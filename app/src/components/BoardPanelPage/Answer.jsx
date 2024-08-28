import React from "react";

function Answer({ id, index, content, isVisible }) {
  return (
    <div className="row">
      <div className="col" id="2">
        {index}. {isVisible === true ? content : "_____________"}
      </div>
    </div>
  );
}

export default Answer;
