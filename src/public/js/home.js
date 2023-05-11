const socket = io();
const divProductos = document.getElementById('divProductos');

socket.on('showAllProducts', data => {
    divProductos.innerHTML = data
})
