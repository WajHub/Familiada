import React from "react";

function NavQuestions({ type, disabled }) {
  const handlerNavigation = () => {
    if (type == "Previous") window.api.prevQuestion();
    else if (type == "Next") window.api.nextQuestion();
  };
  return (
    <div className={type == "Next" ? "text-end col" : "col"}>
      <button
        onClick={handlerNavigation}
        className={
          disabled
            ? "btn btn-outline-primary disabled"
            : "btn btn-outline-primary"
        }
        id={type}
        disabled={disabled}
      >
        {type}
      </button>
    </div>
  );
}

export default NavQuestions;
