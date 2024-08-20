import React from "react";
import { useState, useEffect } from "react";

import NewCollectionButton from "../components/HomePage/NewCollectionButton.jsx";
import CollectionsSelect from "../components/HomePage/CollectionsSelect.jsx";
import ChoseCollectionButton from "../components/HomePage/ChoseCollectionButton.jsx";
import DeleteCollectionButton from "../components/HomePage/DeleteCollectionButton.jsx";

const HomePage = () => {
  const [myCollections, setCollections] = useState([]);

  const updateCollections = () => {
    window.api.getCollections().then((collections) => {
      setCollections(collections);
    });
  };

  useEffect(() => {
    updateCollections();
  }, []);

  return (
    <div className="content">
      <div className="d-flex justify-content-center">
        <h1 className="h1">Familiada</h1>
      </div>
      <NewCollectionButton onCollectionAdd={updateCollections} />
      {myCollections && <CollectionsSelect myCollections={myCollections} />}
      <div className="d-flex justify-content-center">
        <ChoseCollectionButton />
        <DeleteCollectionButton onCollectionDelete={updateCollections} />
      </div>
    </div>
  );
};

export default HomePage;
