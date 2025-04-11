import ComboBox, { ComboBox$SelectionChangeEvent } from 'sap/m/ComboBox';
import { AggregationBindingInfo } from 'sap/ui/base/ManagedObject';
import Control from 'sap/ui/core/Control';
import { MetadataOptions } from 'sap/ui/core/Element';
import EventBus from 'sap/ui/core/EventBus';
import Item from 'sap/ui/core/Item';
import RenderManager from 'sap/ui/core/RenderManager';
import Filter from 'sap/ui/model/Filter';
import Sorter from 'sap/ui/model/Sorter';

/**
 * @extends sap.ui.core.Control
 *
 *
 * @name rf.calculator.control.MaterialComboBox
 */
export default class MaterialComboBox extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			items: { type: 'any', defaultValue: '' },

			selectedItem: { type: 'any', defaultValue: null },
		},
		aggregations: {
			_select: { type: 'sap.m.Select', multiple: false, visibility: 'hidden' },
			_comboBox: { type: 'sap.m.ComboBox', multiple: false, visibility: 'hidden' },
		},
		events: {
			selectionChange: {
				parameters: {
					data: { type: 'object' },
				},
			},
		},
	};

	renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, control: MaterialComboBox) => {
			rm.openStart('div', control);
			rm.openEnd();
			rm.renderControl(control.getAggregation('_comboBox') as any);
			rm.close('div');
		},
	};

	init(): void | undefined {
		this.setAggregation(
			'_comboBox',
			new ComboBox({
				selectionChange: (event: ComboBox$SelectionChangeEvent) => {
					const selectedItem = event.getParameter('selectedItem'),
						data = selectedItem?.getBindingContext('local')?.getObject();
					if (!selectedItem || !data) return;
					this.setProperty('selectedItem', data, true);
					EventBus.getInstance().publish('calculator', 'updateResults', {
						path: this.getBindingContext()?.getPath(),
					});
					// this.fireSelectionChange({ data });
				},
			})
		);

		this._buildComboBox();
	}

	setItems(items: any): this {
		this.setProperty('items', items, true);
		this._buildComboBox();
		return this;
	}

	reset(): void {
		this.setItems('');
		(this.getAggregation('_comboBox') as ComboBox)?.removeAllItems();
	}

	_buildComboBox() {
		const items = this.getProperty('items');
		const comboBox = this.getAggregation('_comboBox') as ComboBox;
		if (!items) return;

		const sorter = new Sorter({ path: items.sorter.path, descending: items.sorter.descending });
		const filter = items.filters[0];
		const filters = [];
		if (filter) {
			filters.push(new Filter({ path: filter.path, operator: filter.operator, value1: filter.value1 }));
		}
		const binding: AggregationBindingInfo = {
			model: 'local',
			path: '/Materials',
			filters: filters,
			sorter: sorter,
			templateShareable: true,
			template: new Item({
				key: '{local>ID}',
				text: '{local>Name} - Rarity: {local>Rarity} | {local>StatJoin}',
			}),
		};
		if (items.filters[0]?.path === 'ID')
			binding.events = {
				change: async () => {
					const selectedItem = comboBox.getItems()[0];
					comboBox.setSelectedItem(selectedItem);
					comboBox.fireSelectionChange({
						selectedItem,
					});
				},
			};
		if (items.length) binding.length = items.length;
		comboBox.bindAggregation('items', binding).setEditable(items.editable);
	}
}
