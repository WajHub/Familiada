import React from "react";

function NewCollectionForm({ closeOverlay, updateCollections }) {
  const onFormSubmit = () => {
    var title = document.querySelector("#title").value;
    window.api.saveCollection(title);
    updateCollections();
    closeOverlay();
  };

  return (
    <form id="form_create_new_set">
      <label htmlFor="title">Collection name:</label>
      <input
        type="text"
        id="title"
        name="title"
        required
        style={{ color: "black" }}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          onFormSubmit();
          closeOverlay();
        }}
        className="btn btn-outline-success"
      >
        Create
      </button>
    </form>
  );
}

export default NewCollectionForm;
