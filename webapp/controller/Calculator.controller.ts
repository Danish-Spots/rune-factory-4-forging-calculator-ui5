import Dialog from 'sap/m/Dialog';
import WizardStep from 'sap/m/WizardStep';
import Event from 'sap/ui/base/Event';
import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';
import { WizardButtons } from './Calculator/WizardButtons';
import { MaterialChoiceTable } from './Calculator/MaterialChoiceTable';
import { calculateInheritanceOutcomes, calculateStatIncreases, calculateUpgrades } from '../model/calculator';
import { MaterialItem, StatBonus } from '../model/types';
import { CalcChangeEvent, Gear } from '../model/enums';
import ODataModel from 'sap/ui/model/odata/v4/ODataModel';
import EventBus from 'sap/ui/core/EventBus';
import Table, { Table$RowSelectionChangeEvent } from 'sap/ui/table/Table';
import Auto from 'sap/ui/table/rowmodes/Auto';
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
		table: {
			statToggle: 'Hide stats',
			materialToggle: 'Hide materials',
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
				const eventSource: string = (data as any).eventSource;
				const forgeMaterials = [0, 1, 2, 3, 4, 5]
					.map((i) => {
						const material = this.viewModel.getObject(`/forge/Materials/${i}/Material`);
						return material;
					})
					.filter((material: MaterialItem) => material.ID !== null);
				const upgradeMaterials = [0, 1, 2, 3, 4, 5, 6, 7, 8]
					.map((i) => this.viewModel.getObject(`/upgrade/Materials/${i}/Material`))
					.filter((material: MaterialItem) => material.ID !== null);

				let selectedOutcome = this.viewModel.getProperty('/forge/SelectedOutcome');
				if (!selectedOutcome?.stats) {
					selectedOutcome = {
						stats: [],
					};
				}
				if (eventSource === CalcChangeEvent.ForgeMaterial) this._rebuildOutcomes(forgeMaterials);
				this._upgrades = this._buildUpgrades(upgradeMaterials);

				const bonuses = this._rebuildBonuses(forgeMaterials, upgradeMaterials) as { [key: string]: number };
				this.viewModel.setProperty('/bonuses', { ...bonuses });
				for (const kvp of selectedOutcome.stats) {
					if (bonuses[kvp.key] !== undefined) bonuses[kvp.key] += kvp.value;
					else bonuses[kvp.key] = kvp.value;
				}
				if (this._upgrades) {
					for (const key in bonuses) {
						if (this._upgrades[key]) this._upgrades[key] += bonuses[key];
						else this._upgrades[key] = bonuses[key];
					}
				}
				const weaponName = this.viewModel.getProperty('/selectedWeapon/Name');
				this.viewModel.setProperty('/result', { stats: this._upgrades ?? bonuses, name: weaponName });
			},
			this
		);
	}

	onAfterRendering(): void | undefined {
		const table = this.byId('weaponTable') as Table;
		table.setRowMode(
			new Auto({
				minRowCount: 33,
			})
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

	onWeaponSelected(event: Table$RowSelectionChangeEvent): void {
		const selectedItem = event.getParameter('rowContext');
		const item = selectedItem?.getObject() as any;
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

	toggleMaterialColumns(): void {
		const table = this.byId('weaponTable') as Table;
		table.getColumns().forEach((column, index) => {
			if (index > 0 && index < 6) column.setVisible(!column.getVisible());
		});
		this.viewModel.setProperty(
			'/table/materialToggle',
			table.getColumns()[1].getVisible() ? 'Hide materials' : 'Show materials'
		);
	}
	toggleStatColumns(): void {
		const table = this.byId('weaponTable') as Table;
		table.getColumns().forEach((column, index) => {
			if (index > 5) column.setVisible(!column.getVisible());
		});
		this.viewModel.setProperty(
			'/table/statToggle',
			table.getColumns()[6].getVisible() ? 'Hide stats' : 'Show stats'
		);
	}
}
