///<reference path="states.config.ts"/>

angular.module('app.bootstrap', [
    'ui.router',
    'app.components'
])
    //.config(bootstrap.configureRouter)
    //.config(bootstrap.createStates)
    .run(($rootScope:ng.IRootScopeService, $timeout:ng.ITimeoutService) => {
        $rootScope.$on('$locationChangeSuccess', (event:ng.IAngularEvent, toState:ng.ui.IState, toParams, fromState:ng.ui.IState) => {
            $timeout(() => {
                if (window['GSLoader']) {
                    window['GSLoader']['reset']();
                }
            }, 300);
        });
    });

