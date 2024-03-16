export interface PartialApartmentConfig {
  Nom?: string;
  Prix?: number;
  Lieu?: string;
  Image?: { name: string; url: string }[];
  URL?: string;
  Préféré?: boolean;
  Taille?: number;
}

export interface AddApartmentRequestBody {
  apartment: PartialApartmentConfig;
  comments?: string[];
}
