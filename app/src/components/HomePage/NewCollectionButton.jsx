import React, { useState } from "react";
import Overlay from "../Overlay.jsx";
import NewCollectionForm from "./NewCollectionForm.jsx";

const NewCollectionButton = ({ onCollectionAdd }) => {
  const [isVisibleOverlay, setOverlay] = useState(false);

  const displayOverlay = () => {
    console.log("displayOverlay");
    setOverlay(true);
  };

  const hideOverlay = () => {
    setOverlay(false);
  };

  return (
    <div className="d-flex justify-content-center mb-2">
      <button onClick={displayOverlay} className="btn btn-success">
        Create new Collection
      </button>
      <Overlay isVisible={isVisibleOverlay} hideOverlay={hideOverlay}>
        <NewCollectionForm
          closeOverlay={hideOverlay}
          updateCollections={onCollectionAdd}
        />
      </Overlay>
    </div>
  );
};

export default NewCollectionButton;
