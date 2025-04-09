import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ForgePreview" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ForgePreviewSettings extends $ControlSettings {
        outcomes?: any | PropertyBindingInfo | `{${string}}`;
    }

    export default interface ForgePreview {

        // property: outcomes
        getOutcomes(): any;
        setOutcomes(outcomes: any): this;
    }
}
