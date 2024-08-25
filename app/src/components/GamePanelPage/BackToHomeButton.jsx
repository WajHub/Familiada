import React from "react";
import { useNavigate } from "react-router-dom";

function BackToHomeButton() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row" style={{ marginTop: 25 }}>
        <div className="col d-flex justify-content-center">
          <button
            onClick={() => {
              window.api.deleteCurrentCollection();
              navigate("/");
            }}
            type="button"
            className="btn btn-outline-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackToHomeButton;
