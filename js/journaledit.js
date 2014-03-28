$('#edit').on('pageshow', function(event) {
    console.log('#edit.pageshow');
    //var uid = getUrlVars()["uid"];
    //$('#view').on('swiperight', function(e){
    //$.mobile.changePage( "", { transition: "slide", reverse: "true" });
    //});
});

function renderJournalEditView(data) {

    $('#uid_edit').val(data.uid);
    $('#summary_edit').val(data.summary);
    
    var slider = $('#class_edit');
    slider.val(data.classification);
    slider.slider('refresh');

    var select = $('#status_edit');
    select.val(data.journalStatus);
    select.selectmenu('refresh');

    $('#description_edit').val(data.description);

    $('#categories_edit option').remove();
    if( data.categories.length > 0 ){
       $.each(data.categories, function(i, categorie){
           $('#categories_edit').append('<option selected="selected" value="' + categorie + '">' + categorie + '</option>');
       });
    }
    $('#categories_edit').selectmenu('refresh');
}

function instanceFromForm(){
    var uid = $('#uid_edit').val();
    var o = JSON.parse(localStorage.getItem(uid));

    o.summary = $('#summary_edit').val();
    o.description = $('#description_edit').val();
    o.classification = $('#class_edit').val();
    o.journalStatus = $('#status_edit').val();

    o.categories = $('#categories_edit').val();

    return o;
}

function sendJournal(form) {
    var journal = instanceFromForm();
    EPOKO.post(journal.uid, journal);
}