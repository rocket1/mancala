module gameModule {

    export interface GameStateOptionsInterface {
        initStoneCount?:number;
        pits?:Array<number>;
    }

    export interface GameStateInterface {
        getStoneCount(pit:number);
        getTurn():gameModule.Turn;
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
         * @param pitNumber
         * @returns {number}
         */
        public getStoneCount(pitNumber:number):number {
            return this._pits[pitNumber];
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
        public static  getPlayer2StorePitNumber() {
            return GameState.PIT_COUNT - 1;
        }
    }
}
