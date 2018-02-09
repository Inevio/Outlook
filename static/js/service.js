
var unreadEmailsByAccounts = [];

function totalUnreadEmails() {
	var unreadEmails = 0;
	unreadEmailsByAccounts.forEach(function(dataAccount){
		unreadEmails += dataAccount.unreadEmails;
	});
	return unreadEmails;
}

function updateBadge() {

	var numberOfUnreadMessages = 0;
    api.integration.outlook.listAccounts(function( e , accounts ) {
    	for (var i = 0; i < accounts.length; i++) {
	        var query = {};
	        query.count = true;
	        query.top = 10000;
	        accounts[i].getFolders(null, query, function( error , folders ) {
    	console.log('carpetas cuenta')
    			var foundInbox = false;
	        	for (var j = 0; j < folders.value.length && !foundInbox; j++) {
	        		if (folders.value[j].wellKnownName == 'inbox') {
	        			foundInbox = true;
    	console.log('encontrado inbox')
    					var found = false;
    					for (var k = 0; k < unreadEmailsByAccounts.length && !found; k++) {
    						if (unreadEmailsByAccounts[k].id == folders.value[j].id) {
    							found = true;
    							unreadEmailsByAccounts[k].unreadEmails = folders.value[j].unreadItemCount;
    						}
    					}
    					if (!found) {
    						unreadEmailsByAccounts.push({
    							id : folders.value[j].id,
    							unreadEmails : folders.value[j].unreadItemCount
    						})
    					}
    					api.app.setBadge(totalUnreadEmails());
	        		}
	        	}
    		});
    	}
    });

}

updateBadge();


// If an email has been recieved
api.integration.outlook.on( 'created', function( payload ) {
	updateBadge();
})
// If an email has changed its status
api.integration.outlook.on( 'updated', function( payload ) {
	updateBadge();
})
// If an email has been deleted
api.integration.outlook.on( 'deleted', function( payload ) {
	updateBadge();
})