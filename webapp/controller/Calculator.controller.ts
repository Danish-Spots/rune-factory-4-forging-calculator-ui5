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
import { MaterialComboBox$SelectionChangeEvent } from '../control/MaterialComboBox';
import {
	calculateBonuses,
	calculateInheritanceOutcomes,
	calculateStatIncreases,
	calculateUpgrades,
} from '../model/calculator';
import { MaterialItem, StatBonus } from '../model/types';
import { LevelSlider$ChangeEvent } from '../control/LevelSlider';
import { Gear, StatKey } from '../model/enums';
import ODataModel from 'sap/ui/model/odata/v4/ODataModel';
import Material from './Material.controller';
import { Model$PropertyChangeEvent } from 'sap/ui/model/Model';
import EventBus from 'sap/ui/core/EventBus';
/**
 * @name rf.calculator.controller
 */
export default class Calculator extends Controller {
	dialog: Dialog;
	viewSettingsDialogs: Record<string, Dialog> = {};
	viewModel = new JSONModel({
		wizard: {
			ForgeStep: false,
			WeaponStep: true,
		},
		forge: {
			gear: 'Weapon',
			Materials: [],
			Preview: [],
		},
		Materials: [],
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

	_upgrades: { [key: string]: number };
	_forge: { [key: string]: number };

	onInit(): void | undefined {
		this.getView()?.setModel(this.viewModel);
		this.step = this.byId('WeaponChoiceStep') as WizardStep;
		this.stepIndex = 0;
		this.viewModel.setProperty('/nextButtonEnabled', false);

		this.checkButtonState();

		const model = this.getOwnerComponent()?.getModel('data') as ODataModel;

		const action = model?.bindContext('/UpgradeMaterials(...)');
		action.invoke().then(() => {
			const context = action.getBoundContext();
			const materials = context.getObject().Materials;
			this.viewModel.setProperty('/upgrade', {
				Materials: materials,
			});
		});

		EventBus.getInstance().subscribe(
			'calculator',
			'updateResults',
			(_, __, data) => {
				const path: string = (data as any).path;
				const forgeMaterials = [0, 1, 2, 3, 4, 5]
					.map((i) => {
						const material = this.viewModel.getObject(`/forge/Materials/${i}/Material`);
						return material;
					})
					.filter((material: MaterialItem) => material.ID !== null);
				const upgradeMaterials = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
					.map((i) => this.viewModel.getObject(`/upgrade/Materials/${i}/Material`))
					.filter((material: MaterialItem) => material.ID !== null);

				if (path?.startsWith('/forge')) this._rebuildOutcomes(forgeMaterials);
				else if (path?.startsWith('/upgrade')) this._upgrades = this._buildUpgrades(upgradeMaterials);

				const bonuses = this._rebuildBonuses(forgeMaterials, upgradeMaterials);
			},
			this
		);
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
		this.viewModel.setProperty('/forge/Materials', item.Materials);
		this.viewModel.setProperty('/forge/Preview', []);
		this.viewModel.setProperty('/forge/SelectedOutcome', null);
	}

	onOutcomeSelected(event: Event): void {}

	onNextPressed(): void {
		WizardButtons.onNextPressed.call(this);
	}

	onNavigationChange(event: Event): void {
		WizardButtons.onNavigationChange.call(this, event);
	}

	onPreviousPressed(): void {
		WizardButtons.onPreviousPressed.call(this);
	}

	checkButtonState(): void {
		WizardButtons.checkButtonState.call(this);
	}

	_rebuildOutcomes(materials: MaterialItem[]): void {
		const weaponStats = this.viewModel.getObject('/selectedWeapon/Stats');
		const outcomes = calculateInheritanceOutcomes(materials);
		const model = this.getView()?.getModel('data') as ODataModel;
		const action = model?.bindContext('/CalculateOutcomes(...)');
		action?.setParameter('outcomes', outcomes).setParameter('weaponStats', weaponStats);
		action
			?.invoke()
			.then(() => {
				const context = action.getBoundContext();
				this._forge = context.getObject().value;
				this.viewModel.setProperty('/forge/Preview', context.getObject().value);
			})
			.catch((error: any) => {
				console.error(error);
			});
	}

	_buildUpgrades(materials: MaterialItem[]): { [key: string]: number } {
		const results = calculateStatIncreases(materials);

		return results;
	}

	_rebuildBonuses(forgeMaterials: MaterialItem[], upgradeMaterials: MaterialItem[]): StatBonus {
		const bonuses = calculateUpgrades(forgeMaterials.concat(upgradeMaterials), Gear.Weapon);
		return bonuses;
	}
}
