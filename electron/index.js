const { SerialPort } = require('serialport')
const { ipcRenderer } = require("electron");

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      console.log('error', err.message)
      return
    } 
    const ul = document.getElementById("port-list");
    ports.forEach(element => {
        console.log(element);
        const html = `<a href="#" onclick="selectPort({ vendorId: '${ element.vendorId }', productId: '${ element.productId }'})" class="list-group-item list-group-item-action">${element.path}</a>`;
        ul.innerHTML += html;
    });

    if (ports.length === 0) {
        console.log('error', 'no ports')   
    }

  })
}

async function selectPort(port) {
    const { vendorId, productId } = port;
    ipcRenderer.send ("port-selected", { vendorId: parseInt(vendorId, 16), productId: parseInt(productId, 16) });
}

function listPorts() {
  listSerialPorts();
  setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
// setTimeout(listPorts, 2000);

listSerialPorts()