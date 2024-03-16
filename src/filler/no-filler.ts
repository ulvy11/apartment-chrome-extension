import { Filler } from "./filler";

export class NoFiller extends Filler {
  private hostName: string;
  constructor(hostName: string) {
    super();
    this.hostName = hostName;
  }
  public getAddApartmentRequestBody(): null {
    alert(`Filler pas implémenté pour ${this.hostName}`);
    return null;
  }
}
