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
			materials: { type: 'array', defaultValue: '' },
			materialId: { type: 'string', defaultValue: '' },
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
				change: this._onSelectionChange.bind(this),
				forceSelection: false,
			})
		);
	}

	_onSelectionChange(event: Select$ChangeEvent): void {
		console.log(event);
		const selectedItem = event.getParameter('selectedItem');
		if (!selectedItem) return;
		const data = selectedItem.getBindingContext('data')?.getObject();
		if (!data) return;
		const fieldName = this.getProperty('fieldName');
		if (fieldName === '') throw new Error('fieldName is not set');
		this.fireSelectionChange({ data, fieldName });
	}

	setQuery(query: string | undefined): this {
		this.setProperty('query', query, true);
		if (query) {
			const select = this.getAggregation('_select') as Select;
			select?.bindItems(this._buildSelect(query));
			select.setSelectedKey('');
		}
		return this;
	}

	setMaterialId(id: string | undefined): this {
		if (!id) return this;
		this.setProperty('materialId', id, true);
		(this.getAggregation('_select') as Select)
			.setForceSelection(true)
			.bindItems({
				path: `/Materials`,
				model: 'data',
				templateShareable: true,
				filters: [new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: id })],
				template: this._itemTemplate(),
				events: {
					dataReceived: () => {
						(this.getAggregation('_select') as Select)?.fireChange({
							selectedItem: (this.getAggregation('_select') as Select)?.getItems()[0],
						});
					},
				},
			})
			.setEditable(false);
		return this;
	}

	setMaterials(materials: Array<any> | undefined): this {
		this.setProperty('materials', materials, true);
		if (!materials) return this;
		const select = this.getAggregation('_select') as Select;
		select.bindItems({
			model: 'data',
			path: '/Materials',
			filters: materials.map((item) => new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: item.ID })),
			templateShareable: true,
			template: this._itemTemplate(),
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
