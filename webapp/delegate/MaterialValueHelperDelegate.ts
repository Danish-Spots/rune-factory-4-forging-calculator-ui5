import ValueHelp from "sap/ui/mdc/ValueHelp";
import FilterableListContent from "sap/ui/mdc/valuehelp/base/FilterableListContent";
import ValueHelpDelegate from "sap/ui/mdc/ValueHelpDelegate";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";

const MaterialValueHelperDelegate = Object.assign({}, ValueHelpDelegate);
MaterialValueHelperDelegate.getFilters = (
  valueHelp: ValueHelp,
  content: FilterableListContent
) => {
  const payload: any = valueHelp.getPayload();
  const filters = payload.searchKeys?.map(
    (path: string) =>
      new Filter({
        path: "Drops",
        operator: FilterOperator.Any,
        variable: "d",
        condition: new Filter({
          path: "d/Location/Name",
          operator: FilterOperator.Contains,
          value1: content.getSearch(),
        }),
      })
  );
  const searchFilter = filters.length && new Filter(filters, false);
  return searchFilter ? [searchFilter] : [];
};
export default MaterialValueHelperDelegate;
