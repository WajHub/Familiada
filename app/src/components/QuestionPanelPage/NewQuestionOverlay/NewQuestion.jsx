import React from "react";

function NewQuestion() {
  return (
    <div className="col-xs-4 pb-4">
      <label htmlFor="ex3">Question:</label>
      <input
        className="form-control questionInput"
        id="questionInput"
        type="text"
        required
      />
    </div>
  );
}

export default NewQuestion;
