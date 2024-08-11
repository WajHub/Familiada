import React from "react";
import Header from "../components/HomePage/Header.jsx";
import "../style/HomePage.css";
import NewCollectionButton from "../components/HomePage/NewCollectionButton.jsx";
import ChoseCollectionForm from "../components/HomePage/ChoseCollectionForm.jsx";

const HomePage = () => {
  return (
    <div>
      <Header />
      <NewCollectionButton />
      <ChoseCollectionForm />
    </div>
  );
};

export default HomePage;
