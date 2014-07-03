angular.module('ajax-filter.options', [])
    .directive('ajaxFilterSite', [function() {
        return {
            scope: {
                site: '='
            },
            template: '<section>' +
                '<header>' +
                '<h1>URL Pattern:</h1>' +
                '<div class="corner"><input type="text" ng-model="site.pattern" width="100" /></div>' +
                '</header>' +
                '<h1>Rules</h1>' +
                '<div class="corner"><button type="button" ng-click="addRule()">Add new Rule</button></div>' +
                '<div ng-repeat="rule in site.rules"><ajax-filter-rule rule="rule" /></div>' +
                '<button type="button" ng-click="remove()">Remove Site</button>' +
                '</section>',
            link: function(scope, element, attrs, ajaxFilterOptionsCtrl) {
                scope.site.rules = scope.site.rules || [];
                scope.addRule = function(rule) {
                    scope.site.rules.push(rule || {});
                };
                scope.remove = function() {
                    ajaxFilterOptionsCtrl.removeSite(scope.site);
                }
            },
            controller: function($scope) {
                this.removeRule = function(rule) {
                    $scope.site.rules.splice($scope.site.rules.indexOf(rule), 1);
                };
            },
            restrict: 'EA',
            require: '^ajaxFilterOptions'
        };
    }])
    .directive('ajaxFilterRule', [function() {
        return {
            scope: {
                rule: '='
            },
             template: '<section>' +
                 '<header>' +
                 '<h1>Operation:</h1>' +
                 '<div class="corner"><select ng-model="rule.op" ng-options="choice for choice in choices"><option value="">--Select a value--</option></select></div>' +
                 '</header>' +
                 '<header>' +
                 '<h1>Path:</h1>' +
                 '<div class="corner"><input type="text" ng-model="rule.path" width="150" /></div>' +
                 '</header>' +
                 '<header ng-hide="{{!rule.op || rule.op == \'remove\'}}">' +
                 '<h1>Value:</h1>' +
                 '<div class="corner"><input type="text" ng-model="rule.value" width="100" /></div>' +
                 '</header>' +
                 '</section>' +
                '<button type="button" ng-click="remove()">Remove</button>',
            link: function(scope, element, attrs, ajaxFilterSiteCtrl) {
                angular.extend(scope, {
                    choices: ['add', 'remove', 'replace', 'test']
                });
                scope.remove = function() {
                    ajaxFilterSiteCtrl.removeRule(scope.rule);
                };
            },
            require: '^ajaxFilterSite',
            restrict: 'EA'
        };
    }])
    .directive('ajaxFilterOptions', [function() {
        return {
            template: '<h1>AJAX Response Filter Options</h1>' +
                '<header>' +
                '<h1>Sites</h1>' +
                '<div class="corner"><button type="button" ng-click="addSite()">Add new Site</button></div>' +
                '</header>' +
                '<div ng-repeat="site in sites"><ajax-filter-site site="site" /></div>' +
                '<button ng-click="save()">Save Options</button>',
            link: function(scope, element, attrs) {
                scope.sites = [];
                scope.addSite = function(site) {
                    scope.sites.push(site || {});
                };
                scope.save = function() {
                    chrome.storage.sync.set({sites: scope.sites.map(function(site) {
                        return {
                            pattern: site.pattern,
                            rules: site.rules.map(function(rule) {
                                return {
                                    op: rule.op,
                                    path: rule.path,
                                    value: rule.value
                                };
                            })
                        };
                    })})
                };
                chrome.storage.sync.get({sites: []}, function(data) {
                    data.sites.forEach(function(site) {
                        scope.addSite(site);
                    });
                    scope.$apply();
                });
            },
            controller: function($scope) {
                this.removeSite = function(site) {
                    $scope.sites.splice($scope.sites.indexOf(site));
                };
            },
            restrict: 'EA'
        };
    }]);
