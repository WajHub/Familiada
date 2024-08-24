import React from "react";

function Question({ questionContent }) {
  return (
    <div
      className="container text-center display-4 mt-2"
      id="questionsContainer"
      style={
        ({ marginBottom: 10 }, { color: "white" }, { textAlign: "center" })
      }
    >
      {questionContent}
    </div>
  );
}

export default Question;
