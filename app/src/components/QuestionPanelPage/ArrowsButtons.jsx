import React from "react";

import "../../../node_modules/bootstrap-icons/font/bootstrap-icons.css";

function ArrowsButtons({ onMoveUp, onMoveDown }) {

  return (
    <div className="col-1 p-0 d-flex align-items-center">
      <div className="row p-1 m-0">
        <button
          onClick={onMoveUp}
          className="btn btn-light btn-sm move-up border-0 m-0 p-0 mb-1"
        >
          <i className="bi bi-arrow-up-circle-fill text-dark h5"></i>{" "}
        </button>
        <button
          onClick={onMoveDown}
          className="btn btn-light btn-sm move-down border-0 m-0 p-0 mt-1"
        >
          <i className="bi bi-arrow-down-circle-fill text-dark h5"></i>{" "}
        </button>
      </div>
    </div>
  );
}

export default ArrowsButtons;
