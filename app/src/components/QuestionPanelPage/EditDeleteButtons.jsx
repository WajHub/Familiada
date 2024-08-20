import React from "react";

function EditDeleteButtons() {
  return (
    <div className="col-1 d-flex align-items-center mb-3 p-0">
      <div className="row m-0">
        <button className="btn btn-danger btn-sm m-0 mb-2 " id="6">
          <i className="bi bi-trash"></i>
        </button>
        <button className="btn btn-primary btn-sm m-0" id="6">
          <i className="bi bi-pencil"></i>
        </button>
      </div>
    </div>
  );
}

export default EditDeleteButtons;
