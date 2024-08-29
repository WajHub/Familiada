import React from "react";

function ConfirmButton({ onAccept }) {
  return (
    <div className="container text-center h-100 d-flex align-items-center justify-content-center">
      <label htmlFor="question">Are you sure?</label>
      <button
        type="submit"
        onClick={() => {
          onAccept();
        }}
        className="btn btn-danger"
      >
        Delete
      </button>
    </div>
  );
}

export default ConfirmButton;
