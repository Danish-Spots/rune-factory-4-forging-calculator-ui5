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
 * @name rf.calculator.control.MaterialSelect
 */
export default class MaterialSelect extends Control {
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
		render: (rm: RenderManager, control: MaterialSelect) => {
			rm.openStart('div', control);
			rm.openEnd();
			rm.renderControl(control.getAggregation('_select') as any);
			rm.close('div');
		},
	};

	init(): void | undefined {
		this.setAggregation(
			'_select',
			new Select({
				forceSelection: false,
				change: this._onSelectionChange.bind(this),
			})
		);
	}

	_onSelectionChange(event: Select$ChangeEvent): void {
		const selectedItem = event.getParameter('selectedItem'),
			data = selectedItem?.getBindingContext('data')?.getObject();
		if (!selectedItem || !data) return;
		this.setProperty('selectedItem', data, true);
	}

	setFieldName(fieldName: string): this {
		this.setProperty('fieldName', fieldName, true);
		return this;
	}

	setItems(items: string | Array<any> | undefined): this {
		this.setProperty('items', items, true);
		// Set to empty when no items and fire change event
		if (!items) return this;
		let binding;
		if (Array.isArray(items)) {
			binding = {
				filters: items.map((item) => new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: item.ID })),
			};
		} else if (isNaN(parseInt(items)))
			binding = {
				filters: [
					new Filter({
						path: 'Category',
						operator: FilterOperator.Contains,
						value1: items,
					}),
				],
			};
		else
			binding = {
				filters: [new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: items })],
				events: {
					dataReceived: () => {
						(this.getAggregation('_select') as Select)?.fireChange({
							selectedItem: (this.getAggregation('_select') as Select)?.getItems()[0],
						});
					},
				},
			};
		this._buildSelect(binding, 'events' in binding, !('events' in binding));
		return this;
	}

	reset(): void {
		this.setItems('');
		(this.getAggregation('_select') as Select)?.removeAllItems();
	}

	_buildSelect(binding: Omit<AggregationBindingInfo, 'path'>, forceSelection: boolean, editable: boolean) {
		const select = this.getAggregation('_select') as Select;
		select.setSelectedKey('');
		select.removeAllItems();
		select
			.setForceSelection(forceSelection)
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
