import React from "react";

function TeamStats({ redName, redPoints, blueName, bluePoints }) {
  return (
    <div className="row m-4 p-1">
      <div className="col-2 text-center" id="redTeamPoints">
        {redPoints}
      </div>
      <div className="col-4 text-left" id="redTeamName">
        {redName}
      </div>

      <div className="col-4 text-end " id="blueTeamName">
        {blueName}
      </div>
      <div className="col-2 text-center " id="blueTeamPoints">
        {bluePoints}
      </div>
    </div>
  );
}

export default TeamStats;
