//module bootstrap {
//
//    interface AugmentedWindow extends ng.IWindowService {
//        isNative:boolean
//    }
//
//    /**
//     * @ngInject
//     */
//    export function configureRouter($locationProvider:angular.ILocationProvider,
//                                    $provide:ng.auto.IProvideService):void {
//
//
//        //$locationProvider.html5Mode(true);
//
//        // Enable HTML 5 mode for link rewriting, but disable the history API so hashbang URLs are still used.
//        //$provide.decorator('$sniffer', /* @ngInject */ function ($delegate) {
//        //    $delegate.history = false;
//        //    return $delegate;
//        //});
//    }
//
//    /**
//     * @ngInject
//     */
//    export function createStates($urlRouterProvider:angular.ui.IUrlRouterProvider,
//                                 $stateProvider:angular.ui.IStateProvider):void {
//        // Redirect to the root state when no hashbang is in the URL.
//        $urlRouterProvider.when('', '/');
//        // Handle unknown routes by displaying the not-found route without changing the displayed URL.
//        $urlRouterProvider.otherwise(function ($injector) {
//            $injector.get('$state').go('not-found');
//        });
//
//        $stateProvider.state({
//            name: 'root',
//            abstract: true,
//            views: {
//                '': {
//                    template: '<toolbar></toolbar><div ui-view style="height:100%" class="inner-template-wrapper"></div>'
//                }
//            },
//            resolve: {
//                init: ['blockService', (blockService:globalApiModule.BlockService) => {
//                    return blockService.init();
//                }]
//            }
//        });
//
//        $stateProvider.state({
//            name: 'mobile-menu',
//            url: '/menu',
//            views: {
//                '': {
//                    templateUrl: 'components/toolbar/mobile-menu.html',
//                    controller: 'MobileMenuController',
//                    controllerAs: 'mobileMenuCtrl'
//                }
//            },
//            resolve: {
//                previousState: [
//                    "$state",
//                    function ($state) {
//                        return {
//                            name: $state.current.name
//                        };
//                    }
//                ]
//            }
//        });
//
//        $stateProvider.state({
//            name: 'home',
//            url: '/',
//            page: 'home',
//            views: {
//                '': {
//                    templateUrl: 'sections/home/home.html',
//                    controller: 'HomeController',
//                    controllerAs: 'homeCtrl'
//                }
//            },
//            resolve: {
//                init: ['blockService', (blockService:globalApiModule.BlockService) => {
//                    return blockService.init();
//                }]
//            }
//        });
//
//        //
//        //$stateProvider.state({
//        //    name: 'root.artists',
//        //    url: '/artists',
//        //    views: {
//        //        '': {
//        //            //templateUrl: 'sections/artists/artists.html',
//        //            controller: 'ArtistsController',
//        //            controllerAs: 'artistsCtrl'
//        //        }
//        //    }
//        //});
//
//        $stateProvider.state({
//            name: 'root.grants',
//            url: '/grants',
//            page: 'grants',
//            views: {
//                '': {
//                    templateUrl: 'sections/grants/grants.html',
//                    controller: 'GrantsController',
//                    controllerAs: 'grantsCtrl'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'root.retreats',
//            url: '/retreats',
//            page: 'retreats',
//            views: {
//                '': {
//                    templateUrl: 'sections/retreats/retreats.html',
//                    controller: 'RetreatsController',
//                    controllerAs: 'retreatsCtrl'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'root.upcoming-retreats',
//            url: '/upcoming-retreats/:retreatId',
//            views: {
//                '': {
//                    templateUrl: 'sections/retreats/retreat.html',
//                    controller: retreatModule.RetreatController,
//                    controllerAs: 'retreatCtrl'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'root.past-retreats',
//            url: '/past-retreats/:retreatId',
//            views: {
//                '': {
//                    templateUrl: 'sections/retreats/retreat.html',
//                    controller: retreatModule.RetreatController,
//                    controllerAs: 'retreatCtrl'
//                }
//            }
//        });
//
//        //$stateProvider.state({
//        //    name: 'root.article',
//        //    url: '/magazine'
//        //    //,
//        //    //views: {
//        //    //    '': {
//        //    //        templateUrl: 'sections/article/article.html',
//        //    //        controller: 'ArticleController',
//        //    //        controllerAs: 'articleCtrl'
//        //    //    }
//        //    //}
//        //});
//        //
//        //$stateProvider.state({
//        //    name: 'root.article-date',
//        //    url: '/magazine/:type/:year/:month'
//        //    //,
//        //    //views: {
//        //    //    '': {
//        //    //        templateUrl: 'sections/article/article.html',
//        //    //        controller: 'ArticleController',
//        //    //        controllerAs: 'articleCtrl'
//        //    //    }
//        //    //}
//        //});
//
//        $stateProvider.state({
//            name: 'root.featured-artist',
//            url: '/magazine/featured-artist',
//            views: {
//                '': {
//                    templateUrl: 'sections/article/article-detail.html',
//                    controller: 'ArticleDetailController',
//                    controllerAs: 'articleDetailCtrl'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'root.article-detail',
//            url: '/magazine/:type/:year/:month/:slug'
//            //,
//            //views: {
//            //    '': {
//            //        templateUrl: 'sections/article/article-detail.html',
//            //        controller: 'ArticleDetailController',
//            //        controllerAs: 'articleDetailCtrl'
//            //    }
//            //}
//        });
//
//        $stateProvider.state({
//            name: 'root.support',
//            url: '/support',
//            page: 'support',
//            views: {
//                '': {
//                    templateUrl: 'sections/support/support.html',
//                    controller: 'SupportController',
//                    controllerAs: 'supportCtrl'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'root.about',
//            url: '/about',
//            page: 'about',
//            views: {
//                '': {
//                    templateUrl: 'sections/about/about.html',
//                    controller: 'AboutController',
//                    controllerAs: 'aboutCtrl'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'type',
//            url: '/type',
//            views: {
//                '': {
//                    templateUrl: 'sections/type-spec/type-spec.html'
//                }
//            }
//        });
//
//        $stateProvider.state({
//            name: 'not-found',
//            templateUrl: 'sections/not-found/not-found.html'
//        });
//    }
//}
