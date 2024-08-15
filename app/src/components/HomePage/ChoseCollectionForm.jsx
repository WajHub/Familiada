import React from "react";
import CollectionsSelect from "./CollectionsSelect.jsx";

const ChooseSetForm = () => {
  return (
    <div className="d-flex justify-content-center">
      <form id="form_chose_set">
        <div className="form-group">
          <CollectionsSelect />
          <button
            type="submit"
            onClick={(e) => choseCollection(e)}
            className="btn btn-outline-success"
          >
            Chose Set
          </button>
          <button
            type="submit"
            onClick={(e) => displayOverlayForDeleteCollection(e)}
            className="btn btn-danger"
          >
            Delete Set
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChooseSetForm;
