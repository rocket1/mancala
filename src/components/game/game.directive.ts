module gameModule {

    export enum GamePlayState {
        IDLE,
        MOVE_IN_PROGRESS
    }

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
        private _gamePlayState:GamePlayState;

        public static ANIMATION_INTERVAL:number = 400; // milliseconds.

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
            this._gamePlayState = GamePlayState.IDLE;


            this.resetGame();

            $scope.$on('clickPit', (e:ng.IAngularEvent, pitNumber:number) => {

                e.preventDefault();

                if (this.getGamePlayState() === GamePlayState.MOVE_IN_PROGRESS) {
                    return false;
                }

                return this._enterGamePlayState(GamePlayState.MOVE_IN_PROGRESS, this._execMove(pitNumber));
            });
        }

        /**
         *
         * @param gamePlayState
         * @param promiseFunc
         * @returns {IPromise<TResult>}
         * @private
         */
        private _enterGamePlayState(gamePlayState:GamePlayState, promiseFunc:ng.IPromise):ng.IPromise {

            let lastState = this._gamePlayState;
            this._gamePlayState = gamePlayState;
            this.$_scope.$apply();

            return promiseFunc.finally(() => {
                this._gamePlayState = lastState;
            });
        }

        /**
         * TODO: Flatten these promises a bit.
         * @param pitNumber
         * @private
         */
        private _execMove(pitNumber:number):ng.IPromise {

            let frames = this.$_moveService.getMoveFrames(pitNumber, this._gameState);

            if (!frames.length) {
                return this.$_q.when();
            }

            this._gameState = frames.shift();

            return this.$_scope.$apply(() => {

                return this._sleepFunc(() => {
                    return this._runFrames(frames);
                })

                    .then(() => {

                        this._gameState.incrTurn();

                        return this._sleepFunc(() => {

                            let aiPitNumber = this.$_mancalaAI.move(this._gameState);
                            frames = this.$_moveService.getMoveFrames(aiPitNumber, this._gameState);
                            return this._runFrames(frames);

                        }, GameController.ANIMATION_INTERVAL * 2);
                    })

                    .then(() => {
                        return this.$_q.when(this._gameState.incrTurn());
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
         * @returns {GamePlayState}
         */
        public getGamePlayState():gameModule.GamePlayState {
            return this._gamePlayState;
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
         * @returns {any}
         * @private
         */
        private _runFrames(frames:Array<gameModule.GameState>):ng.IPromise {

            this._gameState = frames.shift();

            if (frames.length) {
                return this._sleepFunc(() => {
                    return this._runFrames(frames)
                });
            }

            return this.$_q.when();
        }

        /**
         *
         * @param func
         * @param ms
         * @returns {IPromise<any>}
         * @private
         */
        private _sleepFunc(func:Function, ms?:number):ng.IPromise {
            return this.$_timeout(() => {
                return func();
            }, ms ? ms : GameController.ANIMATION_INTERVAL);
        }

        /**
         *
         * @returns {boolean}
         */
        public moveInProgress():boolean {
            return this._gamePlayState === GamePlayState.MOVE_IN_PROGRESS;
        }
    }
}
