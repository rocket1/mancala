module gameModule {

    export interface GameStateOptionsInterface {
        initStoneCount:number
    }

    export interface GameStateInterface {
        getStoneCount(pit:number);
        getTurn():gameModule.Turn;
    }

    export class GameState implements GameStateInterface {

        private _turn:gameModule.Turn;
        private _pits:Array<number>;
        public static defaultStoneCount = 5;

        constructor(options?:GameStateOptionsInterface) {

            this._turn = gameModule.Turn.player1Turn;
            let stoneCount = (options && options['initStoneCount']) ? options['initStoneCount'] : GameState.defaultStoneCount;
            this._reset(stoneCount);
        }

        private _reset(stoneCount:number):void {

            this._pits = [];
            let totalPits = 14;

            for (let i = 0; i < totalPits; ++i) {
                this._pits[i] = stoneCount;
            }

            let player1Store = (totalPits / 2) - 1; // i.e. 6
            let player2Store = totalPits - 1; // i.e. 13

            this._pits[player1Store] = 0;
            this._pits[player2Store] = 0;
        }

        public getStoneCount(pit:number) {
            return this._pits[pit];
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
