// Window buttons
var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
     const remote = require('electron').remote;

     document.querySelector(".corner-button.minimize").addEventListener("click", function (e) {
          var window = remote.getCurrentWindow();
          window.minimize(); 
     });

     document.querySelector(".corner-button.close").addEventListener("click", function (e) {
          var window = remote.getCurrentWindow();
          window.close();
     }); 
}
