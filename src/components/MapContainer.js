import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import mapStyles from "./mapStyles.json";
import greenPin from "../images/green-pointer.png";
const { REACT_APP_GOOGLE_API_KEY } = process.env;

export default function MapContainer({ currObjective, userPick, isBreak, setBreak, pinMarker }) {
  const mapContainerStyles = {
    width: "98.8vw",
    height: "100vh",
  };

  const center = { lat: 31.5, lng: 36.5 };

  const makeMove = (e) => {
    setBreak(true);
    const latLng = e.latLng.toJSON();
    const location = {
      lat: latLng.lat,
      lng: latLng.lng,
    };
    pinMarker(location);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_GOOGLE_API_KEY,
  });

  console.log(process.env.REACT_APP_GOOGLE_API_KEY);
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyles}
      zoom={8}
      center={center}
      options={{
        disableDefaultUI: true,
        styles: mapStyles, //removes locations name
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "cooperative",
      }}
      onClick={makeMove}
    >
      {userPick && <Marker key={"user"} position={userPick.location} />}
      {isBreak && (
        <Marker key={"currObjective"} position={currObjective.location} color="green" options={{ icon: greenPin }} />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}
