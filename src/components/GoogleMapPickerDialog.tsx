// components/GoogleMapPickerDialog.tsx
"use client";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete as GoogleAutocomplete,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

export function GoogleMapPickerDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (lat: string, lng: string) => void;
}) {
  const [markerPos, setMarkerPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    const place = autocomplete?.getPlace();
    const location = place?.geometry?.location;

    if (!place || !location) {
      console.warn("Place or location missing.");
      return;
    }

    const lat = location.lat();
    const lng = location.lng();

    setMarkerPos({ lat, lng });
    onSelect(lat.toFixed(6), lng.toFixed(6));
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl overflow-visible z-[999] rounded-lg p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b p-4 shadow-sm h-[45px] flex flex-col items-start justify-center bg-sidebar-border rounded-tl-lg rounded-tr-lg">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            Select Location
          </DialogTitle>
        </DialogHeader>


        {/* ✅ Use a plain <input> for Autocomplete to work */}
        <div className="relative z-[50] px-4">
          <GoogleAutocomplete
            onLoad={(a) => (autocompleteRef.current = a)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search location..."
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            />
          </GoogleAutocomplete>
        </div>

        <div className="mt-4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPos || defaultCenter}
            zoom={markerPos ? 15 : 5}
            mapTypeId="roadmap" // ✅ use roadmap to avoid satellite-only view
            onClick={(e) => {
              console.log("Map clicked at:", e);
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (lat && lng) {
                setMarkerPos({ lat, lng });
                onSelect(lat.toFixed(6), lng.toFixed(6));
                onClose();
              }
            }}
          >
            {markerPos && <Marker position={markerPos} />}
          </GoogleMap>
        </div>

        <div className="p-4 flex justify-end">
          <Button
            onClick={() => {
              if (markerPos) {
                onSelect(markerPos.lat.toFixed(6), markerPos.lng.toFixed(6));
                onClose();
              }
            }}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
