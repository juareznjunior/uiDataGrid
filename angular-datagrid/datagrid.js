;(function(ng){

	var  ngElem = function(elem) { return ng.element(elem); }
		,fireWatch = function() {}
		,watchers = function() {
			var self = this;
			
			this.$scope.$watch('title',function(n,o){
				if ( n !== o ) {
					self.$title.text(n);
				}
			});
			
			if ( false === this.$scope.autoload ) {
				this.$scope.$watch('autoload',function(n){
					if ( true === n ) {
						self.createRows();
						fireWatch();
					}
				});
			}
		}

	var uiDataGrid = function($scope,$element,$attrs) {
	
		this.$scope   = $scope;
		this.$element = $element;
		this.$title   = $element.children().eq(0);
		
		// helpers
		var uiDataGridTables = [].slice.call($element[0].getElementsByTagName('table'))
			,contentScroll   = uiDataGridTables.shift().parentNode.parentNode
			,tableHeaderChilds = ngElem(uiDataGridTables[0]).children()
			,tableGridLayout = ngElem(uiDataGridTables[1]).children()
			,tableBodyChilds = ngElem(uiDataGridTables[2]).children();
			
		// grid layout
		this.uiDataGridColGroupLayout = ngElem(tableGridLayout[0]);
		this.uiDataGridTbodyLayout = ngElem(tableGridLayout[1]);
		
		// header
		this.uiDataGridColGroupHeader = ngElem(tableHeaderChilds[0]);
		this.uiDataGridTheadHeader = ngElem(tableHeaderChilds[1]);
		
		// body
		this.uiDataGridColGroupBody = ngElem(tableBodyChilds[0]);
		this.uiDataGridTheadBody = ngElem(tableBodyChilds[1]);
		this.uiDataGridTbody = ngElem(tableBodyChilds[2]);
		
		// clean helpers
		uiDataGridTables = tableHeaderChilds = tableBodyChilds = null;
		
		watchers.call(this);
		
		this.createColumns();

	}
	uiDataGrid.prototype = {
		createColumns: function() {
		
			if ( undefined === this.$scope.columns ) {
				return this;
			}
			
			var  auxTh
				,auxCol
				,obj
				,title
				,i  = 0
				,sw = 0
				,al = 'ui-datagrid-align-'
				,ch = 'ui-datagrid-column-hide'
				,colTpl = '<col></col>'
				,thTpl  = '<th class="ui-widget ui-state-default"></th>'
				,tdTpl  = '<td class="ui-widget ui-widget-content"></td>'
				,tr1 = ngElem(this.uiDataGridTbodyLayout[0].rows[0]).empty()
				,tr2 = ngElem(this.uiDataGridTheadHeader[0].rows[0]).empty()
				,tr3 = ngElem(this.uiDataGridTheadBody[0].rows[0]).empty();
			
			for (; obj = this.$scope.columns[i]; i += 1) {
			
				auxTh = ngElem(thTpl).text(obj.title || obj.name).addClass(al+(( /left|right|center/.test(obj.align) ) ? obj.align : 'left'));
				auxCol = ngElem(colTpl).css({"width":obj.width+'px'});
				
				this.uiDataGridColGroupLayout.append(auxCol);
				this.uiDataGridColGroupHeader.append(auxCol.clone());
				this.uiDataGridColGroupBody.append(auxCol.clone());
				
				tr1.append(ngElem(tdTpl));
				tr2.append(auxTh);
				tr3.append(auxTh.clone());
				
				sw += obj.width || 0;
			}
			
			tr1 = tr2 = tr3 = null;
			auxTh = auxCol = null;
			
			this.uiDataGridTheadBody.addClass('ng-hide');
			
			return this;
		}
		,createRows: function() {
			if ( undefined === this.$scope.rows ) {
				return this;
			}
			
			var  i = 0
				,j = 0
				,cls = 'ui-widget ui-widget-content'
				,data
				,row
				,json
				,cell
				,theadThs = this.uiDataGridTheadHeader[0].rows[0].cells
				,oTbody = this.uiDataGridTbody.empty()[0];
			
			for (; data = this.$scope.rows[i]; i += 1) {
				row = oTbody.insertRow(-1);
				j = 0;
				for (; json = this.$scope.columns[j]; j += 1) {
					cell = row.insertCell(-1);
					ngElem(cell).addClass(cls +' '+ theadThs[cell.cellIndex].className.split(' ').slice(-1)).html(data[json.name]);
				}
			}
			
			data = row = json = cell = theadThs = oTbody = null;
			
			return this;
		}
	}

	ng.module('uiDataGrid', [])
		.directive('uidatagrid', function factory() {
			return {
				 restrict: 'EA'
				,templateUrl:'angular-datagrid/template/datagrid.html'
				,replace:true
				,scope: {
					 columns:"="
					,rows:"="
					,autoload:"="
					,title:"="
				}
				,compile: function($element,$attr) {
					return function($scope,$element,$attrs) {
						$scope.uiDataGrid = new uiDataGrid($scope,$element);
					}
				}
			};
		});
}(angular));