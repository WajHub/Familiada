import React from "react";

const OverlayNewCollection = ({ isVisible, onClose }) => {
  const onFormSubmit = (event) => {
    event.preventDefault();
    var title = document.querySelector("#title").value;
    window.api.saveCollection(title);
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="overlay h-100 d-flex align-items-center justify-content-center">
      <form id="form_create_new_set">
        <label htmlFor="title">Collection name:</label>
        <input type="text" id="title" name="title" required />
        <button
          type="submit"
          onClick={onFormSubmit}
          className="btn btn-outline-success"
        >
          Create
        </button>
      </form>

      <button
        type="submit"
        onClick={onClose}
        className="btn btn-danger"
        id="cancelButton"
      >
        Cancel
      </button>
    </div>
  );
};

export default OverlayNewCollection;
