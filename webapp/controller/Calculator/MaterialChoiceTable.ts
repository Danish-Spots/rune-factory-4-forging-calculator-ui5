import Dialog from 'sap/m/Dialog';
import MessageStrip from 'sap/m/MessageStrip';
import Table from 'sap/m/Table';
import Fragment from 'sap/ui/core/Fragment';
import Device from 'sap/ui/Device';
import Sorter from 'sap/ui/model/Sorter';
import Calculator from '../Calculator.controller';
import Event from 'sap/ui/base/Event';

/**
 * Collection of static methods to be used in the MaterialChoiceTable fragment.
 */
export class MaterialChoiceTable {
	static async openChooseMaterialDialog(this: Calculator): Promise<void> {
		this.dialog ??= (await this.loadFragment({
			name: 'rf.calculator.view.fragment.MaterialChoiceTable',
		})) as Dialog;

		this.dialog.open();
	}

	static onSelectionChange(this: Calculator): void {
		const table = this.byId('materialChoiceTable') as Table;
		const messageStrip = this.byId('materialMessageStrip') as MessageStrip;
		const selectedItems = table.getSelectedItems();

		this.viewModel.setProperty('/selectionCount', selectedItems.length);
		if (selectedItems.length > 15) messageStrip.setVisible(true);
		else messageStrip.setVisible(false);
	}

	static async onSortPressed(this: Calculator): Promise<void> {
		const dialog = await MaterialChoiceTable.getViewSettingsDialog.call(
			this,
			'rf.calculator.view.fragment.SortDialog'
		);
		dialog.open();
	}

	static onSortOkPressed(this: Calculator, event: Event): void {
		const table = this.byId('materialChoiceTable') as Table,
			params = event.getParameters(),
			binding = table.getBinding('items') as any,
			sorters = [];
		let path, descending;

		path = (params as any).sortItem.getKey();
		descending = (params as any).sortDescending;
		sorters.push(new Sorter(path, descending));
		binding?.sort(sorters);
	}

	static async onGroupPressed(this: Calculator): Promise<void> {
		const dialog = await MaterialChoiceTable.getViewSettingsDialog.call(
			this,
			'rf.calculator.view.fragment.GroupDialog'
		);
		dialog.open();
	}

	static onGroupConfirm(this: Calculator, event: Event): void {
		const table = this.byId('materialChoiceTable') as Table,
			params = event.getParameters() as any,
			binding = table.getBinding('items'),
			groups = [];
		let path, descending, group;

		if (params.groupItem) {
			path = params.groupItem.getKey();
			descending = params.groupDescending;
			group = this.groupFunctions[path];
			groups.push(new Sorter(path, descending, group));
			(binding as any)?.sort(groups);
		} else if (this.groupReset) {
			(binding as any)?.sort();
			this.groupReset = false;
		}
	}

	static onGroupReset(this: Calculator): void {
		this.groupReset = true;
	}

	static async getViewSettingsDialog(this: Calculator, dialogFragmentName: string) {
		this.viewSettingsDialogs[dialogFragmentName] ??= (await Fragment.load({
			name: dialogFragmentName,
			controller: this,
			id: this.getView()?.getId() as string,
		})) as Dialog;

		if (Device.system.desktop) this.viewSettingsDialogs[dialogFragmentName].addStyleClass('sapUiSizeCompact');

		return this.viewSettingsDialogs[dialogFragmentName];
	}

	static onConfirmPressed(this: Calculator): void {
		const table = this.byId('materialChoiceTable') as Table,
			selectedItems = table.getSelectedItems();

		const items = selectedItems.slice(0, 15);
		const objects = items.map((item) => item.getBindingContext('data')?.getObject());
		this.viewModel.setProperty('/selectedItems', objects);
		this.dialog.close();
	}

	static onCancelPressed(this: Calculator): void {
		this.dialog.close();
	}
}
