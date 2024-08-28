import React from "react";
import crossSvg from "../style/cross.png";

function Overlay({ isVisible, hideOverlay, children }) {
  if (!isVisible) {
    return null;
  }
  return (
    <div className="overlay h-100 d-flex align-items-center justify-content-center">
      {children}
      <button
        onClick={hideOverlay}
        className="btn btn-danger cancel-buttonOverlay"
      >
        <img src={crossSvg} alt="Close" />
      </button>
    </div>
  );
}

export default Overlay;
