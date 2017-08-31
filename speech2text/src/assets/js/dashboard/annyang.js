if (annyang) {
    var commands = {
        'effacer recherche': function() {
            dashboard.phrase = '';
            dashboard.content = '';
            dashboard.init();
        },
        "je n'ai pas bien entendu": repeterModule,
        'ouvrir paramètres': function() {
            $('#settings').modal('show');
        },
        'fermer paramètres': function() {
            $('#settings').modal('hide');
        },
        'ouvrir aide': function() {
            $("#wrapper").toggleClass("toggled");
        },
        'fermer aide': function() {
            $("#wrapper").toggleClass("toggled");
        },
        'ouvrir profil': function() {
            $('#user').modal('show');
        },
        'fermer profil': function() {
            $('#user').modal('hide');
        },          
        'écouter musique': function() { // Ne marche pas
            //$('#play-button').click();
            console.log('lancer la musique');
            $('#test-button').trigger('submit'); 
        },
        'Bonne journée speechi': function() { // Ne marche pas
            parler('bonne journée à vous aussi maitre');
            $(location).attr('href', '/auth/logout')
        },
        'déconnexion': function() { // Ne marche pas
            parler('bonne journée maitre');
            $(location).attr('href', '/auth/logout')
        },
        'bonjour speechi': function() { // Ne marche pas
            parler('bonjour maitre');
        },
        'merci speechi': function() { // Ne marche pas
            parler('mais derien maitre');
        },
        'que penses-tu de stéphane et morgane': function() { // Ne marche pas
            parler('je pense qu\'ils sauront reconnaitre que votre équipe à fait un excellent travail, surement même, le meilleur!!');
        },
        'speechi lire résultat *number': emitResultRequest,
        'speechi stop': emitStopSpeech,

        // Pour toutes les recherches avec l'API : définir un mot clé 'ok google'...
        'speechi *question': emitQuestion
    };
    annyang.addCommands(commands);
    annyang.setLanguage('fr-FR');
    
    annyang.addCallback('result', function(phrases) {
        console.log("I think the user said: ", phrases[0]);
        dashboard.phrase = phrases[0];
        console.log("But then again, it could be any of the following: ", phrases);
    });

    annyang.start();
}