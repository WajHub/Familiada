import React from "react";
import "../../../node_modules/bootstrap-icons/font/bootstrap-icons.css";

function EditDeleteButtons({ id, editQuestion, deleteQuestion }) {
  const handleDeleteQuestion = () => {
    window.api.deleteQuestion(id);
    deleteQuestion(id);
  };

  return (
    <div className="col-1 d-flex align-items-center mb-3 p-0">
      <div className="row m-0">
        <button
          onClick={handleDeleteQuestion}
          className="btn btn-danger btn-sm m-0 mb-2 "
        >
          <i className="bi bi-trash"></i>
        </button>
        <button
          onClick={(event) => {
            editQuestion(id);
          }}
          className="btn btn-primary btn-sm m-0"
        >
          <i className="bi bi-pencil"></i>
        </button>
      </div>
    </div>
  );
}

export default EditDeleteButtons;
