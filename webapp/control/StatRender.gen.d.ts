import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./StatRender" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $StatRenderSettings extends $ControlSettings {
        stats?: any | PropertyBindingInfo | `{${string}}`;
    }

    export default interface StatRender {

        // property: stats
        getStats(): any;
        setStats(stats: any): this;
    }
}
