import Card from 'sap/f/Card';
import Header from 'sap/f/cards/Header';
import HBox from 'sap/m/HBox';
import Label from 'sap/m/Label';
import Text from 'sap/m/Text';
import Title from 'sap/m/Title';
import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import UI5Element, { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import Float from 'sap/ui/model/type/Float';

/**
 * @extends sap.ui.core.Control
 *
 * @name rf.calculator.control.Result
 */
export default class Result extends Control {
	primaryStats = ['atk', 'matk', 'def', 'mdef'];

	static readonly metadata: MetadataOptions = {
		properties: {
			result: { type: 'any', defaultValue: '' },
		},
		aggregations: {
			_hbox: { type: 'sap.m.HBox', multiple: false, visibility: 'hidden' },
		},
	};

	renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, ui5Element: UI5Element) => {
			rm.openStart('div', ui5Element);
			rm.openEnd();
			rm.renderControl(ui5Element.getAggregation('_hbox') as HBox);
			rm.close('div');
		},
	};

	init() {
		this.setAggregation(
			'_hbox',
			new HBox({
				justifyContent: 'End',
				width: '100%',
				items: [new Card({})],
			})
		);
	}

	setResult(result: any): this {
		this.setProperty('result', result, true);
		const box = this.getAggregation('_hbox') as HBox;
		const card = box.getItems()[0] as Card;
		console.log(result);
		let primaryStat = [];
		let secondaryStat = [];
		if (!result) return this;
		for (const statKey in result.stats) {
			const index = this.primaryStats.indexOf(statKey);
			const vBox = new VBox({
				gap: '2px',
				items: [
					new Label({
						design: 'Bold',
						text: `{i18n>${statKey}}`,
					}),
					new Text({
						text: this.convertPercentage(result.stats[statKey]),
					}),
				],
			});
			if (index > -1) {
				primaryStat[index] = vBox;
			} else {
				secondaryStat.push(vBox);
			}
		}
		primaryStat = primaryStat.filter((stat) => stat !== undefined);
		const primaryVbox = new VBox({
			gap: '8px',
			items: primaryStat,
		});
		const secondaryVbox = new VBox({
			gap: '8px',
			items: secondaryStat,
		});

		card.setHeader(
			new Header({
				title: result.name,
			})
		);
		card.setContent(
			new HBox({
				gap: '48px',
				items: [primaryVbox, secondaryVbox],
			}).addStyleClass('sapUiSmallMargin')
		);

		return this;
	}

	convertPercentage(stat: float): string {
		if (stat.toString().includes('.')) {
			return `${stat * 100} %`;
		}
		return stat.toString();
	}
}
