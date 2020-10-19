import React, { useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import mapStyles from "./mapStyles.json";
// import objectives from "./objectives.json";
import greenPin from "../images/green-pointer.png";
const { REACT_APP_GOOGLE_API_KEY } = process.env;

export default function MapContainer({
  currObjective,
  userPick,
  isBreak,
  setBreak,
  pinMarker,
}) {
  // const [currObjective, setcurrObjective] = useState({ MGLSDE_L_4: "" });
  // const [userPick, setUserPick] = useState(null);
  // const [score, setScore] = useState(0);
  // const [level, setLevel] = useState(1);
  // const [isBreak, setBreak] = useState(false);
  // const [center, setCenter] = useState({ lat: 32.2, lng: 34.91737 });
  const gameMap = useRef();

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
    // setCenter(currObjective.location);
  };

  // const newGame = () => {
  //   for (let i = 0; i < 5; i++) {
  //     randomObjectives[i] =
  //       objectives[Math.floor(Math.random() * objectives.length)];
  //   }
  //   console.log(randomObjectives);
  //   setcurrObjective(randomObjectives[0]);
  //   setUserPick(null);
  //   setBreak(false);
  //   setLevel(1);
  // };

  // const pinMarker = (e) => {
  //   if (isBreak) return;
  //   if (level === 6) return;

  //   setBreak(true);
  //   const latLng = e.latLng.toJSON();
  //   const location = {
  //     lat: latLng.lat,
  //     lng: latLng.lng,
  //   };
  //   setUserPick({
  //     name: "Your pick",
  //     location: location,
  //   });
  //   // console.log(gameMap);
  //   setCenter(currObjective.location);

  //   //calculate points
  //   calculatePoints(currObjective.location, location);

  //   //increment level

  //   setLevel((prev) => prev + 1);
  //   //setting a timer so previous objective will dissappear after 2 sec
  //   setTimeout(() => {
  //     setcurrObjective(randomObjectives[level]);
  //     setUserPick(null);
  //     setBreak(false);
  //   }, 2000);
  // };

  // const calculatePoints = (currObjective, userPick) => {
  //   console.log(currObjective);
  //   console.log(userPick);
  //   const distance = getDistanceFromLatLonInKm(
  //     currObjective.lat,
  //     currObjective.lng,
  //     userPick.lat,
  //     userPick.lng
  //   );
  //   console.log(distance);
  //   setScore((curr) => Math.floor(curr + Math.max(0, 100 - distance * 5)));
  // };

  return (
    <>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyles}
          zoom={7}
          center={center}
          options={{
            disableDefaultUI: true,
            styles: mapStyles, //removes locations name
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "none",
          }}
          onClick={makeMove}
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
    </>
  );
}
