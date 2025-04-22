import Event from 'sap/ui/base/Event';
import Controller from 'sap/ui/core/mvc/Controller';
import UIComponent from 'sap/ui/core/UIComponent';

/**
 * @namespace rf.calculator.controller
 */
export default class MaterialList extends Controller {
	onRowPress(event: Event): void {
		const params: any = event.getParameters();
		const router = UIComponent.getRouterFor(this);
		router.navTo('material', {
			ID: params.bindingContext.getProperty('ID') as string,
		});
	}
}
