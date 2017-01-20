module gameModule {

    export class MoveService {

        public getMoveFrames(pitNumber:number, gameState:gameModule.GameState):Array<gameModule.GameState> {

            let stoneCount = gameState.getStoneCount(pitNumber);
            let turn = gameState.getTurn();
            let firstFrame = angular.copy(gameState);
            let frames = [];

            firstFrame.clear(pitNumber);
            frames.push(firstFrame);

            for (let i = 1; i <= stoneCount; ++i) {
                let newFrame = angular.copy(frames[i - 1]);
                pitNumber = MoveService._getNextPitNumber(pitNumber, turn);
                newFrame.incrStoneCount(pitNumber);
                frames.push(newFrame);
            }

            return frames;
        }

        /**
         *
         * @param turn
         * @param pitNumber
         * @returns {boolean}
         * @private
         */
        private static _isWrongStore(pitNumber:number, turn:gameModule.Turn):boolean {
            if (turn === gameModule.Turn.player1Turn && pitNumber === GameState.getPlayer2StorePitNumber()) {
                return true;
            }
            else if (turn === gameModule.Turn.player2Turn && pitNumber === GameState.getPlayer1StorePitNumber()) {
                return true;
            }

            return false
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
