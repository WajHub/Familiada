import React from "react";

function WrongAnswerMark({ team }) {
  return (
    <div className={team == "RED" ? "wrongRed mb-4" : "wrongBlue mb-4"}>
      &nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;X
      <br />
      &nbsp;&nbsp;X
      <br /> &nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;X<br></br>
    </div>
  );
}

export default WrongAnswerMark;
