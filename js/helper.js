function getUrlVars() {
    var vars = [],
        hash;
    var query = window.location.href.slice(window.location.href.indexOf('?') + 1);
    console.log(query);
    var params = query.split("&");
    $.each(params, function(i, param){
      var pair = param.split("=");
      if(pair[1].indexOf("#") > -1){
        pair[1] = pair[1].substring(0, pair[1].indexOf("#"))
      }
      vars[pair[0]] = pair[1];
    });
    console.log(vars);

    return vars;
}

/*
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('?');
    console.log(hashes);
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i];
        console.log(hash.split("&"));
        hash = hash.split('=');
        if (hash[1]) {
            vars.push(hash[0]);
            var indexOfHash = hash[1].indexOf('#');
            if (indexOfHash > -1) {
                hash[1] = hash[1].slice(0, indexOfHash);
            }
            vars[hash[0]] = hash[1];
        }
        //alert(hash[0] + ":" + hash[1]);
    }
    return vars;
}
*/

function decodeEntities(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

function addCategory(cat) {
    //alert(cat);
    if (typeof cat != "string") {
      var tmp = $(cat).val();
      $(cat).val("");
      //$(cat).get().focus();
      cat = tmp;
    }
    $('#categories_edit').append('<option selected="selected" value="' + cat + '">' + cat + '</option>');
    $('#categories_edit').selectmenu('refresh');
}

function alphaAscComperator(a, b){  
  var keyA = $('SUMMARY',a).text().toLowerCase();
  var keyB = $('SUMMARY',b).text().toLowerCase();
  return (keyA > keyB) ? 1 : -1;
}
alphaAscComperator.title = "A-Z";

function alphaDescComperator(a, b){
  var keyA = $('SUMMARY',a).text().toLowerCase();
  var keyB = $('SUMMARY',b).text().toLowerCase();
  return (keyA < keyB) ? 1 : -1;
}
alphaDescComperator.title = "Z-A";

function dateAscComperator(a, b){
  var keyA = $('DTSTART',a).text();
  var keyB = $('DTSTART',b).text();
  return (keyA > keyB) ? 1 : -1;
}
dateAscComperator.title = "Chronologic";

function dateDescComperator(a, b){  
  var keyA = $('DTSTART',a).text();
  var keyB = $('DTSTART',b).text();
  return (keyA < keyB) ? 1 : -1;
}
dateDescComperator.title = "Newest on Top";

var comperators = new Array(dateDescComperator,
			    alphaAscComperator,
                            dateAscComperator,
                            alphaDescComperator);
var comperator = dateDescComperator;

function changeOrder(repopulate){
  var tmp = comperators.shift();
  comperators.push(tmp);
  comperator = comperators[0];
  repopulate();
}

/*
function postFormData(form, postUrl) {
    var s = form.serialize();
    //console.log("Serialized Form Data: " + s);
    $.ajax({
        type: "POST",
  url: postUrl,
        xhrFields: {
    withCredentials: true
  },
        data: s,
        success: function(data, textStatus, xhr) {
            //console.log("Successfully submitted. (" + textStatus + ")");
            var uid = getUrlVars()["uid"];
            if (uid != null && uid != "") {
    // uid is only available if we are back on #view
                showJournal(uid);
            } else {
    console.log('can not reload #view after postFormData');
                location.reload();
            }
  }
    });
    return true;
}
*/
