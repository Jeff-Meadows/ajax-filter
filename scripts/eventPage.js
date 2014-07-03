function tabUpdated(id, info, tab) {
    chrome.storage.sync.get({sites: []}, function(data) {
        data.sites.forEach(function(site) {
            if (tab.url.match(new RegExp(site.pattern))) {
                var patch = site.rules;
                chrome.tabs.executeScript(id, {
                    runAt: "document_start",
                    file: 'scripts/inject_hacked_xhr.js'
                }, function() {
                    chrome.tabs.executeScript(id, {
                        runAt: "document_end",
                        code: '_ajax_filter_inject_data(' + JSON.stringify(patch) + '); _ajax_filter_inject_script("bower_components/json-patch/jsonpatch.js"); _ajax_filter_inject_script("scripts/hacked_xhr.js");'
                    });
                });
            }
        });
    });
}

chrome.tabs.onUpdated.addListener(tabUpdated);