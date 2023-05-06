// Initializing settings

// if focus and break time defined, get it, if not set the default values
let focusTime, breakTime, longBreakAfter, longBreakTime;
if (localStorage.getItem('focusTime') !== null) {
    focusTime = parseInt(localStorage.getItem('focusTime'));
} else {
    localStorage.setItem('focusTime',1500);
    focusTime = 1500;
}
if (localStorage.getItem('breakTime') !== null) {
    breakTime = parseInt(localStorage.getItem('breakTime'));
} else {
    localStorage.setItem('breakTime',300);
    breakTime = 300;
}

// setting the number of focus periods after which a long break occurs
if (localStorage.getItem('longBreakAfter') !== null) {
    longBreakAfter = parseInt(localStorage.getItem('longBreakAfter'));
} else {
    localStorage.setItem('longBreakAfter',4);
    longBreakAfter = 4;
}
// setting the duration of a long break in s
if (localStorage.getItem('longBreakTime') !== null) {
    longBreakTime = parseInt(localStorage.getItem('longBreakTime'));
} else {
    localStorage.setItem('longBreakTime',900);
    longBreakTime = 900;
}

// Progress ring
var circle = document.querySelector('.progress-ring__circle');
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}

// Timer
{
    let controlClickNum = 1,
        roundIndex = 1,
        currentState = 'break',
        isLongBreak = false,
        timeRemaining = focusTime,
        counter;
    document.querySelector('.control').onclick = handleControlClick;
    const classes = {'focus':['pause','play'],'break':['done','play']},
    element = document.querySelector('.countdown');
    switchCard(false);
    let isChanging = false;
    function handleControlClick() {
        if (isChanging) {
            return
        }     
        // do the effect of the action
        if (currentState == 'focus') {
            if (classes[currentState][controlClickNum % 2] == 'play') {
                // clicked on play button
                counter = window.setInterval(countDown, 1000);
                changeIcon(classes[currentState][controlClickNum % 2], classes[currentState][(controlClickNum + 1) % 2]);
            } else {
                // clicked on pause button
                clearInterval(counter);
                changeIcon(classes[currentState][controlClickNum % 2], classes[currentState][(controlClickNum + 1) % 2]);
            }
        } else { // if currentState is break
            if (classes[currentState][controlClickNum % 2] == 'play') {
                // clicked on play button
                counter = window.setInterval(countDown, 1000);
                changeIcon(classes[currentState][controlClickNum % 2], classes[currentState][(controlClickNum + 1) % 2]);
            } else {
                // clicked on done button
                clearInterval(counter);
                changeIcon(classes[currentState][controlClickNum % 2], classes[currentState][(controlClickNum + 1) % 2]);
                switchCard(false);
                controlClickNum++;
            }          
        }
        controlClickNum++;
    }
    // breaknél pipa legyen pause helyett
    function changeIcon(from,to) {
        isChanging = true;
        document.querySelector('.control img').classList.add('fade');
        window.setTimeout(function(){
            document.querySelector('.control').classList.add(to);
            document.querySelector('.control img').classList.remove('fade');
            document.querySelector('.control').classList.remove(from);
        },200);
        isChanging = false;
    }
    function countDown() {
        timeRemaining--;
        if (timeRemaining == 0) {
            changeIcon(classes[currentState][controlClickNum % 2], classes[currentState == 'focus' ? 'break' : 'focus'][1]);
            switchCard();
            return
        }
        updateClock(element, timeRemaining);
    }
    function updateClock(element, timeRemaining) {
        if (timeRemaining%60 >= 10 ) {
            element.innerText = Math.floor(timeRemaining/60) + ':' + timeRemaining%60 + ' Left'
        } else {
            element.innerText = Math.floor(timeRemaining/60) + ':0' + timeRemaining%60 + ' Left'
        }
        if (currentState == 'focus') {
            setProgress((focusTime - timeRemaining) / focusTime * 100);
        } else if (!isLongBreak) {
            setProgress((breakTime - timeRemaining) / breakTime * 100);
        } else {
            setProgress((longBreakTime - timeRemaining) / longBreakTime * 100);
        }
    }

    function switchCard(notification = true) {
        controlClickNum = 1;
        if (currentState == 'focus') {
            if (roundIndex == longBreakAfter) {
                isLongBreak = true;
                timeRemaining = longBreakTime;
                currentState = 'break';
                roundIndex = 1;
            } else {
                isLongBreak = false;
                timeRemaining = breakTime;
                currentState = 'break';
                roundIndex++;
            }
        } else {
            isLongBreak = false;
            timeRemaining = focusTime;
            currentState = 'focus';
        }

        //breakParticles();
        const particles = {'focus':focusParticles,'break':breakParticles};
        particles[currentState]();

        // update counter
        clearInterval(counter);
        updateClock(element, timeRemaining);

        if (currentState == 'focus') {
            document.querySelector('.main-pomodoro-card').classList.remove('break');
            
        } else {
            document.querySelector('.main-pomodoro-card').classList.remove('focus');
        }
        document.querySelector('.main-pomodoro-card').classList.add(currentState);
        if (notification) {
            notify(currentState);
        }

        document.querySelector('.rounds').innerText = roundIndex + '/4';
    }
    function handleSkip() {
        document.querySelector('.control').classList.remove(document.querySelector('.control').classList[1]);
        switchCard(false);
        changeIcon('foo', classes[currentState][1]);
    }
}

