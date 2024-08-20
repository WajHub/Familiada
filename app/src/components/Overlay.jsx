import React from "react";

function Overlay({ isVisible, hideOverlay, children }) {
  if (!isVisible) {
    return null;
  }
  return (
    <div className="overlay h-100 d-flex align-items-center justify-content-center">
      {children}
      <button onClick={hideOverlay} className="btn btn-primary">
        Cancel
      </button>
    </div>
  );
}

export default Overlay;
