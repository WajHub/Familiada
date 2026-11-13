import React from "react";

function CollectionsSelect({ myCollections, selectedCollectionId, onChange }) {
  return (
    <select
      className="form-select"
      value={selectedCollectionId}
      onChange={(event) => onChange(event.target.value)}
    >
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
