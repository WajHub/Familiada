import React from "react";
import { useNavigate, Link } from "react-router-dom";

function ChoseCollectionButton() {
  return (
    <div className="d-flex justify-content-center">
      <Link to="/QuestionsPanel">
        <button
          type="submit"
          onClick={() => {
            {
              event.preventDefault();
              const selected_set = document.querySelector(".form-select");
              window.api.setCurrentCollection(selected_set.value);
            }
          }}
          className="btn btn-outline-success"
        >
          Chose Collection
        </button>
        \
      </Link>
    </div>
  );
}

export default ChoseCollectionButton;
