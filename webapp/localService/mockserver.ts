import MockServer from "sap/ui/core/util/MockServer";

export default {
  init: function () {
    // create
    const mockServer = new MockServer({
      rootUri: sap.ui.require.toUrl("rf/calculator/data.svc/"),
    });

    const urlParams = new URLSearchParams(window.location.search);

    // configure mock server with a delay
    MockServer.config({
      autoRespond: true,
      autoRespondAfter: parseInt(urlParams.get("serverDelay") || "500"),
    });

    // simulate
    const path = sap.ui.require.toUrl("rf/calculator/localService");
    mockServer.simulate(path + "/metadata.xml", path + "/mockdata");

    // start
    mockServer.start();
  },
};
