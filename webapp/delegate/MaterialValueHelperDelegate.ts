import ValueHelp from "sap/ui/mdc/ValueHelp";
import Content from "sap/ui/mdc/valuehelp/base/Content";
import FilterableListContent from "sap/ui/mdc/valuehelp/base/FilterableListContent";
import ValueHelpDelegate from "sap/ui/mdc/ValueHelpDelegate";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";

const MaterialValueHelperDelegate = Object.assign({}, ValueHelpDelegate);
MaterialValueHelperDelegate.getFilters = (
  valueHelp: ValueHelp,
  content: FilterableListContent
) => {
  const payload: any = valueHelp.getPayload();
  const filters = payload.searchKeys?.map(
    (path: string) =>
      new Filter({
        path,
        operator: FilterOperator.Contains,
        value1: content.getSearch(),
      })
  );
  const searchFilter = filters.length && new Filter(filters, false);
  return searchFilter ? [searchFilter] : [];
};

MaterialValueHelperDelegate.isSearchSupported = (
  valueHelp: ValueHelp,
  _content: Content,
  _listBinding: ListBinding
) => {
  return !!(valueHelp.getPayload() as any)?.searchKeys;
};
export default MaterialValueHelperDelegate;
