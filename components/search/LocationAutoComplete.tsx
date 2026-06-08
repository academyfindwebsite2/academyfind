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
    let intervalId: NodeJS.Timeout;

    const initToken = () => {
      // 🚨 Pura path securely check karna zaroori hai (Optional Chaining ka use)
      if (typeof window !== "undefined" && window.google?.maps?.places) {
        setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
        clearInterval(intervalId); // Token milte hi interval rok do
      }
    };

    // 1. Component load hote hi pehli baar try karo
    initToken();

    // 2. Agar Google Maps slow load ho raha hai, toh har 300ms mein check karo
    intervalId = setInterval(initToken, 300);

    // 3. Cleanup function taaki memory leak na ho
    return () => clearInterval(intervalId);
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
        apiOptions={{
          language: 'en',
          region: 'in',
        }}
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
          // LocationAutocomplete.tsx ke andar styles prop ko isse replace karein:

        styles: {
          control: (provided, state) => ({
            ...provided,
            borderRadius: "0.75rem", // rounded-xl
            padding: "0.2rem",
            borderColor: state.isFocused ? "#fbbf24" : "#e2e8f0", // Focus par amber
            boxShadow: state.isFocused ? "0 0 0 1px #fbbf24" : "none",
            "&:hover": { borderColor: "#fbbf24" },
          }),
          menu: (provided) => ({
            ...provided,
            borderRadius: "1rem", // rounded-2xl
            marginTop: "0.5rem",
            padding: "0.5rem",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            border: "1px solid #e2e8f0",
          }),
          option: (provided, state) => ({
            ...provided,
            borderRadius: "0.5rem", // rounded-lg
            padding: "0.75rem 1rem",
            backgroundColor: state.isFocused ? "#fffbeb" : "white", // amber-50
            color: state.isFocused ? "#92400e" : "#334155", // amber-800 : slate-700
            cursor: "pointer",
            margin: "0.2rem 0",
            fontWeight: state.isFocused ? "500" : "400",
          }),
          input: (provided) => ({
            ...provided,
            color: "#334155", // slate-700
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#94a3b8", // slate-400
          }),
        },
        }}
        autocompletionRequest={{
          componentRestrictions: { country: "in" },
          types: ["geocode"],
          sessionToken: sessionToken, 
        }as any}
      />
    </div>
  );
}