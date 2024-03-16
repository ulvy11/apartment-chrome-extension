import { AddApartmentRequestBody } from "../local-notion/entities/apartment";

export abstract class Filler {
  public abstract getAddApartmentRequestBody(): Promise<AddApartmentRequestBody> | null;
}
