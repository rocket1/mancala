module gameModule {

    export function GameDirective():ng.IDirective {

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
        private $_q:ng.IQService;
        private _gameState:gameModule.GameState;
        private $_mancalaAI:mancalaAIModule.MancalAIService;
        private $_moveService:gameModule.MoveService;

        public static ANIMATION_INTERVAL:number = 600; // milliseconds.

        /**
         * @ngInject
         *
         * @param $scope
         * @param $timeout
         * @param $q
         * @param $mancalaAI
         * @param $moveService
         */
        constructor($scope:ng.IScope, $timeout:ng.ITimeoutService, $q:ng.IQService, $mancalaAI:mancalaAIModule.MancalAIService, $moveService:gameModule.MoveService) {

            this.$_scope = $scope;
            this.$_timeout = $timeout;
            this.$_q = $q;
            this.$_mancalaAI = $mancalaAI;
            this.$_moveService = $moveService;

            this.resetGame();

            $scope.$on('clickPit', (e:ng.IAngularEvent, pitNumber:number) => {
                e.preventDefault();
                this._execMove(pitNumber);
            });
        }

        /**
         *
         * @param pitNumber
         * @private
         */
        private _execMove(pitNumber:number):ng.IPromise {

            let frames = this.$_moveService.getMoveFrames(pitNumber, this._gameState);
            this._gameState = frames.shift();

            return this.$_scope.$apply(() => {

                return this._tick(() => {

                    this._runFrames(frames).then(() => {

                        this._gameState.incrTurn();

                        return this._tick(() => {
                            let aiPitNumber = this.$_mancalaAI.move(this._gameState);
                            frames = this.$_moveService.getMoveFrames(aiPitNumber, this._gameState);
                            return this._runFrames(frames);
                        }, GameController.ANIMATION_INTERVAL * 2);

                    }).then(() => {
                        this._gameState.incrTurn();
                    });
                });
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
         */
        public resetGame():void {
            this._gameState = new gameModule.GameState();
        }

        /**
         *
         * @param frames
         * @private
         */
        private _runFrames(frames:Array<gameModule.GameState>):ng.IPromise {

            this._gameState = frames.shift();

            if (frames.length) {
                return this._tick(() => {
                    return this._runFrames(frames)
                });
            }

            return this.$_q.when();
        }

        private _tick(func:Function, ms?:number):ng.IPromise {
            return this.$_timeout(() => {
                return func();
            }, ms ? ms : GameController.ANIMATION_INTERVAL);
        }
    }
}
