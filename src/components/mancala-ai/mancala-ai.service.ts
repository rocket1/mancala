module mancalaAIModule {

    export interface mancalaAIMoveResponseInterface {
        getGameState():gameModule.GameState;
        setGameState(gameState:gameModule.GameState):void;
        getFrames():Array<gameModule.GameState>;
        setFrames(frames:Array<gameModule.GameState>):void;
    }

    export class MacalaAIMoveResponse implements mancalaAIMoveResponseInterface {

        private _gameState:gameModule.GameState;
        private _frames:Array<gameModule.GameState>;

        constructor() {
        }

        public getGameState():gameModule.GameState {
            return this._gameState;
        }

        public setGameState(gameState:gameModule.GameState):void {
            this._gameState = gameState;
        }

        public getFrames():Array<gameModule.GameState> {
            return this._frames;
        }

        public setFrames(frames:Array<gameModule.GameState>):void {
            this._frames = frames;
        }
    }


    export class MancalAIService {

        constructor() {

        }

        public move(gameState:gameModule.GameState):mancalaAIMoveResponseInterface {

            let response = new MacalaAIMoveResponse();

            let gstate = new gameModule.GameState({
                pits: [1, 2, 3, 4, 5, 10, 8, 4, 12, 11, 4, 9, 0, 11]
            });

            response.setGameState(gstate);
            return response;
        }
    }
}
