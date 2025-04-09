import FormattedText from 'sap/m/FormattedText';
import HBox from 'sap/m/HBox';
import { ObjectBindingInfo } from 'sap/ui/base/ManagedObject';
import Control from 'sap/ui/core/Control';
import UI5Element from 'sap/ui/core/Element';
import { MetadataOptions } from 'sap/ui/core/Element';
import { ControlRenderer } from 'sap/ui/core/ElementMetadata';
import RenderManager from 'sap/ui/core/RenderManager';

/**
 * @extends sap.ui.core.Control
 *
 *
 * @name rf.calculator.control.StatRender
 */
export default class StatRender extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			stats: { type: 'any', defaultValue: '' },
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
				columnGap: '8px',
			})
		);
	}

	setStats(stats: any): this {
		this.setProperty('stats', stats, true);
		const hbox = this.getAggregation('_hbox') as HBox;
		hbox.removeAllItems();

		if (!stats || !stats.mPath || !stats.sHtml) return this;
		hbox?.bindAggregation('items', {
			path: stats.mPath,
			template: new FormattedText({
				htmlText: `{${stats.sHtml}}`,
			}),
			templateShareable: false,
		});
		return this;
	}
}
