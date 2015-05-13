
(function () {
    'use strict';

    /* ngInject */
    function RTDetailAddController($log, $state, $stateParams, RecordSchemas, RecordTypes, Schemas) {
        var ctl = this;
        ctl.submitForm = submitForm;
        initialize();

        function initialize() {
            ctl.definition = Schemas.Object();
            RecordTypes.get({ id: $stateParams.uuid }).$promise.then(function (data) {
                ctl.recordType = data;
                ctl.currentSchema = RecordSchemas.get({ id: ctl.recordType.current_schema });
            });
        }

        function submitForm() {
            var key = ctl.definition.title;
            if (ctl.currentSchema.schema.definitions[key]) {
                $log.debug('Title', key, 'exists for current schema');
                return;
            }

            ctl.currentSchema.schema.definitions[key] = ctl.definition;
            RecordSchemas.create({
                schema: ctl.currentSchema.schema,
                record_type: ctl.recordType.uuid
            }, function (newSchema) {
                $log.debug(newSchema);
                $state.go('rt.detail', {uuid: ctl.recordType.uuid});
            }, function (error) {
                $log.debug('Error saving new schema: ', error);
            });
        }
    }

    /* ngInject */
    function RTDetailAdd() {
        var module = {
            restrict: 'E',
            templateUrl: 'scripts/views/recordtype/detail-add-edit-partial.html',
            controller: 'RTDetailAddController',
            controllerAs: 'rtDetail',
            bindToController: true
        };
        return module;
    }

    angular.module('ase.views.recordtype')
    .controller('RTDetailAddController', RTDetailAddController)
    .directive('aseRtDetailAdd', RTDetailAdd);

})();