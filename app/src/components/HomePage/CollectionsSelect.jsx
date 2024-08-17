import React, { useEffect, useState } from "react";

function CollectionsSelect({ myCollections }) {
  return (
    <select className="form-select">
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
