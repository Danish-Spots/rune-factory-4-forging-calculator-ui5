import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";

export default class Material extends Controller {
  onInit(): void | undefined {
    const router = UIComponent.getRouterFor(this);
    router
      .getRoute("material")
      ?.attachPatternMatched(this.onObjectMatched, this);
  }

  onObjectMatched(event: Route$PatternMatchedEvent): void | undefined {
    const view = this.getView();
    const args: any = event.getParameter("arguments");
    view?.bindElement({
      model: "data",
      path: `/Materials('${args?.materialId}')`,
      events: {
        change: this.onBindingChange.bind(this),
        dataRequested: function (_event: any) {
          console.log("dataRequested");
          view.setBusy(true);
        },
        dataReceived: function (_event: any) {
          console.log("dataReceived");
          view.setBusy(false);
        },
      },
    });
  }

  onBindingChange(): void | undefined {
    // if (!this.getView()?.getBindingContext("data")) {
    //   UIComponent.getRouterFor(this)?.getTargets()?.display("notFound");
    // }
  }
}
