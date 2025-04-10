import Column from 'sap/m/Column';
import ColumnListItem from 'sap/m/ColumnListItem';
import Table from 'sap/m/Table';
import Text from 'sap/m/Text';
import { MetadataOptions } from 'sap/ui/core/Component';
import Control from 'sap/ui/core/Control';
import UI5Element from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import StatRender from './StatRender';
import HBox from 'sap/m/HBox';
import FormattedText from 'sap/m/FormattedText';
import Fragment from 'sap/ui/core/Fragment';
import Menu from 'sap/m/table/columnmenu/Menu';
import QuickSort, { QuickSort$ChangeEvent } from 'sap/m/table/columnmenu/QuickSort';
import QuickSortItem from 'sap/m/table/columnmenu/QuickSortItem';
import Sorter from 'sap/ui/model/Sorter';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import { ListBase$SelectionChangeEvent } from 'sap/m/ListBase';
import CustomData from 'sap/ui/core/CustomData';
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
					this.fireChange();
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
		const uniqueKeys = Array.from(new Set(statKeys));
		uniqueKeys.forEach((key: string) => {
			if (key === 'atk' || key === 'matk' || key === 'def' || key === 'mdef') return;
			addColumn(key);
		});
		outcomes.forEach((outcome: any) => {
			const cells = ['', '', '', ''];
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
