$('#edit').on('pageshow', function(event) {
    console.log('#edit.pageshow');
    //var uid = getUrlVars()["uid"];
    //$('#view').on('swiperight', function(e){
    //$.mobile.changePage( "", { transition: "slide", reverse: "true" });
    //});
});

function showJournalForm(data) {
    $.mobile.changePage( $('#edit'), { transition: "slide" } );

    journals = $(data).find('VJOURNAL');
    journal = journals[0];

    uid = $(journal).find("UID")[0];
    summary = $(journal).find("SUMMARY")[0];
    description = $(journal).find("DESCRIPTION")[0];
    categories = $(journal).find("CATEGORIES");
    classification = $(journal).find("CLASS")[0];
    journalStatus = $(journal).find("STATUS")[0];
    dtstart = $(journal).find("DTSTART")[0];
    dtstamp = $(journal).find("DTSTAMP")[0];
    dtmodified = $(journal).find("LAST-MODIFIED")[0];

    $('#uid_edit').val($(uid).text());
    $('#summary_edit').val($(summary).text());
    
    var slider = $('#class_edit');
    slider.val($(classification).text());
    slider.slider('refresh');

    var select = $('#status_edit');
    select.val($(journalStatus).text());
    select.selectmenu('refresh');

    $('#description_edit').val($(description).text());

    $('#categories_edit option').remove();
    if( categories.length > 0 ){
	categoriesText = "";
	$.each(categories, function(i, categorie){
	    categoriesText += $(categorie).text() + " ";
	    $('#categories_edit').append('<option selected="selected" value="' + $(categorie).text() + '">' + $(categorie).text() + '</option>');
	});
    }
    $('#categories_edit').selectmenu('refresh');

    //try{
	//$('#journal_edit').textinput("refresh");
    //}
    //catch(e){
	// // journlList not initialized, on init refresh is implicit
    //}
}
