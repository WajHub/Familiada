import React from "react";
import { Link } from "react-router-dom";

function nav({ displayOverlayNameOfTeams }) {
  return (
    <div className="container">
      <div className="row" style={{ marginTop: "25px" }}>
        <div className="col d-flex justify-content-center">
          <Link to="/">
            <button type="button" className="btn btn-outline-secondary">
              Back
            </button>
          </Link>
        </div>
        <div className="col d-flex justify-content-center">
          <button
            onClick={displayOverlayNameOfTeams}
            type="button"
            className="btn btn-outline-success"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default nav;
