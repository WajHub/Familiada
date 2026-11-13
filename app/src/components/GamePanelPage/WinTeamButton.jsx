import React from "react";

function WinTeamButton({ teamColor, disabled, onWin }) {
  const handleWin = () => {
    onWin(teamColor);
  };
  return (
    <div className="col">
      <div className="text-center">
        <button
          onClick={handleWin}
          disabled={disabled}
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
