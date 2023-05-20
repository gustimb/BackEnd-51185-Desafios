const socket = io();

const input = document.getElementById('textbox');
const log = document.getElementById('log');
const promptName = prompt("Ingrese su nombre")

input.addEventListener('keyup', evt => {
    const nickID = promptName
    if (evt.key === 'Enter') {
        socket.emit('message', [nickID, input.value])
        input.value = '';
    }
})

socket.on('log', data => {
    let chat = '';
    data.map(log => {
        chat += `${log.user} dice: ${log.message} <br/>`
    });
    log.innerHTML = chat;
})