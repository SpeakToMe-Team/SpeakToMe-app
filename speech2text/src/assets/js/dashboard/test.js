$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

socket.on('message', function(message) {
    alert('Le serveur a un message pour vous : ' + message.title);
})

$('#poke').click(function (event) {
    event.preventDefault();
    console.log('poke');
    socket.emit('message', 'Salut serveur, ça va ?');
})