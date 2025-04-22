import { IconTabBar$SelectEvent } from 'sap/m/IconTabBar';
import Event from 'sap/ui/base/Event';
import Controller from 'sap/ui/core/mvc/Controller';
import Theming from 'sap/ui/core/Theming';
import UIComponent from 'sap/ui/core/UIComponent';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @name rf.calculator.controller
 */
export default class App extends Controller {
	viewModel = new JSONModel({
		showLightMode: true,
		selectedKey: 'materials',
		showDarkMode: false,
	});
	onInit(): void | undefined {
		if (window.location.href.includes('calculator')) this.viewModel.setProperty('/selectedKey', 'calculator');
		const theme = localStorage.getItem('theme') || 'sap_horizon';
		this.viewModel.setProperty('/showLightMode', theme === 'sap_horizon');
		this.viewModel.setProperty('/showDarkMode', theme !== 'sap_horizon');
		this.handleThemeChange(theme);
		this.getView()?.setModel(this.viewModel, 'appModel');
	}
	selectNavDestination(event: IconTabBar$SelectEvent) {
		const item = event.getParameter('item');
		const router = UIComponent.getRouterFor(this);

		const itemPath = item?.getKey();
		if (!itemPath) return;
		router.navTo(itemPath);
	}

	onChangeThemeRequest(_event: Event) {
		const currentTheme = this.viewModel.getProperty('/showLightMode');
		if (currentTheme) {
			this.viewModel.setProperty('/showLightMode', false);
			this.viewModel.setProperty('/showDarkMode', true);
			this.handleThemeChange('sap_horizon_dark');
		} else {
			this.viewModel.setProperty('/showLightMode', true);
			this.viewModel.setProperty('/showDarkMode', false);
			this.handleThemeChange('sap_horizon');
		}
	}

	handleThemeChange(themeString: string) {
		localStorage.setItem('theme', themeString);
		Theming.setTheme(themeString);
	}
}
