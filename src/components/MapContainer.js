import React, { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import mapStyles from "./mapStyles.json";
import objectives from "./objectives.json";
import greenPin from "../images/green-pointer.png";

export default function MapContainer() {
  const [currObjective, setcurrObjective] = useState(null);
  const [userPick, setUserPick] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isBreak, setBreak] = useState(false);

  const mapContainerStyles = {
    width: "60vw",
    height: "60vh",
  };

  const defaultCenter = {
    lat: 32.24995,
    lng: 34.91737,
  };
  const map = useRef();

  const pinMarker = (e) => {
    if (isBreak) return;

    setBreak(true);
    const latLng = e.latLng.toJSON();
    const location = {
      lat: latLng.lat,
      lng: latLng.lng,
    };
    setUserPick({
      name: "Your pick",
      location: location,
    });
    setcurrObjective(objectives[level - 1]);
    //calculate points
    calculatePoints(objectives[level - 1].location, location);

    //increment level
    setLevel((prev) => prev + 1);
    //setting a timer so previous objective will dissappear after 2 sec
    setTimeout(() => {
      setcurrObjective(null);
      setUserPick(null);
      setBreak(false);
    }, 2000);
  };

  const calculatePoints = (currObjective, userPick) => {
    console.log(currObjective);
    console.log(userPick);
    const distance = Math.sqrt(
      Math.pow(currObjective.lng - userPick.lng, 2) +
        Math.pow(currObjective.lat - userPick.lat, 2)
    );
    setScore((curr) =>
      Math.floor(curr + Math.max(0, 100 - 100 * distance * 2))
    );
  };

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyD8BcFBnjsUlLZdKroEw5_FGz22bUWIXTE">
        <GoogleMap
          mapContainerStyle={mapContainerStyles}
          zoom={8}
          center={defaultCenter}
          options={{
            styles: mapStyles, //removes location name
            streetViewControl: false,
            fullscreenControl: false,
          }}
          onClick={pinMarker}
          ref={map}
        >
          {/* {locations.map((location) => (
          <Marker
            key={`location${location.name}`}
            position={location.location}
          />
        ))} */}
          {userPick && <Marker key={"user"} position={userPick.location} />}
          {currObjective && (
            <Marker
              key={"currObjective"}
              position={currObjective.location}
              color="green"
              options={{ icon: greenPin }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <h2>Current score: {score}</h2>
    </>
  );
}
