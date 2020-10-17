import React, { useState, useEffect, useRef } from "react";
import MapContainer from "./MapContainer";
import LeaderBoard from "./LeaderBoard";
import Modal from "./Modal";
import objectives from "./objectives.json";
import styled from "styled-components";
const randomObjectives = [];

//styled components
const FadedBackground = styled.div`
  background-color: rgba(48, 49, 48, 0.82);
  position: fixed;
  top: 0;
  height: 100%;
  transition: all 1.3s;
  width: 100%;
  z-index: 2;
`;

const InfoBox = styled.div`
  background: linear-gradient(
    90deg,
    rgba(25, 25, 25, 1) 0%,
    rgba(69, 71, 73, 1) 73%
  );
  position: absolute;
  width: 35vw;
  height: 40vh;
  top: 10vh;
  left: 50vw;
  padding: 10px 20px;
  font-family: "Chilanka", cursive;
  font-family: "Quicksand", sans-serif;
  line-height: 2.5em;
  color: rgb(250, 100, 120);
  border-radius: 10px;
  z-index: 1;
`;

const Row = styled.div`
  font-size: 1.5em;
`;

const MiniTitles = styled.span`
  font-weight: 900;
`;

const Button = styled.button`
  background-color: rgb(230, 250, 245);
  position: absolute;
  border: none;
  cursor: pointer;
  font-weight: bold;
  outline: none;
  bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  width: fit-content;
  font-family: "Chilanka", cursive;
  font-family: "Quicksand", sans-serif;
  color: rgb(250, 100, 120);
  &:hover {
    filter: brightness(1.25);
    transition: 0.5s;
  }
`;

export default function GameController() {
  const [currObjective, setcurrObjective] = useState({ MGLSDE_L_4: "" });
  const [userPick, setUserPick] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isBreak, setBreak] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    newGame();
    fetchScores();
  }, []);

  const nameInput = useRef();

  const newGame = () => {
    let i = 0;
    while (i < 5) {
      let newObjective =
        objectives[Math.floor(Math.random() * objectives.length)];

      if (!newObjective.MGLSDE_L_4) continue;
      randomObjectives[i] = newObjective;
      i++;
    }
    setcurrObjective(randomObjectives[0]);
    setUserPick(null);
    setBreak(false);
    setScore(0);
    setLevel(1);
  };

  const pinMarker = (location) => {
    if (isBreak) return;

    // setBreak(true);
    // const latLng = e.latLng.toJSON();
    // const location = {
    //   lat: latLng.lat,
    //   lng: latLng.lng,
    // };
    setUserPick({
      name: "Your pick",
      location: location,
    });
    // console.log(gameMap);
    // setCenter(currObjective.location);

    //calculate points
    calculatePoints(currObjective.location, location);

    //Stop game from progressing after reaching level 5
    if (level === 5) {
      setTimeout(() => {
        openModal();
      }, 2000);
      return;
    }

    //increment level
    //setting a timer so previous objective will dissappear after 2 sec
    setTimeout(() => {
      setLevel((prev) => prev + 1);
      setcurrObjective(randomObjectives[level]);
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
    setScore((curr) => Math.floor(curr + Math.max(0, 100 - distance * 2)));
  };

  const fetchScores = async () => {
    fetch("/api/v1/scores")
      .then((response) => response.json())
      .then((scores) => setLeaderBoard(scores));
  };

  const submitScore = async () => {
    if (!nameInput.current.value) return;
    const response = await fetch("/api/v1/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: nameInput.current.value, score: score }),
    });
    if (response.msg) {
      alert(response.msg);
    } else {
      closeModal();
      fetchScores();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    newGame();
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      {showModal ? (
        <FadedBackground onClick={closeModal}></FadedBackground>
      ) : null}
      <Modal
        onClose={closeModal}
        show={showModal}
        content={{
          header: "Game Over",
          body: `You scored ${score} points.`,
          elements: (
            <input
              type="text"
              placeholder="Your name"
              ref={nameInput}
              maxLength="18"
            />
          ),
        }}
        actionInfo={{ text: "SUBMIT", action: submitScore }}
      />
      <InfoBox>
        <h1>Geography Shalosh Yehidot Finals</h1>
        <h3>{`Level ${level}`}</h3>
        <Row>
          <MiniTitles>Find:</MiniTitles>{" "}
          {`${currObjective.MGLSDE_L_4.slice(
            0,
            1
          )}${currObjective.MGLSDE_L_4.slice(1).toLowerCase()}`}
        </Row>
        <Row>
          <MiniTitles>Current score:</MiniTitles>
          {" " + score}
        </Row>
        <Button onClick={newGame}>New Game</Button>
      </InfoBox>
      <MapContainer
        currObjective={currObjective}
        userPick={userPick}
        setUserPick={setUserPick}
        setScore={setScore}
        isBreak={isBreak}
        setBreak={setBreak}
        pinMarker={pinMarker}
      />
      <h1>LEADERS BOARD:</h1>
      <LeaderBoard scores={leaderBoard} />
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
