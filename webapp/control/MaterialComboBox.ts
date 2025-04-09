import ComboBox, { ComboBox$SelectionChangeEvent } from 'sap/m/ComboBox';
import Select, { Select$ChangeEvent } from 'sap/m/Select';
import Event from 'sap/ui/base/Event';
import { AggregationBindingInfo } from 'sap/ui/base/ManagedObject';
import Control from 'sap/ui/core/Control';
import { MetadataOptions } from 'sap/ui/core/Element';
import ElementMetadata from 'sap/ui/core/ElementMetadata';
import Item from 'sap/ui/core/Item';
import RenderManager from 'sap/ui/core/RenderManager';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

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
			/**
			 * The destination for changes of the control, attached with selectionChange event.
			 */
			fieldName: { type: 'string', defaultValue: '' },
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
					fieldName: { type: 'string' },
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
						data = selectedItem?.getBindingContext('data')?.getObject();
					if (!selectedItem || !data) return;
					this.setProperty('selectedItem', data, true);
					this.fireSelectionChange({ data, fieldName: this.getFieldName() });
				},
			})
		);
	}

	setItems(items: string | Array<any> | undefined): this {
		this.setProperty('items', items, true);
		// Set to empty when no items and fire change event
		if (!items) {
			this._buildEmptyComboBox();
			return this;
		}
		let filters, events;
		if (Array.isArray(items)) {
			filters = items.map((item) => new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: item.ID }));
		} else if (isNaN(parseInt(items)))
			filters = [
				new Filter({
					path: 'Category',
					operator: FilterOperator.Contains,
					value1: items,
				}),
			];
		else {
			filters = [new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: items })];
			events = {
				dataReceived: () => {
					const comboBox = this.getAggregation('_comboBox') as ComboBox;
					if (!comboBox) return;
					const selectedItem = comboBox.getItems()[0];
					comboBox.setSelectedItem(selectedItem);
					comboBox.fireSelectionChange({
						selectedItem,
					});
				},
			};
		}

		this._buildComboBox({ filters, events: events ?? {} }, !events);
		return this;
	}

	reset(): void {
		this.setItems('');
		(this.getAggregation('_comboBox') as ComboBox)?.removeAllItems();
	}

	_buildEmptyComboBox() {
		const comboBox = this.getAggregation('_comboBox') as ComboBox;
		comboBox.setSelectedKey('');
		comboBox.removeAllItems();
		comboBox.setEditable(true);
	}

	_buildComboBox(binding: Omit<AggregationBindingInfo, 'path'>, editable: boolean) {
		const comboBox = this.getAggregation('_comboBox') as ComboBox;
		comboBox.setSelectedKey('');
		comboBox.removeAllItems();
		comboBox
			.bindItems(
				Object.assign(
					{
						model: 'data',
						path: '/Materials',
						templateShareable: true,
						template: this._itemTemplate(),
					},
					binding
				)
			)
			.setEditable(editable);
	}

	_itemTemplate() {
		return new Item({
			key: '{data>ID}',
			text: '{data>Name} - Rarity: {data>Rarity}',
		});
	}
}
