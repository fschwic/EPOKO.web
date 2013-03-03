/*jshint browser:true, jquery:true, devel:true, strict:true */

var serviceURL = "/restaccess/jqj?cal_webfile=";
var webfileId;
var webfileUri;
var categorieSet = {};

$('body div').on('pageinit', function(event) {
    webfileId = getUrlVars()["uri"];
    webfileUri = "http://www.epoko.net/webfile/dav/" + webfileId + "/public.ics";
    populateJournalList();
});

// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
    //alert("pagechange");
    
    // We only want to handle changePage() calls where the caller is
    // asking us to load a page by URL.
    if ( typeof data.toPage === "string" ) {
	// We only want to handle if #journalPage.
	var u = $.mobile.path.parseUrl( data.toPage );
	if ( u.hash.search(/^#view/) !== -1 ) {
	    //alert("view");
	    var uid = u.hash.replace( /.*uid=/, "" );
	    showJournal(uid);
	    
	    // Now call changePage() and tell it to switch to
	    // the page we just modified.
	    data.options.dataUrl = "#view?uid="+uid;
	    $.mobile.changePage( $('#view'), data.options );
	    
	    // Make sure to tell changePage() we've handled this call so it doesn't
	    // have to do anything.
	    e.preventDefault();
	}
	else if( u.hash.search(/^#edit/) !== -1 ) {
	    //alert("edit");
	    var uid = u.hash.replace( /.*uid=/, "" );
	    $.get(serviceURL+webfileUri+'%23'+uid, showJournalForm, "xml");
	    $.mobile.changePage( $('#edit'), data.options );
	    e.preventDefault();
	}
    }
});

function populateJournalList() {
  $('#button-sort .ui-btn-text').text(comperator.title);

  $.get(serviceURL+webfileUri, function(data) {
    $('#journalList li').remove();
    $('#journalListMenu li').remove();
    journals = $(data).find('VJOURNAL');
    journals.sort(comperator);
	
	var character = "0";
	$.each(journals, function(index, journal) {
	    uid = $(journal).find("UID")[0];
	    summary = $(journal).find("SUMMARY")[0];
	    description = $(journal).find("DESCRIPTION")[0];
	    categories = $(journal).find("CATEGORIES");
	    classification = $(journal).find("CLASS")[0];
	    status = $(journal).find("STATUS");
	    dtstart = $(journal).find("DTSTART")[0];
	    dtstamp = $(journal).find("DTSTAMP")[0];
	    dtmodified = $(journal).find("LAST-MODIFIED")[0];

            if (comperator.name.search(/alpha/) === 0) {
              var curCharacter = $(summary).text().substring(0,1).toUpperCase();
              if(character != curCharacter){
                character = curCharacter;
                $('#journalList').append('<li data-role="list-divider">' + character + '</li>');
		$('#journalListMenu').append('<li data-role="list-divider">' + character + '</li>');
              }
            }
	    
	    $.each(categories, function(index, categorie){
		var categorieKey = $(categorie).text().toLowerCase();
		var x = categorieSet[categorieKey];
		categorieSet[categorieKey] = x ? x+1 : 1;
            });
	    // Overview
	    $('#journalList').append('<li><a class="ui-link-inherit" href="../journals/#view?uid='+$(uid).text()+'" data-transition="slide">'
				     + '<p class="ui-li-aside">' + $(dtstart).attr("rfc822") + '</p>'
				     + '<h4>' + $(summary).text() + '</h4>' 
				     + '<p>' + $(description).text() + '</p>' 
				     + '</a></li>');
            // List in journal view
	    $('#journalListMenu').append('<li><a class="ui-link-inherit" href="#view?uid='+$(uid).text()+'" data-ajax="false">'
	    		 + '<h4>' + $(summary).text() + '</h4>' 
	    				 + '<p>' + $(dtstart).attr("rfc822") + '</p>' 
	    			 + '</a></li>');
	});
	$('#journalList').listview('refresh');
	$('#journalListMenu').listview('refresh');
    }, "xml");
}
