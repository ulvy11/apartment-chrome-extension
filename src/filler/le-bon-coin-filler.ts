import { AddApartmentRequestBody } from "../local-notion/entities/apartment";
import { Filler } from "./filler";
import { Utils } from "../utils/utils";

export class LeBonCoinFiller extends Filler {
  public async getAddApartmentRequestBody(): Promise<AddApartmentRequestBody> {
    const func = (): AddApartmentRequestBody => {
      let apartmentRequestBody: AddApartmentRequestBody = {
        apartment: {},
      };

      const lieu = document
        .querySelector("[data-qa-id='adview_spotlight_description_container']")
        .querySelector('[href="#map"]')
        .textContent.trim();

      apartmentRequestBody.apartment.Lieu = lieu;

      const nom = document
        .querySelector("[data-qa-id='adview_spotlight_description_container']")
        .querySelector('[data-qa-id="adview_title"]')
        .textContent.trim();

      apartmentRequestBody.apartment.Nom = nom;

      // de la forme "400 €Charges comprisesCC"
      const prixComplet = document
        .querySelector("[data-qa-id='adview_spotlight_description_container']")
        .querySelector('[data-qa-id="adview_price"]').textContent;

      apartmentRequestBody.apartment.Prix = Number.parseInt(
        prixComplet.substring(0, prixComplet.indexOf("€")).trim()
      );

      const elements = document
        .querySelector("[data-qa-id='adview_spotlight_description_container']")
        .querySelectorAll(".text-body-1");

      // de la forme "18 m² ·"
      let surface = "";
      elements.forEach((element) => {
        if (element.textContent.includes("m²")) {
          surface = element.textContent;
          return;
        }
      });
      apartmentRequestBody.apartment.Taille = Number.parseInt(
        surface.substring(0, surface.indexOf("m²")).trim()
      );

      const url = document.location.href;
      apartmentRequestBody.apartment.URL = url;

      const images: { name: string; url: string }[] = [];

      const photos = document.querySelectorAll("button > img");
      const altValues = new Set();

      photos.forEach((elt) => {
        const alt = elt.getAttribute("alt");
        if (!altValues.has(alt)) {
          altValues.add(alt);

          const imageUrl = elt.getAttribute("src");
          images.push({
            name: alt,
            url: imageUrl,
          });
        }
      });

      apartmentRequestBody.apartment.Image = images.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return apartmentRequestBody;
    };

    const openPhotos = () => {
      const tags = document.querySelectorAll("button");

      const tagsWithPhotos = Array.from(tags).find((tag) => {
        const pattern = /Voir les [0-9]+ photos/;
        return pattern.test(tag.innerText);
      });

      tagsWithPhotos.click();
    };

    const closePhotos = () => {
      document.querySelector("[data-title='Close']").closest("button").click();
    };
    await Utils.executeScriptOnCurrentTab(openPhotos);

    await new Promise((r) => setTimeout(r, 200));

    const res = await Utils.executeScriptOnCurrentTab(func);

    Utils.executeScriptOnCurrentTab(closePhotos);

    if (res.tabId) {
      return res.results[0].result;
    }

    alert("No results were found on the page");

    return {
      apartment: {},
    };
  }
}
