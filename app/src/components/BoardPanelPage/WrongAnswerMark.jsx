import React from "react";

function WrongAnswerMark({ team, amount }) {
  const MARK =
    "&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;X<br />&nbsp;&nbsp;X <br /> &nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;X<br></br>";

  const marksArray = Array(amount).fill(MARK);
  return (
    <div
      className={
        team == "RED"
          ? "col text-center p-3 wrongAnswerRed"
          : "col text-center p-3 wrongAnswerBlue"
      }
    >
      <div className={team == "RED" ? "wrongRed mb-4" : "wrongBlue mb-4"}>
        {marksArray.map((mark, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: mark }} />
        ))}
      </div>
    </div>
  );
}

export default WrongAnswerMark;
