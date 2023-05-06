// Notifications
var userAgent = navigator.userAgent.toLowerCase();
const alertText = {
    "focus":"It's time to get back to work",
    "break":"You can take a break now",
    "longBreak":"Enjoy your long break"
},
alertTitle = {
    "focus":"Focus",
    "break":"Break",
    "longBreak":"Long break"
},
iconName = {
    "focus":"focus_3d_icon.png",
    "break":"break_3d_icon.png",
    "longBreak":"break_3d_icon.png"
};
let notify;
if (userAgent.indexOf(' electron/') > -1) {
    const notifier = require('node-notifier');
    const path = require('path');
    notify = function(type) {
        notifier.notify(
        {
            title: alertTitle[type], 
            message: alertText[type],
            icon: path.join(__dirname, '/inc/icons/' + iconName[type]),
            sound: true,
            appID: "com.toothsome.tomato"
        },
        (err, data) => {
            // Will also wait until notification is closed.
            console.log('Waited');
            console.log(JSON.stringify({ err, data }, null, '\t'));
        });
    }
    notifier.on('start', () => {
        document.querySelector('.control').click();
    });

} else {
    notify = function(type) {
        alert(alertText[type]);
    }
}