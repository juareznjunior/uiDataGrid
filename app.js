;(function(ng){

	'use strict';

	// uiDataGrid ng-controller
	ng.module('uiDataGridApp', ['uiDataGrid']).controller('dataGridController',function($scope){

		// callback
		// <button class="btn btn-default" ng-click="changeTitle($event)">Change Title</button>
		$scope.changeTitle = function() {

			// uiDataGrid $watch
			$scope.title = 'New Title '+(new Date()).getTime();
		}
		
		// callback
		// <button class="btn btn-default" ng-click="load($event)">load</button>
		$scope.load = function(ev) {

			// uiDataGrid $watch
			$scope.autoload = true;
			ng.element(ev.currentTarget).remove();
		}

		// callback scope
		// click-row
		var trCache;
		$scope.rowDetail = [];
		$scope.callback = function(row) {
			( trCache && trCache.removeClass('success') );
			trCache = angular.element(row).addClass('success');
			$scope.rowDetail = trCache.data('mapper-json');
			$scope.$apply();
		}
		
		// uiDataGrid settings
		$scope.title    = 'Scope Title';
		$scope.autoload = false;
		$scope.mapper   = [
			 {name:'id',title:'Id',width:80,align:'center'}
			,{name:'nome',title:'Nome',width:120}
			,{name:'empresa',title:'Empresa',width:200}
		];
		$scope.rows = [
			 {"id":"50010","nome":"Fulano de Tal","empresa":"Empresa 1"}
			,{"id":"50011","nome":"Beltrano da Silva","empresa":"Empresa 2"}
			,{"id":"50012","nome":"Beltrano da Silva","empresa":"Empresa do tal"}
			,{"id":"50013","nome":"Beltrano da Silva","empresa":"Empresa 123122"}
			,{"id":"50014","nome":"Beltrano da Silva","empresa":"Empresa 2"}
			,{"id":"50015","nome":"Beltrano da Silva","empresa":"Empresa 3312"}
			,{"id":"50016","nome":"Beltrano da Silva","empresa":"Empresa 312"}
			,{"id":"50017","nome":"Beltrano da Silva","empresa":"Empresa 3123122"}
			,{"id":"50018","nome":"Fulano de Tal","empresa":"Empresa 221"}
			,{"id":"50019","nome":"Beltrano da Silva","empresa":"Empresa 2"}
		];	
	});

}(angular));