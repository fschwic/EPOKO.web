var serviceURL = "/restaccess/jqe?cal_webfile=";
var webfileId;
var webfileUri;
var eventId;

function request() {
    var request = new Array();
    var url = "" + document.location;
    var i = url.indexOf('/events/');
    url = url.substring(i + 8);
    var i2 = url.lastIndexOf("/");

    var uri = url.substring(0, i2);
    var uid = url.substring(i2 + 1);
    request[0] = uri;
    request[1] = uid;

    return request;
}

$('body div').on('pageinit', function(event) {
    var r = request();
    webfileId = r[0];
    eventId = r[1];
    webfileUri = "http://www.epoko.net/webfile/dav/" + webfileId + "/public.ics";
    alert(webfileId + " - " + eventId);
    populateEventList();
});

function populateEventList() {
    $.get(serviceURL+webfileUri, function(data) {
	$('#eventList li').remove();
	journals = $(data).find('VEVENT');
	
	journals.sort(function(a, b){
	    var keyA = $('DTSTART',a).text().toLowerCase();
	    var keyB = $('DTSTART',b).text().toLowerCase();
	    return (keyA > keyB) ? 1 : -1;
	});
	
	var date = "19700101";
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
	    //alert($(summary).text() + " - " + $(uid).text());
	    
	    var curDate = $(dtstart).text().substring(0,8);
	    if(date != curDate){
        date = curDate;
		$('#eventList').append('<li data-role="list-divider">' + date + '</li>');
	    }
	    
      //http://shani.schwichtenberg.net:31555/projects/EPOKO.web/events/61a4caffdc3e005c47afb6eabdd4cae0/61a4caffdc3e005c47afb6eabdd4cae0#view
      //http://shani.schwichtenberg.net:31555/projects/EPOKO.web/events/61a4caffdc3e005c47afb6eabdd4cae0/BeezleBug/61a4caffdc3e005c47afb6eabdd4cae0#view
	    $('#eventList').append('<li><a class="ui-link-inherit" href="view.html?uid='+$(uid).text()+'" data-transition="slide">'
				     + '<p class="ui-li-aside">' + $(dtstart).attr("rfc822") + '</p>'
				     + '<h4>' + $(summary).text() + '</h4>' 
				     + '<p>' + $(description).text() + '</p>' 
				     + '</a></li>');
	});
	$('#eventList').listview('refresh');
    }, "xml");
}
