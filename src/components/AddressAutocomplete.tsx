"use client";

import { useEffect, useRef } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";

// Libraries must be a constant to avoid re-renders in useJsApiLoader
const LIBRARIES: ("places")[] = ["places"];

interface GooglePlaceDetails {
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews?: any[]; // google.maps.places.PlaceReview[];
  types?: string[];
  website?: string;
  price_level?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos?: any[]; // google.maps.places.PlacePhoto[];
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, lat: number, lng: number, details?: GooglePlaceDetails) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  disabled
}: AddressAutocompleteProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  if (loadError) {
    console.error("Google Maps Load Error:", loadError);
    // Fallback to simple input
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <input
          type="text"
          value={value}
          disabled
          placeholder="Loading maps..."
          className={`${className} opacity-50 cursor-not-allowed`}
        />
        <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <PlacesAutocompleteInternal
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}

function PlacesAutocompleteInternal({
  value: propValue,
  onChange,
  onSelect,
  placeholder,
  className,
  disabled
}: AddressAutocompleteProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed, e.g. location bias */
    },
    debounce: 300,
    defaultValue: propValue,
  });

  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Sync internal state with external prop if it changes externally
  useEffect(() => {
    if (propValue !== value) {
      setValue(propValue, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propValue]); // Only listen to prop changes

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Select the first suggestion if available
      if (status === "OK" && data.length > 0) {
        handleSelect(data[0].description, data[0].place_id);
      }
    }
  };

  const handleSelect = async (address: string, placeIdFromSuggestion?: string) => {
    setValue(address, false);
    clearSuggestions();
    
    // Pass the raw address string immediately
    onChange(address);

    try {
      // Priority 1: Use placeId from suggestion if available (Most Accurate)
      // Priority 2: Use geocode placeId (Fallback)
      let placeId = placeIdFromSuggestion;
      // Always get Geocode for Lat/Lng (needed for map placement)
      // Note: getGeocode can take placeId too!
      const geocodeArgs = placeId ? { placeId: placeId } : { address };
      const results = await getGeocode(geocodeArgs);
      
      const latLng = await getLatLng(results[0]);
      const lat = latLng.lat;
      const lng = latLng.lng;

      // If we didn't have a placeId from suggestion, use the one from geocode
      if (!placeId) {
          placeId = results[0].place_id;
      }
      
      let details: GooglePlaceDetails | undefined = { place_id: placeId };

      if (placeId && window.google && window.google.maps && window.google.maps.places) {
          if (!placesService.current) {
              placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
          }
          
          try {
              const placeDetails = await new Promise<google.maps.places.PlaceResult | null>((resolve) => {
                  placesService.current!.getDetails({
                      placeId: placeId!, // Use specific placeId
                      fields: ['rating', 'user_ratings_total', 'reviews', 'types', 'website', 'photos', 'price_level']
                  }, (place, status) => {
                      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                          console.log(`[AddressAutocomplete] Details fetched successfully for ${placeId}`);
                          resolve(place);
                      } else {
                          console.error(`[AddressAutocomplete] Place Details Failed: ${status}`, placeId);
                          // Resolve null but log error
                          resolve(null);
                      }
                  });
              });

              if (placeDetails) {
                  details = {
                      place_id: placeId,
                      rating: placeDetails.rating,
                      user_ratings_total: placeDetails.user_ratings_total,
                      reviews: placeDetails.reviews,
                      types: placeDetails.types,
                      website: placeDetails.website,
                      price_level: placeDetails.price_level,
                      photos: placeDetails.photos
                  };
              }
          } catch (e) {
              console.error("Error fetching place details", e);
          }
      }

      onSelect(address, lat, lng, details);
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
      // Even if geocoding fails, we still have the address text
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={!ready || disabled}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {status === "OK" && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none">
          {data.map(({ place_id, description, structured_formatting }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description, place_id)}
              className="cursor-pointer px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 flex items-start gap-2"
            >
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
              <div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {structured_formatting.main_text}
                </span>
                {structured_formatting.secondary_text && (
                  <span className="ml-1 text-xs text-zinc-500 block">
                    {structured_formatting.secondary_text}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
