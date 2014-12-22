// EPOKO REST Endpoint
var serviceURL = "http://core.epoko.net/restaccess/jqj?cal_webfile=";
// Identifier of the webfile which consists of hash and username of an EPOKO.webfile concatenated by slash
var webfileId;
// URL of the webfile constructed from webfileId
var webfileUri;
// Identifier of an event in the webfile
var uid;
// Categorie filter value
var categorieSelection;
// All categories retrieved from the webfile
var categorieSet;

$('#cats').on('pageshow', function(event) {
    console.log("#cats.pageshow");
    initFromUrl();
    populateCategoriesList();
});

$('#list').on('pageinit', function(event) {
    console.log("#list.pageinit");
    initFromUrl();
    populateJournalList();
});

function initFromUrl(){
    console.log($.query);
    webfileId = getUrlVars()["uri"];
    webfileUri = "http://www.epoko.net/webfile/dav/" + webfileId + "/public.ics";
    categorieSelection = getUrlVars()["cat"];
    // http://www.epoko.net/webfile/dav/61a4caffdc3e005c47afb6eabdd4cae0/BeezleBug/public.ics
    EPOKO.webfileUri = webfileUri;
}

// Listen for any attempts to call changePage().
$(document).on( "pagebeforechange", function( e, data ) {
    //console.log("pagebeforechange");

    // We only want to handle changePage() calls where the caller is
    // asking us to load a page by URL.
    if ( typeof data.toPage === "string" ) {
    // We only want to handle if #journalPage.
    var u = $.mobile.path.parseUrl( data.toPage );
    if ( u.hash.search(/^#view/) !== -1 ) {
        if ( data.options.fromPage && data.options.fromPage[0].id !== "edit" ) {
          var uid = u.hash.replace( /.*uid=/, "" );
          console.log("pagebeforechange to #view");
          window.uid = uid;
          showJournal(uid);

          // Now call changePage() and tell it to switch to
          // the page we just modified.
          data.options.dataUrl = "#view?uid="+uid;
          $.mobile.changePage( $('#view'), data.options );

          // Make sure to tell changePage() we've handled this call so it doesn't
          // have to do anything.
          e.preventDefault();
        }
    }
    else if( u.hash.search(/^#edit/) !== -1 ) {
        var uid = u.hash.replace( /.*uid=/, "" );
        console.log("pagebeforechange to #edit");
        $.mobile.changePage( $('#edit'), { transition: "slide" } );
        renderJournalEditView(JSON.parse(localStorage.getItem(uid)));
        e.preventDefault();
    }
    }
});

function populateCategoriesList(){
    categorieSet = {};
    $.get(serviceURL + webfileUri, function(data) {
        $('#categoriesList li').remove();

        journals = $(data).find('VJOURNAL');
        journalsCount = 1;
        $.each(journals, function(index, journal) {
            journalsCount++;
            categories = $(journal).find('CATEGORIES');
            $.each(categories, function(index, categorie){
                var categorieKey = $(categorie).text().toLowerCase();
                if(! categorieSet[categorieKey] ){
                    categorieSet[categorieKey] = {};
                };
                if(! categorieSet[categorieKey].name ){
                    categorieSet[categorieKey].name = $(categorie).text();
                };
                var x = categorieSet[categorieKey].count;
                categorieSet[categorieKey].count = x ? x+1 : 1;
            });
        });

        // Categories
        $('#categoriesList').append('<li><a class="ui-link-inherit" href="../journals/#list" onClick="categorieSelection = \'\'; populateJournalList();" data-transition="slide">'
                + '<h4>All Categories</h4>'
                + '<span class="ui-li-count">' + journalsCount + '</span>'
                + '</a></li>');

        var categorieArray = [];
        for(var prop in categorieSet){
            categorieArray.push(prop);
        };
        categorieArray.sort();
        // $('#journalList').append('<li data-role="list-divider">Kategorien</li>');
        $.each(categorieArray, function(index, cat){
            //?uri=' + webfileId + '?categorie=' + cat + '
            $('#categoriesList').append('<li><a class="ui-link-inherit" href="../journals/#list" onClick="categorieSelection = \'' + cat + '\'; populateJournalList();" data-transition="slide">'
                + '<h4>' + categorieSet[cat].name + '</h4>'
                + '<span class="ui-li-count">' + categorieSet[cat].count + '</span>'
                + '</a></li>');
        });

        // don't refresh before init ... or catch
        try{
            $('#categoriesList').listview('refresh');
        }
        catch(e){
            // journlList not initialized
        }
    }, "xml").fail( function(){
      console.log("Request to EPOKO service failed!");
    });
}

function populateJournalList() {
  //    alert(categorieSelection);
  $('#button-sort .ui-btn-text').text(comperator.title);

  var params = "";
  if(categorieSelection){
    params += "&categories=" + categorieSelection;
    $('#list-title').text("Kategorie: " + categorieSelection);
  };
  $.get(serviceURL + webfileUri + params, function(data) {
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

        var categoriesText = [];
        $.each(categories, function(index, categorie){
            categoriesText.push($(categorie).text());
        });
        // Overview,  onClick="alert(\''+$(uid).text()+'\');"
        $('#journalList').append('<li><a class="ui-link-inherit" href="../journals/#view?uid='+$(uid).text()+'" data-transition="slide">'
                     + '<p class="ui-li-aside">' + $(dtstart).attr("rfc822") + '</p>'
                     + '<h4>' + $(summary).text() + '</h4>'
                     + '<p>' + $(description).text() + '</p>'
                     + '<p><strong>' + categoriesText.join(", ") + '</strong></p>'
                     + '</a></li>');
            // List in journal view
        $('#journalListMenu').append('<li><a class="ui-link-inherit" href="#view?uid='+$(uid).text()+'" data-ajax="false">'
                 + '<h4>' + $(summary).text() + '</h4>'
                         + '<p>' + $(dtstart).attr("rfc822") + '</p>'
                     + '</a></li>');
    });


      // don't refresh before init ... or catch
      try{
      $('#journalList').listview('refresh');
      }
      catch(e){
      // journlList not initialized
      }
      try{
      $('#journalListMenu').listview('refresh');
      }
      catch(e){
      // journalListMenu not initialized
      }
    }, "xml").fail( function(){
      alert("Request to EPOKO service failed!");
    });
}
