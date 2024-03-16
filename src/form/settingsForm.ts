import $ from "jquery";
import { Popover } from "bootstrap";
import { Config } from "../config/config";

export class SettingsForm {
  public static init() {
    SettingsForm.initSettingsButton();
    SettingsForm.initSubmitButton();
    SettingsForm.initResetProxyButton();
  }

  public static readonly ID = "settingsForm";

  private static initSettingsButton() {
    $("#settingsButton").on("click", SettingsForm.initField);
  }

  private static initResetProxyButton() {
    $("#resetproxyServer").on("click", () => {
      SettingsForm.resetProxy();
    });
  }

  private static setProxy(proxy: string) {
    $("#proxyServer").val(proxy);
  }

  private static async initField() {
    SettingsForm.setProxy(await Config.getProxyServer());
  }

  private static resetProxy() {
    SettingsForm.setProxy(Config.getProperty(Config.PROXY_SERVER));
  }

  private static initSubmitButton() {
    $("#settingsSubmitButton").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = <HTMLFormElement>$(`#${SettingsForm.ID}`).get(0);

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      await Config.setLocalStorageProxyServer(
        $("#proxyServer").val().toString()
      );

      const popover = new Popover(event.target, {
        content: "Enregistré",
        placement: "right",
        trigger: "manual",
      });
      popover.show();

      setTimeout(() => {
        popover.dispose();
      }, 1000);
    });
  }
}
