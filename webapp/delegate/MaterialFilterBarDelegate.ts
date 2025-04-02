import DefaultTypeMap from "sap/ui/mdc/DefaultTypeMap";
import MaterialTablePropertyInfo from "../model/metadata/MaterialTablePropertyInfo";
import FilterBarDelegate from "sap/ui/mdc/FilterBarDelegate";
import MaterialBaseDelegate from "./MaterialBaseDelegate";
import FilterBar, { PropertyInfo } from "sap/ui/mdc/FilterBar";
import Element from "sap/ui/core/Element";
import FilterField from "sap/ui/mdc/FilterField";
import ValueHelp from "sap/ui/mdc/ValueHelp";
import Fragment from "sap/ui/core/Fragment";

interface FilterBarPayload {
  valueHelp: {
    [key: string]: boolean;
  };
}

var MaterialFilterBarDelegate = Object.assign(
  {},
  MaterialBaseDelegate,
  FilterBarDelegate
);

const _createValueHelp = async (filterBar: FilterBar, propKey: string) => {
  const path = "rf.calculator.view.fragment.";
  const valueHelp = (await Fragment.load({
    name: `${path}${
      (filterBar.getPayload() as FilterBarPayload).valueHelp[propKey]
    }`,
  })) as unknown as ValueHelp;
  filterBar.addDependent(valueHelp);
  return valueHelp;
};

const _createFilterField = async (
  id: string,
  property: PropertyInfo,
  filterBar: FilterBar
) => {
  const propKey = property.key;
  if ((filterBar.getPayload() as FilterBarPayload).valueHelp[propKey]) {
    const filterField = new FilterField(id, {
      dataType: property.dataType,
      conditions: `{$filters>/conditions/${propKey}}`,
      propertyKey: propKey,
      required: property.required,
      label: property.label,
      maxConditions: property.maxConditions,
      delegate: { name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {} },
    });
    const dependents = filterBar.getDependents();
    let valueHelp = dependents.find((dependent) =>
      dependent.getId().includes(propKey)
    ) as ValueHelp;
    valueHelp ??= await _createValueHelp(filterBar, propKey);
    filterField.setValueHelp(valueHelp);
    return filterField;
  }
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
  return filterField ?? _createFilterField(id, prop, filterBar);
};
export default MaterialFilterBarDelegate;
