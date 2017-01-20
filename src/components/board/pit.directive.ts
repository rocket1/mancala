module boardModule {

    export function PitDirective() {

        return {
            restrict: 'E',
            templateUrl: 'components/board/pit.html',
            scope: {
                'stoneCount': '=?'
            },
            bindToController: true,
            controller: PitController,
            controllerAs: 'pitCtrl',
            replace: true
        }
    }

    export class PitController {

        private stoneCount:number;

        /**
         * @ngInject
         */
        constructor($scope:ng.IScope) {}

        public getStoneCount():number {
            return this.stoneCount;
        }
    }
}
