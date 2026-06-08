"use client";

import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface LocationAutocompleteProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export default function LocationAutocomplete({ onLocationSelect }: LocationAutocompleteProps) {
  const [value, setValue] = useState<any>(null);
  
  // 1. Session Token State
  const [sessionToken, setSessionToken] = useState<any>(null);

  // Component load hote hi Google ka Session Token generate karo
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setSessionToken(new google.maps.places.AutocompleteSessionToken());
    }
  }, []);

  const handleSelect = (selectedOption: any) => {
    setValue(selectedOption);

    if (selectedOption && window.google) {
      // 2. Google Places Service initialize karo
      const placesService = new google.maps.places.PlacesService(document.createElement("div"));

      // 3. getDetails use karo (Ye officially session ko close karta hai aur free banata hai)
      placesService.getDetails(
        {
          placeId: selectedOption.value.place_id,
          // 🚨 PRO TIP: Sirf geometry (lat/lng) aur address maango, warna Google reviews/photos ka extra charge le lega
          fields: ["geometry", "formatted_address"], 
          sessionToken: sessionToken, // Pass token here to close the session!
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || selectedOption.label;

            onLocationSelect(lat, lng, address);

            // 4. Ek search khatam! Naye search ke liye NAYA token generate kar do
            setSessionToken(new google.maps.places.AutocompleteSessionToken());
          }
        }
      );
    }
  };

  return (
    <div className="w-full sm:w-72">
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        debounce={300}
        selectProps={{
          instanceId: "google-places-location-search",
          value,
          onChange: handleSelect,
          placeholder: "Search area (e.g. Sector 62)...",
          isClearable: true,
          components: {
            DropdownIndicator: null,
          },
          styles: {
            control: (provided) => ({
              ...provided,
              borderRadius: "0.75rem",
              padding: "0.1rem",
              borderColor: "#e2e8f0",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#fbbf24",
              },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#fef3c7" : "white",
              color: "#0f172a",
              cursor: "pointer",
            }),
          },
        }}
        autocompletionRequest={{
          componentRestrictions: { country: "in" },
          types: ["geocode"],
          sessionToken: sessionToken, // 👈 Token passes to autocomplete to group keystrokes
        }as any}
      />
    </div>
  );
}