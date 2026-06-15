export type IucnStatus = "LC" | "NT" | "VU" | "EN" | "CR" | "DD" | "NE";
export type Seasonality = "RE" | "MB" | "MA" | "MS" | "ML" | "ACC";
export type CitesAppendix = "I" | "II" | "III";

export interface Bird {
  scientific_name: string;
  common_name: string;
  iucn_status: IucnStatus;
  seasonality: Seasonality;
  cites_appendix: CitesAppendix | null;
  size: string;
  weight: string;
  juvenile_noted: boolean;
  distribution: string | null;
  vocalization: string | null;
  male_plumage: string | null;
  female_plumage: string | null;
  zone_in_humedal: string | null;
  description: string;
  page: number;
  images: string[];
}