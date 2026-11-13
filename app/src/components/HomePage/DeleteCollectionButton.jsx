import React from "react";
import { useState } from "react";
import Overlay from "../Overlay.jsx";
import ConfirmButton from "../ConfirmButton.jsx";

function DeleteCollectionButton({
  selectedCollectionId,
  onCollectionDelete,
}) {
  const [isVisibleOverlay, setOverlay] = useState(false);

  const displayOverlay = () => {
    setOverlay(true);
  };

  const hideOverlay = () => {
    setOverlay(false);
  };

  const deleteCollection = async () => {
    try {
      await window.api.deleteCollection(selectedCollectionId);
      console.log("Collection deleted");
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
    onCollectionDelete();
    hideOverlay();
  };
  return (
    <div className="d-flex justify-content-center">
      <button type="submit" onClick={displayOverlay} className="btn btn-danger">
        Delete
      </button>
      <Overlay isVisible={isVisibleOverlay} hideOverlay={hideOverlay}>
        <ConfirmButton onAccept={deleteCollection} />
      </Overlay>
    </div>
  );
}

export default DeleteCollectionButton;
