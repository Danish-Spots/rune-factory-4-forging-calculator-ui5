import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./MaterialCard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MaterialCardSettings extends $ControlSettings {
        materialPath?: string | PropertyBindingInfo;
        materialSelected?: (event: MaterialCard$MaterialSelectedEvent) => void;
        levelChanged?: (event: MaterialCard$LevelChangedEvent) => void;
    }

    export default interface MaterialCard {

        // property: materialPath
        getMaterialPath(): string;
        setMaterialPath(materialPath: string): this;

        // event: materialSelected
        attachMaterialSelected(fn: (event: MaterialCard$MaterialSelectedEvent) => void, listener?: object): this;
        attachMaterialSelected<CustomDataType extends object>(data: CustomDataType, fn: (event: MaterialCard$MaterialSelectedEvent, data: CustomDataType) => void, listener?: object): this;
        detachMaterialSelected(fn: (event: MaterialCard$MaterialSelectedEvent) => void, listener?: object): this;
        fireMaterialSelected(parameters?: MaterialCard$MaterialSelectedEventParameters): this;

        // event: levelChanged
        attachLevelChanged(fn: (event: MaterialCard$LevelChangedEvent) => void, listener?: object): this;
        attachLevelChanged<CustomDataType extends object>(data: CustomDataType, fn: (event: MaterialCard$LevelChangedEvent, data: CustomDataType) => void, listener?: object): this;
        detachLevelChanged(fn: (event: MaterialCard$LevelChangedEvent) => void, listener?: object): this;
        fireLevelChanged(parameters?: MaterialCard$LevelChangedEventParameters): this;
    }

    /**
     * Interface describing the parameters of MaterialCard's 'materialSelected' event.
     */
    // eslint-disable-next-line
    export interface MaterialCard$MaterialSelectedEventParameters {
    }

    /**
     * Interface describing the parameters of MaterialCard's 'levelChanged' event.
     */
    // eslint-disable-next-line
    export interface MaterialCard$LevelChangedEventParameters {
    }

    /**
     * Type describing the MaterialCard's 'materialSelected' event.
     */
    export type MaterialCard$MaterialSelectedEvent = Event<MaterialCard$MaterialSelectedEventParameters>;

    /**
     * Type describing the MaterialCard's 'levelChanged' event.
     */
    export type MaterialCard$LevelChangedEvent = Event<MaterialCard$LevelChangedEventParameters>;
}
