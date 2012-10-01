
function postFormData(form, postUrl){
    var s = form.serialize();
    alert(s);
    //return;
    $.ajax({
        type: "POST",
        url: postUrl,
        data: s,
        success: function(data, textStatus, xhr) {
            alert("Successfully submitted. (" + textStatus + ")");
	    var uid = getUrlVars()["uid"];
	    if(uid != null && uid != ""){
		showJournal(uid);
	    }
	    else{
		location.reload();
	    }
        }
    });
    return true;
}

function setDateTime(input){
    var now = new Date();
    input.val(now.format('yyyymmdd"T"HHMMss'));
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('?');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
	var indexOfHash = hash[1].indexOf('#');
	if(indexOfHash > -1){
	    hash[1] = hash[1].slice(0,indexOfHash);
	}
        vars[hash[0]] = hash[1];
	//alert(hash[0] + ":" + hash[1]);
    }
    return vars;
}

function decodeEntities(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

function addCategory(cat){
    //alert(cat);
    $('#categories_edit').append('<option selected="selected" value="' + cat + '">' + cat + '</option>');
    $('#categories_edit').selectmenu('refresh');
}
