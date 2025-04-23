import Slider from 'sap/m/Slider';
import Control from 'sap/ui/core/Control';
import UI5Element, { MetadataOptions } from 'sap/ui/core/Element';
import EventBus from 'sap/ui/core/EventBus';
import RenderManager from 'sap/ui/core/RenderManager';
import { CalcChangeEvent } from '../model/enums';

/**
 * @extends sap.ui.core.Control
 *
 *
 * @name rf.calculator.control.LevelSlider
 */
export default class LevelSlider extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			value: { type: 'int', defaultValue: 1 },
		},
		aggregations: {
			_slider: { type: 'sap.m.Slider', multiple: false, visibility: 'hidden' },
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
			rm.renderControl(ui5Element.getAggregation('_slider') as Slider);
			rm.close('div');
		},
	};

	init(): void {
		this.setAggregation(
			'_slider',
			new Slider({
				min: 1,
				max: 10,
				value: 1,
				width: '100%',
				showAdvancedTooltip: true,
				showHandleTooltip: false,
				inputsAsTooltips: true,
				change: (oEvent) => {
					const value = oEvent.getParameter('value');
					this.setProperty('value', value, true);
					EventBus.getInstance().publish('calculator', 'updateResults', {
						eventSource: CalcChangeEvent.Level,
					});
				},
			})
		);
	}
}
