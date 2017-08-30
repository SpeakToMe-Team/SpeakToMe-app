$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

socket.on('message', function(message) {
    alert('Le serveur a un message pour vous : ' + message.title);
});

$('#poke').click(function (event) {
    event.preventDefault();
    console.log('poke');
    socket.emit('message', 'Salut serveur, ça va ?');
});

$('#bouton-emitQuestion').click(function(e) {
	e.preventDefault();
	var question = $('#input-emitQuestion').val();

	console.log('bouton question ? ' + question);
    socket.emit('question', question);
    
    parler('Je viens de lancer la recherche avec le bouton !');
});