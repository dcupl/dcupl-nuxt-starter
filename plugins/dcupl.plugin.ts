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

const serverDcuplInstance = new DcuplInstance("server");
export default defineNuxtPlugin({
  setup: async (nuxtApp) => {
    const sessionDcuplInstance = new DcuplInstance("session");
    if (import.meta.server) {
      const shouldUpdate = await serverDcuplInstance.shouldUpdate();
      if (shouldUpdate) {
        await serverDcuplInstance.init();
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
