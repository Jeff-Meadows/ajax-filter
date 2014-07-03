(function(XHR) {
    "use strict";

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;

    var _ajax_filter_patch = JSON.parse(document.getElementById('chrome-ajax-response-filter-info').value);

    XHR.prototype.open = function(method, url, async, user, pass) {
        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = function(data) {
        var self = this;
        var oldOnReadyStateChange;

        function onReadyStateChange() {
            if(self.readyState == 4 /* complete */) {
                var result = self.responseText;
                var json = JSON.parse(result);
                try {
                    jsonpatch.apply(json, _ajax_filter_patch);
                } catch (e) {}

                Object.defineProperty(self, 'responseText', {
                    get: function() {
                        return JSON.stringify(json);
                    }
                });
            }

            if(oldOnReadyStateChange) {
                oldOnReadyStateChange.call(this);
            }
        }

        //if(this.addEventListener) {
        //    this.addEventListener("readystatechange", onReadyStateChange, false);
        //} else {
            oldOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = onReadyStateChange;
        //}
        Object.defineProperty(this, 'onreadystatechange', {
            set: function(val) {
                oldOnReadyStateChange = val;
            }
        });

        send.call(this, data);
    }
})(XMLHttpRequest);
