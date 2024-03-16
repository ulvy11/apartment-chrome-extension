import { ApartmentForm } from "./apartmentForm";
import { SettingsForm } from "./settingsForm";

export class Forms {
  public static init() {
    ApartmentForm.init();
    SettingsForm.init();
  }
}
