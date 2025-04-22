import Column from 'sap/m/Column';
import ColumnListItem from 'sap/m/ColumnListItem';
import Table from 'sap/m/Table';
import Text from 'sap/m/Text';
import { MetadataOptions } from 'sap/ui/core/Component';
import Control from 'sap/ui/core/Control';
import UI5Element from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import { ListBase$SelectionChangeEvent } from 'sap/m/ListBase';
import CustomData from 'sap/ui/core/CustomData';
import EventBus from 'sap/ui/core/EventBus';
/**
 * @extends sap.ui.core.Control
 *
 *
 * @name rf.calculator.control.ForgePreview
 */
export default class ForgePreview extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			outcomes: { type: 'any', defaultValue: {} },
			selectedOutcome: { type: 'any', defaultValue: {} },
		},
		aggregations: {
			_table: { type: 'sap.m.Table', multiple: false, visibility: 'hidden' },
		},
		events: {
			change: {},
		},
	};

	renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, ui5Element: UI5Element) => {
			rm.openStart('div', ui5Element);
			rm.openEnd();
			rm.renderControl(ui5Element.getAggregation('_table') as Table);
			rm.close('div');
		},
	};

	init() {
		this.setAggregation(
			'_table',
			new Table({
				mode: 'SingleSelectLeft',
				includeItemInSelection: true,
				selectionChange: (event: ListBase$SelectionChangeEvent) => {
					const selectedItem = event.getParameter('listItem');
					const selectedOutcome = selectedItem?.getCustomData()[0]?.getValue();
					this.setProperty('selectedOutcome', selectedOutcome, true);
					EventBus.getInstance().publish('calculator', 'updateResults', {
						path: this.getBindingContext()?.getPath(),
					});
				},
			})
		);
	}

	setOutcomes(outcomes: any): this {
		this.setProperty('outcomes', outcomes, true);
		const table = this.getAggregation('_table') as Table;
		const resourceBundle = (this.getModel('i18n') as ResourceModel)?.getResourceBundle() as ResourceBundle;

		table.removeAllItems();
		table.removeAllColumns();
		if (!outcomes) return this;
		const addColumn = (header: string) => {
			table.addColumn(
				new Column({
					header: new Text({ text: resourceBundle?.getText(header) ?? '-' }),
				})
			);
		};
		addColumn('atk');
		addColumn('matk');
		addColumn('def');
		addColumn('mdef');

		// flatten stat keys
		const statKeys: string[] = outcomes.reduce((acc: string[], outcome: { stats: any[] }) => {
			outcome.stats.forEach((stat: any) => acc.push(stat.key));
			return acc;
		}, []);
		const uniqueKeys = Array.from(new Set(statKeys)).filter(
			(key: string) => key !== 'atk' && key !== 'matk' && key !== 'def' && key !== 'mdef'
		);
		uniqueKeys.forEach((key: string) => {
			addColumn(key);
		});
		outcomes.forEach((outcome: any) => {
			let cells = outcome.stats.map(() => '');
			outcome.stats.forEach((stat: any) => {
				const index = ['atk', 'matk', 'def', 'mdef'].indexOf(stat.key);
				if (index !== -1) {
					cells[index] = stat.value;
				} else {
					const index = uniqueKeys.indexOf(stat.key);
					if (index !== -1) {
						cells[index + 4] = stat.value;
					}
				}
			});
			cells = Array.from(cells, (_, i) => {
				if (!(i in cells)) return null;
				else return cells[i];
			});
			table.addItem(
				new ColumnListItem({
					cells: [...cells.map((cell: string) => new Text({ text: cell }))],
					customData: new CustomData({
						key: 'outcome',
						value: outcome,
					}),
				})
			);
		});

		return this;
	}
}
