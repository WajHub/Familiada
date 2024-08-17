import React, { useEffect, useState } from "react";

function QuestionsPanelPage() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    window.api.get_title().then((response) => {
      setTitle(response.dataValues.title);
    });
  });

  return <h3 id="title">{title}</h3>;
}

export default QuestionsPanelPage;
