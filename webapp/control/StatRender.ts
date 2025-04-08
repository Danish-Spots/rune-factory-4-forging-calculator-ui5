import FormattedText from 'sap/m/FormattedText';
import HBox from 'sap/m/HBox';
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
			fieldName: { type: 'string', defaultValue: '' },
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

	setFieldName(fieldName: string): this {
		if (!fieldName) return this;
		this.setProperty('fieldName', fieldName, true);
		this._updateHbox();

		return this;
	}

	setStats(stats: any): this {
		this.setProperty('stats', stats, true);
		if (!stats) return this;
		this._updateHbox();
		return this;
	}

	_updateHbox(): void {
		const stats = this.getProperty('stats');
		const fieldName = this.getProperty('fieldName');
		if (!stats) return;
		if (!stats.matPath || !stats.htmlPath) return;
		if (stats.matPath.includes('Key') && !fieldName) return;
		const hbox = this.getAggregation('_hbox') as HBox;
		if (!hbox) return;
		// hbox.addAggregation('items', new FormattedText({ htmlText: stats }));
		hbox.bindAggregation('items', {
			path: stats.matPath.includes('Key') ? stats.matPath.replace('Key', fieldName) : stats.matPath,
			template: new FormattedText({
				htmlText: `{${stats.htmlPath}}`,
			}),
			templateShareable: true,
		});
	}
}
