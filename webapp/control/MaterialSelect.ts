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
			query: { type: 'any', defaultValue: '' },
			/**
			 * The destination for changes of the control, attached with selectionChange event.
			 */
			fieldName: { type: 'string', defaultValue: '' },
			materials: { type: 'any', defaultValue: '' },
		},
		aggregations: {
			_select: { type: 'sap.m.Select', multiple: false, visibility: 'hidden' },
		},
		events: {
			selectionChange: {
				parameters: {
					data: { type: 'object' },
					index: { type: 'int' },
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
				change: this._onSelectionChange.bind(this),
			})
		);
	}

	_onSelectionChange(event: Select$ChangeEvent): void {
		console.log(event);
		const selectedItem = event.getParameter('selectedItem');
		if (!selectedItem) return;
		const data = selectedItem.getBindingContext('data')?.getObject();
		if (!data) return;
		const index = this.getProperty('fieldName');
		if (index === -1) throw new Error('fieldName is not set');
		this.fireSelectionChange({ data, index });
	}

	setQuery(query: string | undefined): this {
		this.setProperty('query', query, true);
		if (query) {
			(this.getAggregation('_select') as Select)?.bindItems(this._buildSelect(query));
		}
		return this;
	}

	setMaterials(materials: string | undefined): this {
		console.log(materials);
		this.setProperty('materials', materials, true);
		if (!materials) return this;
		const select = this.getAggregation('_select') as Select;
		select.bindItems({
			path: materials,
			templateShareable: true,
			template: new Item({
				key: '{ID}',
				text: '{Name} - Rarity: {Rarity}',
			}),
		});
		return this;
	}

	reset(): void {
		this.setQuery('');
		this.setMaterials('');
		(this.getAggregation('_select') as Select)?.removeAllItems();
	}

	_buildSelect(query: string) {
		return {
			path: 'data>/Materials',
			templateShareable: true,
			filters: [
				new Filter({
					path: 'Category',
					operator: FilterOperator.Contains,
					value1: query,
				}),
			],
			template: this._itemTemplate(),
		};
	}

	_itemTemplate() {
		return new Item({
			key: '{data>ID}',
			text: '{data>Name} - Rarity: {data>Rarity}',
		});
	}
}
