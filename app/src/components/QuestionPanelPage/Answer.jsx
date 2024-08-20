import React from "react";

function Answer({ answer }) {
  return (
    <div className="answerSaved">
      Answer: <strong>{answer.dataValues.content}</strong>
    </div>
  );
}

export default Answer;
