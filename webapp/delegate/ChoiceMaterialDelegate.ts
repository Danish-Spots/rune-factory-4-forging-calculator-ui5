import TableDelegate from 'sap/ui/mdc/TableDelegate';
import ChoiceMaterialTablePropertyInfo from '../model/metadata/ChoiceMaterialTablePropertyInfo';
import Column from 'sap/ui/mdc/table/Column';
import Text from 'sap/m/Text';
import Table, { PropertyInfo } from 'sap/ui/mdc/Table';

const ChoiceMaterialDelegate = Object.assign({}, TableDelegate);

ChoiceMaterialDelegate.fetchProperties = async () => {
	return ChoiceMaterialTablePropertyInfo.filter((propertyInfo) => propertyInfo.key !== '$search');
};

const _createColumn = (id: string, propertyInfo: PropertyInfo) =>
	new Column(id, {
		propertyKey: propertyInfo.key,
		header: propertyInfo.label,
		template: new Text({
			text: {
				path: 'data>' + propertyInfo.path,
				type: propertyInfo.dataType,
			},
		}),
	});

ChoiceMaterialDelegate.addItem = async (table: Table, propertyKey) => {
	const propertyInfo = ChoiceMaterialTablePropertyInfo.find((p) => p.key === propertyKey) as PropertyInfo;
	const id = table.getId() + '---col-' + propertyKey.toLowerCase();
	return await _createColumn(id, propertyInfo);
};

ChoiceMaterialDelegate.updateBindingInfo = (table: Table, bindingInfo) => {
	TableDelegate.updateBindingInfo.call(ChoiceMaterialDelegate, table, bindingInfo);
	bindingInfo.path = (table.getPayload() as any)?.bindingPath;
};

export default ChoiceMaterialDelegate;
