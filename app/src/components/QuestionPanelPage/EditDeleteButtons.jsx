import React from "react";

function EditDeleteButtons({ id, editQuestion }) {
  const handleDeleteQuestion = (event) => {
    // window.api.deleteQuestion(event.currentTarget.id);
    const question = document.getElementById(event.currentTarget.id).parentNode
      .parentNode;
    question.remove();
  };

  return (
    <div className="col-1 d-flex align-items-center mb-3 p-0">
      <div className="row m-0">
        <button
          onClick={handleDeleteQuestion}
          className="btn btn-danger btn-sm m-0 mb-2 "
          id={id}
        >
          <i className="bi bi-trash"></i>
        </button>
        <button
          onClick={(event) => {
            const id = event.currentTarget.id;
            editQuestion(id);
          }}
          className="btn btn-primary btn-sm m-0"
          id={id}
        >
          <i className="bi bi-pencil"></i>
        </button>
      </div>
    </div>
  );
}

export default EditDeleteButtons;
