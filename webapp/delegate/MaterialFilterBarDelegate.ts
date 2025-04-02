import DefaultTypeMap from "sap/ui/mdc/DefaultTypeMap";
import MaterialTablePropertyInfo from "../model/metadata/MaterialTablePropertyInfo";
import FilterBarDelegate from "sap/ui/mdc/FilterBarDelegate";
import MaterialBaseDelegate from "./MaterialBaseDelegate";
import FilterBar, { PropertyInfo } from "sap/ui/mdc/FilterBar";
import Element from "sap/ui/core/Element";
import FilterField from "sap/ui/mdc/FilterField";

var MaterialFilterBarDelegate = Object.assign(
  {},
  MaterialBaseDelegate,
  FilterBarDelegate
);

const _createFilterField = async (id: string, property: PropertyInfo) => {
  const propKey = property.key;
  const filterField = new FilterField(id, {
    dataType: property.dataType,
    conditions: `{$filters>/conditions/${propKey}}`,
    propertyKey: propKey,
    required: property.required,
    label: property.label,
    maxConditions: property.maxConditions,
    delegate: { name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {} },
  });

  return filterField;
};

MaterialFilterBarDelegate.fetchProperties = async () =>
  MaterialTablePropertyInfo;

MaterialFilterBarDelegate.addItem = async (
  filterBar: FilterBar,
  propertyKey: string
) => {
  const prop = MaterialTablePropertyInfo.find(
    (p) => p.key === propertyKey
  ) as PropertyInfo;
  const id = `${filterBar.getId()}--filter--${propertyKey}`;
  const filterField = Element.getElementById(id) as FilterField;
  return filterField ?? _createFilterField(id, prop);
};
export default MaterialFilterBarDelegate;
