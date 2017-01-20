module mancalaAIModule {

    export class MancalAIService {

        /**
         * @ngInject
         */
        constructor() {

        }

        /**
         *
         * @param gameState
         * @returns {number}
         */
        public move(gameState:gameModule.GameState):number {
            return _.random(7, 12);
        }
    }
}
