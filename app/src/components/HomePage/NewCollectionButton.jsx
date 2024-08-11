import React, { useState } from "react";
import OverlayNewCollection from "./OverlayNewCollection.jsx";

const NewCollectionButton = () => {
  const [isVisibleOverlay, setOverlay] = useState(false);

  const displayOverlay = () => {
    setOverlay(true);
  };

  const hideOverlay = () => {
    setOverlay(false);
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <button
          style={{ marginBottom: "20px" }}
          type="submit"
          onClick={displayOverlay}
          className="btn btn-success"
        >
          Create new Collection
        </button>
      </div>

      <OverlayNewCollection
        isVisible={isVisibleOverlay}
        onClose={hideOverlay}
      />
    </>
  );
};

export default NewCollectionButton;