// Parallax move effect
let x = 0;
let y = 0;
let elem, elemX, elemY;
elems = document.querySelectorAll("[data-parallax]");
elemsPos = [],
elemsTransform = [];
for (let index = 0; index < elems.length; index++) {
    const elem = elems[index],
    elemRect = elem.getBoundingClientRect();
    elemsPos.push([(elemRect.left+(elemRect.width/2)),(elemRect.top+(elemRect.height/2))]);
    elemsTransform.push(elem.style.transform);
}
(function() {
    document.querySelector('.main-pomodoro-card').onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        // get cursor coords
        var eventDoc, doc, body;
        event = event || window.event;
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        let x = event.pageX,
            y = event.pageY,
            cursorZ = 300;
        for (let index = 0; index < elems.length; index++) {
            const xDist = (x - elemsPos[index][0]),
            yDist = (y - elemsPos[index][1]),
            elem = elems[index];
            if (elemsTransform[index]) {
                elevation = elemsTransform[index].split("translateZ(")[1].split('px')[0];
            } else {
                elevation = 10;
            }
            let Zdist = cursorZ - elevation,
            xRotation = Math.atan(yDist / cursorZ),
            yRotation = -1 * Math.atan(xDist / cursorZ),
            xTranslation = xDist/220*elevation,
            yTranslation = yDist /220* elevation;

            elem.style.transform = elemsTransform[index] + " rotateX(" + xRotation + "rad) rotateY(" + yRotation + "rad) translateX(" + xTranslation + "px) translateY(" + yTranslation + "px)";   
        }
    }
})();

(function() {
    document.querySelector('.main-pomodoro-card').onmouseleave = handleMouseLeave;
    function handleMouseLeave() {
        for (let index = 0; index < elems.length; index++) {
            elems[index].style.transform = "translateX(0px) translateY(0px)";   
        }
    }
})();


// Corner buttons
(function() {
    let buttons = document.querySelectorAll('.corner-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onmouseenter = handleMouseEnter;
        buttons[i].onmouseleave = handleMouseLeave;
    }
    function handleMouseEnter() {
        this.classList.add('mouseover')
    }
    function handleMouseLeave() {
        this.classList.remove('mouseover')
    }
})();

// Settings page
let settingsOpen = 0;
function toggleSettings() {
    if (settingsOpen) {
        document.querySelector('.main-settings').classList.remove('fadein')
        setTimeout(document.querySelector('.main-settings').classList.remove('active'), 300);
        settingsOpen = false;
    } else {
        document.querySelector('.main-settings').classList.add('active');
        setTimeout(document.querySelector('.main-settings').classList.add('fadein'), 300);
        settingsOpen = true;
        fillInputsWithData();
    }

}

function fillInputsWithData() {
    document.querySelector('.input-focustime').value = focusTime;
    document.querySelector('.input-breaktime').value = breakTime;
    document.querySelector('.input-longbreaktime').value = longBreakTime;
    document.querySelector('.input-rounds').value = longBreakAfter;
}

function saveSettings() {
    focusTime = document.querySelector('.input-focustime').value;
    breakTime = document.querySelector('.input-breaktime').value;
    longBreakTime = document.querySelector('.input-longbreaktime').value;
    longBreakAfter = document.querySelector('.input-rounds').value;
    localStorage.setItem('focusTime', focusTime);
    localStorage.setItem('breakTime', breakTime);
    localStorage.setItem('longBreakTime', longBreakTime);
    localStorage.setItem('longBreakAfter',longBreakAfter);
}