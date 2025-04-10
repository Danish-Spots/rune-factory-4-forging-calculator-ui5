import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./MaterialCard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MaterialCardNewSettings extends $ControlSettings {
        materialPath?: string | PropertyBindingInfo;
        materialSelected?: (event: MaterialCardNew$MaterialSelectedEvent) => void;
        levelChanged?: (event: MaterialCardNew$LevelChangedEvent) => void;
    }

    export default interface MaterialCardNew {

        // property: materialPath
        getMaterialPath(): string;
        setMaterialPath(materialPath: string): this;

        // event: materialSelected
        attachMaterialSelected(fn: (event: MaterialCardNew$MaterialSelectedEvent) => void, listener?: object): this;
        attachMaterialSelected<CustomDataType extends object>(data: CustomDataType, fn: (event: MaterialCardNew$MaterialSelectedEvent, data: CustomDataType) => void, listener?: object): this;
        detachMaterialSelected(fn: (event: MaterialCardNew$MaterialSelectedEvent) => void, listener?: object): this;
        fireMaterialSelected(parameters?: MaterialCardNew$MaterialSelectedEventParameters): this;

        // event: levelChanged
        attachLevelChanged(fn: (event: MaterialCardNew$LevelChangedEvent) => void, listener?: object): this;
        attachLevelChanged<CustomDataType extends object>(data: CustomDataType, fn: (event: MaterialCardNew$LevelChangedEvent, data: CustomDataType) => void, listener?: object): this;
        detachLevelChanged(fn: (event: MaterialCardNew$LevelChangedEvent) => void, listener?: object): this;
        fireLevelChanged(parameters?: MaterialCardNew$LevelChangedEventParameters): this;
    }

    /**
     * Interface describing the parameters of MaterialCardNew's 'materialSelected' event.
     */
    // eslint-disable-next-line
    export interface MaterialCardNew$MaterialSelectedEventParameters {
    }

    /**
     * Interface describing the parameters of MaterialCardNew's 'levelChanged' event.
     */
    // eslint-disable-next-line
    export interface MaterialCardNew$LevelChangedEventParameters {
    }

    /**
     * Type describing the MaterialCardNew's 'materialSelected' event.
     */
    export type MaterialCardNew$MaterialSelectedEvent = Event<MaterialCardNew$MaterialSelectedEventParameters>;

    /**
     * Type describing the MaterialCardNew's 'levelChanged' event.
     */
    export type MaterialCardNew$LevelChangedEvent = Event<MaterialCardNew$LevelChangedEventParameters>;
}
