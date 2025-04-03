import FilterBarDelegate from 'sap/ui/mdc/FilterBarDelegate';
import FilterField from 'sap/ui/mdc/FilterField';
import ChoiceMaterialTablePropertyInfo from '../model/metadata/ChoiceMaterialTablePropertyInfo';
import Element from 'sap/ui/core/Element';
import FilterBar, { PropertyInfo } from 'sap/ui/mdc/FilterBar';

const ChoiceMaterialFilterDelegate = Object.assign({}, FilterBarDelegate);

const _createFilterField = (id: string, property: PropertyInfo, filterBar: FilterBar) => {
	const key = property.key;
	// @ts-ignore
	const filterField = new FilterField(id, {
		dataType: property.dataType,
		conditions: `{$filters>/conditions/${key}}`,
		propertyKey: key,
		required: property.required || false,
		label: property.label,
		maxConditions: property.maxConditions,
		delegate: {
			name: 'sap/ui/mdc/field/FieldBaseDelegate',
			payload: {},
		},
	});

	return filterField;
};

ChoiceMaterialFilterDelegate.addItem = async (filterBar, propertyKey, _propBag) => {
	const property = ChoiceMaterialTablePropertyInfo.find((p) => p.key === propertyKey);
	const id = filterBar.getId() + '---' + propertyKey.toLowerCase();
	return (
		(Element.getElementById(id) as FilterField) ??
		(await _createFilterField(id, property as PropertyInfo, filterBar))
	);
};
