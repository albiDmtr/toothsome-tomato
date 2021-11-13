window.addEventListener('DOMContentLoaded', () => {
  const { remote } = require('electron');
  let currWindow = remote.BrowserWindow.getFocusedWindow();
  window.closeCurrentWindow = function(){
    currWindow.close();
  }


    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })