;(function(ng){

	'use strict';

	var
		globalMapper   = [
			 {name:'id',title:'Id',width:80,align:'center'}
			,{name:'nome',title:'Nome',width:120}
			,{name:'empresa',title:'Empresa',width:200}
		]
		,globalRows = [
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

	ng.module('uiDataGridApp', ['uiDataGrid'])
		.controller('dataGridController1',function($scope){
			// callback
			// <button class="btn btn-default" ng-click="changeTitle()">Change Title</button>
			$scope.changeTitle = function() {
				$scope.datagrid.setTitle('New Title '+(new Date()).getTime());
			}

			$scope.rowDetail = [];

			var dg = $scope.$watch('datagrid',function(n,v){
				if ( undefined !== n ) {
					var trCache;
					$scope.datagrid.config({
						 columns: globalMapper
						,rows: globalRows
						,autoload: false
						,buttons: [{
							 label: 'Load'
							,click: function(btn) {
								this.load();
								ng.element(btn).addClass('disabled');
							}
						}]
						,clickRow: function() {
							( trCache && trCache.removeClass('success') );
							trCache = angular.element(this).addClass('success');
							$scope.rowDetail = trCache.data('mapper-json');
							$scope.$apply();
						}
					});

					dg();
				}
			});
		});
}(angular));