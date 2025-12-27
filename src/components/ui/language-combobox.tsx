"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Comprehensive list of languages with ISO 639-1 codes
const LANGUAGES = [
  // Most common languages first
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },

  // Other languages alphabetically
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "hy", name: "Armenian", nativeName: "Հայերdelays" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan" },
  { code: "eu", name: "Basque", nativeName: "Euskara" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ" },
  { code: "ca", name: "Catalan", nativeName: "Català" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "et", name: "Estonian", nativeName: "Eesti" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "ka", name: "Georgian", nativeName: "ქართული" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mt", name: "Maltese", nativeName: "Malti" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "fa", name: "Persian", nativeName: "فارسی" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { code: "so", name: "Somali", nativeName: "Soomaali" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbek" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
]

interface LanguageComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function LanguageCombobox({
  value,
  onValueChange,
  placeholder = "Select language...",
  disabled = false,
}: LanguageComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedLanguage ? selectedLanguage.name : placeholder}
            </span>
            {selectedLanguage && (
              <span className="text-xs text-muted-foreground">
                ({selectedLanguage.code})
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {LANGUAGES.map((language) => (
                <CommandItem
                  key={language.code}
                  value={`${language.name} ${language.nativeName} ${language.code}`}
                  onSelect={() => {
                    onValueChange(language.code)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === language.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1">{language.name}</span>
                  {language.nativeName !== language.name && (
                    <span className="text-muted-foreground text-sm ml-2">
                      {language.nativeName}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-2">
                    {language.code}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Export the languages list for use elsewhere
export { LANGUAGES }
