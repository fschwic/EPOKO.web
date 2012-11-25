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

function sendJournal(form) {
    //var form = $('#journal_edit');
    var uid = $('#uid_edit');
    var url = serviceURL + webfileUri;

    var uidVal = $(uid).val();
    if (uidVal != null && uidVal != "") {
        url = url + '%23' + uidVal;
    }
    postFormData(form, url);
}

function postFormData(form, postUrl) {
    var s = form.serialize();
    console.log("Serialized Form Data: " + s);
    //return;
    $.ajax({
        type: "POST",
        url: postUrl,
        data: s,
        success: function(data, textStatus, xhr) {
            console.log("Successfully submitted. (" + textStatus + ")");
            var uid = getUrlVars()["uid"];
            if (uid != null && uid != "") {
                showJournal(uid);
            } else {
                location.reload();
            }
        }
    });
    return true;
}

function setDateTime(input) {
    var now = new Date();
    input.val(now.format('yyyymmdd"T"HHMMss'));
}

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('?');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
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

var comperators = new Array(alphaAscComperator,
                            dateAscComperator,
                            dateDescComperator,
                            alphaDescComperator);
var comperator = alphaAscComperator;

function changeOrder(repopulate){
  var tmp = comperators.shift();
  comperators.push(tmp);
  comperator = comperators[0];
  repopulate();
}

