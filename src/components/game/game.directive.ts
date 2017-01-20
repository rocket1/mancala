module gameModule {

    export function GameDirective() {

        return {
            restrict: 'E',
            templateUrl: 'components/game/game.html',
            scope: {},
            bindToController: true,
            controller: GameController,
            controllerAs: 'gameCtrl',
            replace: true
        }
    }

    export class GameController {

        private _gameState:gameModule.GameState;

        /**
         * @ngInject
         */
        constructor($scope:ng.IScope) {
            this._gameState = new gameModule.GameState();
        }

        public getGameState():gameModule.GameState {
            return this._gameState;
        }
    }
}
