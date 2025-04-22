import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Percentage" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $PercentageSettings extends $ControlSettings {
        value?: number | PropertyBindingInfo | `{${string}}`;
    }

    export default interface Percentage {

        // property: value
        getValue(): number;
        setValue(value: number): this;
    }
}
