import UIComponent from 'sap/ui/core/UIComponent';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ODataModel from 'sap/ui/model/odata/v4/ODataModel';

/**
 * @namespace rf.calculator
 */
export default class Component extends UIComponent {
	public static metadata = {
		interfaces: ['sap.ui.core.IAsyncContentCreation'],
		manifest: 'json',
	};
	init(): void {
		// call the init function of the parent
		super.init();

		this.getRouter().initialize();
		const model = this.getModel('data') as ODataModel;
		const materialAction = model?.bindList('/Materials');
		materialAction.requestContexts(0, 241).then((contexts) => {
			const materials = contexts.map((context) => context.getObject());
			const materialModel = new JSONModel({ Materials: materials });
			this.setModel(materialModel, 'local');
		});
	}
}
