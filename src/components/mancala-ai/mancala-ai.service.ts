module mancalaAIModule {

    export class MancalAIService {

        constructor() {

        }

        public move(gameState:gameModule.GameState):number {
            return _.random(7, 12);
        }
    }
}
