module gameModule {

    export interface MoveRange {
        minPitNumber:number,
        maxPitNumber:number,
    }

    export interface GameStateOptionsInterface {
        initStoneCount?:number;
        pits?:Array<number>;
    }

    export interface GameStateInterface {
        getStoneCount(pit:number);
        getTurn():gameModule.Turn;
        gameIsOver():boolean;
    }

    export class GameState implements GameStateInterface {

        private _turn:gameModule.Turn;
        private _pits:Array<number>;
        public static DEFAULT_STONE_COUNT = 5;
        public static PIT_COUNT = 14;

        constructor(options?:GameStateOptionsInterface) {

            this._turn = gameModule.Turn.player1Turn;
            this._pits = (options && options['pits']) ? options['pits'] : null;

            if (!this._pits) {
                let stoneCount = (options && options['initStoneCount']) ? options['initStoneCount'] : GameState.DEFAULT_STONE_COUNT;
                this._reset(stoneCount);
            }
        }

        /**
         *
         * @param stoneCount
         * @private
         */
        private _reset(stoneCount:number):void {

            this._pits = [];

            for (let i = 0; i < GameState.PIT_COUNT; ++i) {
                this._pits[i] = stoneCount;
            }

            this._pits[GameState.getPlayer1StorePitNumber()] = 0;
            this._pits[GameState.getPlayer2StorePitNumber()] = 0;
        }

        /**
         *
         * @returns {boolean}
         */
        public gameIsOver():boolean {
            var p1Score = this._pits[GameState.getPlayer1StorePitNumber()];
            var p2Score = this._pits[GameState.getPlayer2StorePitNumber()];
            var total = GameState.DEFAULT_STONE_COUNT * GameState.PIT_COUNT;
            return p1Score + p2Score === total;
        }

        /**
         *
         * @param pitNumber
         * @returns {number}
         */
        public getStoneCount(pitNumber:number):number {
            return this._pits[pitNumber];
        }

        /**
         *
         * @param pitNumber
         * @returns {number}
         */
        public setStoneCount(pitNumber:number, stoneCount:number):void {
            this._pits[pitNumber] = stoneCount;
        }

        /**
         *
         * @param pitNumber
         */
        public incrStoneCount(pitNumber:number):void {
            this._pits[pitNumber] = this._pits[pitNumber] + 1;
        }

        /**
         *
         * @param pitNumber
         */
        public clear(pitNumber:number):void {
            this._pits[pitNumber] = 0;
        }

        /**
         *
         */
        public incrTurn():void {
            this._turn = this._turn === gameModule.Turn.player1Turn ? gameModule.Turn.player2Turn : gameModule.Turn.player1Turn;
        }

        /**
         *
         * @returns {gameModule.Turn}
         */
        public getTurn():gameModule.Turn {
            return this._turn;
        }

        /**
         *
         * @returns {number}
         */
        public static getPlayer1StorePitNumber() {
            return (GameState.PIT_COUNT / 2) - 1;
        }

        /**
         *
         * @returns {number}
         */
        public static getPlayer2StorePitNumber() {
            return GameState.PIT_COUNT - 1;
        }

        /**
         *
         * @returns {number}
         */
        public getPlayer1Score():number {
           return this._pits[GameState.getPlayer1StorePitNumber()];
        }

        /**
         *
         * @returns {number}
         */
        public getPlayer2Score():number {
           return this._pits[GameState.getPlayer2StorePitNumber()];
        }

        /**
         *
         * @returns {number}
         */
        public static getPlayer1MoveRange():MoveRange {
            return {
                minPitNumber: 0,
                maxPitNumber: GameState.getPlayer1StorePitNumber() - 1
            }
        }

        /**
         *
         * @returns {number}
         */
        public static getPlayer2MoveRange():MoveRange {
            return {
                minPitNumber: GameState.getPlayer1StorePitNumber() + 1,
                maxPitNumber: GameState.getPlayer2StorePitNumber() - 1
            }
        }
    }
}
