import React from "react";

function ArrowsButtons() {
  return (
    <div className="col-1 p-0 d-flex align-items-center">
      <div className="row p-1 m-0">
        <button className="btn btn-light btn-sm move-up border-0 m-0 p-0 mb-1">
          <i className="bi bi-arrow-up-circle-fill text-dark h5"></i>{" "}
        </button>
        <button className="btn btn-light btn-sm move-down border-0 m-0 p-0 mt-1">
          <i className="bi bi-arrow-down-circle-fill text-dark h5"></i>{" "}
        </button>
      </div>
    </div>
  );
}

export default ArrowsButtons;
