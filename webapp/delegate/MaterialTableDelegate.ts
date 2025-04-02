import TableDelegate from "sap/ui/mdc/TableDelegate";
import Text from "sap/m/Text";
import Element from "sap/ui/core/Element";
import {
  default as Table,
  PropertyInfo as TablePropertyInfo,
} from "sap/ui/mdc/Table";
import Column from "sap/ui/mdc/table/Column";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import MaterialBaseDelegate from "./MaterialBaseDelegate";
import MaterialTablePropertyInfo from "../model/metadata/MaterialTablePropertyInfo";
import FilterBar from "sap/ui/mdc/FilterBar";

interface TablePayload {
  bindingPath: string;
  searchKeys: string[];
}

const _createColumn = (propertyInfo: TablePropertyInfo, table: Table) => {
  const name = propertyInfo.key;
  const id = table.getId() + "---col-" + name.toLowerCase();
  const col = Element.getElementById(id) as Column;
  return (
    col ??
    new Column(undefined, {
      propertyKey: name,
      header: propertyInfo.label,
      template: new Text({
        text: {
          path: "data>" + name,
          type: propertyInfo.dataType,
        },
      }),
    })
  );
};

const _createSearchFilters = (search: string, keys: string[]) => {
  const filters = keys.map(
    (k) =>
      new Filter({
        path: k,
        operator: FilterOperator.Contains,
        value1: search,
      })
  );
  return [new Filter(filters, false)];
};

const _recursiveFilterBuild = (filters: Filter[], key: string) => {
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].getPath() === key) {
      const newFilter = new Filter({
        path: "Drops",
        operator: FilterOperator.Any,
        variable: "d",
        condition: new Filter({
          path: `d/${key}/Name`,
          operator: FilterOperator.Contains,
          value1: filters[i].getValue1(),
        }),
      });
      filters[i] = newFilter;
    } else if (filters[i].getPath() === undefined)
      filters = _recursiveFilterBuild(filters[i].getFilters() as Filter[], key);
  }
  return filters;
};

const MaterialTableDelegate = Object.assign(
  {},
  MaterialBaseDelegate,
  TableDelegate
);

MaterialTableDelegate.fetchProperties = async () => {
  return MaterialTablePropertyInfo.filter((p) => p.key !== "$search");
};

MaterialTableDelegate.addItem = async (table: Table, propertyKey: string) => {
  console.log("add item (table)");
  const propertyInfo = MaterialTablePropertyInfo.find(
    (p) => p.key === propertyKey
  ) as TablePropertyInfo;
  return _createColumn(propertyInfo, table);
};

MaterialTableDelegate.updateBindingInfo = (table, bindingInfo) => {
  TableDelegate.updateBindingInfo.call(
    MaterialTableDelegate,
    table,
    bindingInfo
  );

  bindingInfo.path = (table.getPayload() as TablePayload).bindingPath;
  bindingInfo.templateShareable = true;
};
MaterialTableDelegate.getFilters = (table: Table) => {
  const search = (
    Element.getElementById(table.getFilter()) as FilterBar
  ).getSearch();
  const keys = (table.getPayload() as TablePayload).searchKeys;
  let filters = TableDelegate.getFilters(table);
  filters = _recursiveFilterBuild(filters, "Location");
  filters = _recursiveFilterBuild(filters, "Monster");
  console.table(filters);
  if (search && keys) {
    filters = filters.concat(_createSearchFilters(search, keys));
  }
  return filters;
};
export default MaterialTableDelegate;
