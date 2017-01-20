///<reference path="game.directive.ts"/>
///<reference path="move.service.ts"/>

angular.module('app.components.game', [])
    .directive('game', gameModule.GameDirective)
    .service('$moveService', gameModule.MoveService);
