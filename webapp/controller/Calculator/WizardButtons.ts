import Wizard from 'sap/m/Wizard';
import Calculator from '../Calculator.controller';
import WizardStep from 'sap/m/WizardStep';
import Event from 'sap/ui/base/Event';

export class WizardButtons {
	static onNextPressed(this: Calculator): void {
		const wizard = this.byId('ForgingWizard') as Wizard;
		this.stepIndex = wizard.getSteps().indexOf(this.step);
		const nextStep = wizard.getSteps()[this.stepIndex + 1];
		if (this.step && !(this.step as any).bLast) wizard.goToStep(nextStep, true);
		else wizard.nextStep();

		this.stepIndex++;
		this.step = nextStep;
		this.checkButtonState();
	}

	static onNavigationChange(this: Calculator, event: Event): void {
		this.step = (event as any).getParameter('step') as WizardStep;
		this.stepIndex = (this.byId('ForgingWizard') as Wizard).getSteps().indexOf(this.step);

		this.checkButtonState();
	}

	static onPreviousPressed(this: Calculator): void {
		const wizard = this.byId('ForgingWizard') as Wizard;
		this.stepIndex = wizard.getSteps().indexOf(this.step);
		const previousStep = wizard.getSteps()[this.stepIndex - 1];
		if (this.step && !(this.step as any).bLast) wizard.goToStep(previousStep, true);
		else wizard.previousStep();

		this.stepIndex--;
		this.step = previousStep;
		this.checkButtonState();
	}

	static checkButtonState(this: Calculator): void {
		switch (this.stepIndex) {
			case 0:
				this.viewModel.setProperty('/wizard/WeaponStep', true);
				this.viewModel.setProperty('/wizard/ForgeStep', false);
				this.viewModel.setProperty('/previousButtonVisible', false);
				break;
			case 1:
				this.viewModel.setProperty('/wizard/WeaponStep', false);
				this.viewModel.setProperty('/wizard/ForgeStep', true);
				this.viewModel.setProperty('/previousButtonVisible', true);
			default:
				break;
		}
	}
}
