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

        private $_scope:ng.IScope;
        private $_timeout:ng.ITimeoutService;
        private _gameState:gameModule.GameState;
        private $_mancalaAI:mancalaAIModule.MancalAIService;
        private $_moveService:gameModule.MoveService;

        public static ANIMATION_INTERVAL:number = 400; // milliseconds.

        /**
         * @ngInject
         */
        constructor($scope:ng.IScope, $timeout:ng.ITimeoutService, $mancalaAI:mancalaAIModule.MancalAIService, $moveService:gameModule.MoveService) {

            this.$_scope = $scope;
            this.$_timeout = $timeout;
            this._gameState = new gameModule.GameState();
            this.$_mancalaAI = $mancalaAI;
            this.$_moveService = $moveService;

            $scope.$on('clickPit', (e:ng.IAngularEvent, pitNumber:number) => {

                e.preventDefault();

                let frames = this.$_moveService.getMoveFrames(pitNumber, this._gameState);
                this._runFrames(frames);
                //
                //
                //let response = this.$_mancalaAI.move(this._gameState);
                //this._runSteps(response.getGameStateSteps());
                //this._gameState = response.getGameState();
            });
        }

        /**
         *
         * @returns {gameModule.GameState}
         */
        public getGameState():gameModule.GameState {
            return this._gameState;
        }

        /**
         *
         * @param frames
         * @private
         */
        private _runFrames(frames:Array<gameModule.GameState>):void {

            this._gameState = frames.shift();
            this.$_scope.$apply();

            if (frames.length) {
                this.$_timeout( () => {
                    this._runFrames(frames);
                }, GameController.ANIMATION_INTERVAL);
            }
        }
    }
}
