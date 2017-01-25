module gameModule {

    export enum GamePlayState {
        IDLE,
        MOVE_IN_PROGRESS,
        GAME_OVER
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

        public static ANIMATION_INTERVAL:number = 100; // milliseconds.

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

                if (this.getGamePlayState() === GamePlayState.MOVE_IN_PROGRESS
                    || this.getGamePlayState() === GamePlayState.GAME_OVER) {
                    return false;
                }

                var promise = this._execMove(pitNumber).then((lastFrame) => {

                    if (lastFrame.getTurn() === Turn.player2Turn) {
                        return this._sleepFunc(() => {
                            return this.doAIMove(lastFrame);
                        }, GameController.ANIMATION_INTERVAL * 2);
                    }
                    else {
                        return this.$_q.when(lastFrame);
                    }
                });

                return this._enterGamePlayState(GamePlayState.MOVE_IN_PROGRESS, promise).then((lastFrame) => {
                    if (lastFrame.gameIsOver()) {
                        this._gamePlayState = GamePlayState.GAME_OVER;
                    }
                });
            });
        }

        /**
         *
         * @param gamePlayState
         * @param promiseFunc
         * @returns {IPromise<TResult>}
         * @private
         */
        private _enterGamePlayState(gamePlayState:GamePlayState, promiseFunc:ng.IPromise<any>):ng.IPromise<any> {

            let lastState = this._gamePlayState;
            this._gamePlayState = gamePlayState;

            return promiseFunc.finally(() => {
                this._gamePlayState = lastState;
            });
        }

        /**
         *
         * @param gameState
         * @returns {ng.IPromise<any>}
         */
        private doAIMove(gameState:GameState):ng.IPromise<any> {

            let aiPitNumber = this.$_mancalaAI.getBestMove(gameState);
            let frames = this.$_moveService.getMoveFrames(aiPitNumber, gameState);

            return this._runFrames(frames).then((lastFrame) => {
                if (lastFrame.getTurn() === Turn.player2Turn) {
                    return this.doAIMove(lastFrame);
                }
                else {
                    return this.$_q.when(lastFrame);
                }
            });

        }

        /**
         * @param pitNumber
         * @private
         */
        private _execMove(pitNumber:number):ng.IPromise<any> {

            let frames = this.$_moveService.getMoveFrames(pitNumber, this._gameState);
            return this._runFrames(frames);
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
            this._gamePlayState = GamePlayState.IDLE;
            this._gameState = new gameModule.GameState();
        }

        /**
         *
         * @param frames
         * @returns {any}
         * @private
         */
        private _runFrames(frames:Array<gameModule.GameState>):ng.IPromise<any> {

            let lastFrame = frames[frames.length - 1];
            this._gameState = frames.shift();

            if (frames.length) {
                //return this.$_scope.$apply(() => {
                return this._sleepFunc(() => {
                    return this._runFrames(frames)
                });
                //});
            }

            return this.$_q.when(lastFrame);
        }

        /**
         *
         * @param func
         * @param ms
         * @returns {IPromise<any>}
         * @private
         */
        private _sleepFunc(func:Function, ms?:number):ng.IPromise<any> {
            return this.$_timeout(() => {
                return func();
            }, ms ? ms : GameController.ANIMATION_INTERVAL);
        }

        /**
         *
         * @returns {boolean}
         */
        public isIdle():boolean {
            return this._gamePlayState === GamePlayState.IDLE;
        }

        /**
         *
         * @returns {boolean}
         */
        public moveInProgress():boolean {
            return this._gamePlayState === GamePlayState.MOVE_IN_PROGRESS;
        }

        /**
         *
         * @returns {boolean}
         */
        public isGameOver():boolean {
            return this._gamePlayState === GamePlayState.GAME_OVER;
        }

        /**
         *
         * @returns {boolean}
         */
        public isPlayer1Turn():boolean {
            return this._gameState.getTurn() === Turn.player1Turn;
        }
    }
}
