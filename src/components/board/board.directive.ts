module boardModule {

    export interface BoardInterface {
        getGameState():gameModule.GameState
    }

    export function BoardDirective() {

        return {
            restrict: 'E',
            templateUrl: 'components/board/board.html',
            scope: {
                'gameState': '=?'
            },
            bindToController: true,
            controller: BoardController,
            controllerAs: 'boardCtrl',
            replace: true
        }
    }

    export class BoardController implements BoardInterface {

        private _$scope:ng.IScope;
        private gameState:gameModule.GameState;

        /**
         * @ngInject
         */
        constructor($scope:ng.IScope) {
            this._$scope = $scope;
        }

        /**
         *
         * @returns {gameModule.GameState}
         */
        public getGameState():gameModule.GameState {
            return this.gameState;
        }
    }
}
