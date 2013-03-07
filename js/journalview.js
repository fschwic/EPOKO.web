// In Journal View the listing is loaded when the page appears.
$('#view').on('pageshow', function(event) {
    var uid = getUrlVars()["uid"];
    $('#view').on('swipeleft', function(e){
	$.mobile.changePage( "#edit?uid=" + uid, { transition: "slide" });
    });
});

// If Journal View is called directly, pagebeforechange is not bound already (see journallist.js)
// and the first time the content must be shown while init.
$('#view').on('pageinit', function(event) {
    var uid = getUrlVars()["uid"];
    showJournal(uid);
});

$('#view').on('swiperight', function(e){
    $.mobile.changePage( "#list", { transition: "slide", reverse: "true" });
});

function clearJournal(){
    $('#title').text("Loading Journal");
    $('#summary').text("");
    $('#created').text("");
    $('#modified').text("");
    $('#classification').removeClass("public private");
    $('#status').removeClass("draft final cancelled");
    $('#description *').remove();
    $('#categories *').remove();
}

function showJournal(uid){
    clearJournal();
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
	    $('#classification').addClass("private");
	} */
	$('#classification').addClass($(classification).text().toLowerCase());
	$('#status').addClass($(journalStatus).text().toLowerCase());
	
	var creole = new Parse.Simple.Creole( {
	    forIE: document.all,
	    interwiki: {
		WikiCreole: 'http://www.wikicreole.org/wiki/',
		Wikipedia: 'http://en.wikipedia.org/wiki/'
	    },
	    linkFormat: ''
	} );
	theElement = document.getElementById('description');
	creole.parse(theElement, $(description).text());	
	
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
