import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace rf.calculator.controller
 */
export default class MaterialList extends Controller {
  onFilterMaterials(event: SearchField$SearchEvent): void {
    const filter = [];
    const query = event.getParameter("query");
    if (query) filter.push(new Filter("Name", FilterOperator.Contains, query));

    const list = this.byId("materialList");
    const binding = list?.getBinding("items") as ListBinding;
    binding?.filter(filter);
  }
}
