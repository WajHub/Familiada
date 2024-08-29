import React from "react";

function WinTeamButton({ teamColor }) {
  const handleWin = () => {
    document.querySelector("#winRED").disabled = true;
    document.querySelector("#winBLUE").disabled = true;
    window.api.win(teamColor);
  };
  return (
    <div className="col">
      <div className="text-center">
        <button
          onClick={handleWin}
          type="button"
          className={
            teamColor == "RED" ? "btn btn-danger win" : "btn btn-primary win"
          }
          id={"win" + teamColor}
        >
          Win {teamColor}
        </button>
      </div>
    </div>
  );
}

export default WinTeamButton;
