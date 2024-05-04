import $ from "jquery";
import { LeBonCoinFiller } from "./le-bon-coin-filler";
import { Filler } from "./filler";
import { NoFiller } from "./no-filler";
import { ApartmentForm } from "../form/apartmentForm";
import { Utils } from "../utils/utils";

export class FillerManager {
  constructor() {
    this.init();
  }

  private filler: Filler;

  private init() {
    this.askHost();
  }

  private async askHost() {
    const tabUrl = await Utils.getTabUrl();
    if (tabUrl.startsWith("chrome://")) {
      this.handleHost("");
      return;
    }

    const res = await Utils.executeScriptOnCurrentTab(() => {
      return document.location.hostname;
    });

    if (res.tabId) {
      this.handleHost(res.results[0].result);
    }
  }

  private handleHost(hostName: string) {
    switch (hostName) {
      case "www.leboncoin.fr": {
        this.filler = new LeBonCoinFiller();
        break;
      }
      default: {
        this.filler = new NoFiller(hostName);
        break;
      }
    }

    $("#importButton")
      .off("click")
      .on("click", async () => {
        const res = await this.filler.getAddApartmentRequestBody();
        if (res) {
          ApartmentForm.setApartmentRequestBody(res);
        }
      });
  }
}
