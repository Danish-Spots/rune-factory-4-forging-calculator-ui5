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

	constructor(mSettings?: any) {
		super(mSettings);
		this.setProperty('items', mSettings?.items || '', true);
		this.setProperty('selectedItem', mSettings?.selectedItem || null, true);
	}

	init(): void | undefined {
		this.setAggregation(
			'_comboBox',
			new ComboBox({
				selectionChange: (event: ComboBox$SelectionChangeEvent) => {
					const selectedItem = event.getParameter('selectedItem'),
						data = selectedItem?.getBindingContext('data')?.getObject();
					if (!selectedItem || !data) return;
					this.setProperty('selectedItem', data, true);
					this.fireSelectionChange({ data });
				},
			})
		);

		this._buildComboBox();
	}

	setItems(items: string | undefined): this {
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
		comboBox.setSelectedKey('');
		comboBox.removeAllItems();
		let binding: Omit<AggregationBindingInfo, 'path'>,
			editable: boolean = true;
		if (!items) {
			binding = {
				sorter: [new Sorter({ path: 'Rarity', descending: true })],
				length: 250,
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
		else {
			binding = {
				filters: [new Filter({ path: 'ID', operator: FilterOperator.EQ, value1: items })],
				events: {
					dataReceived: () => {
						const comboBox = this.getAggregation('_comboBox') as ComboBox;
						if (!comboBox) return;
						const selectedItem = comboBox.getItems()[0];
						comboBox.setSelectedItem(selectedItem);
						comboBox.fireSelectionChange({
							selectedItem,
						});
					},
				},
			};
			editable = false;
		}

		comboBox
			.bindItems(
				Object.assign(
					{
						model: 'data',
						path: '/Materials',
						templateShareable: true,
						template: new Item({
							key: '{data>ID}',
							text: '{data>Name} - Rarity: {data>Rarity} | {data>StatJoin}',
						}),
					},
					binding
				)
			)
			.setEditable(editable);
	}
}
