import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ForgePreview" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ForgePreviewSettings extends $ControlSettings {
        outcomes?: any | PropertyBindingInfo | `{${string}}`;
        selectedOutcome?: any | PropertyBindingInfo | `{${string}}`;
        change?: (event: ForgePreview$ChangeEvent) => void;
    }

    export default interface ForgePreview {

        // property: outcomes
        getOutcomes(): any;
        setOutcomes(outcomes: any): this;

        // property: selectedOutcome
        getSelectedOutcome(): any;
        setSelectedOutcome(selectedOutcome: any): this;

        // event: change
        attachChange(fn: (event: ForgePreview$ChangeEvent) => void, listener?: object): this;
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: ForgePreview$ChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachChange(fn: (event: ForgePreview$ChangeEvent) => void, listener?: object): this;
        fireChange(parameters?: ForgePreview$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of ForgePreview's 'change' event.
     */
    // eslint-disable-next-line
    export interface ForgePreview$ChangeEventParameters {
    }

    /**
     * Type describing the ForgePreview's 'change' event.
     */
    export type ForgePreview$ChangeEvent = Event<ForgePreview$ChangeEventParameters>;
}
