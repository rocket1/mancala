///<reference path="game.directive.ts"/>

angular.module('app.components.game', [])
    .directive('game', gameModule.GameDirective);
