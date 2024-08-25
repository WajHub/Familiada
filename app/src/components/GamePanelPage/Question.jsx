import React from "react";

function Question({ questionContent }) {
  return (
    <div
      className="container text-center display-4 mt-2"
      id="questionsContainer"
    >
      {questionContent}
    </div>
  );
}

export default Question;
