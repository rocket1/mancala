module gameModule {

    export class MoveService {

        /**
         *
         * @param pitNumber
         * @param gameState
         * @returns {any}
         */
        public getMoveFrames(pitNumber:number, gameState:gameModule.GameState):Array<gameModule.GameState> {

            if (!MoveService.moveIsValid(pitNumber, gameState)) {
                return [];
            }

            let stoneCount = gameState.getStoneCount(pitNumber);
            let turn = gameState.getTurn();
            let firstFrame = angular.copy(gameState);
            let frames:Array<gameModule.GameState> = [];

            firstFrame.clear(pitNumber);
            frames.push(firstFrame);

            for (let i = 1; i <= stoneCount; ++i) {
                let newFrame = angular.copy(frames[i - 1]);
                pitNumber = MoveService._getNextPitNumber(pitNumber, turn);
                newFrame.incrStoneCount(pitNumber);
                frames.push(newFrame);
            }

            let lastGameState = frames[frames.length - 1];
            let oppositePitNumber = MoveService._getOppositePitNumber(pitNumber);
            let myLastCount = lastGameState.getStoneCount(pitNumber);
            let oppositeCount = lastGameState.getStoneCount(oppositePitNumber);

            // Did we land in an empty pit on our side, collecting other players stones across?
            if (MoveService._moveInRange(pitNumber, turn) && myLastCount === 1 && oppositeCount > 0) {

                // Draw a frame with your pit being emptied.
                let newFrame = angular.copy(lastGameState);
                newFrame.clear(pitNumber);
                frames.push(newFrame);

                // Draw a frame with opposite pit being emptied.
                let newFrame = angular.copy(newFrame);
                newFrame.clear(oppositePitNumber);
                frames.push(newFrame);

                // Draw a frame with the store getting the stones.
                let newFrame = angular.copy(newFrame);
                let storePitNumber = MoveService._getStorePitNumberByTurn(turn);
                let currentScore = newFrame.getStoneCount(storePitNumber);
                let newScore = currentScore + myLastCount + oppositeCount;
                newFrame.setStoneCount(storePitNumber, newScore);
                newFrame.incrTurn();
                frames.push(newFrame);
            }
            else if (pitNumber !== MoveService._getStorePitNumberByTurn(turn)) {
                lastGameState.incrTurn();
            }

            return frames;
        }

        /**
         *
         * @param pitNumber
         * @private
         */
        private static _getOppositePitNumber(pitNumber:number):number {
            return ((GameState.PIT_COUNT - 1 ) - 1) - pitNumber;
        }

        /**
         *
         * @param pitNumber
         * @param turn
         * @returns {boolean}
         * @private
         */
        private static _moveInRange(pitNumber:number, turn:gameModule.Turn):boolean {

            var moveRange = turn === gameModule.Turn.player1Turn
                ? gameModule.GameState.getPlayer1MoveRange()
                : gameModule.GameState.getPlayer2MoveRange();

            return pitNumber >= moveRange.minPitNumber && pitNumber <= moveRange.maxPitNumber;
        }

        /**
         *
         * @param pitNumber
         * @param gameState
         * @returns {boolean}
         */
        public static moveIsValid(pitNumber:number, gameState:gameModule.GameState):boolean {

            var turn = gameState.getTurn();

            // Is the pitnumber valid for this player?
            if (!MoveService._moveInRange(pitNumber, turn)) {
                return false;
            }

            // Is the pit empty?
            if (gameState.getStoneCount(pitNumber) === 0) {
                return false;
            }

            return true;
        }

        /**
         *
         * @param turn
         * @param pitNumber
         * @returns {boolean}
         * @private
         */
        private static _isWrongStore(pitNumber:number, turn:gameModule.Turn):boolean {
            let otherTurn = turn === gameModule.Turn.player1Turn ? gameModule.Turn.player2Turn : gameModule.Turn.player1Turn;
            return pitNumber === MoveService._getStorePitNumberByTurn(otherTurn);
        }

        /**
         *
         * @param pitNumber
         * @returns {number}
         * @private
         */
        private static _normalizePitNumber(pitNumber:number):number {
            return pitNumber % gameModule.GameState.PIT_COUNT;
        }

        /**
         *
         * @param pitNumber
         * @returns {number}
         * @private
         */
        private static _incrPitNumber(pitNumber:number):number {
            return MoveService._normalizePitNumber(pitNumber + 1);
        }

        /**
         *
         * @param turn
         * @returns {number}
         * @private
         */
        private static _getStorePitNumberByTurn(turn:gameModule.Turn):number {

            return turn === gameModule.Turn.player1Turn
                ? GameState.getPlayer1StorePitNumber()
                : GameState.getPlayer2StorePitNumber()
        }

        /**
         *
         * @param pitNumber
         * @param turn
         * @returns {number}
         * @private
         */
        private static _getNextPitNumber(pitNumber:number, turn):number {

            let newPitNumber = MoveService._incrPitNumber(pitNumber);

            if (MoveService._isWrongStore(newPitNumber, turn)) {
                newPitNumber = MoveService._incrPitNumber(newPitNumber);
            }

            return newPitNumber;
        }
    }
}
