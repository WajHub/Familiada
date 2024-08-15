import React, { useEffect, useState } from "react";

function CollectionsSelect() {
  const [myCollections, setCollections] = useState([]);

  useEffect(() => {
    window.api.getCollections().then((collections) => {
      setCollections(collections);
    });
  }, []);

  return (
    <select className="form-select" style={{ marginBottom: "10px" }}>
      {myCollections.map((collection) => {
        return (
          <option
            key={collection.dataValues.id}
            value={collection.dataValues.id}
          >
            {collection.dataValues.title}
          </option>
        );
      })}
    </select>
  );
}

export default CollectionsSelect;
