import React from "react";
import { useNavigate, Link } from "react-router-dom";

function ChoseCollectionButton() {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center">
      {/* <Link to="/QuestionsPanel"> */}
      <button
        type="submit"
        onClick={() => {
          {
            event.preventDefault();
            const selected_set = document.querySelector(".form-select");
            if (selected_set.value != undefined) {
              window.api.setCurrentCollection(selected_set.value);
              navigate("/QuestionsPanel");
            }
          }
        }}
        className="btn btn-outline-success"
      >
        Select
      </button>
      {/* </Link> */}
    </div>
  );
}

export default ChoseCollectionButton;
