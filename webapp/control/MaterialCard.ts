import Control from 'sap/ui/core/Control';
import Card from 'sap/f/Card';
import CardHeader from 'sap/f/cards/Header';
import VBox from 'sap/m/VBox';
import Label from 'sap/m/Label';
import MaterialComboBox from 'rf/calculator/control/MaterialComboBox';
import LevelSlider from 'rf/calculator/control/LevelSlider';
import StatRender from 'rf/calculator/control/StatRender';
import RenderManager from 'sap/ui/core/RenderManager';
import { PropertyBindingInfo } from 'sap/ui/base/ManagedObject';
import Slider from 'sap/m/Slider';
import Event from 'sap/ui/base/Event';
import { MetadataOptions } from 'sap/ui/core/Element';

/**
 * @extends sap.ui.core.Control
 *
 *
 * @name rf.calculator.control.MaterialCard
 */
export default class MaterialCard extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			materialPath: {
				type: 'string',
				defaultValue: '',
			},
		},
		aggregations: {
			_card: { type: 'sap.f.Card', multiple: false, visibility: 'hidden' },
		},
		events: {
			materialSelected: {},
			levelChanged: {},
		},
	};

	constructor(mSettings?: any) {
		super(mSettings);
	}

	renderer = {
		apiVersion: 4,
		render: (oRM: RenderManager, oControl: MaterialCard) => {
			oRM.openStart('div', oControl);
			oRM.openEnd();
			oRM.renderControl(oControl.getAggregation('_card') as Card);
			oRM.close('div');
		},
	};

	init(): void | undefined {
		this.setAggregation('_card', new Card());
	}

	setMaterialPath(path: string) {
		this.setProperty('materialPath', path, true);
		this._buildCard();
		return this;
	}

	_buildCard() {
		const card = this.getAggregation('_card') as Card;
		const path = this.getMaterialPath();
		card.setHeader(
			new CardHeader({
				title: `{${path}/Header_Name}`,
			})
		);
		card.setContent(
			new VBox({
				items: [
					new MaterialComboBox({
						selectedItem: `{${path}/Material}`,
						items: `{= \${${path}/Select_Query} ? \${${path}/Select_Query} : \${/selectedItems} }`,
						selectionChange: this._onMaterialSelected.bind(this),
					}),
					new Label({
						text: 'Material Level',
					}),
					new Slider({
						value: `{${path}/Material/Level}`,
						change: this._onLevelChange.bind(this),
						min: 1,
						max: 10,
						width: '100%',
						showAdvancedTooltip: true,
						showHandleTooltip: false,
						inputsAsTooltips: true,
						step: 1,
					}),
					new StatRender({
						stats: {
							mPath: `${path}/Material/Stats`,
							sHtml: 'Stat_HTML',
						},
						class: 'sapUiMediumMarginBottom',
					}),
				],
			})
		);
	}

	/** Getter for materialPath property */
	getMaterialPath(): string {
		return this.getProperty('materialPath') as string;
	}

	/** Internal handler for material selection */
	_onMaterialSelected(oEvent: Event) {
		this.fireEvent('materialSelected', { event: oEvent });
	}

	/** Internal handler for level change */
	_onLevelChange(oEvent: Event) {
		this.fireEvent('levelChanged', { event: oEvent });
	}
}
