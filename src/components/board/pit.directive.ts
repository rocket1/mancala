module boardModule {

    export function PitDirective() {

        return {
            restrict: 'E',
            templateUrl: 'components/board/pit.html',
            scope: {
                'stoneCount': '=',
                'pitNumber': '=?'
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
        constructor() {}

        /**
         *
         * @returns {number}
         */
        public getStoneCount():number {
            return this.stoneCount;
        }

        /**
         * Crappy util hack to get numerical repeat in Angular.
         * @param num
         * @returns {any[]}
         */
        public getNumber(num:number):Array<number> {
            return new Array(num);
        }
    }
}
