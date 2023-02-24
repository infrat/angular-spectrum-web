const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");
const electronReload = require('electron-reload');

let mainWindow
let appURL = `file://${__dirname}/dist/angular-spectrum-web/index.html`;
// let appURL = `http://localhost:4200/`;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.webContents.on('did-fail-load', async () => {
        mainWindow.loadURL(appURL);
    });

    mainWindow.loadURL(appURL);
    // mainWindow.loadURL(
    //     url.format({
    //         pathname: path.join(__dirname, `/dist/angular-spectrum-web/index.html`),
    //         protocol: "file:",
    //         slashes: true
    //     })
    // );
    // Open the DevTools.
      mainWindow.webContents.openDevTools()

    mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {

        //Add listeners to handle ports being added or removed before the callback for `select-serial-port`
        //is called.
        mainWindow.webContents.session.on('serial-port-added', (event, port) => {
            console.log('serial-port-added FIRED WITH', port)
            //Optionally update portList to add the new port
        })

        mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
            console.log('serial-port-removed FIRED WITH', port)
            //Optionally update portList to remove the port
        })
        event.preventDefault()
        if (portList && portList.length > 0) {
            callback(portList[0].portId)
        } else {
            callback('') //Could not find any matching devices
        }
    })

    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
        if (permission === 'serial' && details.securityOrigin === 'file:///') {
            return true
        }

        return false
    })

    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
        if (details.deviceType === 'serial' && details.origin === 'file://') {
            return true
        }

        return false
    })

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    //   if (process.platform !== 'darwin') 
    app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})