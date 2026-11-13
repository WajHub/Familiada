import React from "react";

function NewQuestion({ questionsContent, onChange }) {
  return (
    <div className="col-xs-4 pb-4">
      <label htmlFor="ex3">Question:</label>
      <input
        className="form-control questionInput"
        id="questionInput"
        type="text"
        value={questionsContent}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}

export default NewQuestion;
