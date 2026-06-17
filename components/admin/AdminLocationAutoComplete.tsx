"use client";

import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface LocationAutocompleteProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  className?: string; // 🚀 NAYA: Isse hum width customize kar payenge
}

export default function LocationAutocomplete({ onLocationSelect, className }: LocationAutocompleteProps) {
  const [value, setValue] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState<any>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const initToken = () => {
      if (typeof window !== "undefined" && window.google?.maps?.places) {
        setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
        clearInterval(intervalId);
      }
    };

    initToken();
    intervalId = setInterval(initToken, 300);

    return () => clearInterval(intervalId);
  }, []);

  const handleSelect = (selectedOption: any) => {
    setValue(selectedOption);

    if (selectedOption && window.google) {
      const placesService = new google.maps.places.PlacesService(document.createElement("div"));

      placesService.getDetails(
        {
          placeId: selectedOption.value.place_id,
          fields: ["geometry", "formatted_address"], 
          sessionToken: sessionToken, 
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || selectedOption.label;

            onLocationSelect(lat, lng, address);
            setSessionToken(new google.maps.places.AutocompleteSessionToken());
          }
        }
      );
    }
  };

  return (
    // 🚀 NAYA: Yahan humne default class ya custom class li hai
    <div className={className || "w-full sm:w-72"}>
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        apiOptions={{ language: 'en', region: 'in' }}
        debounce={300}
        selectProps={{
          instanceId: "google-places-location-search",
          value,
          onChange: handleSelect,
          placeholder: "Search area (e.g. Sector 62)...",
          isClearable: true,
          components: { DropdownIndicator: null },
          styles: {
            control: (provided, state) => ({
              ...provided,
              borderRadius: "0.75rem",
              padding: "0.2rem",
              borderColor: state.isFocused ? "#9333ea" : "#e2e8f0", // Form ke liye thoda purple tone (optional)
              boxShadow: state.isFocused ? "0 0 0 1px #9333ea" : "none",
              "&:hover": { borderColor: "#9333ea" },
            }),
            menu: (provided) => ({
              ...provided,
              borderRadius: "1rem",
              marginTop: "0.5rem",
              padding: "0.5rem",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              border: "1px solid #e2e8f0",
              zIndex: 120, // Dropdown form me hide na ho
            }),
            option: (provided, state) => ({
              ...provided,
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              backgroundColor: state.isFocused ? "#faf5ff" : "white", // purple-50
              color: state.isFocused ? "#581c87" : "#334155", // purple-900 : slate-700
              cursor: "pointer",
              margin: "0.2rem 0",
              fontWeight: state.isFocused ? "500" : "400",
            }),
            input: (provided) => ({ ...provided, color: "#334155" }),
            placeholder: (provided) => ({ ...provided, color: "#94a3b8" }),
          },
        }}
        autocompletionRequest={{
          componentRestrictions: { country: "in" },
          types: ["geocode", "establishment"], // Sirf areas aur businesses search kare
          sessionToken: sessionToken, 
        } as any}
      />
    </div>
  );
}