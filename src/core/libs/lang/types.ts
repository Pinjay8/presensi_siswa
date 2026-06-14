export type LanguageKeyType = "id" | "en";

export const LANGUAGE_OPTIONS: {
  key: LanguageKeyType;
  label: string;
  flag: string;
  countryCode?: string;
}[] = [
  {
    key: "id",
    label: "Bahasa Indonesia",
    flag: "🇮🇩",
    countryCode: "ID",
  },
  {
    key: "en",
    label: "English",
    flag: "🇬🇧",
    countryCode: "GB",
  },
];
