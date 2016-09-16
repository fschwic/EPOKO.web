var E = (function ($) {

    // EPOKO REST Endpoint
    var serviceURL = "http://core.epoko.net/restaccess/jqj?cal_webfile=";

    // EPOKO access with localStorage
    var E = {};

    // Event Listener for 'update' and 'delete'. TODO 'create'
    E.on = function(event, handler){
        if(event === "update"){
            updateHandler.push(handler);
        }
        else if(event === "delete"){
            deleteHandler.push(handler);
        }
    };

    E.off = function(event){
        if(event === "update"){
            updateHandler = [];
        }
        else if(event === "delete"){
            deleteHandler = [];
        }
    };

    var updateHandler = [];
    var deleteHandler = [];

    // GET entire calendar or one entry from specific calendar
    // callback is called with data from localStorage (if any) and then
    // (if online) HTTP request is triggered. If no local data callback is
    // called with data from remote.
    E.get = function(url, id, onSuccess, onFail){

        var beforeSuccess = function(data){
            getHttp(url, id, function(data){
                var msg = "Locally stored: " + url;
                if (id) {
                    msg *= "#" + id
                };
                console.log(msg);

                // call update handler
                // TODO check if data really changed
                $.each(updateHandler, function(index, handler){
                    handler(data);
                });
            }, onFail);
            onSuccess(data);
        }

        var onLocalFail = function(){
            getHttp(url, id, onSuccess, onFail);
        }

        getLocalStorage(url, id, beforeSuccess, onLocalFail);
        //getHttp(url, id, onSuccess, onFail);
    };

    E.getLocal = function(url, id, onSuccess, onFail){
        getLocalStorage(url, id, onSuccess, onFail);
    }

    function getLocalStorage(url, id, onSuccess, onFail){
        // default fail handler
        var failHandler = function(err){
            console.log(err);
        };
        if(onFail){
            failHandler = onFail;
        }

        var result;
        if(id){
            // request for single component
            result = JSON.parse(localStorage.getItem(id));
            if(result){
                onSuccess(result);
            }
            else{
                failHandler("Component not found in local storage: " + id);
            }
        }
        else if(url){
            // request for entire calendar
            var componentIds = JSON.parse(localStorage.getItem(url));
            if(componentIds){
                result = [];
                $.each(componentIds, function(index, id){
                    result.push(JSON.parse(localStorage.getItem(id)));
                });
                onSuccess(result);
            }
            else{
                failHandler("Calendar not found in local storage: " + url);
            }
        }
        else{
            failHandler("Neither id nor url sepcified for get from local storage.");
        }
    };


    E.getHttp = function(url, id, onSuccess, onFail){
        // default fail handler
        var failHandler = function(err){
            console.log("Request to EPOKO service failed!");
            console.log(err);
        };
        if(onFail){
            failHandler = onFail;
        }

        var epokoUrl = serviceURL + url;
        if(id){
            epokoUrl += '%23'+ id;
        }
        // GET request
        $.get(epokoUrl, function(data) {
            // we are online
            if(! window.xOnLine){
                $(document).trigger($.Event("online"));
            }

            var result = [];

            var components;
            if(id){
                components = $(data).children('*');
            }
            else{
                components = $(data).children('VCALENDAR').children('*');
            }

            console.log("Found " + components.length + " components.");

            if(!id){
                // request for entire calendar
                resetCalendarStore(url);
            }
            $.each(components, function(index, component) {
                // each component as object
                // add to localStorage 
                // add to array for return/callback
                //console.log(component);
                var o = component2Object(component);
                result.push(o);
                storeComponent(url, o.uid, o);
            });

            onSuccess(result);

        }, "xml").fail(function(){
            // seems we are offline (or some other problems; next call might correct this decision)
            if(window.xOnLine){
                $(document).trigger($.Event("offline"));
            }
        }).fail(failHandler);
    };


    function component2Object(component){
        var o = {};

        o.uid = $($(component).find("UID")[0]).text();
        o.summary = $($(component).find("SUMMARY")[0]).text();
        o.description = $($(component).find("DESCRIPTION")[0]).text();
        o.location = $($(component).find("LOCATION")[0]).text();
        o.url = $($(component).find("URL")[0]).text();
        o.classification = $($(component).find("CLASS")[0]).text();
        o.journalStatus = $($(component).find("STATUS")).text();
        o.dtstart = {};
        o.dtend = {};
        o.created = {};
        o.dtstamp = {};
        o.modified = {};
        o.dtstart.rfc822 = $($(component).find("DTSTART")[0]).attr('rfc822');
        o.dtend.rfc822 = $($(component).find("DTEND")[0]).attr('rfc822');
        o.created.rfc822 = $($(component).find("CREATED")[0]).attr('rfc822');
        o.dtstamp.rfc822 = $($(component).find("DTSTAMP")[0]).attr('rfc822');
        o.modified.rfc822 = $($(component).find("LAST-MODIFIED")[0]).attr('rfc822');
        o.dtstart.ics = $($(component).find("DTSTART")[0]).text();
        o.dtend.ics = $($(component).find("DTEND")[0]).text();
        o.created.ics = $($(component).find("CREATED")[0]).text();
        o.dtstamp.ics = $($(component).find("DTSTAMP")[0]).text();
        o.modified.ics = $($(component).find("LAST-MODIFIED")[0]).text();

        o.categories = [];
        var xmlCategories = $(component).find("CATEGORIES");
        if( xmlCategories.length > 0 ){
            $.each(xmlCategories, function(i, categorie){
                o.categories.push($(categorie).text());
            });
        }

        return o;
    };

    function storeComponent(url, id, object){
        //console.log("storeComponent(" + url + ", " + id + ", " + object + ")");
        //console.log(object);

        // persits to which calender the compoent belongs
        var calendar = JSON.parse(localStorage.getItem(url));
        if(!calendar){
            calendar = [];
        }
        if(calendar.indexOf(id) < 0){
            calendar.push(id);
        }
        localStorage.setItem(url, JSON.stringify(calendar));

        // persist component
        localStorage.setItem(id, JSON.stringify(object));
    };

    function resetCalendarStore(url){
        // does not delete the stored components
        console.log("clear calendar " + url);
        var emptyArray = [];
        localStorage.setItem(url, JSON.stringify(emptyArray));
    }

    return E;

}(jQuery));
