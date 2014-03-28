var EPOKO = (function(){
  var j = {};

  // EPOKO REST Endpoint
  var serviceURL = "http://localhost:8080/restaccess/jqj?cal_webfile=";
  j.webfileUri = "http://www.epoko.net/webfile/dav/61a4caffdc3e005c47afb6eabdd4cae0/BeezleBug/public.ics";

  j.serviceMapper = {};
  j.serviceMapper.fromGet = function(xml){

    var o = {};

    var journals = $(xml).find('VJOURNAL');
    var journal = journals[0];

    o.uid = $($(journal).find("UID")[0]).text();
    o.summary = $($(journal).find("SUMMARY")[0]).text();
    o.description = $($(journal).find("DESCRIPTION")[0]).text();
    o.classification = $($(journal).find("CLASS")[0]).text();
    o.journalStatus = $($(journal).find("STATUS")).text();
    o.dtstart = {};
    o.created = {};
    o.dtstamp = {};
    o.modified = {};
    o.dtstart.rfc822 = $($(journal).find("DTSTART")[0]).attr('rfc822');
    o.created.rfc822 = $($(journal).find("CREATED")[0]).attr('rfc822');
    o.dtstamp.rfc822 = $($(journal).find("DTSTAMP")[0]).attr('rfc822');
    o.modified.rfc822 = $($(journal).find("LAST-MODIFIED")[0]).attr('rfc822');
    o.dtstart.ics = $($(journal).find("DTSTART")[0]).text();
    o.created.ics = $($(journal).find("CREATED")[0]).text();
    o.dtstamp.ics = $($(journal).find("DTSTAMP")[0]).text();
    o.modified.ics = $($(journal).find("LAST-MODIFIED")[0]).text();

    o.categories = [];
    var xmlCategories = $(journal).find("CATEGORIES");
    if( xmlCategories.length > 0 ){
      $.each(xmlCategories, function(i, categorie){
        o.categories.push($(categorie).text());
      });
    }

    return o;
  };

  j.serviceMapper.forSend = function(object){
    var o = JSON.parse(JSON.stringify(object));

    o.BEGIN = "VJOURNAL";

    o.UID = o.uid;
    delete o.uid;
    
    o.STATUS = o.journalStatus;
    delete o.journalStatus;

    o.CLASS = o.classification;
    delete o.classification;
    
    o.DTSTART = o.dtstart.ics;
    delete o.dtstart;
    
    o.CREATED = o.created.ics;
    delete o.created;
    
    o.DTSTAMP = o.dtstamp.ics;
    delete o.dtstamp;
    
    delete o.modified;

    var s = $.param(o, true);
    return s;
  };

  j.sendFails = function(){
    var fails = JSON.parse(localStorage.EPOKOjournalsToBeSend);
    delete localStorage.EPOKOjournalsToBeSend;
    $.each(fails, function(i, uid){
      console.log("Submitting " + uid + " ...");
      j.post(uid, JSON.parse(localStorage.getItem(uid)));
    });
  };

  j.get = function(uid, successCallBack, failCallBack){

    console.log('get: '+ serviceURL+webfileUri + '%23' + uid);
    $.get(serviceURL + j.webfileUri + '%23' + uid, function(data){
      successCallBack(j.serviceMapper.fromGet(data)); 
    }, "xml").fail(failCallBack);
  
  };

  j.post = function(uid, object, successCallBack, failCallBack){
    var resourceUrl = serviceURL + j.webfileUri + '%23' + uid;
    console.log('put: ' + resourceUrl);
    var s = j.serviceMapper.forSend(object);

    localStorage.setItem(uid, JSON.stringify(object));

    $.ajax({
        type: "POST",
        url: resourceUrl,
        xhrFields: {
          withCredentials: true
        },
        data: s,
        success: function(data, textStatus, xhr) {
            console.log("Successfully submitted " + resourceUrl + ".");
            var uid = getUrlVars()["uid"];
            if (uid != null && uid != "") {
              // uid is only available if we are back on #view
              showJournal(uid);
            } else {
              console.log('can not reload #view after postFormData');
              location.reload();
            }

            if(successCallBack){
              successCallBack(data);
            }
        },
        error: function(jqXHR, status, msg){
          console.log("Failed to submit " + serviceURL + j.webfileUri + '%23' + uid + ".");
          var fails = JSON.parse(localStorage.getItem("EPOKOjournalsToBeSend"));
          if(!fails){
            fails = [];
          }
          fails.push(uid);
          console.log(JSON.stringify(fails));
          localStorage.setItem("EPOKOjournalsToBeSend", JSON.stringify(fails));
          console.log("Marked " + uid + " for later submission.");

          if(failCallBack){
            failCallBack(data, status, msg);
          }
          showJournal(uid);
        }
    });
    //return true;
  };

  return j;
})();