import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Result" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ResultSettings extends $ControlSettings {
        result?: any | PropertyBindingInfo | `{${string}}`;
        weapon?: any | PropertyBindingInfo | `{${string}}`;
        bonuses?: any | PropertyBindingInfo | `{${string}}`;
    }

    export default interface Result {

        // property: result
        getResult(): any;
        setResult(result: any): this;

        // property: weapon
        getWeapon(): any;
        setWeapon(weapon: any): this;

        // property: bonuses
        getBonuses(): any;
        setBonuses(bonuses: any): this;
    }
}
