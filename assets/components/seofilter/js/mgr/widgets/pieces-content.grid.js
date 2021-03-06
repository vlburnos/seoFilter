seoFilter.grid.PiecesContent = function (config) {
	config = config || {};
	if (!config.id) {
		config.id = 'seofilter-grid-pieces-content';
	}
	Ext.applyIf(config, {
		url: seoFilter.config.connector_url,
		fields: this.getFields(config),
		columns: this.getColumns(config),
		tbar: this.getTopBar(config),
		sm: new Ext.grid.CheckboxSelectionModel(),
		baseParams: {
			action: 'mgr/piece-content/getlist'
		},
		listeners: {
			rowDblClick: function (grid, rowIndex, e) {
				var row = grid.store.getAt(rowIndex);
				this.updatePieceContent(grid, e, row);
			}
		},
		viewConfig: {
			forceFit: true,
			enableRowBody: true,
			autoFill: true,
			showPreview: true,
			scrollOffset: 0,
			getRowClass: function (rec, ri, p) {
				return ''; //!rec.data.alias ? 'seofilter-grid-row-disabled' : '';
			}
		},
		paging: true,
		remoteSort: true,
		autoHeight: true
	});
    seoFilter.grid.PiecesContent.superclass.constructor.call(this, config);

	// Clear selection on grid refresh
	this.store.on('load', function () {
		if (this._getSelectedIds().length) {
			this.getSelectionModel().clearSelections();
		}
	}, this);
};
Ext.extend(seoFilter.grid.PiecesContent, MODx.grid.Grid, {
	windows: {},

	getMenu: function (grid, rowIndex) {
		var ids = this._getSelectedIds();

		var row = grid.getStore().getAt(rowIndex);
		var menu = seoFilter.utils.getMenu(row.data['actions'], this, ids);

		this.addContextMenuItem(menu);
	},

	createPieceContent: function (btn, e) {
		var w = MODx.load({
			xtype: 'seofilter-piece-content-window-create',
			id: Ext.id(),
			listeners: {
				success: {
					fn: function () {
						this.refresh();
					}, scope: this
				}
			}
		});
        var defaultValues = {
            pagetitle: 'A',
            text1: 'A',
            text2: 'A',
            title: 'A',
            keywords: 'A',
            description: 'A'
        };
        var gridContentFilter = this.getStore().baseParams.filter;
        if(typeof gridContentFilter != 'undefined') {
            defaultValues.resource_id = gridContentFilter;
        }
        w.reset();
		w.setValues(defaultValues);
		w.show(e.target);
	},

	updatePieceContent: function (btn, e, row) {
		if (typeof(row) != 'undefined') {
			this.menu.record = row.data;
		}
		else if (!this.menu.record) {
			return false;
		}
		var id = this.menu.record.id;

		MODx.Ajax.request({
			url: this.config.url,
			params: {
				action: 'mgr/piece-content/get',
				id: id
			},
			listeners: {
				success: {
					fn: function (r) {
						var w = MODx.load({
							xtype: 'seofilter-piece-content-window-update',
							id: Ext.id(),
							record: r,
							listeners: {
								success: {
									fn: function () {
										this.refresh();
									}, scope: this
								}
							}
						});
						w.reset();
						w.setValues(r.object);
						w.show(e.target);
					}, scope: this
				}
			}
		});
	},

	removePieceContent: function (act, btn, e) {
		var ids = this._getSelectedIds();
		if (!ids.length) {
			return false;
		}
		MODx.msg.confirm({
			title: ids.length > 1
				? _('seofilter_piece_content_remove')
				: _('seofilter_piece_content_remove'),
			text: ids.length > 1
				? _('seofilter_pieces_content_remove_confirm')
				: _('seofilter_piece_content_remove_confirm'),
			url: this.config.url,
			params: {
				action: 'mgr/piece-content/remove',
				ids: Ext.util.JSON.encode(ids)
			},
			listeners: {
				success: {
					fn: function (r) {
						this.refresh();
					}, scope: this
				}
			}
		});
		return true;
	},

	getFields: function (config) {
		return ['id', 'resource', 'resource_id', 'alias', 'pagetitle', /*'title', 'keywords', 'description', 'text1', 'text2',*/ 'actions'];
	},

	getColumns: function (config) {
		return [/*{
			header: _('seofilter_piece_id'),
			dataIndex: 'id',
			sortable: true,
			width: 50
		}, {
			header: _('seofilter_piece_content_resource_id'),
			dataIndex: 'resource_id',
			sortable: true,
			width: 50
		},*/ {
            header: _('seofilter_piece_content_resource'),
            dataIndex: 'resource',
            sortable: true,
            width: 150
        },
            {
            header: _('seofilter_piece_content_alias'),
            dataIndex: 'alias',
            sortable: true,
            width: 150
        }, {
            header: _('seofilter_piece_content_pagetitle'),
            dataIndex: 'pagetitle',
            sortable: true,
            width: 150
        },/* {
            header: _('seofilter_piece_content_title'),
            dataIndex: 'title',
            sortable: true,
            width: 150
        }, {
            header: _('seofilter_piece_content_keywords'),
            dataIndex: 'keywords',
            sortable: true,
            width: 150
        }, {
            header: _('seofilter_piece_content_description'),
            dataIndex: 'description',
            sortable: true,
            width: 150
        }, {
            header: _('seofilter_piece_content_text1'),
            dataIndex: 'text1',
            sortable: false,
            width: 150
        }, {
            header: _('seofilter_piece_content_text2'),
            dataIndex: 'text2',
            sortable: false,
            width: 150
        },*/ {
			header: _('seofilter_grid_actions'),
			dataIndex: 'actions',
			renderer: seoFilter.utils.renderActions,
			sortable: false,
			width: 80,
			id: 'actions'
		}];
	},

	getTopBar: function (config) {
		return [{
			text: '<i class="icon icon-plus"></i>&nbsp;' + _('seofilter_piece_content_create'),
			handler: this.createPieceContent,
			scope: this
		}, '->',{
            xtype: 'seofilter-combo-category',
            name: 'filter',
            width: 200,
            id: config.id + '-filter-field',
            emptyText: _('seofilter_grid_filter'),
            listeners: {
                select: {
                    fn: function (tf) { this._doFilter(tf); },
                    scope: this
                }
            }
        }, {
			xtype: 'textfield',
			name: 'query',
			width: 200,
			id: config.id + '-search-field',
			emptyText: _('seofilter_grid_search'),
			listeners: {
				render: {
					fn: function (tf) {
						tf.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
							this._doSearch(tf);
						}, this);
					}, scope: this
				}
			}
		}, {
			xtype: 'button',
			id: config.id + '-search-clear',
			text: '<i class="icon icon-times"></i>',
			listeners: {
				click: {fn: this._clearSearch, scope: this}
			}
		}];
	},

	onClick: function (e) {
		var elem = e.getTarget();
		if (elem.nodeName == 'BUTTON') {
			var row = this.getSelectionModel().getSelected();
			if (typeof(row) != 'undefined') {
				var action = elem.getAttribute('action');
				if (action == 'showMenu') {
					var ri = this.getStore().find('id', row.id);
					return this._showMenu(this, ri, e);
				}
				else if (typeof this[action] === 'function') {
					this.menu.record = row.data;
					return this[action](this, e);
				}
			}
		}
		return this.processEvent('click', e);
	},

	_getSelectedIds: function () {
		var ids = [];
		var selected = this.getSelectionModel().getSelections();

		for (var i in selected) {
			if (!selected.hasOwnProperty(i)) {
				continue;
			}
			ids.push(selected[i]['id']);
		}

		return ids;
	},

    _doFilter: function (tf, nv, ov) {
        this.getStore().baseParams.filter = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },
	_doSearch: function (tf, nv, ov) {
		this.getStore().baseParams.query = tf.getValue();
		this.getBottomToolbar().changePage(1);
		this.refresh();
	},

	_clearSearch: function (btn, e) {
		this.getStore().baseParams.filter = '';
        this.getStore().baseParams.query = '';
		Ext.getCmp(this.config.id + '-filter-field').setValue('');
        Ext.getCmp(this.config.id + '-search-field').setValue('');
		this.getBottomToolbar().changePage(1);
		this.refresh();
	}
});
Ext.reg('seofilter-grid-pieces-content', seoFilter.grid.PiecesContent);
