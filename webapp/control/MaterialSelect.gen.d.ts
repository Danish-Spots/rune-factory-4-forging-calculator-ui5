import Event from "sap/ui/base/Event";
import array from "array";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./MaterialSelect" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MaterialSelectSettings extends $ControlSettings {
        query?: any | PropertyBindingInfo | `{${string}}`;

        /**
         * The destination for changes of the control, attached with selectionChange event.
         */
        fieldName?: string | PropertyBindingInfo;
        materials?: array | PropertyBindingInfo | `{${string}}`;
        materialId?: string | PropertyBindingInfo;
        selectionChange?: (event: MaterialSelect$SelectionChangeEvent) => void;
    }

    export default interface MaterialSelect {

        // property: query
        getQuery(): any;
        setQuery(query: any): this;

        // property: fieldName

        /**
         * The destination for changes of the control, attached with selectionChange event.
         */
        getFieldName(): string;

        /**
         * The destination for changes of the control, attached with selectionChange event.
         */
        setFieldName(fieldName: string): this;

        // property: materials
        getMaterials(): array;
        setMaterials(materials: array): this;

        // property: materialId
        getMaterialId(): string;
        setMaterialId(materialId: string): this;

        // event: selectionChange
        attachSelectionChange(fn: (event: MaterialSelect$SelectionChangeEvent) => void, listener?: object): this;
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: MaterialSelect$SelectionChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachSelectionChange(fn: (event: MaterialSelect$SelectionChangeEvent) => void, listener?: object): this;
        fireSelectionChange(parameters?: MaterialSelect$SelectionChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of MaterialSelect's 'selectionChange' event.
     */
    export interface MaterialSelect$SelectionChangeEventParameters {
        data?: object;
        fieldName?: string;
    }

    /**
     * Type describing the MaterialSelect's 'selectionChange' event.
     */
    export type MaterialSelect$SelectionChangeEvent = Event<MaterialSelect$SelectionChangeEventParameters>;
}
