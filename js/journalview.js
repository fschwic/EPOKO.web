// In Journal View the listing is loaded when the page appears.
$('#view').on('pageshow', function(event) {
    var uid = getUrlVars()["uid"];
    populateJournalListMenu();
});

// If Journal View is called directly, pagebeforechange is not bound already (see journallist.js)
// and the first time the content must be shown while init.
$('#view').on('pageinit', function(event) {
    var uid = getUrlVars()["uid"];
    showJournal(uid);
});

function showJournal(uid){
    $.get(serviceURL+webfileUri + '%23' + uid, function(data) {
	journals = $(data).find('VJOURNAL');
	journal = journals[0];
	
	uid = $(journal).find("UID")[0];
	summary = $(journal).find("SUMMARY")[0];
	description = $(journal).find("DESCRIPTION")[0];
	categories = $(journal).find("CATEGORIES");
	classification = $(journal).find("CLASS")[0];
	journalStatus = $(journal).find("STATUS");
	dtstart = $(journal).find("DTSTART")[0];
	created = $(journal).find("CREATED")[0];
	dtstamp = $(journal).find("DTSTAMP")[0];
	dtmodified = $(journal).find("LAST-MODIFIED")[0];
	
	$('#editbutton').attr('href',"#edit?uid=" + $(uid).text());
	
	$('#title').text("Journal: " + $(summary).text());
	$('#summary').text($(summary).text());

	$('#created').text($(created).attr('rfc822'));
	$('#modified').text($(dtmodified).attr('rfc822'));
	/* if( $(classification).text() === "PRIVATE" ){
	    $('#classification').removeClass("public");
	    $('#classification').addClass("private");
	} */
	$('#classification').text($(classification).text());
	$('#status').text($(journalStatus).text());
	
	var creole = new Parse.Simple.Creole( {
	    forIE: document.all,
	    interwiki: {
		WikiCreole: 'http://www.wikicreole.org/wiki/',
		Wikipedia: 'http://en.wikipedia.org/wiki/'
	    },
	    linkFormat: ''
	} );
	theElement = document.getElementById('description');
	$('#description *').remove();
	creole.parse(theElement, $(description).text());	
	
	$('#categories *').remove();
	if( categories.length > 0 ){
	    categoriesText = "";
	    $.each(categories, function(i, categorie){
		categoriesText += $(categorie).text() + " ";
	    });
	    $('#categories').text(categoriesText);
	}
	
	/*
	$('#journalFields li').remove();
	if(dtstart){
	    $('#journalFields').append('<li>' + $(dtstart).attr('rfc822') + '</li>');
	}
	if(dtstamp){
	    $('#journalFields').append('<li>Stamp on ' + $(dtstamp).attr('rfc822') + '</li>');
	}
	if(created){
	    $('#journalFields').append('<li>Created on ' + $(created).attr('rfc822') + '</li>');
	}
	if(dtmodified){
	    $('#journalFields').append('<li>Modified on ' + $(dtmodified).attr('rfc822') + '</li>');
	}
	if(classification){
	    $('#journalFields').append('<li>' + $(classification).text() + '</li>');
	}
	if(journalStatus){
	    $('#journalFields').append('<li>' + $(journalStatus).text() + '</li>');
	}
	$('#journalFields').listview('refresh');
	*/

    }, "xml");
}


function populateJournalListMenu() {
    $.get(serviceURL+webfileUri, function(data) {
	$('#journalListMenu li').remove();
	journals = $(data).find('VJOURNAL');
	
	journals.sort(function(a, b){
	    var keyA = $('SUMMARY',a).text();
	    var keyB = $('SUMMARY',b).text();
	    return (keyA > keyB) ? 1 : -1;
	});
	
	var character = "0";
	$.each(journals, function(index, journal) {
	    uid = $(journal).find("UID")[0];
	    summary = $(journal).find("SUMMARY")[0];
	    description = $(journal).find("DESCRIPTION")[0];
	    categories = $(journal).find("CATEGORIES");
	    classification = $(journal).find("CLASS")[0];
	    journalStatus = $(journal).find("STATUS");
	    dtstart = $(journal).find("DTSTART")[0];
	    dtstamp = $(journal).find("DTSTAMP")[0];
	    dtmodified = $(journal).find("LAST-MODIFIED")[0];
	    
	    var curCharacter = $(summary).text().substring(0,1).toUpperCase();
	    if(character != curCharacter){
		character = curCharacter;
		$('#journalListMenu').append('<li data-role="list-divider">' + character + '</li>');
	    }
	    
	    $('#journalListMenu').append('<li><a class="ui-link-inherit" href="#view?uid='+$(uid).text()+'" data-ajax="false">'
					 + '<h4>' + $(summary).text() + '</h4>' 
					 + '<p>' + $(dtstart).attr("rfc822") + '</p>' 
					 + '</a></li>');
	});
	$('#journalListMenu').listview('refresh');
    }, "xml");
}
