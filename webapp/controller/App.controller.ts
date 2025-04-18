import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MenuItem from "sap/m/MenuItem";
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @name rf.calculator.controller
 */
export default class App extends Controller {
  onMenuAction(event: Event<{ item: string }>) {
    const router = UIComponent.getRouterFor(this);
    const item = event.getParameter("item") as unknown as MenuItem;

    const itemPath = item.getText();
    router.navTo(itemPath.toLowerCase());

    MessageToast.show(itemPath);
  }
}
