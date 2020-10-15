import React, { useEffect, useRef, useState } from "react";
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
  const [currObjective, setcurrObjective] = useState({ MGLSDE_L_4: "" });
  const [userPick, setUserPick] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isBreak, setBreak] = useState(false);
  const [center, setCenter] = useState({ lat: 32.24995, lng: 34.91737 });
  const randomObjectives = [];
  const gameMap = useRef();

  useEffect(() => {
    newGame();
  }, []);

  const mapContainerStyles = {
    width: "40vw",
    height: "80vh",
  };

  const newGame = () => {
    for (let i = 0; i < 5; i++) {
      randomObjectives[i] =
        objectives[Math.floor(Math.random() * objectives.length)];
    }
    console.log(randomObjectives);
    setcurrObjective(randomObjectives[0]);
    setUserPick(null);
    setBreak(false);
    setLevel(1);
  };

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
    // console.log(gameMap);
    setCenter(currObjective.location);

    //calculate points
    calculatePoints(objectives[level - 1].location, location);

    //increment level
    setLevel((prev) => prev + 1);
    //setting a timer so previous objective will dissappear after 2 sec
    setTimeout(() => {
      setcurrObjective(objectives[level - 1]);
      setUserPick(null);
      setBreak(false);
    }, 2000);
  };

  const calculatePoints = (currObjective, userPick) => {
    console.log(currObjective);
    console.log(userPick);
    const distance = getDistanceFromLatLonInKm(
      currObjective.lat,
      currObjective.lng,
      userPick.lat,
      userPick.lng
    );
    console.log(distance);
    setScore((curr) => Math.floor(curr + Math.max(0, 100 - distance * 5)));
  };

  return (
    <>
      <h1>Geography Shalosh Yehidot Finals</h1>
      <h2>
        Find:{" "}
        {`${currObjective.MGLSDE_L_4.slice(
          0,
          1
        )}${currObjective.MGLSDE_L_4.slice(1).toLowerCase()}`}
      </h2>
      <LoadScript googleMapsApiKey="AIzaSyD8BcFBnjsUlLZdKroEw5_FGz22bUWIXTE">
        <GoogleMap
          mapContainerStyle={mapContainerStyles}
          zoom={7}
          center={center}
          options={{
            styles: mapStyles, //removes locations name
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
          }}
          onClick={pinMarker}
          ref={gameMap}
        >
          {userPick && <Marker key={"user"} position={userPick.location} />}
          {isBreak && (
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

//helpers
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
