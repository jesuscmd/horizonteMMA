
(function() {
  'use strict';
  angular.module('horizonteMMAModule')
  .controller('MapController', mapController);
  mapController.$inject = ['ModelService','$scope','MapService', 'NgMap'];
  function mapController(modelService,$scope, mapService,NgMap) {
    var ctrl = this;
    ctrl.userPoint;
    ctrl.originPoint;
    ctrl.centerCountry= {lat: 19.4326077, lng: -99.13320799999997};
    var map;
    NgMap.getMap().then(map => ctrl.map = map);

    var init = function(){
      ctrl.institutes =  modelService.getInstitutes();
      ctrl.institudeSelected = modelService.getInstitudeSelected();
      ctrl.filters = modelService.getFilters();
      ctrl.userPoint = mapService.getUserPoint();
      ctrl.originPoint = mapService.getOriginPoint();
      var pos = ctrl.centerCountry;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setPoint(pos);
        },
        function(error){
          console.log(error);
          setPoint(ctrl.centerCountry);
        });
      }

      $scope.$watch('ctrl.filters', function(newValue, oldValue) {
        refreshMarkers();
      },true);

    }

    var setPoint = function(point){
      mapService.setOriginPoint(point);
      mapService.setUserPoint(point);  
      modelService.calculateDistance();
    }

    ctrl.setUserPotition = function(){
      setPoint(ctrl.userPoint);
    }

    var refreshMarkers = function(){
      if(ctrl.map){
      ctrl.map.hideInfoWindow('infoinstitute');
       for (var key in ctrl.map.customMarkers) {
        var id = parseInt(key.replace("marker_",""));
        var ins = _.find(ctrl.institutes, function(o){return o.id == id} );
        if(ins){
          if(ins.showByDiscipline && ins.showByDistance && ins.showByLocation){
            ctrl.map.customMarkers[key].setMap(ctrl.map);
          }else{
            ctrl.map.customMarkers[key].setMap(null);
          }  
        }
        

      }; 
    }
  }

  ctrl.showInfoWindow = function(evt, index) {
    ctrl.ins = ctrl.institutes[index];
    ctrl.map.showInfoWindow('infoinstitute', 'marker_'+ctrl.ins.id);
  };
  init();

}

})();