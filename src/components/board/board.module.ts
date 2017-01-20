///<reference path="board.directive.ts"/>
///<reference path="pit.directive.ts"/>

angular.module('app.components.board', [])
    .directive('board', boardModule.BoardDirective)
    .directive('pit', boardModule.PitDirective);
