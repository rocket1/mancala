module boardModule {

    export function ClickPitDirective() {

        return {
            restrict: 'A',
            scope: {
                'clickPit': '='
            },
            bindToController: true,
            controller: PitController
        }
    }

    export class PitController {

        private clickPit:number;

        /**
         * @ngInject
         */
        constructor($scope:ng.IScope, $element:ng.IRootElementService) {
            $element.bind('click', (e:Event) => {
                e.preventDefault();
                $scope.$emit('clickPit', this.clickPit)
            })
        }
    }
}
