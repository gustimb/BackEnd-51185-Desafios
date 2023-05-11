const socket = io();

const input = document.getElementById('textbox');
const log = document.getElementById('log');

input.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        socket.emit('message', input.value)
        input.value = '';
    }
})

socket.on('log', data => {
    let chat = '';
    data.map (log => {
        chat += `${log.user} dice: ${log.message} <br/>`
    });
    log.innerHTML = chat;
})