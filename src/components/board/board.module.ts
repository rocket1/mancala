///<reference path="board.directive.ts"/>

angular.module('app.components.board', [])
    .directive('board', boardModule.BoardDirective);
