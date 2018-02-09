
    // Comprobamos si tiene cuenta
    // Listar una cuenta
    api.integration.outlook.listAccounts(function( e , accounts ) {
        
        if (e) alert('Se ha producido un error.'+e)

        numberOfAccounts = accounts.length;

        // Si ya tiene cuentas ponemos la pantalla de correos
        if (accounts.length > 0) {
            $('.container-login').hide();
            $('.container-inbox').show();
//            $('.ui-header').first().parent().parent().parent().css('width', '1000px');
//            loadInboxView(accounts);
        }
        else {
//            loadLoginView();
        }
        start();

    });