angular.module('app', [
    'ngAnimate',
    'rt.debounce',
    'app.bootstrap',
    'app.components',
    'app.sections',
    'app.templates',
    'truncate'
])
    .run(($anchorScroll, $rootScope:ng.IRootScopeService) => {
        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $anchorScroll();
        })
    });
