const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require("url");
const path = require("path");
const electronReload = require('electron-reload');

let mainWindow;
let selectSerialWindow;

let appURL = `file://${__dirname}/dist/angular-spectrum-web/index.html`;
// let appURL = `http://localhost:4200/`;
let selectedPort;
function createWindow() {

    selectSerialWindow = new BrowserWindow({
        width: 320,
        height: 240,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    selectSerialWindow.loadURL(`file://${__dirname}/electron/serial-dialog.html`);
    // selectSerialWindow.removeMenu();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })
    // mainWindow.removeMenu()
    // mainWindow.hide();
    mainWindow.loadURL(appURL);
    mainWindow.webContents.on('did-fail-load', async () => {
        mainWindow.loadURL(appURL);
    });
    mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {

        //Add listeners to handle ports being added or removed before the callback for `select-serial-port`
        //is called.
        mainWindow.webContents.session.on('serial-port-added', (event, port) => {
            console.log('serial-port-added FIRED WITH',
             port)
            //Optionally update portList to add the new port
        })

        mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
            console.log('serial-port-removed FIRED WITH', port)
            //Optionally update portList to remove the port
        })
        event.preventDefault()

        if (portList && portList.length > 0) {
            for (const port of portList) {
                const parsedVendorId = parseInt(port.vendorId);
                const parsedProductId = parseInt(port.productId);
                if (parsedVendorId === selectedPort.vendorId && parsedProductId === selectedPort.productId) {
                    console.log('Found matching port!');
                    console.log(port);
                    callback(port.portId);
                    return;
                }
            }
            dialog.showErrorBox('Missing serial port', 'Cannot find matching serial port.'); 
        }else {
            dialog.showErrorBox('Missing serial port', 'Cannot find matching serial port.');
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

ipcMain.on ("port-selected", (event, args) => {
    selectedPort = args;
    console.log(args);
    selectSerialWindow.destroy();
    mainWindow.show();
});