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

// TODO: Fix the material card tomorrow to replace the fragment
export default class MaterialCardNew extends Control {
	static metadata = {
		properties: {
			materialPath: {
				type: 'string',
				defaultValue: '',
			},
		},
		aggregations: {},
		events: {
			materialSelected: {},
			levelChanged: {},
		},
	};

	constructor(mSettings?: any) {
		super(mSettings);
	}

	/** Main render method */
	renderer(oRM: RenderManager, oControl: MaterialCardNew) {
		const path = oControl.getMaterialPath();

		oRM.openStart('div', oControl);
		oRM.class('materialCardNewWrapper'); // Optional: for custom CSS
		oRM.openEnd();

		const card = new Card({
			header: new CardHeader({
				title: `{${path}/Header_Name}`,
			}),
			content: new VBox({
				items: [
					new MaterialComboBox({
						selectedItem: `{${path}/Material}`,
						items: `{= \${${path}/Select_Query} ? \${${path}/Select_Query} : \${/selectedItems} }`,
						selectionChange: oControl._onMaterialSelected.bind(oControl),
					}),
					new Label({
						text: 'Material Level',
					}),
					new LevelSlider({
						value: `{${path}/Material/Level}`,
						change: oControl._onLevelChange.bind(oControl),
					}),
					new StatRender({
						stats: {
							mPath: `${path}/Material/Stats`,
							sHtml: 'Stat_HTML',
						},
						class: 'sapUiMediumMarginBottom',
					}),
				],
			}),
		});

		oRM.renderControl(card);
		oRM.close('div');
	}

	/** Getter for materialPath property */
	getMaterialPath(): string {
		return this.getProperty('materialPath') as string;
	}

	/** Internal handler for material selection */
	_onMaterialSelected(oEvent: sap.ui.base.Event) {
		this.fireEvent('materialSelected', { event: oEvent });
	}

	/** Internal handler for level change */
	_onLevelChange(oEvent: sap.ui.base.Event) {
		this.fireEvent('levelChanged', { event: oEvent });
	}
}
