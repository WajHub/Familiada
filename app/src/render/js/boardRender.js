const questionContent = document.querySelector(".question");
const answerContainer = document.querySelector("#answerContainer");

window.api.onDisplayQuestion((question) => {
  questionContent.innerHTML = "";
  answerContainer.innerHTML = "";
  questionContent.innerHTML = question;
})

window.api.onDisplayHiddenAnswer((index) => {
  console.log(index)
    // div row
  const row = document.createElement("div");
  row.classList.add("row");
    // div col
  const col = document.createElement("div");
  col.classList.add("col");

  row.appendChild(col);
  col.innerHTML = index + ". __________________";
  answerContainer.appendChild(row);
  
})

function nextQuestion(){
  window.api.counterValue("NEXT_QUESTION");
}
