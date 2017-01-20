module gameModule {

    export class MoveService {

        public getMoveFrames(pitNumber:number, gameState:gameModule.GameState):Array<gameModule.GameState> {

            let stoneCount = gameState.getStoneCount(pitNumber);

            let firstFrame = angular.copy(gameState);
            let frames = [];
            firstFrame.clear(pitNumber);
            frames.push(firstFrame);

            for (let i = 1; i <= stoneCount; ++i) {
                let lastFrame = frames[i - 1];
                let newFrame = angular.copy(lastFrame);
                pitNumber = (pitNumber + 1) % gameModule.GameState.PIT_COUNT;
                newFrame.incrStoneCount(pitNumber);
                frames.push(newFrame);
            }

            return frames;
        }
    }
}
