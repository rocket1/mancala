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

        private _reset(stoneCount:number):void {

            this._pits = [];
            let totalPits = GameState.PIT_COUNT;

            for (let i = 0; i < totalPits; ++i) {
                this._pits[i] = stoneCount;
            }

            let player1Store = (totalPits / 2) - 1; // i.e. 6
            let player2Store = totalPits - 1; // i.e. 13

            this._pits[player1Store] = 0;
            this._pits[player2Store] = 0;
        }

        public getStoneCount(pitNumber:number) {
            return this._pits[pitNumber];
        }

        public incrStoneCount(pitNumber:number):void {
            this._pits[pitNumber] = this._pits[pitNumber] + 1;
        }

        public clear(pitNumber:number):void {
            this._pits[pitNumber] = 0;
        }

        public setStoneCount(pit:number, stoneCount:number):void {
            this._pits[pit] = stoneCount;
        }

        public incrTurn():gameModule.Turn {
            this._turn = this._turn === gameModule.Turn.player1Turn ? gameModule.Turn.player2Turn : gameModule.Turn.player1Turn;
            return this._turn;
        }

        public getTurn():gameModule.Turn {
            return this._turn;
        }
    }
}
