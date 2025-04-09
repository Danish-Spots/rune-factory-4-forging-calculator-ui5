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
		},
		aggregations: {
			_table: { type: 'sap.m.Table', multiple: false, visibility: 'hidden' },
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
	// <Table
	//     mode="SingleSelectLeft"
	//     includeItemInSelection="true"
	//     items="{/forge/Preview}">
	//     <columns>
	//       <Column>
	//         <Text text="Primary stats"></Text>
	//       </Column>
	//       <Column >
	//         <Text text="Secondary stats"/>
	//       </Column>
	//     </columns>
	//     <items>
	//       <ColumnListItem >
	//         <cells>
	//           <rf:StatRender
	//             stats="{mPath: 'primaryStats', sHtml: 'html'}">
	//           </rf:StatRender>
	//           <rf:StatRender
	//             stats="{mPath: 'secondaryStats', sHtml: 'html'}"/>
	//         </cells>
	//       </ColumnListItem>
	//     </items>
	//   </Table>

	init() {
		this.setAggregation(
			'_table',
			new Table({
				mode: 'SingleSelectLeft',
				includeItemInSelection: true,
			})
		);
	}

	setOutcomes(outcomes: any): this {
		this.setProperty('outcomes', outcomes, true);
		const table = this.getAggregation('_table') as Table;
		table.removeAllItems();
		table.removeAllColumns();
		const addColumn = (header: string) => {
			table.addColumn(
				new Column({
					header: new Text({ text: header }),
				})
			);
		};
		addColumn('Attack');
		addColumn('Magic Attack');
		addColumn('Defence');
		addColumn('Magic Defence');

		// flatten stat keys
		const statKeys: string[] = outcomes.reduce((acc: string[], outcome: { secondaryStats: any[] }) => {
			outcome.secondaryStats.forEach((stat: any) => acc.push(stat.key));
			return acc;
		}, []);
		const uniqueKeys = Array.from(new Set(statKeys));
		uniqueKeys.forEach((key: string) => {
			addColumn(key);
		});
		outcomes.forEach((outcome: any) => {
			const cells = ['', '', '', ''];
			outcome.primaryStats.forEach((stat: any) => {
				const index = ['atk', 'matk', 'def', 'mdef'].indexOf(stat.key);
				if (index !== -1) {
					cells[index] = stat.value;
				}
			});
			outcome.secondaryStats.forEach((stat: any) => {
				const index = uniqueKeys.indexOf(stat.key);
				if (index !== -1) {
					cells[index + 4] = stat.value;
				}
			});

			// const hbox = new HBox({
			// 	items: outcome.secondaryStats.map((stat: any) => new FormattedText({ htmlText: stat.html })),
			// });
			table.addItem(
				new ColumnListItem({
					cells: [...cells.map((cell: string) => new Text({ text: cell }))],
				})
			);
		});

		// table.addItem(
		// 	new ColumnListItem({
		// 		cells: [new Text({ text: '{primaryStats}' }), new Text({ text: '{secondaryStats}' })],
		// 	})
		// );
		return this;
	}
}
