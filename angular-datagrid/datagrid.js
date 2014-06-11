/**
 * [description]
 * @param  {[type]} ng [description]
 * @return {[type]}    [description]
 *
 * Beta
 */
;(function(ng){

	'use strict';

	var uiDataGrid = function(options) {

		options = {
			 title  : options.title || 'DataGrid Title'
			,height : Number(options.height.replace(/[^0-9.]/,'')) || 200
			,element: options.element
		};

		// title
		this.elementTitle = options.element.children().eq(0).text( options.title );
		
		// helpers
		var uiDataGridTables  = [].slice.call(options.element[0].getElementsByTagName('table'))
			,contentScroll     = uiDataGridTables.shift().parentNode.parentNode
			,tableHeaderChilds = ng.element(uiDataGridTables[0]).children()
			,tableGridLayout   = ng.element(uiDataGridTables[1]).children()
			,tableBodyChilds   = ng.element(uiDataGridTables[2]).children()
			,scrollHeight      = [options.height,'px'].join('');
			
		// grid layout
		this.uiDataGridColGroupLayout = ng.element(tableGridLayout[0]);
		this.uiDataGridTbodyLayout    = ng.element(tableGridLayout[1]);
		
		// header
		this.uiDataGridColGroupHeader = ng.element(tableHeaderChilds[0]);
		this.uiDataGridTheadHeader    = ng.element(tableHeaderChilds[1]);
		
		// body
		this.uiDataGridColGroupBody = ng.element(tableBodyChilds[0]);
		this.uiDataGridTheadBody    = ng.element(tableBodyChilds[1]);
		this.uiDataGridTbody        = ng.element(tableBodyChilds[2]);

		// tools
		this.uiDataGridTools = ng.element(uiDataGridTables[3].tBodies[0].rows[0].cells);

		// scroll height
		ng.element(uiDataGridTables[2].parentNode).css({'height':scrollHeight});
		
		// clean helpers
		uiDataGridTables = tableHeaderChilds = tableBodyChilds = options = null;

		// options
		this.options = {
			 title   : 'DataGrid Title'
			,columns : []
			,clickRow: false
			,autoload: true
			,buttons : [] 
		};
	};

	uiDataGrid.prototype = {
		config: function(options) {

			this.options = ng.extend({},this.options,options || {});

			if ( ng.isFunction(this.options.clickRow) ) {
				this.uiDataGridTbody.data('udg-callback',this.options.clickRow).on('click',function(e){
					ng.element(e.currentTarget).data('udg-callback').call(e.target.parentNode);
				});
			}

			createColumns.call(this);
			createToolBarButtons.call(this);
		}
		,setTitle : function(title) {
			this.elementTitle.text(title);
		}
		,load: function() {
			this.options.autoload = true;
			createRows.call(this);
		}
	}

	// private
	var 
		createColumns = function() {
			
			var  auxTh
				,auxCol
				,obj
				,title
				,len = this.options.columns.length
				,i  = 0
				,sw = 0
				,al = 'ui-datagrid-align-'
				,ch = 'ui-datagrid-column-hide'
				,colTpl = '<col></col>'
				,thTpl  = '<th class="ui-widget ui-state-default"></th>'
				,tdTpl  = '<td class="ui-widget ui-widget-content"></td>'
				,tr1 = ng.element(this.uiDataGridTbodyLayout[0].rows[0]).empty()
				,tr2 = ng.element(this.uiDataGridTheadHeader[0].rows[0]).empty()
				,tr3 = ng.element(this.uiDataGridTheadBody[0].rows[0]).empty();

			/**
			 * Aux Function
			 *
			 * @contect uiDataGrid
			 * @param  Object tdTpl
			 * @param  Object auxCol
			 * @return void
			 */
			var appendElements = function(auxTh,auxCol) {

				// cols
				this.uiDataGridColGroupLayout.append(auxCol);
				this.uiDataGridColGroupHeader.append(auxCol.clone());
				this.uiDataGridColGroupBody.append(auxCol.clone());

				// header
				tr2.append(auxTh);

				// body
				tr3.append(auxTh.clone());
			}

			// enable row number
			if ( this.options.rowNumber ) {

				auxTh  = ng.element(thTpl).addClass('ui-state-default ui-datagrid-cell-rownumber');
				auxCol = ng.element(colTpl);

				appendElements.call(this,auxTh,auxCol);

				// grid layout
				tr1.append(ng.element('<td class="ui-widget ui-widget-content ui-datagrid-cell-rownumber"></td>'));

				sw = 20;
			}
			
			for (; obj = this.options.columns[i]; i += 1) {
			
				auxTh = ng.element(thTpl).text(obj.title || obj.name).addClass(al+(( /left|right|center/.test(obj.align) ) ? obj.align : 'left'));
				auxCol = ng.element(colTpl);
				if ( (i+1) < len ) {
					auxCol.css({"width":obj.width+'px'});
				}
				
				appendElements.call(this,auxTh,auxCol);

				// grid layout
				tr1.append(ng.element(tdTpl));
				
				sw += obj.width || 0;
			}
			
			appendElements = null;
			tr1 = tr2 = tr3 = null;
			auxTh = auxCol = null;
			
			this.uiDataGridTheadBody.addClass('ng-hide');

			( true === this.options.autoload && this.load() );
		}
		,createRows = function() {

			if ( false === this.options.autoload ) {
				return;
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
			
			for (; data = this.options.rows[i]; i += 1) {
				row = oTbody.insertRow(-1);
				ng.element(row).data('mapper-json',data);
				
				// row number
				if ( this.options.rowNumber ) {
					ng.element(row.insertCell(-1)).addClass('ui-state-default ui-datagrid-cell-rownumber ui-datagrid-align-center').text((i+1));
				}

				j = 0;
				for (; json = this.options.columns[j]; j += 1) {
					cell = row.insertCell(-1);
					ng.element(cell).addClass(cls +' '+ theadThs[cell.cellIndex].className.split(' ').slice(-1)).html(data[json.name]);
				}
			}
			
			data = row = json = cell = theadThs = oTbody = null;
		}
		,createToolBarButtons = function() {

			if ( ng.isArray( this.options.buttons ) ) {

				// cell to append btns
				var obj
					,btn
					,self = this
					,cell = ng.element(this.uiDataGridTools[0])
					,idx  = 0;

				// each button
				for (; obj = this.options.buttons[idx]; idx += 1) {

					var btn = ng.element('<button type="button"></button>');

					obj.text  = obj.label || obj.text;
					obj.click = obj.fn || obj.click;

					delete obj.fn;
					delete obj.label;

					if ( ng.isFunction(obj.click) ) {
						btn.data('udg-callback',obj.click).on('click',function(e){
							ng.element(e.currentTarget).data('udg-callback').call(self,e.currentTarget);
						});
					}

					btn.text(obj.text).addClass('btn btn-default');

					cell.append(btn[0]);
				}

				cell = btn = null;
			}
		};

	ng.module('uiDataGrid', [])
		.directive('uiDatagrid', function factory() {
			return {
				 restrict: 'EA'
				,templateUrl:'angular-datagrid/template/datagrid.html'
				,replace:true
				,compile: function($scope,$attrs) {
					return function($scope,$element,$attrs){
						$scope.datagrid = new uiDataGrid({
							 element: $element
							,height: $attrs.height || '200'
							,title: $attrs.title
						});

						uiDataGrid = null;
					}
				}
			};
		});
}(angular));