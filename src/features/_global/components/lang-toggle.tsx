import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { LanguageKeyType, LANGUAGE_OPTIONS } from "@/core/libs/lang/types";
import ReactCountryFlag from "react-country-flag";

export const LangToggle = () => {
  const changeLang = (v: string) => {
    lang.setActiveLang(v as LanguageKeyType);
    window.location.reload();
  };
  const activeLang = lang.getActiveLang();

  const currentLanguage = LANGUAGE_OPTIONS.find(
    (item) => item.key === activeLang,
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="border rounded-md bg-white">
          <ReactCountryFlag
            countryCode={currentLanguage?.countryCode || "ID"}
            svg
            style={{
              width: "1.2em",
              height: "1.2em",
              marginRight: 8,
            }}
          />
          {activeLang.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map((item) => (
          <DropdownMenuItem key={item.key} onClick={() => changeLang(item.key)}>
            <ReactCountryFlag
              countryCode={item.key === "id" ? "ID" : "GB"}
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
                marginRight: 8,
              }}
            />
            {item.label} ({item.key.toUpperCase()})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
