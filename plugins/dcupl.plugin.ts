import { DcuplInstance } from "~/dcupl/dcupl.instance";
import { Dcupl } from "@dcupl/core";

declare module "#app" {
  interface NuxtApp {
    $dcuplSession: {
      init: () => Promise<void>;
      dcupl: Dcupl;
    };
    $dcuplServer: {
      init: () => Promise<void>;
      dcupl: Dcupl;
    };
    $dcupl: Dcupl;
  }
}

let status: "initial_load" | "idle" | "updating" = "initial_load";

const serverDcuplInstance = new DcuplInstance("server");
export default defineNuxtPlugin({
  setup: async (nuxtApp) => {
    const sessionDcuplInstance = new DcuplInstance("session");
    if (import.meta.server) {
      const shouldUpdate = await serverDcuplInstance.shouldUpdate();

      if (shouldUpdate) {
        if (status === "initial_load") {
          console.log("initial load");
          // for the initial load we have to wait for the server instance to be initialized
          await serverDcuplInstance.init();
          status = "idle";
        } else if (status === "idle") {
          // when the server instance is idle we can update it without waiting - serving the old version until the new one is ready
          console.log("updating");
          status = "updating";
          serverDcuplInstance.init();
          status = "idle";
        }
      }
    } else {
      await sessionDcuplInstance.init();
    }

    // returns the dcupl instance depending on the server/client environment
    nuxtApp.provide(
      "dcupl",
      (() => {
        if (import.meta.server) {
          return serverDcuplInstance.dcupl;
        } else {
          return sessionDcuplInstance.dcupl;
        }
      })()
    );

    // provides the dcupl instance class if you need access to the loader or want to extend it
    nuxtApp.provide("dcuplSession", sessionDcuplInstance);
    nuxtApp.provide("dcuplServer", serverDcuplInstance);
  },
});
