'use strict';

describe('driver.views.record: Embedded Map Controller', function () {

    beforeEach(module('driver.views.record'));

    var $compile;
    var $controller;
    var $httpBackend;
    var $rootScope;
    var $scope;

    var Controller;

    beforeEach(inject(function (_$compile_, _$controller_, _$httpBackend_, _$rootScope_) {
        $compile = _$compile_;
        $controller = _$controller_;
        $httpBackend = _$httpBackend_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;

        Element = $compile('<div class="map" leaflet-map driver-embed-map></div>')($scope);
        $rootScope.$apply();

        // find the controller by name
        Controller = Element.controller('driverEmbedMap');
    }));

    it('should have a map on the controller', function() {
        expect(Controller.map).toBeDefined();
    });

    it('should broadcast map click coordinates as [lng, lat]', function() {
        var lat = 11.3;
        var lng = 124.2;
        var latlng = L.latLng(lat, lng);

        spyOn($rootScope, '$broadcast').and.callThrough();
        Controller.map.fireEvent('click', {latlng: latlng});

        expect($rootScope.$broadcast).toHaveBeenCalled();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('driver.views.record:marker-moved',
                                                           [lng, lat]);
    });
});
