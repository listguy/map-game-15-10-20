import React from "react";

export default function LeaderBoard({ scores }) {
  return scores.map((scoreObj, i) => (
    <div key={`row${i}`} className="score-row">
      <span key={`name${i}`} className="score-name"></span>
      {scoreObj.name}
      <span key={`score${i}`}>{scoreObj.score}</span>
    </div>
  ));
}
