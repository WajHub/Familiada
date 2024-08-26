import React from "react";

function NavQuestions({ type }) {
  const handlerNavigation = () => {
    if (type == "Previous") window.api.prevQuestion();
    else if (type == "Next") window.api.nextQuestion();
  };
  return (
    <div className={type == "Next" ? "text-end col" : "col"}>
      <div
        onClick={handlerNavigation}
        className="btn btn-outline-primary disabled"
        id={type}
        disabled=""
      >
        {type}
      </div>
    </div>
  );
}

export default NavQuestions;
