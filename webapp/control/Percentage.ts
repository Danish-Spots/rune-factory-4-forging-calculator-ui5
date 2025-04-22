import Text from 'sap/m/Text';
import Control from 'sap/ui/core/Control';
import { convertPercentage } from '../utils/convertPercentage';
import RenderManager from 'sap/ui/core/RenderManager';
import UI5Element from 'sap/ui/core/Element';

/**
 * @extends sap.ui.core.Control
 *
 * @name rf.calculator.control.Percentage
 */
export default class Percentage extends Control {
	static readonly metadata = {
		properties: {
			value: { type: 'float', defaultValue: 0 },
		},
		aggregations: {
			_text: { type: 'sap.m.Text', multiple: false, visibility: 'hidden' },
		},
	};

	renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, ui5Element: UI5Element) => {
			rm.openStart('div', ui5Element);
			rm.openEnd();
			rm.renderControl(ui5Element.getAggregation('_text') as Text);
			rm.close('div');
		},
	};

	init(): void | undefined {
		this.setAggregation('_text', new Text({}));
	}

	setValue(value: float): this {
		this.setProperty('value', value, true);
		if (!value) return this;
		const text = this.getAggregation('_text') as Text;
		text.setText(`${convertPercentage(value)}`);
		return this;
	}
}
