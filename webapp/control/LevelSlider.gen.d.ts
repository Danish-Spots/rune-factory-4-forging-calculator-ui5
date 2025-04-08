import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./LevelSlider" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $LevelSliderSettings extends $ControlSettings {
        fieldName?: string | PropertyBindingInfo;
        change?: (event: LevelSlider$ChangeEvent) => void;
    }

    export default interface LevelSlider {

        // property: fieldName
        getFieldName(): string;
        setFieldName(fieldName: string): this;

        // event: change
        attachChange(fn: (event: LevelSlider$ChangeEvent) => void, listener?: object): this;
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: LevelSlider$ChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachChange(fn: (event: LevelSlider$ChangeEvent) => void, listener?: object): this;
        fireChange(parameters?: LevelSlider$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of LevelSlider's 'change' event.
     */
    export interface LevelSlider$ChangeEventParameters {
        value?: number;
        fieldName?: string;
    }

    /**
     * Type describing the LevelSlider's 'change' event.
     */
    export type LevelSlider$ChangeEvent = Event<LevelSlider$ChangeEventParameters>;
}
