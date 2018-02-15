
    var autoSaveDraftInterval = 0;
    $.getScript( "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.4/tinymce.min.js",
    function( data, textStatus, jqxhr ) {
        tinymce.init({
            selector:'.email-new-email textarea',
            height: '100%',
            theme: 'modern',
            plugins: 'contextmenu print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
            toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
            image_advtab: true,
            forced_root_block: false,
            contextmenu: "copy paste link image inserttable | cell row column deletetable",
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css'
            ],
            content_style: ".mce-content-body p {margin:10px 0;} .mce-content-body {padding-top: 25px;}",
            init_instance_callback: function (editor) {
                editor.on('KeyPress', function (e) {
                    if ($('.ui-main.ui-main-new-email').is(':visible')) {
                        clearTimeout( autoSaveDraftInterval )
                        autoSaveDraftInterval = setTimeout( autoSaveDraft, 2 * 1000 )
                    }
                });
            }
        });
    });

    $('.main-container').on('click', function() {
        $('.header-new-email-emails .suggestions').remove();
    })
    
    var win = $( this );
    win.on('ui-view-resize ui-view-maximize ui-view-unmaximize ui-view-resize-end', function() {
        var heightNewEmailArea = $('.ui-main-new-email').height();
        var heightHeaderNewEmail = $('.header-new-email').height();
        var heightFooterNewEmail = $('.new-email-footer').height();
        var heightHeaderTinymce = $('.mce-top-part.mce-container').height();
        var heightFooterTinymce = $('.mce-statusbar.mce-container').height();
        var finalHeightTextareaTinymce = heightNewEmailArea - heightHeaderNewEmail - heightFooterNewEmail - 25 - heightHeaderTinymce - heightFooterTinymce
        $('.mce-edit-area.mce-container.mce-panel.mce-stack-layout-item').css('height', finalHeightTextareaTinymce)
    })

    function autoSaveDraft() {
        saveDraft(function() {});
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Pendientes
    // Adjuntar desde horbito
    // Adjuntar desde pc
    // Detectar cuando llega un nuevo correo
    // Descargar adjunto a horbito
    // Tinymce

    // Comprobar
    // Cuentas extra


    // Cosas que necesito
    // Detectar cuando da permiso por primera vez
    // Imagen del usuario de la cuenta
    // - Asumo como principal la primera que me llega

    // Orden carpetas / identificar inbox
    // account.email da un string alfanumerico
    // - Adjuntos
    // - Crear carpeta
    // tinymce
    // colors of image/name
    // - more than one send
/*
    function updateGeneralBadge(numberOfBadge) {
        api.app.setBadge(numberOfBadge);
    }
*/

    var hotmailAccounts = [];
    var idArchiveFolder;
    var idSpamFolder;
    var idDraftFolder;
    var idDeletedFolder;
    var searchResults = [];
    var changesDonePendingSync = [];
/*
api.integration.outlook.removeAccount(8451, function() {

})
api.integration.outlook.removeAccount(9716, function() {

})
api.integration.outlook.removeAccount(9720, function() {

})*/
    var numberOfAccounts = 0;

    waitToUpdateAccounts = false;
    function sincronizationAccount() {
        // Comprobamos si añade o borra una cuenta
//        setInterval(function() {
//            if (!waitToUpdateAccounts) {
                api.integration.outlook.listAccounts(function( e , accounts ) {
                    if (e) alert('Se ha producido un error.'+e)
                    if (numberOfAccounts != accounts.length) {
                        // If an account has been eliminated
                        if (numberOfAccounts > accounts.length) {
                            // For now, nothing gets eliminated
                        }
                        // If one has been added
                        else {
                            if (accounts.length == 1) {
                                loadInboxView(accounts);
                            }
                            else {
                                accounts.forEach(function ( account ) {
                                    var found = false;
                                    for (var i = 0; i < hotmailAccounts.length && !found; i++) {
                                        if (hotmailAccounts[i].id == account.id) {
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        hotmailAccounts.push(account);
                                        loadOtherAccount(account);
                                    }
                                });
                            }
                        }
                        numberOfAccounts = accounts.length;
                    }
                });
//            }
//        }, 1000);
    }


    function setInitialTexts() {
        $( '.welcome-text-line-1' ).text( lang.welcomeTextLine1 );
        $( '.welcome-text-line-2' ).text( lang.welcomeTextLine2 );
        $( '.login-outlook span' ).text( lang.loginOutlook );

        // Left side column
        $('.ui-subheader input[name="search"]').attr('placeholder', lang.search)
        $('.ui-left-side-folders-entry.folder .name').text(lang.folders);
        $('.ui-left-side-accounts-general-title .title').text(lang.accounts);

        // Buttons up top
        $('.ui-subheader-buttons-button.send-email .text').text(lang.send)
        $('.ui-subheader-buttons-button.attach-to-email .text').text(lang.attach)
        $('.ui-subheader-buttons-button.discard-email .text').text(lang.discard)
        $('.ui-subheader-buttons-button.close-email .text').text(lang.closeEmail)
        $('.ui-subheader-buttons-button.new .text').text(lang.new)
        $('.ui-subheader-buttons-button.mark-read .text').text(lang.markAllRead)
        $('.ui-subheader-buttons-button.move-to .text').text(lang.moveTo)
        $('.ui-subheader-buttons-button.reply .text').text(lang.reply)
        $('.ui-subheader-buttons-button-reply-display .rep').text(lang.reply)
        $('.ui-subheader-buttons-button-reply-display .rep').text(lang.reply)
        $('.ui-subheader-buttons-button-reply-display .repall').text(lang.replyAll)
        $('.ui-subheader-buttons-button-reply-display .forw').text(lang.forward)
        $('.ui-subheader-buttons-button.delete .text').text(lang.deleteMail)
        $('.ui-subheader-buttons-button.delete-emails .text').text(lang.deleteMails)
        $('.ui-subheader-buttons-button.archive .text').text(lang.archive)
        $('.ui-subheader-buttons-button.spam .text').text(lang.spam)
        $('.ui-subheader-buttons-button.undo-action text').text(lang.undo)
        $('.header-view-email-sender-buttons-more-display .rea').text(lang.markRead)
        $('.header-view-email-sender-buttons-more-display .unr').text(lang.markUnread)
        $('.header-view-email-sender-buttons .text').text(lang.reply)
        $('.header-view-email-sender-buttons-display .rep').text(lang.reply)
        $('.header-view-email-sender-buttons-display .repall').text(lang.replyAll)
        $('.header-view-email-sender-buttons-display .forw').text(lang.forward)
        $('.email-new-email-hover p').text(lang.dropFiles)

        // Buttons bottom
        $('.new-email-send').text(lang.send)
        $('.new-email-discard').text(lang.discard)

        $('.header-new-email-emails .to .text').text(lang.to)
        $('.header-new-email .subject').attr('placeholder', lang.subject)
        $('.email-new-email textarea').attr('placeholder', lang.addMessagePlaceholder)
//        $('.drop-down-attachment .pc').text(lang.uploadPC)
        $('.drop-down-attachment .horbito').text(lang.uploadHorbito)
        $('.downloadToPC').text(lang.uploadPC)
        $('.downloadToInevio').text(lang.uploadHorbito)
    }


    api.integration.outlook.on( 'added-account', function( payload ) {
        sincronizationAccount();
    })
    setInitialTexts();


    // Comprobamos si tiene cuenta
    // Listar una cuenta
    var initialized = false;
    api.integration.outlook.listAccounts(function( e , accounts ) {
        
        if (e) alert('Se ha producido un error.'+e)

        numberOfAccounts = accounts.length;

        // Si ya tiene cuentas ponemos la pantalla de correos
        if (accounts.length > 0) {
            loadInboxView(accounts);
        }

    });

    function abilityToMoveEmail() {
        $('.ui-subheader-buttons-button-moveTo-display .option').on('click', function() {
            var idFolderDestiny = $(this).attr('idfolder');
            var emailsListTicked = $('.ui-main-email-list-inner .ui-main-email.checked');

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            getAccount({
                idAccount : idCurrentAccount,
                idFolderDestiny : idFolderDestiny,
                emailsListTicked : emailsListTicked
            }, function(account, jsonData) {

                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                
                var unreadEmailsBeingMoved = 0;
                for (var i = 0; i < jsonData.emailsListTicked.length; i++) {

                    var idEmailMoving = jsonData.emailsListTicked.eq(i).attr('idmail');
                    if (jsonData.emailsListTicked.eq(i).hasClass('unread')) {
                        unreadEmailsBeingMoved++;
                    }

                    // We remove the email from the variable with all the emails
                    var idFolderSelected = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                    var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolderSelected);
                    var found = false;
                    for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                        if (folderInHotmailAccount.emails.value[i].id == idEmailMoving) {
                            found = true;
                            folderInHotmailAccount.emails.value.splice(i, 1);
                        }
                    }

                    account.moveMessage(idEmailMoving, jsonData.idFolderDestiny, function() {});

                }
                
                $('.ui-main-email-list-inner .ui-main-email.checked').remove();
                $('.main-container').click();

                // We correct the badges
                var unreadEmailsSelectedFolder = parseInt($('.ui-left-side-folders-entry.indent.mark > .entry > .unread-messages').html()) - unreadEmailsBeingMoved;
                if (unreadEmailsSelectedFolder == 0) {
                    unreadEmailsSelectedFolder = ''
                }
                $('.ui-left-side-folders-entry.indent.mark > .entry > .unread-messages').html(unreadEmailsSelectedFolder);
                if ($('.ui-left-side-folders-entry.indent.mark').attr('knownname') == 'inbox') {
                    $('.ui-left-side-accounts-account.selected .unread-messages').html(unreadEmailsSelectedFolder);
                }
                var foldersList = $('.ui-left-side-folders-entry.indent');
                var found = false;
                for (var i = 0; i < foldersList.length && !found; i++) {
                    if (foldersList.eq(i).attr('idfolder') == jsonData.idFolderDestiny) {
                        found = true;
                        var unreadEmailsDestinyFolder = foldersList.eq(i).find('.unread-messages').first().html();
                        if (unreadEmailsDestinyFolder.length == 0) {
                            unreadEmailsDestinyFolder = 0;
                        }
                        foldersList.eq(i).find('.unread-messages').first().html(parseInt(unreadEmailsDestinyFolder) + unreadEmailsBeingMoved);
                    }
                }
                


                // We empty the emails in the destiny folder if it were already loaded
                var found = false;
                for (var i = 0; i < hotmailAccount.folders.length && !found; i++) {
                    if (hotmailAccount.folders[i].idFolder == jsonData.idFolderDestiny) {
                        found = true;
                        hotmailAccount.folders[i].emails = {
                            'loaded' : false,
                            'value' : []
                        };
                    }
                }

                $('.ui-subheader-buttons-button.move-to').hide();
                $('.ui-subheader-buttons-button.delete-emails').hide();

            });
            
        });
    }

    function loadFoldersInMoveTo() {
        var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
        var idFolderSelected = $('.ui-left-side-folders-entry.indent.mark').attr('idfolder')
        var hotmailAccount = getHotmailAccount(idHotmailAccount);
        var moveToOptions = '';
        var foldersList = $('.ui-left-side-folders-entry.indent .text');
        for (var i = 0; i < foldersList.length; i++) {
            var idFolderInserting = foldersList.closest('.ui-left-side-folders-entry').eq(i).attr('idfolder');
            if (idFolderSelected != idFolderInserting) {
                moveToOptions += '<div class="option" idfolder="'+idFolderInserting+'">'+foldersList.eq(i).html()+'</div>'
            }
        }
        $('.ui-subheader-buttons-button-moveTo-display').html(moveToOptions)
        abilityToMoveEmail();
    }

    function saveDraft(callback) {
        var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
        var newDraft = false;
        if (typeof idEmail === typeof undefined || idEmail === false) {
            newDraft = true;
        }

        var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
        var jsonData = {
            idAccount : idCurrentAccount, 
            idEmail : idEmail, 
            newDraft : newDraft,
            callback : callback
        };
        getAccount(jsonData, function(account, jsonData) {
            var mail = {};

            var to = $('.ui-main-new-email .to input').val();
            var cc = '';
            if ($('.ui-main-new-email').hasClass('cc')) {
                cc = $('.ui-main-new-email .cc input').val();
            }
            var cco = '';
            if ($('.ui-main-new-email').hasClass('cco')) {
                cco = $('.ui-main-new-email .cco input').val();
            }
            if (to.length > 0) {
                var toRecipients = [];
                var toAux = to.split(',');
                for (var i = 0; i < toAux.length; i++) {
                    var address
                    var aux = toAux[i].split('<');
                    if (aux.length == 1) {
                        toRecipients.push({
                            'emailAddress' : {
                                'address' : toAux[i]
                            }
                        });
                    }
                    else {
                        var aux2 = aux[1].split('>')
                        toRecipients.push({
                            'emailAddress' : {
                                'address' : aux2[0],
                                'name' : aux[0]
                            }
                        });
                    }
                }
                mail.toRecipients = toRecipients;
            }
            if (cc.length > 0) {
                var ccRecipients = [];
                var ccAux = cc.split(',');
                for (var i = 0; i < ccAux.length; i++) {
                    var address
                    var aux = ccAux[i].split('<');
                    if (aux.length == 1) {
                        ccRecipients.push({
                            'emailAddress' : {
                                'address' : ccAux[i]
                            }
                        });
                    }
                    else {
                        var aux2 = aux[1].split('>')
                        ccRecipients.push({
                            'emailAddress' : {
                                'address' : aux2[0],
                                'name' : aux[0]
                            }
                        });
                    }
                }
                mail.ccRecipients = ccRecipients;
            }
            if (cco.length > 0) {
                var ccoRecipients = [];
                var ccoAux = cco.split(',');
                for (var i = 0; i < ccoAux.length; i++) {
                    var address
                    var aux = ccoAux[i].split('<');
                    if (aux.length == 1) {
                        ccoRecipients.push({
                            'emailAddress' : {
                                'address' : ccoAux[i]
                            }
                        });
                    }
                    else {
                        var aux2 = aux[1].split('>')
                        ccoRecipients.push({
                            'emailAddress' : {
                                'address' : aux2[0],
                                'name' : aux[0]
                            }
                        });
                    }
                }
                mail.bccRecipients = ccoRecipients;
            }

            mail.subject = $('.ui-main.ui-main-new-email input.subject').val();
//            var emailContent = $('.ui-main.ui-main-new-email .email-new-email textarea').val();
            var emailContent = tinymce.activeEditor.getContent();
            if (emailContent.length == 0) {
                emailContent = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta content="text/html; charset=us-ascii"></head><body>'+$('.ui-main.ui-main-new-email .email-new-email textarea').val()+'</body></html>';
            }
            mail.body = {
                'contentType' : 'html',
                'content' : emailContent
            };

            var idEmail = null;
            if (!jsonData.newDraft) {
                idEmail = jsonData.idEmail;
                
                account.updateMessage(idEmail, mail, function(error, data) {
                    if (error) alert('Se ha producido un error. '+error)

                    var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
                    var newDraft = false;
                    if (typeof idEmail === typeof undefined || idEmail === false || idEmail == undefined) {
                        newDraft = true;
                        idEmail = data.id;
                    }

                    $('.ui-main.ui-main-new-email').attr('idemail', idEmail);
                    var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                    var hotmailAccount = getHotmailAccount(idCurrentAccount);
                    var folder = getEmailsInFolder(hotmailAccount, idDraftFolder);
                    if (folder !== false) {
                        var found = false;
                        for (var i = 0; i < folder.emails.value.length && !found; i++) {
                            if (folder.emails.value[i].id == idEmail) {
                                found = true;
                                folder.emails.value[i] = data;
                            }
                        }
                    }
                    
callback();
                    jsonData.callback;

                })
            }
            else {

                account.createMessage(mail, idEmail, null, function(error, data) {
                    if (error) alert('Se ha producido un error. '+error)
                    
                    var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
                    var newDraft = false;
                    if (typeof idEmail === typeof undefined || idEmail === false || idEmail == undefined) {
                        newDraft = true;
                        idEmail = data.id;
                    }

                    $('.ui-main.ui-main-new-email').attr('idemail', idEmail);
                    var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                    var hotmailAccount = getHotmailAccount(idCurrentAccount);
                    var folder = getEmailsInFolder(hotmailAccount, idDraftFolder);
                    if (folder !== false) {
                        folder.emails.value.unshift(data);
                    }

callback();
                    jsonData.callback;

                })

            }

        });

    }

