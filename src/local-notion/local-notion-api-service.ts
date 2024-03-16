import $ from "jquery";
import { AddApartmentRequestBody } from "./entities/apartment";
import { Config } from "../config/config";
import { ApartmentForm } from "../form/apartmentForm";

type FetchMethod = "POST" | "GET";

export class LocalNotionApiService {
  private static PROXY_HOST: string;

  private static readonly ADD_APARTMENT_API = "/notion/addApartment";

  private static async setProxyHost() {
    LocalNotionApiService.PROXY_HOST = await Config.getProxyServer();
  }

  private static async post(
    url: string,
    method: FetchMethod,
    body?: BodyInit,
    headers?: { [key: string]: string }
  ) {
    headers = headers ?? {};
    if (!headers["content-type"])
      headers["content-type"] = "application/json;charset=UTF-8";

    return await fetch(url, {
      method,
      headers,
      body,
    });
  }

  public static async addApartment(
    apartmentRequestBody: AddApartmentRequestBody
  ) {
    await LocalNotionApiService.setProxyHost();

    try {
      const response = await LocalNotionApiService.post(
        (await LocalNotionApiService.PROXY_HOST) +
          LocalNotionApiService.ADD_APARTMENT_API,
        "POST",
        JSON.stringify(apartmentRequestBody)
      );

      const jsonResponse = await response.json();
      if (jsonResponse.pageId) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        ApartmentForm.clearForm();
        $("#resultMessage")
          .empty()
          .append(
            `<h3><strong><span class="badge text-bg-success">La page a bien été créée <a class="success-link" href="${jsonResponse.url}" target="_blank" rel="noopener noreferrer">ici</a></span></strong></h3>`
          );
      } else {
        ApartmentForm.showErrorModal(
          $("<p>Pas de page créée, veuillez réessayer</p>")
        );
      }
    } catch (e) {
      console.error(e);
      const modalBody: JQuery<HTMLElement> =
        $(`<p>Pas réussi à atteindre le proxy</p>
      <p>Vérifier que local-notion est lancé et que la configuration est bonne : ${await LocalNotionApiService.PROXY_HOST}</p>
      <p>${e}</p>`);
      ApartmentForm.showErrorModal(modalBody);
    }
  }
}
