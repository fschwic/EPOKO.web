$('#view').on('pageshow', function(event) {
    //console.log('#view.pageshow');
    //var uid = getUrlVars()["uid"];
    // $('#view').on('swipeleft', function(e){
    // $.mobile.changePage( "#edit?uid=" + uid, { transition: "slide" });
    // });
});

// If Journal View is called directly, pagebeforechange is not bound already (see journallist.js)
// and the first time the content must be shown while init.
$('#view').on('pageinit', function(event) {
    // TODO enable for direct call . But pageinit happens for every first call but not if just a param is changed in the URL
    
    // console.log('#view.pageinit');
    // if(!webfileId){
    //    webfileId = getUrlVars()["uri"];
    //    webfileUri = "http://www.epoko.net/webfile/dav/" + webfileId + "/public.ics";
    //    //var uid = getUrlVars()["uid"];
    //    showJournal(uid);
    // }
});

// $('#view').on('swiperight', function(e){
//     $.mobile.changePage( "#list", { transition: "slide", reverse: "true" });
// });

function showJournal(uid){

    function clearJournal(){
        //console.log('clearJournal()');
        $('#title').text("Loading Journal");
        $('#summary').text("");
        $('#created').text("");
        $('#modified').text("");
        $('#classification').removeClass("public private");
        $('#status').removeClass("draft final cancelled");
        $('#description *').remove();
        $('#categories *').remove();
    }
    
    function renderJournalView(model) {
    
        clearJournal();
        $('#editbutton').attr('href',"#edit?uid=" + encodeURIComponent(model.uid));
    
        $('#title').text("Journal: " + model.summary);
        $('#summary').text(model.summary);

        $('#created').text(model.created.rfc822);
        $('#modified').text(model.modified.rfc822);
        /* if( $(classification).text() === "PRIVATE" ){
            $('#classification').addClass("private");
        } */
        $('#classification').addClass(model.classification.toLowerCase());
        $('#status').addClass(model.journalStatus.toLowerCase());
        $('#categories').text(model.categories.join(", "));

        var creoleParser = new creole({
            forIE: document.all,
            interwiki: {
                WikiCreole: 'http://www.wikicreole.org/wiki/',
                Wikipedia: 'http://en.wikipedia.org/wiki/'
            },
            linkFormat: '#'
        });
        theElement = document.getElementById('description');
        creoleParser.parse(theElement, model.description);

    }

    EPOKO.get(uid, function(data){
        if(! window.xOnLine){
            $(document).trigger($.Event("online"));
        }
        localStorage.setItem(uid, JSON.stringify(data));
        renderJournalView(data);
    }, function(){
        if(window.xOnLine){
            $(document).trigger($.Event("offline"));
        }
        // try to get from local storage
        var journalData = JSON.parse(localStorage.getItem(uid));
        if(journalData){
            //console.log(journalData);
            renderJournalView(journalData);
        }
        else{
            console.log("Journal not found. Neither online nor in local storage.");
        }
    });
}
