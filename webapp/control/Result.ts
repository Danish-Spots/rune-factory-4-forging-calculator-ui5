import Card from 'sap/f/Card';
import Header from 'sap/f/cards/Header';
import HBox from 'sap/m/HBox';
import Label from 'sap/m/Label';
import Text from 'sap/m/Text';
import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import UI5Element, { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';

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
			weapon: { type: 'any', defaultValue: '' },
			bonuses: { type: 'any', defaultValue: '' },
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
				gap: '16px',
				items: [new Card({}), new Card({}), new Card({})],
			})
		);
	}

	setWeapon(weapon: any): this {
		this.setProperty('weapon', weapon, true);
		if (!weapon) return this;
		const box = this.getAggregation('_hbox') as HBox;
		const card = box.getItems()[0] as Card;
		card.setHeader(
			new Header({
				title: `Base ${weapon.Name} Stats`,
			})
		);
		let primaryStat = [];
		let secondaryStat = [];
		for (const stat of weapon.Stats) {
			const index = this.primaryStats.indexOf(stat.Stat_Key);
			const vBox = this.createVbox(stat.Stat_Key, stat.Stat_Value);
			if (index > -1) {
				primaryStat[index] = vBox;
			} else secondaryStat.push(vBox);
		}
		card.setContent(
			new HBox({
				gap: '48px',
			})
		);
		this.buildCardContent(card, primaryStat, secondaryStat);
		return this;
	}

	setBonuses(bonuses: any): this {
		this.setProperty('bonuses', bonuses, true);
		const box = this.getAggregation('_hbox') as HBox;
		const card = box.getItems()[1] as Card;
		console.log(bonuses);
		card.setHeader(
			new Header({
				title: 'Bonuses',
				subtitle: 'Level and Rarity',
			})
		);
		let primaryStat = [];
		for (const statKey in bonuses) {
			const vBox = this.createVbox(statKey, bonuses[statKey]);
			primaryStat.push(vBox);
		}
		primaryStat = primaryStat.filter((stat) => stat !== undefined);
		this.buildCardContent(card, primaryStat, []);
		return this;
	}

	setResult(result: any): this {
		this.setProperty('result', result, true);
		const box = this.getAggregation('_hbox') as HBox;
		const card = box.getItems()[2] as Card;
		let primaryStat = [];
		let secondaryStat = [];
		if (!result) return this;
		for (const statKey in result.stats) {
			const index = this.primaryStats.indexOf(statKey);
			const vBox = this.createVbox(statKey, result.stats[statKey]);
			if (index > -1) {
				primaryStat[index] = vBox;
			} else {
				secondaryStat.push(vBox);
			}
		}
		primaryStat = primaryStat.filter((stat) => stat !== undefined);
		this.buildCardContent(card, primaryStat, secondaryStat);
		card.setHeader(
			new Header({
				title: `Final ${result.name}`,
			})
		);

		return this;
	}

	convertPercentage(stat: float): string {
		if (stat.toString().includes('.')) {
			return `${stat * 100} %`;
		}
		return stat.toString();
	}

	private createVbox(statKey: string, value: float): VBox {
		return new VBox({
			gap: '2px',
			items: [
				new Label({
					design: 'Bold',
					text: `{i18n>${statKey}}`,
				}),
				new Text({
					text: this.convertPercentage(value),
				}),
			],
		});
	}

	private buildCardContent(card: Card, primaryStat: Control[], secondaryStat: Control[]): void {
		const primaryVbox = new VBox({
			gap: '8px',
			items: primaryStat,
		});
		const secondaryVbox = new VBox({
			gap: '8px',
			items: secondaryStat,
		});
		card.setContent(
			new HBox({
				gap: '48px',
				items: [primaryVbox, secondaryVbox],
			}).addStyleClass('sapUiSmallMargin')
		);
	}
}
