import Dialog from "sap/m/Dialog";
import ObjectListItem from "sap/m/ObjectListItem";
import Popup from "sap/m/p13n/Popup";
import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace rf.calculator.controller
 */
export default class MaterialList extends Controller {
  onRowPress(event: Event): void {
    const item = event.getSource();
    const params: any = event.getParameters();
    const router = UIComponent.getRouterFor(this);
    router.navTo("material", {
      ID: params.bindingContext.getProperty("ID") as string,
    });
  }
}
