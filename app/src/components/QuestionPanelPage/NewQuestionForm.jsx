import React, { useState, useEffect } from "react";
import NewQuestion from "./NewQuestionOverlay/NewQuestion.jsx";
import SubmitButtons from "./NewQuestionOverlay/SubmitButtons.jsx";
import NewAnswer from "./NewQuestionOverlay/NewAnswer.jsx";

function NewQuestionForm({ newForm, update, id }) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleAddAnswer = () => {
    setAnswers((currentAnswers) => [
      ...currentAnswers,
      { id: crypto.randomUUID(), content: "", points: 0 },
    ]);
  };

  useEffect(() => {
    let active = true;

    if (!newForm) {
      window.api.getQuestions(id).then((question) => {
        if (!active) return;
        setQuestion(question.dataValues.content);
        window.api.get_answers(id).then((answersResponse) => {
          if (!active) return;
          setAnswers(
            answersResponse.map((answer) => ({
              id: answer.dataValues.id,
              content: answer.dataValues.content,
              points: answer.dataValues.points,
            }))
          );
        });
      });
    } else {
      setAnswers([{ id: crypto.randomUUID(), content: "", points: 0 }]);
    }

    return () => {
      active = false;
    };
  }, [id, newForm]);

  const updateAnswer = (answerId, field, value) => {
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer) =>
        answer.id === answerId ? { ...answer, [field]: value } : answer
      )
    );
  };

  const deleteAnswer = (answerId) => {
    setAnswers((currentAnswers) =>
      currentAnswers.filter((answer) => answer.id !== answerId)
    );
  };

  const saveQuestion = (event) => {
    event.preventDefault();
    const answerContents = answers.map((answer) => answer.content);
    const answerPoints = answers.map((answer) => answer.points);

    if (newForm) window.api.addNewQuestion(question, answerContents, answerPoints);
    else {
      window.api.updateQuestion(id, question, answerContents, answerPoints);
    }
    update();
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <form id="form_addNewQuestion" onSubmit={saveQuestion}>
        <NewQuestion
          questionsContent={question}
          onChange={setQuestion}
        />

        <div className="answerContainer container">
          {answers.map((answer) => (
            <NewAnswer
              key={answer.id}
              answer={answer.content}
              points={answer.points}
              onChange={(field, value) =>
                updateAnswer(answer.id, field, value)
              }
              onDelete={() => deleteAnswer(answer.id)}
            />
          ))}
        </div>

        <SubmitButtons displayNewAnswer={handleAddAnswer} />
      </form>
    </div>
  );
}

export default NewQuestionForm;
