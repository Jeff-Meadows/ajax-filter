function _ajax_filter_inject_script(path) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(path);
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head||document.documentElement).appendChild(s);
}
function _ajax_filter_inject_data(data) {
    var f = document.createElement('form');
    var i = document.createElement('input');
    i.type = 'hidden';
    i.id = 'chrome-ajax-response-filter-info';
    i.value = JSON.stringify(data);
    f.appendChild(i);
    document.body.appendChild(f);
}
