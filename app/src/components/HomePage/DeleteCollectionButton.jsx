import React from "react";
import { useState } from "react";
import Overlay from "../Overlay.jsx";
import ConfirmButton from "../ConfirmButton.jsx";

function DeleteCollectionButton({ onCollectionDelete }) {
  const [isVisibleOverlay, setOverlay] = useState(false);

  const displayOverlay = () => {
    setOverlay(true);
  };

  const hideOverlay = () => {
    setOverlay(false);
  };

  const deleteCollection = () => {
    const selected_set = document.querySelector(".form-select");
    window.api.deleteCollection(selected_set.value).then(() => {
      console.log("Collection deleted");
    });
    onCollectionDelete();
    hideOverlay();
  };
  return (
    <div className="d-flex justify-content-center">
      <button type="submit" onClick={displayOverlay} className="btn btn-danger">
        Delete Set
      </button>
      <Overlay isVisible={isVisibleOverlay} hideOverlay={hideOverlay}>
        <ConfirmButton onAccept={deleteCollection} />
      </Overlay>
    </div>
  );
}

export default DeleteCollectionButton;
