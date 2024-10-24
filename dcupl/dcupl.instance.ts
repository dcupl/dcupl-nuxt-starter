import { Dcupl } from "@dcupl/core";
import { DcuplAppLoader } from "@dcupl/loader";

export class DcuplInstance {
  public dcupl!: Dcupl;
  public dcuplAppLoader!: DcuplAppLoader;
  public changedAt = 0;
  public projectId = "PP7ECntN4AI5Zfn5vEou";
  public apiKey = "e0aa9e13-8f82-4edb-a5f3-3cf0c9e40207";

  constructor(public type: string) {}

  public async init() {
    try {
      const response = await this.getNewDcuplInstance();
      // destroy existing instance if it exists
      if (this.dcupl) {
        this.dcupl.destroy();
      }
      this.dcupl = response.dcupl;
      this.dcuplAppLoader = response.loader;
      console.log("[dcupl initialized]", this.type, this.changedAt);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Fetches the 'Status' (containing a changedAt timestamp) from the dcupl API to
   * decide if the server instance should be updated.
   * It only works if the data & model files are all loaded from the dcupl CDN since
   * the dcupl API does not intercept files loaded from other sources.
   * Depending on your use case, you may have to modify this function.
   */
  public async shouldUpdate() {
    const response: any = await $fetch(
      `https://api.dcupl.com/projects/${this.projectId}/files/versions/draft/status`
    );

    const changedAt = response?.changedAt;
    if (changedAt && changedAt > this.changedAt) {
      this.changedAt = changedAt;
      return true;
    }
    return false;
  }

  private async getNewDcuplInstance() {
    const dcupl = new Dcupl({
      config: {
        projectId: this.projectId,
        apiKey: this.apiKey,
      },
    });

    const dcuplAppLoader = new DcuplAppLoader();

    dcupl.loaders.add(dcuplAppLoader);

    await dcuplAppLoader.config.fetch();

    await dcuplAppLoader.process({ applicationKey: "default" });

    await dcupl.init();

    return { dcupl, loader: dcuplAppLoader };
  }
}