/*
    function autoSaveDraft() {
        setInterval(function() {
            if ($('.ui-main.ui-main-new-email').is(':visible')) {
                saveDraft(function() {

                });
            }
        }, 5 * 1000);
    }
*/
    function loadOtherAccount(account) {
        var userImage = '';
        if (account.avatar == null) {
            var auxAcron = account.name.split(' ');
            var acron = account.name.substr(0, 1);
            if (auxAcron.length > 1) {
                acron += auxAcron[1].substr(0, 1)
            }
            userImage = '<div class="icon-user">'+acron+'</div>';
        }
        else {
            userImage = '<img class="icon-account" src="'+account.avatar+'">';
        }
        $('.ui-left-side-accounts').append('\
            <section class="ui-left-side-accounts-account" idaccount="'+account.id+'">\
                '+userImage+'\
                <span class="email">'+account.sub+'</span>\
                <span class="unread-messages"></span>\
                <span class="delete-account"></span>\
            </section>\
        ');
        abilityToDeleteAccount();
        abilityToChangeAccount();


        var query = {};
        query.count = true;
        query.top = 1000;
        account.getFolders(null, query, function( error , folders ) {
            if (error) alert('Se ha producido un error. '+error)
            
            var found = false;
            for (var i = 0; i < folders.value.length && !found; i++) {
//                if (folders.value[i].displayName.toLowerCase() == 'bandeja de entrada') {
                if (folders.value[i].wellKnownName == 'inbox') {
                    found = true;
                    var found2 = false;
                    var accountsList = $('.ui-left-side-accounts .ui-left-side-accounts-account');
                    for (var j = 0; j < accountsList.length && !found2; j++) {
                        if (accountsList.eq(j).attr('idaccount') == account.id) {
                            found2 = true;
                            accountsList.eq(j).find('.unread-messages').html(folders.value[i].unreadItemCount)
                        }
                    }
                }
            }
        });
    }


    function loadMainAccountAndOthers(accounts) {
        // Cargamos la info de las cuentas
        var mainEmailLoaded = false;
        $('.ui-left-side-accounts').html('');
        hotmailAccounts = [];
        accounts.forEach(function ( account ) {

            if (account.length == 1) {
                account = account[0];
            }

            hotmailAccounts.push(account);

            if (!mainEmailLoaded) {
                mainEmailLoaded = true;

                var userImage = '';
                if (account.avatar == null) {
                    var auxAcron = account.name.split(' ');
                    var acron = account.name.substr(0, 1);
                    if (auxAcron.length > 1) {
                        acron += auxAcron[1].substr(0, 1)
                    }
                    userImage = '<div class="icon-user">'+acron+'</div>';
                }
                else {
                    userImage = '<img class="icon-account" src="'+account.avatar+'">';
                }
                $('.ui-left-side-accounts').append('\
                    <section class="ui-left-side-accounts-account selected" idaccount="'+account.id+'">\
                        '+userImage+'\
                        <span class="email">'+account.sub+'</span>\
                        <span class="unread-messages"></span>\
                        <span class="delete-account"></span>\
                    </section>\
                ');

                loadMainEmail(account);
            }
            else {
                loadOtherAccount(account);
            }
        });
        abilityToChangeAccount();
        abilityToDeleteAccount();
    }



    function loadInboxView(accounts) {

//        autoSaveDraft();

        // Mostramos la vista
        if (initialized) {
            $('.container-login').hide();
            $('.container-inbox').show();
//            $('.ui-header').first().parent().parent().parent().css('width', '1000px');
        }
        initialized = true;
        $('.ui-main-email-list-inner').html('\
            <div class="messageLoadingEmails">\
                <img src="https://static.inevio.com/app/521/img/waiting.png">\
                <div class="text">Waiting for Microsoft</div>\
            </div>\
        ')


        // Cargamos los textos

        loadMainAccountAndOthers(accounts);

        // Acciones
        inboxViewPermanentActions();

        // TEMP
        $('.ui-main-email-list .ui-main-email').on('click', function() {
            loadViewEmail();
        });

        // If an email has been recieved
        api.integration.outlook.on( 'created', function( payload ) {
            newEvent('created', payload);
        })
        // If an email has changed its status
        api.integration.outlook.on( 'updated', function( payload ) {
            newEvent('updated', payload);
        })
        // If an email has been deleted
        api.integration.outlook.on( 'deleted', function( payload ) {
            newEvent('deleted', payload);
        })


    }

    function newEvent(event, payload) {

        var idAccount = payload.id;
        var idEmail = payload.changes.id;
        var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark').attr('idfolder');

        // We check if it is a change we've done
        for (var i = 0; i < changesDonePendingSync.length; i++) {
            if (changesDonePendingSync[i].idEmail == idEmail && event == changesDonePendingSync[i].action) {
                changesDonePendingSync.splice(i, 1);
                return;
            }
        }

        // If it is the account we are viewing
        if ($('.ui-left-side-name').attr('idaccount') == idAccount) {
            var finishedSync = false;
            // If its an update or a deletion we search for the email
            if (event == 'updated' || event == 'deleted') {
                var found = false;

                $('.ui-main.ui-main-email-list .ui-main-email').each(function() {

                    if (!found && $(this).attr('idmail') == idEmail) {

                        var found = true;
                        var isRead = false;

                        if (event == 'deleted') {
                            if ($(this).hasClass('unread')) {
//console.log('fdsfaa');                                $('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html(parseInt($('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html()) - 1);
                            }
                            $(this).remove();
                        }
                        else if (event == 'updated') {
                            if ($(this).hasClass('unread')) {
                                isRead = true;
                                $(this).removeClass('unread');
//console.log('fdsfaa');                                $('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html(parseInt($('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html()) - 1);
                            }
                            else {
                                $(this).addClass('unread');
//console.log('fdsfaa');                                $('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html(parseInt($('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html()) + 1);
                            }
                        }

                        // We remove it from the 'global' variable
                        var hotmailAccount = getHotmailAccount(idAccount);
                        var arrayEmails = getEmailsInFolder(hotmailAccount, idFolder);
                        var foundAndModified = false;
                        for (var i = 0; i < arrayEmails.emails.value.length && !foundAndModified; i++) {
                            if (arrayEmails.emails.value[i].id == idEmail) {
                                if (event == 'deleted') {
                                    arrayEmails.emails.value.splice(i, 1);
                                }
                                else if (event == 'updated') {
                                    arrayEmails.emails.value[i].isRead = isRead;
                                }
                                foundAndModified = true;
                            }
                        }

                        finishedSync = true;

                    }
                });
            }
            else if (event == 'created') {
                // We check the folder for the new email
                getAccount({idAccount : idAccount}, function(account) {
                    var data = new Object();
                    data.top = 50;
                    account.getMessagesInFolder(idFolder, data, function( error, mails ) {
                        if (error) alert('Se ha producido un error. '+error)

                        mails.value.forEach(function( mail ) {
                            // If we find the new email in the folder
                            if (mail.id == idEmail) {
                                if ($('.ui-main-email-list-inner .emptyEmails').length > 0) {
                                    $('.ui-main-email-list-inner').html('');
                                }

                                // We check if it hasnt been showned already
                                var found = false;
                                var emailListShown = $('.ui-main-email-list-inner .ui-main-email')
                                for (var i = 0; i < emailListShown.length && !found; i++) {
                                    if (emailListShown.eq(i).attr('idmail') == mail.id) {
                                        found = true;
                                    }
                                }

                                if (!found) {
                                    $('.ui-main-email-list-inner').prepend(designMailMailsList(mail));
                                    if (!mail.isRead) {
//console.log('dsafa');                                        $('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html(parseInt($('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html()) + 1);
                                    }

                                    var hotmailAccount = getHotmailAccount(idAccount);
                                    var folder = getEmailsInFolder(hotmailAccount, idFolder);
                                    folder.emails.value.splice(0, 0, mail);

                                    actionsInMailList();
                                }

                                finishedSync = true;

                                return false;
                            }
                        });

                    });
                });
            }

            // If it has not been found we check the other folders
            if (!finishedSync) {

                var hotmailAccount = getHotmailAccount(idAccount);

                var query = {};
                query.count = true;
                query.top = 10000;
                // We update the unread counter?
                hotmailAccount.getFolders(null, query, function( error , folders ) {
                    if (error) alert('Se ha producido un error. '+error)

                    var listOfFolders = $('.ui-left-side-folders .ui-left-side-folders-entry.indent');
                    for (var i = 0; i < listOfFolders.length; i++) {
                        var found = false;
                        for (var j = 0; j < folders.value.length && !found; j++) {
                            if (folders.value[j].id == listOfFolders.eq(i).attr('idfolder')) {
                                found = true;
                                var unreadItemCount = folders.value[j].unreadItemCount;
                                if (unreadItemCount == 0) {
                                    unreadItemCount = ''
                                }
                                listOfFolders.eq(i).find('.unread-messages').first().html(unreadItemCount)
                            }
                        }
                    }

                });

                for (var i = 0; i < hotmailAccount.folders.length; i++) {
                    if (hotmailAccount.folders[i].id != idFolder) {
                        hotmailAccount.folders[i].emails = {
                            'loaded' : false,
                            'value' : []
                        };
                    }
                }
            }

        }
        // If it is not the account we are viewing we should check if there should be one more or less viewed email
        else {
            var query = {};
            query.count = true;
            query.top = 1000;
            var hotmailAccount = getHotmailAccount(idAccount);
            hotmailAccount.getFolders(null, query, function( error , folders ) {
                if (error) alert('Se ha producido un error. '+error)
                var found = false;
                for (var i = 0; i < folders.value.length && !found; i++) {
                    if (folders.value[i].wellKnownName == 'inbox') {
                        found = true;
                        var found2 = false;
                        var accountsList = $('.ui-left-side-accounts .ui-left-side-accounts-account');
                        for (var j = 0; j < accountsList.length && !found2; j++) {
                            if (accountsList.eq(j).attr('idaccount') == idAccount) {
                                found2 = true;
                                accountsList.eq(j).find('.unread-messages').html(folders.value[i].unreadItemCount)
                            }
                        }
                    }
                }
                delete hotmailAccount.folders;
            });
        }

    }

    function hideAllInboxViewViews() {
        var className = '.main-container.container-inbox';
        $(className).removeClass('email-list')
        $(className).removeClass('view-email')
        $(className).removeClass('new-email')
        $('.ui-subheader-buttons-button.move-to').hide();
        $('.ui-subheader-buttons-button.delete-emails').hide();
    }

    function actionsOnSuggestions() {
        $('.header-new-email-emails .suggestions .entry').off('click')
        $('.header-new-email-emails .suggestions .entry').on('click', function() {
            var inputContent = $(this).parent().parent().find('input').val();
            inputContent = inputContent.split(',');
            inputContent[inputContent.length - 1] = $(this).html();
            inputContent = inputContent.join(',');
            $(this).parent().parent().find('input').val(inputContent);
            $(this).closest('.suggestions').remove();
        })
    }

    function prepareSuggestionsEmailRecipient() {
        
        $('.header-new-email-emails .to input').on('keyup');
        $('.header-new-email-emails .to input').on('keyup', function() {
            $('.header-new-email-emails .to .suggestions').remove();
            var value = $(this).val();
            var suggest = value.split(',');
            suggest = suggest[suggest.length - 1].trim();
            if (suggest.length > 2) {
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                hotmailAccount.suggestContacts(suggest, function(error, suggestions) {
                    if (error) alert('Se ha producido un error. '+error)
                    else {
                        if (suggestions.length > 0) {
                            var suggestionsEntries = '';
                            for (var i = 0; i < suggestions.length; i++) {
                                suggestionsEntries += '\
                                    <div class="entry">'+suggestions[i].address+'</div>\
                                ';
                            }
                            $('.header-new-email-emails .to').append('\
                                <div class="suggestions">'+suggestionsEntries+'</div>\
                            ');
                            $('.header-new-email-emails .to .suggestions').css('width', $('.header-new-email-emails .to input').width())
                            $('.header-new-email-emails .to .suggestions').css('left', $('.header-new-email-emails .to input').position().left)
                            actionsOnSuggestions();
                        }
                    }
                });
            }
        })

        $('.header-new-email-emails .cc input').on('keyup');
        $('.header-new-email-emails .cc input').on('keyup', function() {
            $('.header-new-email-emails .cc .suggestions').remove();
            var value = $(this).val();
            var suggest = value.split(',');
            suggest = suggest[suggest.length - 1].trim();
            if (suggest.length > 2) {
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                hotmailAccount.suggestContacts(suggest, function(error, suggestions) {
                    if (error) alert('Se ha producido un error. '+error)
                    else {
                        if (suggestions.length > 0) {
                            var suggestionsEntries = '';
                            for (var i = 0; i < suggestions.length; i++) {
                                suggestionsEntries += '\
                                    <div class="entry">'+suggestions[i].address+'</div>\
                                ';
                            }
                            $('.header-new-email-emails .cc').append('\
                                <div class="suggestions">'+suggestionsEntries+'</div>\
                            ');
                            $('.header-new-email-emails .cc .suggestions').css('width', $('.header-new-email-emails .cc input').width())
                            $('.header-new-email-emails .cc .suggestions').css('left', $('.header-new-email-emails .cc input').position().left)
                            actionsOnSuggestions();
                        }
                    }
                });
            }
        })

        $('.header-new-email-emails .cco input').on('keyup');
        $('.header-new-email-emails .cco input').on('keyup', function() {
            $('.header-new-email-emails .cco .suggestions').remove();
            var value = $(this).val();
            var suggest = value.split(',');
            suggest = suggest[suggest.length - 1].trim();
            if (suggest.length > 2) {
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                hotmailAccount.suggestContacts(suggest, function(error, suggestions) {
                    if (error) alert('Se ha producido un error. '+error)
                    else {
                        if (suggestions.length > 0) {
                            var suggestionsEntries = '';
                            for (var i = 0; i < suggestions.length; i++) {
                                suggestionsEntries += '\
                                    <div class="entry">'+suggestions[i].address+'</div>\
                                ';
                            }
                            $('.header-new-email-emails .cco').append('\
                                <div class="suggestions">'+suggestionsEntries+'</div>\
                            ');
                            $('.header-new-email-emails .cco .suggestions').css('width', $('.header-new-email-emails .cco input').width())
                            $('.header-new-email-emails .cco .suggestions').css('left', $('.header-new-email-emails .cco input').position().left)
                            actionsOnSuggestions();
                        }
                    }
                });
            }
        })
    }

    function loadViewNewEmail() {
        hideAllInboxViewViews();
        prepareSuggestionsEmailRecipient();
        var className = '.main-container.container-inbox';
        $(className).addClass('new-email');
        $('.mce-edit-area.mce-container.mce-panel.mce-stack-layout-item').css('height', $('.email-new-email').height() - 120);
    }
    function emptyViewNewEmail() {
        idEmailAnswering = -1;
        $('.ui-main.ui-main-new-email').removeAttr('idemail');
        $('.ui-main-new-email input.emails').val('');
        $('.ui-main-new-email input.subject').val('');
        tinymce.activeEditor.setContent('');
//        $('.email-new-email textarea').jqteVal('');
//        $('.email-new-email textarea').val('');
        $('.attachment-new-email').html('');
        $('.ui-main-new-email').removeClass('cc');
        $('.ui-main-new-email').removeClass('cco');
    }

    function loadViewEmailList() {
        hideAllInboxViewViews();
        var className = '.main-container.container-inbox';
        $(className).addClass('email-list');
    }

    function loadViewEmail() {
        hideAllInboxViewViews();
        var className = '.main-container.container-inbox';
        $(className).addClass('view-email');
    }

    function getEmail(folderInHotmailAccount, idEmail) {
        for (var i = 0; i < folderInHotmailAccount.emails.value.length; i++) {
            if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                return folderInHotmailAccount.emails.value[i];
            }
        }
        return false;
    }


    function abilityToDeleteAccount() {
        $('.ui-left-side-accounts .ui-left-side-accounts-account .delete-account').off('click');
        $('.ui-left-side-accounts .ui-left-side-accounts-account .delete-account').on('click', function() {
            var rowAccount = $(this).closest('.ui-left-side-accounts-account');
            $(this).closest('.ui-left-side-accounts-account').addClass('toBeDeleted');
            confirm(lang.confirmDeleteAccount+' '+rowAccount.find('.email').first().html()+'?', function(accepted) {
                var rowAccount = $('.ui-left-side-accounts-account.toBeDeleted');
                rowAccount.removeClass('toBeDeleted');
                if (accepted) {
                    waitToUpdateAccounts = true;
                    numberOfAccounts--;
                    if (rowAccount.hasClass('selected')) {
                        if ($('.ui-left-side-accounts-account').length > 1) {
                            rowAccount.remove();
                            $('.ui-left-side-accounts-account').first().click();
                        }
                        else {
                            // Mostramos la vista
                            $('.container-login').show();
                            $('.container-inbox').hide();
                            $('.ui-header').first().parent().parent().parent().css('width', '800px');
                            loadLoginView();
                        }
                    }
                    api.integration.outlook.removeAccount(rowAccount.attr('idaccount'), function() {
                        waitToUpdateAccounts = false;
                    })
                }
            })
        });
    }


    function abilityToChangeAccount() {
        $('.ui-left-side-accounts .ui-left-side-accounts-account').off('click');
        $('.ui-left-side-accounts .ui-left-side-accounts-account').on('click', function() {
            if (!$(this).hasClass('selected')) {
                $('.ui-left-side-accounts .ui-left-side-accounts-account').removeClass('selected');
                $(this).addClass('selected')
                var found = false;
                for (var i = 0; i < hotmailAccounts.length && !found; i++) {
                    if (hotmailAccounts[i].id == $(this).attr('idaccount'))  {
                        found = true;
                        loadMainEmail(hotmailAccounts[i]);
                    }
                }
//                loadMainAccountAndOthers(hotmailAccounts);
            }
        });
    }

    
    // Actions to navigate that will never have to be recalled
    var lastEnteredFolderId = -1;
    var creatingNewFolder = 0;
    var sendingEmail = false;
    var withAttachmentPendingShow = false;
    var idEmailAnswering = -1;
    function inboxViewPermanentActions() {

        /*
        $('.email-new-email textarea').trumbowyg({
            svgPath: 'https://static.inevio.com/app/521/trumbowyg/ui/icons.svg'
        });*/

        $('.ui-left-side-accounts-general-title .add').on('click', function() {
            // Para añadir una cuenta
            api.integration.outlook.addAccount(function(){
            });
        });
        $('.main-container').on('click', function() {
            $('.ui-subheader-buttons .mark').removeClass('mark');
            $('.ui-subheader-buttons-button-reply-display').hide();
            $('.header-view-email-sender-buttons-display').hide();
            $('.ui-subheader-buttons-button-moveTo-display').hide();
            $('.drop-down-attachment').hide();
            $('.header-view-email-sender-buttons-more-display').hide();
            $('.dropdown-dropper').hide();
            if (creatingNewFolder == 2) {
                creatingNewFolder = 0;

                var newName = $('.ui-left-side-folders .newFolderInput input').val();
                if (newName.length > 0) {

                    var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                    getAccount({idAccount : idCurrentAccount, newName : newName}, function(account, jsonData) {
                        account.createFolder(jsonData.newName, function(error, data) {
                            if (error) alert('Se ha producido un error. '+error)

                            var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                            var hotmailAccount = getHotmailAccount(idHotmailAccount);
                            data.emails = [];
                            hotmailAccount.folders.push(data);

                            $('.ui-left-side-folders').append('\
                                <section knownname="'+data.wellKnownName+'" idfolder="'+data.id+'" parentfolder="'+data.parentFolderId+'" class="ui-left-side-folders-entry indent">\
                                    <div class="entry">\
                                        <img class="tree" src="https://static.inevio.com/app/521/img/tree-open.png">\
                                        <span class="text">'+data.displayName+'</span>\
                                        <span class="unread-messages">'+data.unreadItemCount+'</span>\
                                    </div>\
                                </section>\
                            ');

                            orderFolders();


                            poderEntrarEnCarpeta();

                        });
                    });
                }

                $('.ui-left-side-folders .newFolderInput').remove();
            }
            else if (creatingNewFolder == 1) {
                creatingNewFolder = 2;
            }
        });
        // Si le busca un correo
        $('.ui-left-side-folders-entry.folder .add').on('click', function() {
            creatingNewFolder = 1;
            $('.ui-left-side-folders .newFolderInput').remove();
            $('.ui-left-side-folders').append('\
                <div class="newFolderInput">\
                    <input type="text">\
                </div>\
            ');
            $('.ui-left-side-folders .newFolderInput input').focus();
        });
        // Si le busca un correo
        $('.ui-subheader .search-glass').on('click', function() {
            $(this).closest('.search').submit();
        });
        $('.ui-subheader form.search').on('submit', function(e) {
            e.preventDefault();

            var lookingFor = $(this).find('input').val();
            if (lookingFor.length > 0) {

    //            $('.ui-subheader-buttons-button.mark-read').hide();

                var idEmail = $('.ui-main.ui-main-view-email').attr('idemail');
                var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                var params = {};
                params.search = lookingFor;
                params.top = 50;

                loadViewEmailList();
                $('.ui-main-email-list-inner').scrollTop(0);
                $('.ui-main-email-list-inner').html('<section class="search">'+lang.resultsSearch+': <span>'+lookingFor+'</span></section>');
                getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
console.log(lastEnteredFolderId)
                    account.getMessagesInFolder(lastEnteredFolderId, params, function(err, mails) {
console.log(err)
                        if (err) alert('Se ha producido un error. '+err)
                        searchResults = {
                            'emails' : mails
                        };
                        mails.value.forEach(function( mail ) {
                            $('.ui-main-email-list-inner').append(designMailMailsList(mail));
                        });
                        actionsInMailList();
                    });
                });

                $('.ui-left-side-folders-entry.mark').removeClass('mark');
            }
        });
        // Si le da a escribir nuevo correo
        $('.ui-subheader-buttons-button.new').on('click', function() {
            // Ponemos la vista de nuevo email
            loadViewNewEmail();
            // Vaciamos los campos
            emptyViewNewEmail();
            $('.header-new-email-emails .to input').focus();
        });
        // Si le da a escribir nuevo correo
        $('.header-new-email-emails .to .text').on('click', function() {
            $('.header-new-email-emails .to input').focus();
        });
        // Si le da a descartar
        $('.container-inbox .ui-subheader-buttons-button.discard-email .text,\
            .new-email-footer .new-email-discard').on('click', function() {

            // Descartamos el email
            var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
            if (typeof idEmail !== typeof undefined && idEmail !== false) {
                var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                    account.removeMessage(jsonData.idEmail, function(error, data) {
                        if (error) alert('Se ha producido un error. '+error)
                        var idEmail = jsonData.idEmail;
                        $('.ui-main.ui-main-new-email').attr('idemail', idEmail);
                        var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                        var hotmailAccount = getHotmailAccount(idCurrentAccount);
                        var folder = getEmailsInFolder(hotmailAccount, idDraftFolder);
                        if (folder !== false) {
                            if (folder.emails.value.length > 0) {
                                folder.emails.value.splice(0, 1);
                            }
                        }
                    });
                });
            }


            // Vaciamos los campos
            emptyViewNewEmail();
            // Cambiamos a vista login
            loadViewEmailList();
        });
        // Si le da a cc en un nuevo correo
        $('.header-new-email-emails .cc').on('click', function() {
            $('.ui-main-new-email').addClass('cc');
        });
        // Si le da a cco en un nuevo correo
        $('.header-new-email-emails .cco').on('click', function() {
            $('.ui-main-new-email').addClass('cco');
        });
        // Si le da a los puntos suspensivos viendo un correo
        $('.ui-subheader-buttons-button.more').on('click', function(e) {
            e.stopPropagation();

            $('.header-view-email-sender-buttons-display').hide();
            $('.ui-subheader-buttons-button-reply-display').hide();

            if ($(this).hasClass('mark')) {
                $('.ui-subheader-buttons .mark').removeClass('mark');
                $('.header-view-email-sender-buttons-more-display').hide();
            }
            else {

                var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idCurrentAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
                var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

                $('.header-view-email-sender-buttons-more-display > *').show();
                if (email.isRead) {
                    $('.header-view-email-sender-buttons-more-display > .rea').hide();
                }
                else {
                    $('.header-view-email-sender-buttons-more-display > .unr').hide();
                }

                $(this).addClass('mark');
                $(this).children('.header-view-email-sender-buttons-more-display').show();
            }

        });
        // Si le da al desplegable en reply viendo un correo
        $('.ui-subheader-buttons-button.reply .dropdown').on('click', function(e) {
            e.stopPropagation();

            $('.header-view-email-sender-buttons-display').hide();
            $('.header-view-email-sender-buttons-more-display').hide();

            if ($(this).parent().hasClass('mark')) {
                $('.ui-subheader-buttons .mark').removeClass('mark');
                $('.ui-subheader-buttons-button-reply-display').hide();
            }
            else {

                var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idCurrentAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
                var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

                $(this).next().children('.repall').hide();
                if ((email.toRecipients.length + email.ccRecipients.length + email.bccRecipients.length) > 1) {
                    $(this).next().children('.repall').show();
                }

                $(this).parent().addClass('mark');
                $(this).next().show();
            }

        });
        // Si le da al desplegable en reply en correo viendo un correo
        $('.header-view-email-sender-buttons .dropdown').on('click', function(e) {
            e.stopPropagation();
            $('.ui-subheader-buttons .mark').removeClass('mark');
            $('.ui-subheader-buttons-button-reply-display').hide();
            $('.header-view-email-sender-buttons-more-display').hide();
            if (!$(this).next().is(':visible')) {

                var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idCurrentAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
                var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

                $(this).next().children('.repall').hide();
                if ((email.toRecipients.length + email.ccRecipients.length + email.bccRecipients.length) > 1) {
                    $(this).next().children('.repall').show();
                }

                $(this).next().show();
            }
            else {
                $(this).next().hide();
            }
        });
        $('.email-new-email').on( 'wz-dropenter', function(){
            $('.email-new-email-hover').show();
            $('.email-new-email-hover').css('height', $('.email-new-email > .mce-tinymce').height());
            $('.email-new-email > .mce-tinymce').hide();
        });
        $('.email-new-email').on( 'wz-dropleave', function(){
            $('.email-new-email-hover').hide();
            $('.email-new-email > .mce-tinymce').show();
        });
        $('.email-new-email').on( 'wz-drop', function( e, item, list ){
            var filesList = [];
            for (var i = 0; i < list.length; i++) {
                filesList.push(list[i].fsnode.id);
            }
            var jsonData = {
                idAccount : $('.ui-left-side-name').attr('idaccount'),
                newFiles: filesList
            }
            
            getAccount(jsonData, function(account, jsonData) {
                var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
                var idAccount = $('.ui-left-side-name').attr('idaccount');
                if (typeof idEmail === typeof undefined || idEmail === false) {
                    saveDraft(function() {
                        var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
                        for (var i = 0; i < jsonData.newFiles.length; i++) {
                            var idFile = jsonData.newFiles[i];
                            api.fs(idFile, function (err, fsnode ) {
                                if (err) alert('Se ha producido un error. '+err)
                                if (fsnode.size < 5242880) {
                                    account.addAttachment(fsnode.id, idEmail, function(error, data) {
                                        if (error) alert('Se ha producido un error. '+error)
                                        var name = data.name;
                                        $('.attachment-new-email').append('\
                                            <div class="attachment" idattachment="'+data.id+'">\
                                                <div class="attachment-inside">\
                                                    <div class="icon"></div>\
                                                    <div class="dropdown">\
                                                        <div class="dropdown-inside">\
                                                            <img src="https://static.inevio.com/app/521/img/dropdown-icon.png">\
                                                        </div>\
                                                        <div class="dropdown-dropper">\
                                                            <div class="entry deattach">'+lang.deattach+'</div>\
                                                            <div class="entry openAttach" fileid="'+idFile+'">'+lang.openAttach+'</div>\
                                                        </div>\
                                                    </div>\
                                                    <div class="name">'+data.name+'</div>\
                                                    <div class="size">'+preparedSizeShow(data.size)+'</div>\
                                                </div>\
                                            </div>\
                                        ');
                                        dropDownAttachmentEmail();
                                    });
                                }
                                else {
                                    confirm(lang.confirmLinkAttachment, function( accepted ) {
                                        if (accepted) {
                                            api.fs(idFile, function (err, fsnode ) {
                                                if (err) alert('Se ha producido un error. '+err)
                                                fsnode.addLink (null, true, true, (err, link) => {
                                                    var content = tinymce.activeEditor.getContent().split('<body>');
                                                    var finalContent = '';
                                                    if (content.length == 1) {
                                                        finalContent = '<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[0]
                                                    }
                                                    else {
                                                        finalContent = content[0]+'<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[1]
                                                    }
                                                    tinymce.activeEditor.setContent(finalContent);
                                                })
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    
                    for (var i = 0; i < jsonData.newFiles.length; i++) {
                        var idFile = jsonData.newFiles[i];
                        api.fs(idFile, function (err, fsnode ) {
                            if (err) alert('Se ha producido un error. '+err)
                            if (fsnode.size < 5242880) {
                                account.addAttachment(fsnode.id, idEmail, function(error, data) {
                                    if (error) alert('Se ha producido un error. '+error)
                                    
                                    var name = data.name;
                                    
                                    $('.attachment-new-email').append('\
                                        <div class="attachment" idattachment="'+data.id+'">\
                                            <div class="attachment-inside">\
                                                <div class="icon"></div>\
                                                <div class="dropdown">\
                                                    <div class="dropdown-inside">\
                                                        <img src="https://static.inevio.com/app/521/img/dropdown-icon.png">\
                                                    </div>\
                                                    <div class="dropdown-dropper">\
                                                        <div class="entry deattach">'+lang.deattach+'</div>\
                                                        <div class="entry openAttach" fileid="'+idFile+'">'+lang.openAttach+'</div>\
                                                    </div>\
                                                </div>\
                                                <div class="name">'+data.name+'</div>\
                                                <div class="size">'+preparedSizeShow(data.size)+'</div>\
                                            </div>\
                                        </div>\
                                    ');
                                    dropDownAttachmentEmail();
                                });
                            }
                            else {
                                confirm(lang.confirmLinkAttachment, function( accepted ) {
                                    if (accepted) {
                                        api.fs(idFile, function (err, fsnode ) {
                                            if (err) alert('Se ha producido un error. '+err)
                                            fsnode.addLink (null, true, true, (err, link) => {
                                                var content = tinymce.activeEditor.getContent().split('<body>');
                                                var finalContent = '';
                                                if (content.length == 1) {
                                                    finalContent = '<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[0]
                                                }
                                                else {
                                                    finalContent = content[0]+'<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[1]
                                                }
                                                tinymce.activeEditor.setContent(finalContent);
                                            })
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        })
        // Si le da adjuntar en un email
        $('.attach-to-email, .new-email-footer .attach').on('click', function(e) {
            e.stopPropagation();

            var dropDown = $(this).next();
            if (!dropDown.hasClass('drop-down-attachment')) {
                dropDown = $(this).find('.drop-down-attachment');
            }

            if (dropDown.is(':visible')) {
                dropDown.hide();
            }
            else {
                $('.drop-down-attachment').hide();
                dropDown.show();
            }

        });
        // Si le da adjuntar desde horbito en un email
        $('.drop-down-attachment .horbito').on('click', function(e) {
            e.stopPropagation();

            var options = {
                title    : 'Seleccionar el adjunto', // To Do -> Meter title por defecto
                mode     : 'file',
                multiple : true
            };

            api.fs.selectSource(options, function(error, response) {
                if (error) alert('Se ha producido un error. '+error)
                $('.main-container.new-email').click()
                if (error != null) {
                    return;
                }
                var object = {
                    idAccount : $('.ui-left-side-name').attr('idaccount'),
                    newFiles: response
                }
                getAccount(object, function(account, jsonData) {
                    var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
                    var idAccount = $('.ui-left-side-name').attr('idaccount');

                    if (typeof idEmail === typeof undefined || idEmail === false) {
                        saveDraft(function() {
                            var idEmail = $('.ui-main.ui-main-new-email').attr('idemail');
                            for (var i = 0; i < jsonData.newFiles.length; i++) {
                                var idFile = jsonData.newFiles[i];
                                api.fs(idFile, function (err, fsnode ) {
                                    if (err) alert('Se ha producido un error. '+err)
                                    if (fsnode.size < 5242880) {
                                        account.addAttachment(idFile, idEmail, function(error, data) {
                                            if (error) alert('Se ha producido un error. '+error)
                                        
                                            var name = data.name;
                                            $('.attachment-new-email').append('\
                                                <div class="attachment" idattachment="'+data.id+'">\
                                                    <div class="attachment-inside">\
                                                        <div class="icon"></div>\
                                                        <div class="dropdown">\
                                                            <div class="dropdown-inside">\
                                                                <img src="https://static.inevio.com/app/521/img/dropdown-icon.png">\
                                                            </div>\
                                                            <div class="dropdown-dropper">\
                                                                <div class="entry deattach">'+lang.deattach+'</div>\
                                                                <div class="entry openAttach" fileid="'+idFile+'">'+lang.openAttach+'</div>\
                                                            </div>\
                                                        </div>\
                                                        <div class="name">'+data.name+'</div>\
                                                        <div class="size">'+preparedSizeShow(data.size)+'</div>\
                                                    </div>\
                                                </div>\
                                            ');
                                            dropDownAttachmentEmail();
                                            
                                        });
                                    }
                                    else {
                                        confirm(lang.confirmLinkAttachment, function( accepted ) {
                                            if (accepted) {
                                                api.fs(idFile, function (err, fsnode ) {
                                                    if (err) alert('Se ha producido un error. '+err)
                                                    fsnode.addLink (null, true, true, (err, link) => {
                                                        var content = tinymce.activeEditor.getContent().split('<body>');
                                                        var finalContent = '';
                                                        if (content.length == 1) {
                                                            finalContent = '<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[0]
                                                        }
                                                        else {
                                                            finalContent = content[0]+'<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[1]
                                                        }
                                                        tinymce.activeEditor.setContent(finalContent);
                                                    })
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        for (var i = 0; i < jsonData.newFiles.length; i++) {
                            var idFile = jsonData.newFiles[i];
                            api.fs(idFile, function (err, fsnode ) {
                                if (err) alert('Se ha producido un error. '+err)
                                if (fsnode.size < 5242880) {
                                    account.addAttachment(idFile, idEmail, function(error, data) {
                                        if (error) alert('Se ha producido un error. '+error)
                                        var name = data.name;
                                        $('.attachment-new-email').append('\
                                            <div class="attachment" idattachment="'+data.id+'">\
                                                <div class="attachment-inside">\
                                                    <div class="icon"></div>\
                                                    <div class="dropdown">\
                                                        <div class="dropdown-inside">\
                                                            <img src="https://static.inevio.com/app/521/img/dropdown-icon.png">\
                                                        </div>\
                                                        <div class="dropdown-dropper">\
                                                            <div class="entry deattach">'+lang.deattach+'</div>\
                                                            <div class="entry openAttach" fileid="'+idFile+'">'+lang.openAttach+'</div>\
                                                        </div>\
                                                    </div>\
                                                    <div class="name">'+data.name+'</div>\
                                                    <div class="size">'+preparedSizeShow(data.size)+'</div>\
                                                </div>\
                                            </div>\
                                        ');
                                        dropDownAttachmentEmail();
                                    });
                                }
                                else {
                                    confirm(lang.confirmLinkAttachment, function( accepted ) {
                                        if (accepted) {
                                            api.fs(idFile, function (err, fsnode ) {
                                                if (err) alert('Se ha producido un error. '+err)
                                                fsnode.addLink (null, true, true, (err, link) => {
                                                    var content = tinymce.activeEditor.getContent().split('<body>');
                                                    var finalContent = '';
                                                    if (content.length == 1) {
                                                        finalContent = '<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[0]
                                                    }
                                                    else {
                                                        finalContent = content[0]+'<body><br><p>'+lang.linkAttchment+': <a href="'+link.url+'" target="_blank">'+link.url+'</a></p><br>'+content[1]
                                                    }
                                                    tinymce.activeEditor.setContent(finalContent);
                                                })
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });

            });

        });
        // Si le da a eliminar correos seleccionados
        $('.ui-subheader-buttons-button.delete-emails').on('click', function(e) {
            e.stopPropagation();
            
            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idCurrentAccount);

            var emailsList = $('.ui-main-email.checked');
            var unreadEmailsBeingDeleted = 0;
            var idFolderSelected = $('.ui-left-side-folders-entry.indent.mark').attr('idfolder')
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolderSelected);
            for (var i = (emailsList.length - 1); i >= 0; i--) {
                var idEmailToBeDeleted = emailsList.eq(i).attr('idmail')
                if (emailsList.eq(i).hasClass('unread')) {
                    unreadEmailsBeingDeleted++;
                }
                if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'deleteditems') {
                    getAccount({idAccount : idCurrentAccount, idEmail : idEmailToBeDeleted}, function(account, jsonData) {
                        account.removeMessage(jsonData.idEmailToBeDeleted, function() {});
                    });
                }
                else {
                    getAccount({idAccount : idCurrentAccount, idEmail : idEmailToBeDeleted}, function(account, jsonData) {
                        account.moveMessage(jsonData.idEmail, idDeletedFolder, function() {});
                    });
                }
                
                var found = false;
                for (var j = 0; j < folderInHotmailAccount.emails.value.length && !found; j++) {
                    if (folderInHotmailAccount.emails.value[j].id == idEmailToBeDeleted) {
                        found = true;
                        folderInHotmailAccount.emails.value.splice(j, 1);
                    }
                }

                emailsList.eq(i).remove();
            }

            $(this).closest('.ui-main-email').remove();
            
            // We correct the badges
            var unreadEmailsSelectedFolder = parseInt($('.ui-left-side-folders-entry.indent.mark > .entry > .unread-messages').html()) - unreadEmailsBeingDeleted;
            if (unreadEmailsSelectedFolder == 0) {
                unreadEmailsSelectedFolder = ''
            }
            $('.ui-left-side-folders-entry.indent.mark > .entry > .unread-messages').html(unreadEmailsSelectedFolder);
            if ($('.ui-left-side-folders-entry.indent.mark').attr('knownname') == 'inbox') {
                $('.ui-left-side-accounts-account.selected .unread-messages').html(unreadEmailsSelectedFolder);
            }
            if ($('.ui-left-side-folders-entry.indent.mark').attr('knownname') != 'deleteditems') {
                var foldersList = $('.ui-left-side-folders-entry.indent');
                var found = false;
                for (var i = 0; i < foldersList.length && !found; i++) {
                    if (foldersList.eq(i).attr('idfolder') == idDeletedFolder) {
                        found = true;
                        var unreadEmailsDestinyFolder = foldersList.eq(i).find('.unread-messages').first().html();
                        if (unreadEmailsDestinyFolder.length == 0) {
                            unreadEmailsDestinyFolder = 0;
                        }
                        foldersList.eq(i).find('.unread-messages').first().html(parseInt(unreadEmailsDestinyFolder) + unreadEmailsBeingDeleted);
                    }
                }
            }

            $('.ui-left-side-folders-entry.mark').click();

            // We empty the emails in trash if it were already loaded
            var found = false;
            for (var i = 0; i < hotmailAccount.folders.length && !found; i++) {
                if (hotmailAccount.folders[i].wellKnownName == 'deleteditems') {
                    found = true;
                    hotmailAccount.folders[i].emails = {
                        'loaded' : false,
                        'value' : []
                    };
                }
            }

        });
        // Si le da al desplegable de mover a
        $('.ui-subheader-buttons-button.move-to').on('click', function(e) {
            e.stopPropagation();
            loadFoldersInMoveTo();
            $('.ui-subheader-buttons-button-moveTo-display').show();
        });
        // Si le da al desplegable en reply viendo un correo
        $('.ui-subheader-buttons-button.reply .ui-subheader-buttons-button-reply-display .rep').on('click', function(e) {
            e.stopPropagation();
            $('.ui-subheader-buttons-button.reply').click();
        });
        // Si le da al desplegable en reply viendo un correo
        $('.header-view-email-sender-buttons').on('click', function(e) {
            e.stopPropagation();
            $('.ui-subheader-buttons-button.reply').click();
        });
        // Si le da al desplegable en reply viendo un correo
        $('.header-view-email-sender-buttons .header-view-email-sender-buttons-display .rep').on('click', function(e) {
            e.stopPropagation();
            $('.ui-subheader-buttons-button.reply').click();
        });
        // Si le da al desplegable en reply all viendo un correo
        $('.header-view-email-sender-buttons .header-view-email-sender-buttons-display .repall').on('click', function(e) {
            e.stopPropagation();
            $('.ui-subheader-buttons-button.reply .repall').click();
        });
        // Si le da al desplegable en forward all viendo un correo
        $('.header-view-email-sender-buttons .header-view-email-sender-buttons-display .forw').on('click', function(e) {
            e.stopPropagation();
            $('.ui-subheader-buttons-button.reply .forw').click();
        });

        // Si le da al desplegable en forward all viendo un correo
        $('.ui-subheader-buttons-button.reply').on('click', function(e) {

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

            var emailToReplyTo = email.from.emailAddress.address;
            if (email.replyTo.length > 0) {
                emailToReplyTo = email.replyTo[0].emailAddress.address;
            }

            $('.ui-subheader-buttons-button.new').click();
            $('.ui-main-new-email .to input.emails').val(emailToReplyTo);
            $('.ui-main-new-email input.subject').val('Re: '+email.subject);
            tinymce.activeEditor.setContent('<br><br><br>------------------------------------------------------------------------------------<br>'+email.body.content);
//            $('.email-new-email textarea').jqteVal('<br><br><br>------------------------------------------------------------------------------------<br>'+email.body.content);
//            $('.ui-main-new-email textarea').val('\n\n\n------------------------------------------------------------------------------------\n\n'+email.body.content);

        });
        // Si le da al desplegable en forward all viendo un correo
        $('.ui-subheader-buttons-button.reply .repall').on('click', function(e) {
            e.stopPropagation();

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

            $('.ui-subheader-buttons-button.new').click();

            var emailToReplyTo = email.from.emailAddress.address;
            if (email.replyTo.length > 0) {
                emailToReplyTo = email.replyTo[0].emailAddress.address;
            }
            if (email.toRecipients.length > 0) {
                for (var i = 0; i < email.toRecipients.length; i++) {
                    var recipient = email.toRecipients[i].emailAddress.name;
                    if (recipient != email.toRecipients[i].emailAddress.address) {
                        recipient += ' <'+email.toRecipients[i].emailAddress.address+'>';
                    }
                    emailToReplyTo += ','+recipient;
                }
            }
            $('.ui-main-new-email .to input.emails').val(emailToReplyTo);
            if (email.ccRecipients.length > 0) {
                var emailCC = '';
                $('.header-new-email-emails .cc').click();
                for (var i = 0; i < email.ccRecipients.length; i++) {
                    var recipient = email.ccRecipients[i].emailAddress.name;
                    if (recipient != email.ccRecipients[i].emailAddress.address) {
                        recipient += ' <'+email.ccRecipients[i].emailAddress.address+'>';
                    }
                    if (i > 0) {
                        emailCC += ',';
                    }
                    emailCC += recipient;
                }
                $('.ui-main-new-email .cc input.emails').val(emailCC);
            }

            $('.ui-main-new-email input.subject').val('Re: '+email.subject);
            tinymce.activeEditor.setContent('<br><br><br>------------------------------------------------------------------------------------<br>'+email.body.content);
//            $('.email-new-email textarea').jqteVal('<br><br><br>------------------------------------------------------------------------------------<br>'+email.body.content);
//            $('.ui-main-new-email textarea').val('\n\n\n------------------------------------------------------------------------------------\n\n'+email.body.content);

        });
        // Si le da al desplegable en forward all viendo un correo
        $('.ui-subheader-buttons-button.reply .forw').on('click', function(e) {
            e.stopPropagation();

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

            $('.ui-subheader-buttons-button.new').click();

            if (email.hasAttachments) {
                alert(lang.attachmentForwardAlert);
            }
            
            $('.ui-main-new-email input.subject').val('Fwd: '+email.subject);
            tinymce.activeEditor.setContent('<br><br><br>------------------------------------------------------------------------------------<br>'+email.body.content);

        });
        // Si le da al desplegable en forward all viendo un correo
        $('.header-view-email-sender-buttons-more-display .rea').on('click', function(e) {
            e.stopPropagation();

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

            markMailAsRead(email.id);
            email.isRead = true;

            $('.main-container').click();

        });
        // Si le da al desplegable en forward all viendo un correo
        $('.header-view-email-sender-buttons-more-display .unr').on('click', function(e) {
            e.stopPropagation();

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var email = getEmail(folderInHotmailAccount, $('.ui-main-view-email').attr('idemail'));

            markMailAsUnread(email.id);
            email.isRead = false;

            $('.main-container').click();

        });
        // Si le da envair un correo
        $('.new-email-send').on('click', function() {
            $('.ui-subheader-buttons-button.send-email').click();
        });
        $('.ui-subheader-buttons-button.send-email').on('click', function(e) {
            e.stopPropagation();

            var validEmailToSendTo = false;
            var hasEmailToSendTo = false;
            if ($('.header-new-email-emails .to input').val().length > 0) {
                var aux = $('.header-new-email-emails .to input').val().split(',');
                for (var i = 0; i < aux.length && !validEmailToSendTo; i++) {
                    if (validateEmail(aux[i].trim())) {
                        validEmailToSendTo = true;
                    }
                }
                hasEmailToSendTo = true;
            }
            else if ($('.header-new-email-emails .cc input').val().length > 0) {
                var aux = $('.header-new-email-emails .cc input').val().split(',');
                for (var i = 0; i < aux.length && !validEmailToSendTo; i++) {
                    if (validateEmail(aux[i].trim())) {
                        validEmailToSendTo = true;
                    }
                }
                hasEmailToSendTo = true;
            }
            else if ($('.header-new-email-emails .cco input').val().length > 0) {
                var aux = $('.header-new-email-emails .cco input').val().split(',');
                for (var i = 0; i < aux.length && !validEmailToSendTo; i++) {
                    if (validateEmail(aux[i].trim())) {
                        validEmailToSendTo = true;
                    }
                }
                hasEmailToSendTo = true;
            }

            if (withAttachmentPendingShow) {
                alert(lang.waitOnSend);
            }
            else if (!hasEmailToSendTo) {
                alert(lang.noDestinatary)
                $('.header-new-email-emails .to input').focus();
            }
            else if (!validEmailToSendTo) {
                alert(lang.noValidDestinatary)
                $('.header-new-email-emails .to input').focus();
            }
            else if (!sendingEmail) {
                sendingEmail = true;

                $('.ui-left-side-folders-entry.mark').click();
                saveDraft(function() {
                    var idEmailDraft = $('.ui-main.ui-main-new-email').attr('idemail');

                    var idEmail = $('.ui-main.ui-main-view-email').attr('idemail');
                    var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
                    getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                        account.sendMessage(idEmailDraft, function(err, data) {
                            sendingEmail = false;
                            if (err) alert('Se ha producido un error. '+err)
                            else {
                                api.banner().setTitle(lang.emailSentTitle).setText(lang.emailSentText).setIcon('https://static.inevio.com/app/521/img/logo-outlook.png').render()
                                // Attention: Should save in sent folder if loaded
                            }
                        });
                    });

                });
            }

        });
        // Si le da a borrar viendo un correo
        $('.ui-subheader-buttons-button.delete').on('click', function() {

            var idEmail = $('.ui-main.ui-main-view-email').attr('idemail');
            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');

            if ($(this).closest('.ui-main-email').hasClass('unread')) {
                $('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html(parseInt($('.ui-left-side-folders .ui-left-side-folders-entry.indent.mark .unread-messages').html()) - 1);
            }

            $(this).closest('.ui-main-email').remove();
            
            if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'deleteditems') {
                getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                    account.removeMessage(jsonData.idEmail, function() {});
                });
            }
            else {
                getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                    account.moveMessage(jsonData.idEmail, idDeletedFolder, function() {});
                });
            }


            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var found = false;
            for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                    found = true;
                    folderInHotmailAccount.emails.value.splice(i, 1);
                }
            }

            $('.ui-left-side-folders-entry.mark').click();

            // We empty the emails in trash if it were already loaded
            var found = false;
            for (var i = 0; i < hotmailAccount.folders.length && !found; i++) {
                if (hotmailAccount.folders[i].wellKnownName == 'deleteditems') {
                    found = true;
                    hotmailAccount.folders[i].emails = {
                        'loaded' : false,
                        'value' : []
                    };
                }
            }

        });
        // Si le da a archive viendo un correo
        $('.ui-subheader-buttons-button.archive').on('click', function() {
            var idEmail = $('.ui-main.ui-main-view-email').attr('idemail');
            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');

            getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                account.moveMessage(jsonData.idEmail, idArchiveFolder, function() {});
            });

            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var found = false;
            var emailBeingArchived;
            var dateAux;
            var dateEmailBeingMoved;
            for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                    found = true;
                    emailBeingArchived = folderInHotmailAccount.emails.value.splice(i, 1);
                    emailBeingArchived = emailBeingArchived[0];
                    dateAux = emailBeingArchived.receivedDateTime.split('T');
                    dateEmailBeingMoved = new Date(dateAux[0].substr(0, 4), dateAux[0].substr(5, 2), dateAux[0].substr(8, 2), dateAux[1].substr(0, 2), dateAux[1].substr(3, 2), dateAux[1].substr(6, 2));
                    dateEmailBeingMoved = dateEmailBeingMoved.getTime();
                }
            }

            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idArchiveFolder);
            var found = false;
            for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                dateAux = folderInHotmailAccount.emails.value[i].receivedDateTime.split('T')
                var dateCompare = new Date(dateAux[0].substr(0, 4), dateAux[0].substr(5, 2), dateAux[0].substr(8, 2), dateAux[1].substr(0, 2), dateAux[1].substr(3, 2), dateAux[1].substr(6, 2));
                if (dateEmailBeingMoved > dateCompare.getTime()) {
                    found = true;
                    folderInHotmailAccount.emails.value.splice(i, 0, emailBeingArchived);
                }
            }
            if (folderInHotmailAccount.emails.loaded && !found) {
                folderInHotmailAccount.emails.value.push(emailBeingArchived);
            }

            $('.ui-left-side-folders-entry.mark').click();

            // We empty the emails in archive if it were already loaded
            var found = false;
            for (var i = 0; i < hotmailAccount.folders.length; i++) {
                if (hotmailAccount.folders[i].wellKnownName == 'archive') {
                    hotmailAccount.folders[i].emails = {
                        'loaded' : false,
                        'value' : []
                    };
                }
                else if (listFolders.eq(i).hasClass('mark')) {
                    listFolders.eq(i).find('.unread-messages').html(parseInt(listFolders.eq(i).find('.unread-messages').html()) - 1);
                }
            }
        });
        // Si le da a mark as spam viendo un correo
        $('.ui-subheader-buttons-button.spam').on('click', function() {
            var idEmail = $('.ui-main.ui-main-view-email').attr('idemail');
            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');

            getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                account.moveMessage(jsonData.idEmail, idSpamFolder, function() {});
            });

            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var found = false;
            var emailBeingArchived;
            var dateAux;
            var dateEmailBeingMoved;
            for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                    found = true;
                    emailBeingArchived = folderInHotmailAccount.emails.value.splice(i, 1);
                    emailBeingArchived = emailBeingArchived[0];
                    dateAux = emailBeingArchived.receivedDateTime.split('T');
                    dateEmailBeingMoved = new Date(dateAux[0].substr(0, 4), dateAux[0].substr(5, 2), dateAux[0].substr(8, 2), dateAux[1].substr(0, 2), dateAux[1].substr(3, 2), dateAux[1].substr(6, 2));
                    dateEmailBeingMoved = dateEmailBeingMoved.getTime();
                }
            }

            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idSpamFolder);
            var found = false;
            for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                dateAux = folderInHotmailAccount.emails.value[i].receivedDateTime.split('T')
                var dateCompare = new Date(dateAux[0].substr(0, 4), dateAux[0].substr(5, 2), dateAux[0].substr(8, 2), dateAux[1].substr(0, 2), dateAux[1].substr(3, 2), dateAux[1].substr(6, 2));
                if (dateEmailBeingMoved > dateCompare.getTime()) {
                    found = true;
                    folderInHotmailAccount.emails.value.splice(i, 0, emailBeingArchived);
                }
            }
            if (folderInHotmailAccount.emails.loaded && !found) {
                folderInHotmailAccount.emails.value.push(emailBeingArchived);
            }

            $('.ui-left-side-folders-entry.mark').click();
        });
        // Si le da a close mail
        $('.ui-subheader-buttons-button.close-email').on('click', function() {
            $('.ui-left-side-folders-entry.mark').click();
        });
        // Si le da a marcar como spam
        $('.ui-subheader-buttons-button.spam').on('click', function() {
            var idEmail = $('.ui-main.ui-main-view-email').attr('idemail');
            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            $(this).closest('.ui-main-email').remove();
            getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                account.removeMessage(jsonData.idEmail, function() {});
            });
            $('.ui-left-side-folders-entry.mark').click();
        });
        // Mark all as read
        $('.ui-subheader-buttons-button.mark-read').on('click', function() {

            if ($('.ui-main-email-list-inner .search').length == 0) {
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            }

            var emailsList = $('.ui-main-email-list-inner > .ui-main-email');
            for (var i = 0; i < emailsList.length; i++) {
                if (emailsList.eq(i).hasClass('unread')) {

                    changesDonePendingSync.push({
                        idEmail: emailsList.eq(i).attr('idmail'),
                        action: 'updated'
                    })

                    if ($('.ui-main-email-list-inner .search').length == 0) {
                        folderInHotmailAccount.emails.value[i].isRead = true;
                    }
                    emailsList.eq(i).removeClass('unread');
                    markMailAsRead(emailsList.eq(i).attr('idmail'))
                }
            }

        });
        // Undo
        $('.ui-subheader-buttons-button.undo-action').on('click', function() {
            if (undo !== false) {

                if (undo.action == 'delete') {

                    getAccount({idAccount : undo.idAccount, idEmail : undo.idMail}, function(account, jsonData) {
//                        account.removeMessage(jsonData.idEmail, function() {});
                    });

                }

            }
        });
    }

    function getHotmailAccount(id) {
        for (var i = 0; i < hotmailAccounts.length; i++) {
            if (hotmailAccounts[i].id == id) {
                return hotmailAccounts[i];
            }
        }
        return false;
    }

    function orderFolders() {
        var order = ['inbox', 'junkemail', 'drafts', 'sentitems', 'deleteditems'];
        var foldersList = $('.ui-left-side-folders > .ui-left-side-folders-entry');
        var finalPosition = 1;
        for (var i = 0; i < order.length; i++) {
            var found = false;
            for (var j = 1; j < foldersList.length && !found; j++) {
                var knownname = foldersList.eq(j).attr('knownname');
                if (knownname != null && knownname.length > 0) {
                    if (order[i] == knownname) {
                        found = true;
                        foldersList.eq(finalPosition++).before(foldersList.eq(j));
                        foldersList = $('.ui-left-side-folders > .ui-left-side-folders-entry');
                    }
                }
            }
        }
    }

    function nestFolders(folders) {
        var indexToJump = [];
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].childFolderCount > 0) {
                var parentId = folders[i].id;
                for (var j = 0; j < parseInt(folders[i].childFolderCount); j++) {
                    var idFolderChild = -1;
                    for (var k = 0; k < parseInt(folders.length) && idFolderChild == -1; k++) {
                        if (folders[k].parentFolderId == parentId) {
                            idFolderChild = folders[k].id;
                        }
                    }
                    // Lo recolocamos visualmente
                    var foldersList = $('.ui-left-side-folders .ui-left-side-folders-entry:not(.folder)');
                    var moved = false;
                    for (var k = 0; k < foldersList.length && !moved; k++) {
                        if (foldersList.eq(k).attr('idfolder') == idFolderChild) {
                            for (var l = 0; l < foldersList.length && !moved; l++) {
                                if (foldersList.eq(l).attr('idfolder') == parentId) {
                                    moved = true;
                                    if (foldersList.eq(l).find('.children').length == 0) {
                                        foldersList.eq(l).append('<div class="children"></div>');
                                    }
                                    foldersList.eq(l).addClass('rowTree')
                                    foldersList.eq(l).find('.children').append(foldersList.eq(k));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function loadMainEmail(account) {

        $('.ui-left-side-name').attr('idaccount', account.id);
        $('.ui-left-side-name .name').text(account.name);
        $('.ui-left-side-folders > *:not(:first)').remove();
        if (account.avatar == null || account.avatar.length == 0) {
            var auxAcron = account.name.split(' ');
            var acron = account.name.substr(0, 1);
            if (auxAcron.length > 1) {
                acron += auxAcron[1].substr(0, 1)
            }
            $('.ui-left-side-name-image').html('<div class="icon-user">'+acron+'</div>');
        }
        else {
            $('.ui-left-side-name-image').html('<img class="user-icon" src="'+account.avatar+'">');
        }
        
        var query = {};
        query.count = true;
        query.top = 10000;
        account.getFolders(null, query, function( error , folders ) {

            if (error) {
                $('.ui-main-email-list-inner').html('\
                    <div class="emptyEmails">\
                        <img src="https://static.inevio.com/app/521/img/empty.png">\
                        <div class="text">Esta carpeta está vacía.</div>\
                    </div>\
                ');
                console.log('Unable to load folders');
                return;
            }

            var hotmailAccount = getHotmailAccount(account.id);
            hotmailAccount.folders = folders.value;
            for (var i = 0; i < hotmailAccount.folders.length; i++) {
                hotmailAccount.folders[i].emails = {
                    'loaded' : false,
                    'value' : []
                };
            }

            for (var i = 0; i < folders.value.length; i++) {
                var folder = folders.value[i];
                var unreadEmails = '';
                if (folder.unreadItemCount > 0) {
                    unreadEmails = folder.unreadItemCount;
                }
                $('.ui-left-side-folders').append('\
                    <section knownname="'+folder.wellKnownName+'" idfolder="'+folder.id+'" parentfolder="'+folder.parentFolderId+'" class="ui-left-side-folders-entry indent">\
                        <div class="entry">\
                            <img class="tree" src="https://static.inevio.com/app/521/img/tree-open.png">\
                            <span class="text">'+folder.displayName+'</span>\
                            <span class="unread-messages">'+unreadEmails+'</span>\
                        </div>\
                    </section>\
                ');
                if (folder.wellKnownName == 'archive') {
                    idArchiveFolder = folder.id;
                }
                else if (folder.wellKnownName == 'inbox') {
                    var foundAccountEntries = false;
                    var listAccountsEntries = $('.ui-left-side-accounts-account');
                    for (var j = 0; j < listAccountsEntries.length && !foundAccountEntries; j++) {
                        if (listAccountsEntries.eq(j).attr('idaccount') == account.id) {
                            foundAccountEntries = true;
                            listAccountsEntries.eq(j).find('.unread-messages').html('')
                            if (folder.unreadItemCount > 0) {
                                listAccountsEntries.eq(j).find('.unread-messages').html(folder.unreadItemCount)
                            }
                        }
                    }
                }
                else if (folder.wellKnownName == 'junkemail') {
                    idSpamFolder = folder.id;
                }
                else if (folder.wellKnownName == 'drafts') {
                    idDraftFolder = folder.id;
                }
                else if (folder.wellKnownName == 'deleteditems') {
                    idDeletedFolder = folder.id;
                }
            }
            orderFolders();
            nestFolders(folders.value);

            poderEntrarEnCarpeta();
            poderDesplegarCarpeta();
            // We open the inbox folder
            var foldersList = $('.ui-left-side-folders .indent');
            var found = false;
            for (var i = 0; i < foldersList.length && !found; i++) {
                var folder = foldersList.eq(i);
//                if (folders.value[i].wellKnownName == 'inbox') {
                if (folder.find('.text').html() == 'Bandeja de entrada') {
                    found = true;
                    folder.click();
                }
            };
        });

    }
    function getAccount(jsonData, callback) {
        api.integration.outlook.listAccounts(function( e , accounts ){
            if (e) alert('Se ha producido un error.'+e)
            accounts.forEach(function ( account ) {
                if (account.id == jsonData.idAccount) {
                    callback(account, jsonData);
                }
            });
        });
    }

    function designMailMailsList(mail) {
        var date = mail.sentDateTime.split('T')[0];
        date = date.substr(8, 2)+'/'+date.substr(5, 2)+'/'+date.substr(0, 4);
        var classUnread = '';
        var classMarked = '';
        if (!mail.isRead) {
            classUnread = ' unread';
        }
        if (!mail.isMark) {
//            classUnread = ' marked';
        }
        var subject = mail.subject;
        if (subject == null) {
            subject = '';
        }
        var hideAttachment = '';
        if (!mail.hasAttachments) {
            hideAttachment = ' hide';
        }
        var preview = '';
        if (mail.bodyPreview.length > 0) {
            preview = ' <span>'+mail.bodyPreview+'</span>';
        }
        var from = '';
        if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'drafts') {
            if (mail.toRecipients.length > 0 && mail.toRecipients[0].emailAddress.name.length > 0) {
                from = mail.toRecipients[0].emailAddress.name;
            }
            else {
                from = '<span class="drafts">['+lang.drafts+']</span>'
            }
        }
        else if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'sentitems') {
            from = '';
            for (var i = 0; i < mail.toRecipients.length; i++) {
                if (i > 0) {
                    from += ', ';
                }
                if (mail.toRecipients[i].emailAddress.name.length > 0) {
                    from += mail.toRecipients[i].emailAddress.name;
                }
                else {
                    from += mail.toRecipients[i].emailAddress.name;
                }
            }
        }
        else if (mail.hasOwnProperty('from') && mail.from != 'undefined') {
            from = mail.from.emailAddress.name;
        }
        return '\
            <section class="ui-main-email'+classUnread+classMarked+'" idmail="'+mail.id+'">\
                <section class="ui-sender">\
                    <div class="checkbox checkEmail">\
                        <div class="tick"></div>\
                    </div>\
                    <div class="sender">'+from+'</div>\
                    <section class="buttons">\
                        <img class="delete" src="https://static.inevio.com/app/521/img/delete-icon.png">\
                        <img class="read" src="https://static.inevio.com/app/521/img/read-email-icon.png">\
                        <img class="attach'+hideAttachment+'" src="https://static.inevio.com/app/521/img/attachment-clip.png">\
                    </section>\
                </section>\
                <div class="subject">'+subject+''+preview+'</div>\
                <span class="date">'+date+'</span>\
            </section>';
    }

    function getEmailsInFolder(hotmailAccount, idFolder) {
        for (var i = 0; i < hotmailAccount.folders.length; i++) {
            if (hotmailAccount.folders[i].id == idFolder) {
                return hotmailAccount.folders[i];
            }
        }
        return false;
    }

    function loadMoreEmails() {

        if (!loadingMoreEmails) {

            loadingMoreEmails = true;

            if ($('.ui-main-email-list-inner .search').length == 0) {

                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
                // 'loaded' : true,
                // 'all' : false,
                // 'value' : mails.value

                var mailsAlreadyVisible = $('.ui-main-email-list-inner > .ui-main-email').length;
                var mailsAlreadyLoaded = folderInHotmailAccount.emails.value.length;
                // If we are showing all that is already loaded
                if (mailsAlreadyVisible == mailsAlreadyLoaded) {
                    // We check not every email has been loaded
                    if (!folderInHotmailAccount.emails.all) {
                        $('.ui-main-email-list-inner').append('<section class="ui-main-email" style="text-align: center;">Loading</section>');
                        // We load more
                        getAccount({idAccount : idHotmailAccount}, function(account) {
                            var data = new Object();
                            data.top = 50;
                            data.skip = mailsAlreadyLoaded;
                            account.getMessagesInFolder(idFolder, data, function( error, mails) {
                                if (error) alert('Se ha producido un error. '+error)
                                folderInHotmailAccount.emails.value = folderInHotmailAccount.emails.value.concat(mails.value);
                                if (mails.value.length < 50) {
                                    folderInHotmailAccount.emails.all = true;
                                }
                                $('.ui-main-email-list-inner .ui-main-email').last().remove();
                                mails.value.forEach(function( mail ) {
                                    $('.ui-main-email-list-inner').append(designMailMailsList(mail));
                                });
                                actionsInMailList();
                                loadingMoreEmails = false;
                            });
                        });
                    }
                    else {
                        loadingMoreEmails = false;
                    }
                }
                // If we are not showing all the emails loaded
                else {
                    var numMaxEmails = 50;
                    if (mailsAlreadyLoaded - mailsAlreadyVisible < 50) {
                        numMaxEmails = mailsAlreadyLoaded - mailsAlreadyVisible;
                        // We should load more
                    }
                    for (var i = mailsAlreadyVisible; i < (mailsAlreadyVisible + numMaxEmails); i++) {
                        $('.ui-main-email-list-inner').append(designMailMailsList(folderInHotmailAccount.emails.value[i]));
                    }
                    actionsInMailList();
                    loadingMoreEmails = false;
                }

            }
            else {/*
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                $('.ui-main-email-list-inner').append('<section class="ui-main-email" style="text-align: center;">Loading</section>');
                // We load more
                getAccount({idAccount : idHotmailAccount}, function(account) {
                    var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                    var data = new Object();
                    data.top = 50;
                    data.skip = $('.ui-main-email-list-inner > .ui-main-email').length - 1;
                    data.search = $('.ui-main-email-list-inner .search span').html();
                    account.getMessagesInFolder(idFolder, data, function( error, mails) {
                        $('.ui-main-email-list-inner .ui-main-email').last().remove();
                        mails.value.forEach(function( mail ) {
                            $('.ui-main-email-list-inner').append(designMailMailsList(mail));
                        });
                        actionsInMailList();
                    });
                });*/
            }

        }

    }

    function poderDesplegarCarpeta() {
        $('.ui-left-side-folders-entry.folder .tree').off('click');
        $('.ui-left-side-folders-entry.folder .tree').on('click', function(e) {
            e.stopPropagation();
            if ($(this).closest('.ui-left-side-folders-entry').hasClass('hideDropDown')) {
                $(this).closest('.ui-left-side-folders-entry').removeClass('hideDropDown');
                var folderPointing = $(this).closest('.ui-left-side-folders-entry').next();
                while (folderPointing.hasClass('ui-left-side-folders-entry')) {
                    folderPointing.show();
                    folderPointing = folderPointing.next();
                }
            }
            else {
                $(this).closest('.ui-left-side-folders-entry').addClass('hideDropDown');
                var folderPointing = $(this).closest('.ui-left-side-folders-entry').next();
                while (folderPointing.hasClass('ui-left-side-folders-entry')) {
                    folderPointing.hide();
                    folderPointing = folderPointing.next();
                }
            }
        });
        $('.ui-left-side-folders .ui-left-side-folders-entry.indent .tree').off('click');
        $('.ui-left-side-folders .ui-left-side-folders-entry.indent .tree').on('click', function(e) {
            e.stopPropagation();
            if ($(this).closest('.ui-left-side-folders-entry').hasClass('hideDropDown')) {
                $(this).closest('.ui-left-side-folders-entry').removeClass('hideDropDown');
            }
            else {
                $(this).closest('.ui-left-side-folders-entry').addClass('hideDropDown');
            }
        });
    }

    function poderEntrarEnCarpeta() {
        $('.ui-left-side-folders .ui-left-side-folders-entry.indent').off('click');
        $('.ui-left-side-folders .ui-left-side-folders-entry.indent').on('click', function(e) {
            e.stopPropagation();
//            $('.ui-subheader-buttons-button.mark-read').show();
            loadingMoreEmails = true;
            $('.ui-main-email-list').scrollTop(0)
            loadViewEmailList();
            $('.ui-left-side-folders .mark').removeClass('mark');
            $(this).addClass('mark');

            var idHotmailAccount = $(this).closest('.main-container').find('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idHotmailAccount);
            var idFolder = $(this).attr('idfolder');
            lastEnteredFolderId = idFolder;
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);

            $('.ui-main-email-list-inner').html('\
                <div class="messageLoadingEmails">\
                    <div class="imageWaiting"></div>\
                    <div class="text">Waiting for Microsoft</div>\
                </div>\
            ')
            
            if (folderInHotmailAccount.emails.loaded == true) {
                $('.ui-main-email-list-inner').html('');
                var numberOfMailsToBeListed = 50;
                if (folderInHotmailAccount.emails.value.length < 50) {
                    numberOfMailsToBeListed = folderInHotmailAccount.emails.value.length;
                }
                for (var i = 0; i < numberOfMailsToBeListed; i++) {
                    $('.ui-main-email-list-inner').append(designMailMailsList(folderInHotmailAccount.emails.value[i]));
                }
                actionsInMailList();
                loadingMoreEmails = false;

                if ($('.ui-main-email-list-inner').html().length == 0) {
                    $('.ui-main-email-list-inner').append('\
                        <div class="emptyEmails">\
                            <img src="https://static.inevio.com/app/521/img/empty.png">\
                            <div class="text">Esta carpeta está vacía.</div>\
                        </div>\
                    ');
                }
            }
            else {
                getAccount({idAccount : idHotmailAccount}, function(account) {
                    var data = new Object();
                    data.top = 50;
                    account.getMessagesInFolder(idFolder, data, function( error, mails ) {
                        if (error) alert('Se ha producido un error. '+error)
                        $('.ui-main-email-list-inner').html('');
                        folderInHotmailAccount.emails = {
                            'loaded' : true,
                            'all' : false,
                            'nextLink' : false,
                            'value' : mails.value
                        };
                        if (mails.hasOwnProperty('@odata.nextLink')) {
                            folderInHotmailAccount.emails.nextLink = mails['@odata.nextLink'];
                        }
                        if (mails.value.length < 50) {
                            folderInHotmailAccount.emails.all = true;
                        }
                        mails.value.forEach(function( mail ) {
                            $('.ui-main-email-list-inner').append(designMailMailsList(mail));
                        });
                        actionsInMailList();
                        loadingMoreEmails = false;

                        if ($('.ui-main-email-list-inner').html().length == 0) {
                            $('.ui-main-email-list-inner').append('\
                                <div class="emptyEmails">\
                                    <img src="https://static.inevio.com/app/521/img/empty.png">\
                                    <div class="text">Esta carpeta está vacía.</div>\
                                </div>\
                            ');
                        }

                    });
                });
            }
        });
    }

    function markMailAsUnread(idEmail) {

        if ($('.ui-main-email-list-inner .search').length == 0) {
            $('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html(parseInt($('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html())+1);
            if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'inbox') {
                $('.ui-left-side-accounts-account.selected .unread-messages').html('')
                if (parseInt($('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html()) > 2) {
                    $('.ui-left-side-accounts-account.selected .unread-messages').html(parseInt($('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html()))
                }
            }
        }
        var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
        getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
            account.updateMessage(jsonData.idEmail, {id: jsonData.idEmail, isRead: "false"}, function(err, sdaf) {
                if (err) alert('Se ha producido un error. '+err)
            });
        });

    }

    function markMailAsRead(idEmail) {

        if ($('.ui-main-email-list-inner .search').length == 0) {
            $('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html(parseInt($('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html())-1);
            if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'inbox') {
                $('.ui-left-side-accounts-account.selected .unread-messages').html('')
                if (parseInt($('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html()) > 2) {
                    $('.ui-left-side-accounts-account.selected .unread-messages').html(parseInt($('.ui-left-side-folders-entry.mark > .entry > .unread-messages').html()))
                }
            }
        }
        var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
        getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
            account.updateMessage(jsonData.idEmail, {id: jsonData.idEmail, isRead: "true"}, function(err, sdaf) {
                if (err) alert('Se ha producido un error. '+err)
            });
        });
        
    }

    function dayWeekToLetters(dayWeek) {
        var week = '';
        switch (dayWeek) {
            case 0:
                week = 'dom';
                break;
            case 1:
                week = 'lun';
                break;
            case 2:
                week = 'mar';
                break;
            case 3:
                week = 'mié';
                break;
            case 4:
                week = 'jue';
                break;
            case 5:
                week = 'vie';
                break;
            case 6:
                week = 'sáb';
                break;
        }
        return week;
    }

    function preparedSizeShow(bytes) {
        var kilobytes = bytes / 1024;
        if (kilobytes < 1) {
            return bytes+' bytes';
        }
        megabytes = kilobytes / 1024;
        if (megabytes < 1) {
            var kilobytesDec = Math.round(kilobytes * 10) / 10;
            return kilobytesDec+' kilobytes';
        }
        var megabytesDec = Math.round(megabytes * 10) / 10;
        return megabytesDec+' megabytes';
    }

    var emailAttachments = [];
    function openMail() {

        var folderInHotmailAccount;
        var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
        var isDraft = false;
        if ($('.ui-main-email-list-inner .search').length == 0) {
            var hotmailAccount = getHotmailAccount(idCurrentAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            if (idFolder == idDraftFolder) {
                isDraft = true;
            }
            folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
        }
        else {
            folderInHotmailAccount = searchResults;
        }
        var idEmail = $('.ui-main-email.open').attr('idmail');

        var found = false;
        for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {

            if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                found = true;
                var mail = folderInHotmailAccount.emails.value[i];

                if (!isDraft) {

                    $('.ui-main.ui-main-view-email').attr('idemail', idEmail);
                    loadViewEmail();
                    $('.header-view-email .subject').html(mail.subject)
                    var sender = '';
                    var acron = '';
                    if (mail.hasOwnProperty('from') && mail.from != undefined) {
                        sender = mail.from.emailAddress.name;
                        acron = sender.substr(0, 1);
                        if (mail.from.emailAddress.name != mail.from.emailAddress.address) {
                            var auxAcron = sender.split(' ');
                            if (auxAcron.length > 1) {
                                acron += auxAcron[1].substr(0, 1);
                            }
                            sender += ' &lt;'+mail.from.emailAddress.address+'&gt;';
                        }
                    }
                    $('.header-view-email-sender-info .sender').html(sender);
                    $('.header-view-email-sender .icon-user').html(acron);

                    var destination = '';
                    for (var i = 0; i < mail.toRecipients.length; i++) {
                        if (i > 0) {
                            destination += '; ';
                        }
                        destination += mail.toRecipients[i].emailAddress.name;
                        if (mail.toRecipients[i].emailAddress.name != mail.toRecipients[i].emailAddress.address) {
                            destination += ' ('+mail.toRecipients[i].emailAddress.address+')';
                        }
                    }
                    for (var i = 0; i < mail.ccRecipients.length; i++) {
                        if (destination.length > 0) {
                            destination += '; ';
                        }
                        destination += mail.ccRecipients[i].emailAddress.name;
                        if (mail.ccRecipients[i].emailAddress.name != mail.ccRecipients[i].emailAddress.address) {
                            destination += ' ('+mail.ccRecipients[i].emailAddress.address+')';
                        }
                    }
                    for (var i = 0; i < mail.bccRecipients.length; i++) {
                        if (destination.length > 0) {
                            destination += '; ';
                        }
                        destination += mail.bccRecipients[i].emailAddress.name;
                        if (mail.bccRecipients[i].emailAddress.name != mail.bccRecipients[i].emailAddress.address) {
                            destination += ' ('+mail.bccRecipients[i].emailAddress.address+')';
                        }
                    }
                    $('.header-view-email-sender-info .destination').html(destination);

                    // Attachments
                    emailAttachments = [];
                    $('.ui-main.ui-main-view-email .attachments-view-email').html('');
                    if (mail.hasAttachments) {
                        getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                            account.listAttachments(jsonData.idEmail, null, function(error, data) {
                                if (error) alert('Se ha producido un error. '+error)
                                // If still viewing the email
                                if ($('.ui-main.ui-main-view-email').attr('idemail') == jsonData.idEmail) {

                                    var found = false;
                                    for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                                        if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                                            found = true;
                                            var mail = folderInHotmailAccount.emails.value[i];

                                            var attachments = data.value;
                                            mail.emailAttachments = attachments;
                                            emailAttachments = attachments;
                                            for (var i = 0; i < attachments.length; i++) {
                                                var attachment = attachments[i];
                                                var idAttachment = attachment.id;
                                                var name = attachment.name;
                                                var sizeBytes = attachment.size;
                                                
                                                $('.ui-main.ui-main-view-email .attachments-view-email').append('\
                                                    <div class="attachment" idattachment="'+idAttachment+'">\
                                                        <div class="attachment-inside">\
                                                            <div class="icon"></div>\
                                                            <div class="dropdown">\
                                                                <div class="dropdown-inside">\
                                                                    <img src="https://static.inevio.com/app/521/img/dropdown-icon.png">\
                                                                </div>\
                                                                <div class="dropdown-dropper">\
                                                                    <a download="'+name+'" href="data:application/octet-stream;base64,'+attachment.contentBytes+'" target="_blank">\
                                                                        <div class="entry downloadToPC">'+lang.downloadPC+'</div>\
                                                                    </a>\
                                                                    <div class="entry downloadToInevio">'+lang.downloadHorbito+'</div>\
                                                                </div>\
                                                            </div>\
                                                            <div class="name">'+name+'</div>\
                                                            <div class="size">'+preparedSizeShow(sizeBytes)+'</div>\
                                                        </div>\
                                                    </div>\
                                                ');
                                            }
                                            dropDownAttachmentEmail();

                                        }
                                    }

                                }
                            });
                        });
                    }

                    var dateAux = mail.receivedDateTime.split('T')
                    var aux = new Date(dateAux[0].substr(0, 4), dateAux[0].substr(5, 2), dateAux[0].substr(8, 2));
                    var dateWeek = dayWeekToLetters(aux.getDay());
                    var date = dateWeek+' '+dateAux[0].substr(8, 2)+'/'+dateAux[0].substr(5, 2)+'/'+dateAux[0].substr(0, 4)+' '+dateAux[1].substr(0, 5);
                    $('.header-view-email-sender-info .date').html(date);
//                    $('.email-view-email').html(mail.body.content)
                    $('.email-view-email').css('height', '1px')
                    $('.email-view-email').attr('srcdoc', mail.body.content);
                    $('.email-view-email').load(function() {
                        var iframe = $(".email-view-email").contents();
                        $('.email-view-email').css('height', iframe.height())
                    })
                    $('.email-view-email').scrollTop(0);

                }
                else {

                    // Ponemos la vista de nuevo email
                    loadViewNewEmail();
                    // Vaciamos los campos
                    emptyViewNewEmail();

                    $('.ui-main.ui-main-new-email').attr('idemail', mail.id);

                    var emailTo = '';
                    for (var i = 0; i < mail.toRecipients.length; i++) {
                        if (i > 0) {
                            emailTo += ', ';
                        }
                        if (mail.toRecipients[i].emailAddress.hasOwnProperty('name') && mail.toRecipients[i].emailAddress.hasOwnProperty('address')) {
                            emailTo += mail.toRecipients[i].emailAddress.name+' <'+mail.toRecipients[i].emailAddress.address+'>';
                        }
                        else {
                            if (mail.toRecipients[i].emailAddress.hasOwnProperty('name')) {
                                emailTo += mail.toRecipients[i].emailAddress.name;
                            }
                            else {
                                emailTo += mail.toRecipients[i].emailAddress.address;
                            }
                        }
                    }
                    $('.ui-main-new-email .to input').val(emailTo);

                    var emailCc = '';
                    for (var i = 0; i < mail.ccRecipients.length; i++) {
                        if (i > 0) {
                            emailCc += ', ';
                        }
                        if (mail.ccRecipients[i].emailAddress.hasOwnProperty('name') && mail.ccRecipients[i].emailAddress.hasOwnProperty('address')) {
                            emailCc += mail.ccRecipients[i].emailAddress.name+' <'+mail.ccRecipients[i].emailAddress.address+'>';
                        }
                        else {
                            if (mail.ccRecipients[i].emailAddress.hasOwnProperty('name')) {
                                emailCc += mail.ccRecipients[i].emailAddress.name;
                            }
                            else {
                                emailCc += mail.ccRecipients[i].emailAddress.address;
                            }
                        }
                    }
                    if (mail.ccRecipients.length > 0) {
                        $('.header-new-email-emails .cc .text').click();
                    }
                    $('.ui-main-new-email .cc input').val(emailCc);

                    var emailCco = '';
                    for (var i = 0; i < mail.bccRecipients.length; i++) {
                        if (i > 0) {
                            emailCco += ', ';
                        }
                        if (mail.bccRecipients[i].emailAddress.hasOwnProperty('name') && mail.bccRecipients[i].emailAddress.hasOwnProperty('address')) {
                            emailCco += mail.bccRecipients[i].emailAddress.name+' <'+mail.bccRecipients[i].emailAddress.address+'>';
                        }
                        else {
                            if (mail.bccRecipients[i].emailAddress.hasOwnProperty('name')) {
                                emailCco += mail.bccRecipients[i].emailAddress.name;
                            }
                            else {
                                emailCco += mail.bccRecipients[i].emailAddress.address;
                            }
                        }
                    }
                    if (mail.bccRecipients.length > 0) {
                        $('.header-new-email-emails .cco .text').click();
                    }
                    $('.ui-main-new-email .cco input').val(emailCco);


                    // Attachments
                    emailAttachments = [];
                    $('.attachment-new-email').html('');
                    if (mail.hasAttachments) {
                        getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                            account.listAttachments(jsonData.idEmail, null, function(error, data) {
                                if (error) alert('Se ha producido un error. '+error)
                                if ($('.ui-main.ui-main-view-email').attr('idemail') == jsonData.idEmail) {
                                    var attachments = data.value;
                                    emailAttachments = attachments;
                                    for (var i = 0; i < attachments.length; i++) {
                                        var attachment = attachments[i];
                                        var idAttachment = attachment.id;
                                        var name = attachment.name;
                                        var sizeBytes = attachment.size;
                                        
                                        $('.attachment-new-email').append('\
                                            <div class="attachment" idattachment="'+idAttachment+'">\
                                                <div class="attachment-inside">\
                                                    <div class="icon"></div>\
                                                    <div class="dropdown">\
                                                        <div class="dropdown-inside">\
                                                            <img src="https://static.inevio.com/app/521/img/dropdown-icon.png">\
                                                        </div>\
                                                        <div class="dropdown-dropper">\
                                                            <a download="'+name+'" href="data:application/octet-stream;base64,'+attachment.contentBytes+'" target="_blank">\
                                                                <div class="entry downloadToPC">'+lang.downloadPC+'</div>\
                                                            </a>\
                                                            <div class="entry downloadToInevio">'+lang.downloadHorbito+'</div>\
                                                        </div>\
                                                    </div>\
                                                    <div class="name">'+name+'</div>\
                                                    <div class="size">'+preparedSizeShow(sizeBytes)+'</div>\
                                                </div>\
                                            </div>\
                                        ');
                                    }
                                    dropDownAttachmentEmail();
                                }
                            });
                        });
                    }

                    $('.ui-main.ui-main-new-email input.subject').val(mail.subject);
                    var message = tinymce.activeEditor.setContent(mail.body.content);
//                    $('.email-new-email textarea').jqteVal(mail.body.content);
//                    $('.ui-main.ui-main-new-email .email-new-email textarea').val(mail.body.content);

                }

            }
        }

    }

    function dropDownAttachmentEmail() {
        // Not used. Uses 'a' tag
        $('.attachment-inside .downloadToPC').on('click', function(e) {
            /*
            var idAttachment = $(this).closest('.attachment').attr('idattachment');
            var found = false;
            for (var i = 0; i < emailAttachments.length && !found; i++) {
                if (emailAttachments[i].id == idAttachment) {
                    found = true;
                    window.open('data:application/octet-stream;base64,'+attachment.contentBytes);
                }
            }*/
        });
        $('.attachment-inside .openAttach').off('click');
        $('.attachment-inside .openAttach').on('click', function(e) {

            var idFileAttached = $(this).attr('fileid')
            api.fs( idFileAttached, function( err, fsnode ){
                if (err) alert('Se ha producido un error. '+err)
                fsnode.open()
            })

//            $(this).closest('.attachment').remove();
        });
        $('.attachment-inside .deattach').off('click');
        $('.attachment-inside .deattach').on('click', function(e) {
            
            var idAccount = $('.ui-left-side-name').attr('idaccount');
            var idFileAttached = $(this).closest('.attachment').attr('idattachment')
            var idEmail = $('.ui-main-new-email').attr('idemail')

            $(this).closest('.attachment').remove();
            getAccount({idAccount : idAccount, idFileAttached : idFileAttached, idEmail : idEmail}, function(account, jsonData) {
                account.deleteAttachment(jsonData.idFileAttached, jsonData.idEmail, function(error, res) {
                    if (error) alert('Se ha producido un error. '+error)
                });
            });

        });
        $('.attachment-inside .downloadToInevio').off('click');
        $('.attachment-inside .downloadToInevio').on('click', function(e) {

            var idAccount = $('.ui-left-side-name').attr('idaccount');
            var options = {
                title : 'Seleccionar carpeta de destino',
                mode : 'file',
                name : $(this).closest('.attachment-inside').find('.name').html()
            };

            var attachmentData = $(this).closest('.attachment');
            api.fs.selectDestiny(options, function(error, response) {
                if (error) alert('Se ha producido un error. '+error)
                if (error == null) {
                    var jsonData = {
                        idAccount : idAccount,
                        idAttachment : attachmentData.attr('idattachment'),
                        destiny : response.destiny,
                        replace : response.replace,
                        name : response.name
                    }
                    getAccount(jsonData, function(account, jsonData) {
                        var attachmentId  = jsonData.idAttachment;
                        var messageId     = $('.ui-main.ui-main-view-email').attr('idemail');
                        account.uploadToHorbito(attachmentId,  messageId, jsonData.destiny, function( err, res ){
                            if (err) alert('Se ha producido un error. '+err)
//                            if (err) alert('Se ha producido un error al guardar el archivo')
//                            if( err ) return console.log( 'Error:\n', JSON.stringify( err, null, 2 ) );
//                            console.log('Res ', res)
                        });
                    });

                }
            });

        });

        $('.attachment-inside .dropdown-inside').off('click');
        $('.attachment-inside .dropdown-inside').on('click', function(e) {
            e.stopPropagation();
            if ($(this).next().is(':visible')) {
                $(this).next().hide();
            }
            else {
                $(this).next().show();
            }
        });
    }

    var undo = false;
    var loadingMoreEmails = false;
    function actionsInMailList() {
        // Select email
        $('.ui-sender .checkbox').off('click');
        $('.ui-sender .checkbox').on('click', function(e) {
            e.stopPropagation();
            $('.main-container').click();
            if ($(this).closest('.ui-main-email').hasClass('checked')) {
                $(this).closest('.ui-main-email').removeClass('checked')
            }
            else {
                $(this).closest('.ui-main-email').addClass('checked')
            }
            var clickedEmails = $('.ui-main-email.checked');
            if (clickedEmails.length == 0) {
                $('.ui-subheader-buttons-button.delete-emails').hide();
                $('.ui-subheader-buttons-button.move-to').hide();
            }
            else {
                $('.ui-subheader-buttons-button.delete-emails').show();
                $('.ui-subheader-buttons-button.move-to').show();
            }
        });
        // Load more
        $('.ui-main-email-list').off('scroll');
        $('.ui-main-email-list').on('scroll', function() {
            var windowHeight = $(this).height();
            var positionScroll = $(this).children('.ui-main-email-list-inner').position();
            positionScroll = positionScroll.top;
            var scrollHeight = $(this).children('.ui-main-email-list-inner').height();
            if (scrollHeight - windowHeight + positionScroll < 200) {
                loadMoreEmails();
            }
        });
        // Open mail
        $('.ui-main-email').off('click');
        $('.ui-main-email').on('click', function(e) {
            var idEmail = $(this).closest('.ui-main-email').attr('idmail');

            if ($(this).closest('.ui-main-email').hasClass('unread')) {
                changesDonePendingSync.push({
                    idEmail: idEmail,
                    action: 'updated'
                })
            }

            $(this).closest('.ui-main-email').removeClass('unread');
            $(this).closest('.ui-main-email').addClass('open');

            var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
            var hotmailAccount = getHotmailAccount(idHotmailAccount);
            var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
            var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
            var email = getEmail(folderInHotmailAccount, idEmail);

            if (!email.isRead) {
                markMailAsRead(idEmail);
                email.isRead = true;
            }

            openMail();
        });
        // Delete
        $('.ui-main-email .delete').off('click');
        $('.ui-main-email .delete').on('click', function(e) {

            e.stopPropagation();

            var idCurrentAccount = $('.ui-left-side-name').attr('idaccount');
            var idEmail = $(this).closest('.ui-main-email').attr('idmail');
            var unread = false;
            if ($(this).closest('.ui-main-email').hasClass('unread')) {
                unread = true;
            }

            changesDonePendingSync.push({
                idEmail: idEmail,
                action: 'deleted'
            })

            $(this).closest('.ui-main-email').remove();

            if ($('.ui-left-side-folders-entry.mark').attr('knownname') == 'deleteditems') {
                getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                    account.removeMessage(jsonData.idEmail, function(err, res) {
                        if (err) alert('Se ha producido un error. '+err)
                    });
                });
            }
            else {
                getAccount({idAccount : idCurrentAccount, idEmail : idEmail}, function(account, jsonData) {
                    account.moveMessage(jsonData.idEmail, idDeletedFolder, function(err, res) {
                        if (err) alert('Se ha producido un error. '+err)
                    });
                });
            }

            if ($('.ui-main-email-list-inner .search').length == 0) {
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
                var found = false;
                for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                    if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                        found = true;
                        folderInHotmailAccount.emails.value.splice(i, 1);
                    }
                }
            }

            // If it was unread, we add 1 to the badge
            if (unread) {
                var listFolders = $('.ui-left-side-folders-entry.indent');
                for (var i = 0; i < listFolders.length; i++) {
                    //  Except if it was in the deleted folder
                    if (listFolders.eq(i).attr('knownname') == 'deleteditems' && !listFolders.eq(i).hasClass('mark')) {
                        listFolders.eq(i).find('.unread-messages').html(parseInt(listFolders.eq(i).find('.unread-messages').html()) + 1);
                    }
                    else if (listFolders.eq(i).hasClass('mark')) {
                        if (listFolders.eq(i).attr('knownname') == 'inbox') {
                            $('.ui-left-side-accounts-account.selected .unread-messages').html('')
                            if (parseInt(listFolders.eq(i).find('.unread-messages').html()) > 2) {
                                $('.ui-left-side-accounts-account.selected .unread-messages').html(parseInt(listFolders.eq(i).find('.unread-messages').html()) - 1)
                            }
                        }
                        listFolders.eq(i).find('.unread-messages').html(parseInt(listFolders.eq(i).find('.unread-messages').html()) - 1);
                    }
                }
            }
            // We empty the emails in trash if it were already loaded
            var found = false;
            for (var i = 0; i < hotmailAccount.folders.length && !found; i++) {
                if (hotmailAccount.folders[i].wellKnownName == 'deleteditems') {
                    found = true;
                    hotmailAccount.folders[i].emails = {
                        'loaded' : false,
                        'value' : []
                    };
                }
            }

        });
        // Mark as read
        $('.ui-main-email .read').off('click');
        $('.ui-main-email .read').on('click', function(e) {
            e.stopPropagation();
            var idEmail = $(this).closest('.ui-main-email').attr('idmail');

            changesDonePendingSync.push({
                idEmail: idEmail,
                action: 'updated'
            })

            var state;
            if ($(this).closest('.ui-main-email').hasClass('unread')) {
                state = true;
                markMailAsRead(idEmail);
                $(this).closest('.ui-main-email').removeClass('unread');
            }
            else {
                state = false;
                markMailAsUnread(idEmail);
                $(this).closest('.ui-main-email').addClass('unread');
            }

            if ($('.ui-main-email-list-inner .search').length == 0) {
                var idHotmailAccount = $('.ui-left-side-name').attr('idaccount');
                var hotmailAccount = getHotmailAccount(idHotmailAccount);
                var idFolder = $('.ui-left-side-folders .ui-left-side-folders-entry.mark').attr('idfolder');
                var folderInHotmailAccount = getEmailsInFolder(hotmailAccount, idFolder);
                var found = false;
                for (var i = 0; i < folderInHotmailAccount.emails.value.length && !found; i++) {
                    if (folderInHotmailAccount.emails.value[i].id == idEmail) {
                        found = true;
                        folderInHotmailAccount.emails.value[i].isRead = state;
                    }
                }
            }

        });
        // Mark as special
        $('.ui-main-email .mark').on('click', function(e) {
            e.stopPropagation();
            alert('No hay forma de saber si es marcado')
        });
    }

    loadLoginView();
    function loadLoginView() {
        $( '.login-outlook span' ).off('click');
        $( '.login-outlook span' ).on('click', function() {
            // Para añadir una cuenta
            api.integration.outlook.addAccount(function(fsdf, dsfsd){
                console.log(fsdf)
                console.log(dsfsd)
            });
        });
    }
