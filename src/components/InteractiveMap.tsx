"use client";

import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Loader2, Sparkles } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem"
};

const centerDefault = {
  lat: 35.6895,
  lng: 139.6917
};

const OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};

interface LocationData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  features?: string; // Comma separated tags usually
  googleTypes?: string[];
  tags?: string[]; // Explicit tags
}

interface InteractiveMapProps {
  locations: LocationData[];
}

// Simple Icon Mapping
const getIconUrl = (tags: string[] = [], features: string = "") => {
  const combined = (tags.join(" ") + " " + features).toLowerCase();
  
  if (combined.includes("anime") || combined.includes("geek") || combined.includes("game")) {
    return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; // Placeholder for custom icon
  }
  if (combined.includes("spicy") || combined.includes("food") || combined.includes("ramen")) {
    return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
  }
  if (combined.includes("bar") || combined.includes("drink") || combined.includes("izakaya")) {
    return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
  }
  return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
};

const LIBRARIES: ("places")[] = ["places"];

export function InteractiveMap({ locations }: InteractiveMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoadingRec, setIsLoadingRec] = useState(false);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;
    
    locations.forEach(loc => {
      if (loc.latitude && loc.longitude) {
        bounds.extend({ lat: loc.latitude, lng: loc.longitude });
        hasPoints = true;
      }
    });

    if (hasPoints) {
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [locations]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Fetch Recommendation when selection changes
  useEffect(() => {
    if (selectedLocation) {
      fetchRecommendation(selectedLocation);
    } else {
      setRecommendation(null);
    }
  }, [selectedLocation]);

  const fetchRecommendation = async (loc: LocationData) => {
    setIsLoadingRec(true);
    setRecommendation(null);
    try {
      const res = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: loc.name,
          address: loc.address,
          tags: loc.tags || (loc.features ? loc.features.split(',') : []),
          googleTypes: loc.googleTypes
        })
      });
      const data = await res.json();
      setRecommendation(data.recommendation);
    } catch (e) {
      console.error(e);
      setRecommendation("Failed to load recommendation.");
    } finally {
      setIsLoadingRec(false);
    }
  };

  if (!isLoaded) return <div className="h-[400px] w-full rounded-lg bg-zinc-100 flex items-center justify-center"><Loader2 className="animate-spin text-zinc-400" /></div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={centerDefault}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={OPTIONS}
    >
      {locations.map((loc, idx) => {
        if (!loc.latitude || !loc.longitude) return null;
        
        return (
          <MarkerF
            key={`${loc.name}-${idx}`}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            onClick={() => setSelectedLocation(loc)}
            icon={getIconUrl(loc.tags, loc.features)}
          />
        );
      })}

      {selectedLocation && (
        <InfoWindowF
          position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="max-w-[250px] p-1">
            <h3 className="font-bold text-sm mb-1">{selectedLocation.name}</h3>
            <p className="text-xs text-zinc-500 mb-2">{selectedLocation.address}</p>
            
            <div className="bg-indigo-50 rounded-md p-2 border border-indigo-100">
              <div className="flex items-center gap-1 mb-1 text-indigo-700">
                <Sparkles className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase">Host Recommendation</span>
              </div>
              
              {isLoadingRec ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                  <span className="text-xs text-indigo-400">Asking AI Host...</span>
                </div>
              ) : (
                <p className="text-xs text-zinc-700 leading-relaxed">
                  {recommendation}
                </p>
              )}
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
