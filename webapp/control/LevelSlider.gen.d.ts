import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./LevelSlider" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $LevelSliderSettings extends $ControlSettings {
        value?: number | PropertyBindingInfo | `{${string}}`;
        change?: (event: LevelSlider$ChangeEvent) => void;
    }

    export default interface LevelSlider {

        // property: value
        getValue(): number;
        setValue(value: number): this;

        // event: change
        attachChange(fn: (event: LevelSlider$ChangeEvent) => void, listener?: object): this;
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: LevelSlider$ChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachChange(fn: (event: LevelSlider$ChangeEvent) => void, listener?: object): this;
        fireChange(parameters?: LevelSlider$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of LevelSlider's 'change' event.
     */
    // eslint-disable-next-line
    export interface LevelSlider$ChangeEventParameters {
    }

    /**
     * Type describing the LevelSlider's 'change' event.
     */
    export type LevelSlider$ChangeEvent = Event<LevelSlider$ChangeEventParameters>;
}
