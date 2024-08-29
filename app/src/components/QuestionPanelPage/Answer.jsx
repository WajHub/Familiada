import React from "react";

function Answer({ answer }) {
  return (
    <div className="answerSaved">
      Answer: <strong>{answer.dataValues.content}</strong> points
      <strong>({answer.dataValues.points})</strong>
    </div>
  );
}

export default Answer;
