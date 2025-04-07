import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Dialog from 'sap/m/Dialog';
import MenuItem from 'sap/m/MenuItem';
import MessageStrip from 'sap/m/MessageStrip';
import MessageToast from 'sap/m/MessageToast';
import Table from 'sap/m/Table';
import Wizard from 'sap/m/Wizard';
import WizardStep from 'sap/m/WizardStep';
import Event from 'sap/ui/base/Event';
import Fragment from 'sap/ui/core/Fragment';
import Controller from 'sap/ui/core/mvc/Controller';
import Device from 'sap/ui/Device';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import Sorter from 'sap/ui/model/Sorter';
import { WizardButtons } from './Calculator/WizardButtons';
import { MaterialChoiceTable } from './Calculator/MaterialChoiceTable';
import Control from 'sap/ui/core/Control';
import FlexBox from 'sap/m/FlexBox';
import { MaterialSelect$SelectionChangeEvent } from '../control/MaterialSelect';
import { calculateInheritanceOutcomes } from '../model/calculator';
import { MaterialItem } from '../model/types';
/**
 * @name rf.calculator.controller
 */
export default class Calculator extends Controller {
	dialog: Dialog;
	viewSettingsDialogs: Record<string, Dialog> = {};
	viewModel = new JSONModel({
		selectionCount: 0,
		forgePreview: {
			gear: 'Weapon',
			Materials: {
				Material_1: {},
				Material_2: {},
				Material_3: {},
				Material_4: {},
				Material_5: {},
				Material_6: {},
			},
			Inheritances: [],
		},
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

	stepIndex: number = 0;
	step: WizardStep;

	onInit(): void | undefined {
		this.getView()?.setModel(this.viewModel);
		this.step = this.byId('ForgingWizardStep') as WizardStep;
		this.viewModel.setProperty('/nextButtonEnabled', false);

		this.checkButtonState();
	}

	async openChooseMaterialDialog(): Promise<void> {
		MaterialChoiceTable.openChooseMaterialDialog.call(this);
	}

	onSelectionChange(): void {
		MaterialChoiceTable.onSelectionChange.call(this);
	}

	async onSortPressed(): Promise<void> {
		MaterialChoiceTable.onSortPressed.call(this);
	}

	onSortOkPressed(event: Event): void {
		MaterialChoiceTable.onSortOkPressed.call(this, event);
	}

	async onGroupPressed(): Promise<void> {
		MaterialChoiceTable.onGroupPressed.call(this);
	}

	onGroupConfirm(event: Event): void {
		MaterialChoiceTable.onGroupConfirm.call(this, event);
	}

	onGroupReset(): void {
		MaterialChoiceTable.onGroupReset.call(this);
	}

	onConfirmPressed(): void {
		MaterialChoiceTable.onConfirmPressed.call(this);
	}

	onCancelPressed(): void {
		MaterialChoiceTable.onCancelPressed.call(this);
	}

	onWeaponSelected(event: Event): void {
		const selectedItem = (event as any).getParameter('listItem');
		const item = selectedItem.getBindingContext('data')?.getObject();

		this.viewModel.setProperty('/selectedWeapon', item);
		this.viewModel.setProperty('/nextButtonEnabled', true);
	}

	onNextPressed(): void {
		WizardButtons.onNextPressed.call(this);
	}

	onNavigationChange(event: Event): void {
		WizardButtons.onNavigationChange.call(this, event);
	}

	onPreviousPressed(): void {}

	handleStepChange(): void {}

	checkButtonState(): void {
		WizardButtons.checkButtonState.call(this);
	}

	onMaterialSelected(event: MaterialSelect$SelectionChangeEvent): void {
		const data = event.getParameter('data'),
			fieldName = event.getParameter('fieldName');
		this.viewModel.setProperty(`/forgePreview/Materials/${fieldName}`, data);
		const obj = this.viewModel.getObject('/forgePreview/Materials');
		const materials: any[] = Object.values(obj).filter((item: any) => item.ID !== undefined);
		console.log(calculateInheritanceOutcomes(materials));
	}
}
