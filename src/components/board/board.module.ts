///<reference path="board.directive.ts"/>
///<reference path="pit.directive.ts"/>
///<reference path="click-pit.directive.ts"/>

angular.module('app.components.board', [])
    .directive('board', boardModule.BoardDirective)
    .directive('pit', boardModule.PitDirective)
    .directive('clickPit', boardModule.ClickPitDirective);
