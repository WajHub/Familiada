const questionContent = document.querySelector(".question");
const answerContainer = document.querySelector("#answerContainer");

window.api.onDisplayQuestion((question) => {
  questionContent.innerHTML = "";
  answerContainer.innerHTML = "";
  questionContent.innerHTML = question;
})

window.api.onDisplayHiddenAnswer((index, idAnswer) => {
    // div row
  const row = document.createElement("div");
  row.classList.add("row");
    // div col
  const col = document.createElement("div");
  col.classList.add("col");
  col.id = idAnswer;

  row.appendChild(col);
  col.innerHTML = index + ". __________________";
  answerContainer.appendChild(row);
})

window.api.onDisplayAnswer((index) => {
  const col = document.getElementById(index);
  col.innerHTML = index + ". " + col.innerHTML;
});

window.api.onExposeAnswerOnBoard((answer, idAnswer, points) => {
  const col = document.getElementById(idAnswer);
  var numberOfAnswer = col.innerHTML.substring(0, col.innerHTML.indexOf(" "));
  console.log(numberOfAnswer);
  col.innerHTML = numberOfAnswer+ " "+answer+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+points;
});

function nextQuestion(){
  window.api.counterValue("NEXT_QUESTION");
}
