import React from "react";
import { useNavigate } from "react-router-dom";

function ChoseCollectionButton({ selectedCollectionId }) {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center">
      {/* <Link to="/QuestionsPanel"> */}
      <button
        type="submit"
        onClick={() => {
          if (selectedCollectionId !== "") {
            window.api.setCurrentCollection(selectedCollectionId);
            navigate("/QuestionsPanel");
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
