module mancalaAIModule {

    export class MancalAIService {

        /**
         * @ngInject
         */
        constructor() {

        }

        /**
         * @ngInject
         * @param gameState
         * @param $moveService
         * @returns {number}
         */
        public move(gameState:gameModule.GameState):number {
            for (let i = 7; i <= 12; ++i) {
                if (gameModule.MoveService.moveIsValid(i, gameState)) {
                    return i;
                }
            }
        }
    }
}
