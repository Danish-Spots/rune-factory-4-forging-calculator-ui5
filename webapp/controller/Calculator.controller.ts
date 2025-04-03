import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import MenuItem from 'sap/m/MenuItem';
import MessageToast from 'sap/m/MessageToast';
import Table from 'sap/m/Table';
import Event from 'sap/ui/base/Event';
import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
/**
 * @name rf.calculator.controller
 */
export default class Calculator extends Controller {
	dialog: any;
	viewModel = new JSONModel({
		selectionCount: 0,
	});

	onInit(): void | undefined {
		this.getView()?.setModel(this.viewModel);
	}

	openChooseMaterialDialog(): void {
		if (!this.dialog) {
			this.dialog = this.loadFragment({
				name: 'rf.calculator.view.fragment.MaterialChoiceTable',
			});
		}

		this.dialog.then((dialog: any) => {
			this.dialog = dialog;
			this.dialog.open();
		});
	}

	onSelectionChange(event: Event): void {
		let table = this.byId('materialChoiceTable') as Table;
		let selectedItems = table.getSelectedItems();

		this.viewModel.setData({
			selectionCount: selectedItems.length,
		});
		if (selectedItems.length > 15) this._showHideInfoToolbar(true);
		else this._showHideInfoToolbar(false);
	}

	_showHideInfoToolbar(visible: boolean): void {
		var oTable = this.byId('materialChoiceTable') as Table;
		oTable.getInfoToolbar().setVisible(visible);
	}
}
