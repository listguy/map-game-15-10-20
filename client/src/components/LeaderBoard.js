import React from "react";
import styled from "styled-components";
//styled components
const Wrapper = styled.div`
  width: 20vw;
  color: rgb(250, 230, 220);
  font-family: "Chilanka", cursive;
  font-family: "Quicksand", sans-serif;
  line-height: 1.4em;

  hr {
    width: 20vw;
    border: 0.5px solid rgb(250, 100, 120);
  }
`;

const BoardHeader = styled.li`
  display: grid;
  grid-template-columns: 2fr 6fr 4fr;
  margin: 0 auto;
  width: 20vw;
  font-weight: 900;
`;

const BoardRow = styled.li`
  display: grid;
  grid-template-columns: 2fr 6fr 4fr;
  margin: 0 auto;
  width: 20vw;
`;
const RankCell = styled.span`
  text-align: center;
`;
const NameCell = styled.span`
  margin-left: 2vw;
`;

const ScoreCell = RankCell;

export default function LeaderBoard({ scores, prefix, pageNumber }) {
  return (
    <Wrapper>
      <BoardHeader>
        <RankCell>Rank</RankCell>
        <NameCell>Name</NameCell>
        <ScoreCell>Score</ScoreCell>
      </BoardHeader>
      <hr />
      {scores.map((scoreObj, i) => (
        <>
          <BoardRow key={`row${i}`}>
            <RankCell key={`rank${i}`}>
              {pageNumber * 40 + prefix * 10 + i + 1}
            </RankCell>
            <NameCell key={`name${i}`}>
              {scoreObj.name ? scoreObj.name : "------"}
            </NameCell>
            <ScoreCell key={`score${i}`}>
              {scoreObj.score ? scoreObj.score : "---"}
            </ScoreCell>
          </BoardRow>
          <hr />
        </>
      ))}
    </Wrapper>
  );
}
