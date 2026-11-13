import React from "react";

function NewCollectionForm({ closeOverlay, updateCollections }) {
  const [title, setTitle] = React.useState("");

  const onFormSubmit = () => {
    window.api.saveCollection(title);
    updateCollections();
    closeOverlay();
  };

  return (
    <form
      id="form_create_new_set"
      onSubmit={(event) => {
        event.preventDefault();
        onFormSubmit();
      }}
    >
      <label htmlFor="title">Collection name:</label>
      <input
        type="text"
        id="title"
        name="title"
        required
        style={{ color: "black" }}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit" className="btn btn-outline-success">
        Create
      </button>
    </form>
  );
}

export default NewCollectionForm;
