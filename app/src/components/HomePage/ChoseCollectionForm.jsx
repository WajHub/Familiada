import React from "react";

const ChooseSetForm = () => {
  return (
    <div className="d-flex justify-content-center">
      <form id="form_chose_set">
        <div className="form-group">
          <select
            className="form-select"
            style={{ marginBottom: "10px" }}
          ></select>
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
