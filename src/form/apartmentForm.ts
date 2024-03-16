import $ from "jquery";
import { AddApartmentRequestBody } from "../local-notion/entities/apartment";
import { LocalNotionApiService } from "../local-notion/local-notion-api-service";
import { Modal } from "bootstrap";

export class ApartmentForm {
  public static init() {
    ApartmentForm.initImageButton();
    ApartmentForm.initCommentButton();
    ApartmentForm.initSubmitButton();
  }

  public static readonly ID = "apartmentForm";

  private static commentIndex = 0;
  private static imageIndex = 0;

  public static getValue(inputId: string): string | number | string[] {
    return $(`#${inputId}`).val();
  }

  public static setValue(
    inputId: string,
    value: string | number | string[]
  ): void {
    $(`#${inputId}`).val(value);
  }
  public static clear(inputId: string) {
    ApartmentForm.setValue(inputId, "");
  }

  private static initSubmitButton() {
    $("#submitButton").on("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = <HTMLFormElement>$(`#${ApartmentForm.ID}`).get(0);

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      LocalNotionApiService.addApartment(
        ApartmentForm.getAddApartmentRequestBody()
      );
    });
  }

  private static getAddApartmentRequestBody(): AddApartmentRequestBody {
    let apartmentRequestBody: AddApartmentRequestBody = {
      apartment: {
        Nom: ApartmentForm.getValue("nom").toString(),
        URL: ApartmentForm.getValue("url").toString(),
        Lieu: ApartmentForm.getValue("lieu").toString(),
        Prix: Number.parseInt(ApartmentForm.getValue("prix").toString()),
        Taille: Number.parseInt(ApartmentForm.getValue("surface").toString()),
        Préféré: $("#prefere").is(":checked"),
        Image: [],
      },
      comments: [],
    };

    $("#imageDiv")
      .children()
      .each((_, imageForm) => {
        const name = $(imageForm).find("[id*=name-]").val().toString();
        const url = $(imageForm).find("[id*=urlImage-]").val().toString();
        apartmentRequestBody.apartment.Image.push({ name, url });
      });

    $("#commentDiv")
      .children()
      .each((_, commentForm) => {
        const comment = $(commentForm).find("[id*=comment-]").val().toString();
        apartmentRequestBody.comments.push(comment);
      });

    return apartmentRequestBody;
  }

  public static clearForm() {
    ApartmentForm.clear("nom");
    ApartmentForm.clear("url");
    ApartmentForm.clear("lieu");
    ApartmentForm.clear("prix");
    ApartmentForm.clear("surface");
    ApartmentForm.clear("prefere");
    ApartmentForm.clearImagesForm();
    ApartmentForm.clearCommentsForm();
  }

  private static initCommentButton() {
    $("#addComment").on("click", () => ApartmentForm.addCommentForm());
  }

  public static clearCommentsForm() {
    $("#commentDiv").empty();
  }

  public static addCommentForm(comment?: string) {
    const commentDiv = $("#commentDiv");
    ApartmentForm.commentIndex += 1;

    const commentForm = $(`
      <div id="comment${ApartmentForm.commentIndex}" class="row comment-form mb-3">
        <div class="col-11">
          <div class="input-group">
            <div class="form-floating">
              <textarea
                class="form-control"
                name="comment-${ApartmentForm.commentIndex}"
                id="comment-${ApartmentForm.commentIndex}"
                placeholder="Commentaire"
                required
              >${comment ?? ""}</textarea>
              <label for="comment-${ApartmentForm.commentIndex}">Commentaire</label>
              <div class="invalid-feedback">
                Il faut écrire un commentaire
              </div>
            </div>
          </div>
        </div>

        <div class="col-1">
          <button type="button" class="btn btn-outline-danger"  id="removeComment${ApartmentForm.commentIndex}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle remove-image" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
          </button>
        </div>
      </div>
  `);

    commentDiv.append(commentForm);

    $(`#removeComment${ApartmentForm.commentIndex}`).on("click", (event) => {
      $(event.target).closest(".comment-form").remove();
    });
  }

  private static initImageButton() {
    $("#addImage").on("click", () => ApartmentForm.addImageForm());
  }

  public static clearImagesForm() {
    $("#imageDiv").empty();
  }

  public static addImageForm(name?: string, url?: string) {
    const imageDiv = $("#imageDiv");
    ApartmentForm.imageIndex += 1;

    const imageForm = $(`
      <div id="image${ApartmentForm.imageIndex}" class="row image-form mb-3">
        <div class="col-5">
          <div class="input-group">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                name="name-${ApartmentForm.imageIndex}"
                id="name-${ApartmentForm.imageIndex}"
                placeholder="Nom de l'image"
                value="${name ?? ""}"
                required
              />
              <label for="name-${ApartmentForm.imageIndex}">Nom</label>
              <div class="invalid-feedback">
                il faut entrer un nom
              </div>
            </div>
          </div>
        </div>

        <div class="col-5">
          <div class="input-group">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                name="urlImage-${ApartmentForm.imageIndex}"
                id="urlImage-${ApartmentForm.imageIndex}"
                placeholder="Url de l'image"
                value="${url ?? ""}"
                pattern="https://.+"
                required
              />
              <label for="urlImage-${ApartmentForm.imageIndex}">URL</label>
              <div class="invalid-feedback">
                il faut entrer une url (https://...)
              </div>
            </div>
          </div>
        </div>

        <div class="col-2">
          <button type="button" class="btn btn-outline-danger"  id="removeImage${ApartmentForm.imageIndex}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle remove-image" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
          </button>
        </div>
      </div>
  `);

    imageDiv.append(imageForm);

    $(`#removeImage${ApartmentForm.imageIndex}`).on("click", (event) => {
      $(event.target).closest(".image-form").remove();
    });
  }

  public static setApartmentRequestBody(
    apartmentRequestBody: AddApartmentRequestBody
  ) {
    let { apartment } = apartmentRequestBody;
    $("#lieu").val(apartment.Lieu);
    $("#nom").val(apartment.Nom);
    $("#prix").val(apartment.Prix);
    $("#surface").val(apartment.Taille);
    $("#url").val(apartment.URL);
    ApartmentForm.clearImagesForm();
    for (const image of apartment.Image) {
      ApartmentForm.addImageForm(image.name, image.url);
    }
  }

  public static showErrorModal(modalBody?: JQuery<HTMLElement>) {
    $("#errorModal .modal-body").empty();
    if (modalBody) $("#errorModal .modal-body").append(modalBody);
    new Modal("#errorModal").show();
  }
}
