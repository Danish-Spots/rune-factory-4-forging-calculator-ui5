import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./MaterialComboBox" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MaterialComboBoxSettings extends $ControlSettings {
        items?: any | PropertyBindingInfo | `{${string}}`;
        selectedItem?: any | PropertyBindingInfo | `{${string}}`;
        selectionChange?: (event: MaterialComboBox$SelectionChangeEvent) => void;
    }

    export default interface MaterialComboBox {

        // property: items
        getItems(): any;
        setItems(items: any): this;

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
    }

    /**
     * Type describing the MaterialComboBox's 'selectionChange' event.
     */
    export type MaterialComboBox$SelectionChangeEvent = Event<MaterialComboBox$SelectionChangeEventParameters>;
}
