import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./MaterialComboBox" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MaterialComboBoxSettings extends $ControlSettings {
        items?: any | PropertyBindingInfo | `{${string}}`;

        /**
         * The destination for changes of the control, attached with selectionChange event.
         */
        fieldName?: string | PropertyBindingInfo;
        selectedItem?: any | PropertyBindingInfo | `{${string}}`;
        selectionChange?: (event: MaterialComboBox$SelectionChangeEvent) => void;
    }

    export default interface MaterialComboBox {

        // property: items
        getItems(): any;
        setItems(items: any): this;

        // property: fieldName

        /**
         * The destination for changes of the control, attached with selectionChange event.
         */
        getFieldName(): string;

        /**
         * The destination for changes of the control, attached with selectionChange event.
         */
        setFieldName(fieldName: string): this;

        // property: selectedItem
        getSelectedItem(): any;
        setSelectedItem(selectedItem: any): this;

        // event: selectionChange
        attachSelectionChange(fn: (event: MaterialComboBox$SelectionChangeEvent) => void, listener?: object): this;
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: MaterialComboBox$SelectionChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachSelectionChange(fn: (event: MaterialComboBox$SelectionChangeEvent) => void, listener?: object): this;
        fireSelectionChange(parameters?: MaterialComboBox$SelectionChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of MaterialComboBox's 'selectionChange' event.
     */
    export interface MaterialComboBox$SelectionChangeEventParameters {
        data?: object;
        fieldName?: string;
    }

    /**
     * Type describing the MaterialComboBox's 'selectionChange' event.
     */
    export type MaterialComboBox$SelectionChangeEvent = Event<MaterialComboBox$SelectionChangeEventParameters>;
}
