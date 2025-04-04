import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Dialog from 'sap/m/Dialog';
import MenuItem from 'sap/m/MenuItem';
import MessageStrip from 'sap/m/MessageStrip';
import MessageToast from 'sap/m/MessageToast';
import Table from 'sap/m/Table';
import Event from 'sap/ui/base/Event';
import Fragment from 'sap/ui/core/Fragment';
import Controller from 'sap/ui/core/mvc/Controller';
import Device from 'sap/ui/Device';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import Sorter from 'sap/ui/model/Sorter';
/**
 * @name rf.calculator.controller
 */
export default class Calculator extends Controller {
	dialog: Dialog;
	viewSettingsDialogs: Record<string, Dialog> = {};
	viewModel = new JSONModel({
		selectionCount: 0,
	});
	groupFunctions: Record<string, Function> = {
		Rarity: (context: any) => {
			const rarity = context.getProperty('Rarity');
			return {
				key: rarity,
				text: rarity,
			};
		},
		Category: (context: any) => {
			const category = context.getProperty('Category');
			return {
				key: category,
				text: category,
			};
		},
	};
	groupReset: boolean;

	onInit(): void | undefined {
		this.getView()?.setModel(this.viewModel);
	}

	async openChooseMaterialDialog(): Promise<void> {
		this.dialog ??= (await this.loadFragment({
			name: 'rf.calculator.view.fragment.MaterialChoiceTable',
		})) as Dialog;

		this.dialog.open();
	}

	onSelectionChange(): void {
		const table = this.byId('materialChoiceTable') as Table;
		const messageStrip = this.byId('materialMessageStrip') as MessageStrip;
		const selectedItems = table.getSelectedItems();

		this.viewModel.setData({
			selectionCount: selectedItems.length,
		});
		if (selectedItems.length > 15) messageStrip.setVisible(true);
		else messageStrip.setVisible(false);
	}

	async onSortPressed(): Promise<void> {
		const dialog = await this.getViewSettingsDialog('rf.calculator.view.fragment.SortDialog');
		dialog.open();
	}

	onSortOkPressed(event: Event): void {
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

	async onGroupPressed(): Promise<void> {
		const dialog = await this.getViewSettingsDialog('rf.calculator.view.fragment.GroupDialog');
		dialog.open();
	}

	onGroupConfirm(event: Event): void {
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

	onGroupReset(): void {
		this.groupReset = true;
	}

	async getViewSettingsDialog(dialogFragmentName: string) {
		this.viewSettingsDialogs[dialogFragmentName] ??= (await Fragment.load({
			name: dialogFragmentName,
			controller: this,
			id: this.getView()?.getId() as string,
		})) as Dialog;

		if (Device.system.desktop) this.viewSettingsDialogs[dialogFragmentName].addStyleClass('sapUiSizeCompact');

		return this.viewSettingsDialogs[dialogFragmentName];
	}

	onConfirmPressed(event: Event): void {
		const table = this.byId('materialChoiceTable') as Table,
			selectedItems = table.getSelectedItems();

		const items = selectedItems.slice(0, 15);

		this.viewModel.setData({
			selectedItems: items.map((item) => item.getBindingContext('data')?.getObject()),
		});

		this.dialog.close();
	}

	onCancelPressed(event: Event): void {
		this.dialog.close();
	}
}
