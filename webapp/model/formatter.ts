import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default {
  statInfos: function (
    this: Controller,
    status: Record<string, number>
  ): string | undefined {
    const resourceBundle = (
      this?.getOwnerComponent()?.getModel("i18n") as ResourceModel
    )?.getResourceBundle() as ResourceBundle;
    let str = "";
    for (const key in status) {
      str += resourceBundle.getText(key) + ": " + status[key] + " ";
    }
    return str;
  },
};
