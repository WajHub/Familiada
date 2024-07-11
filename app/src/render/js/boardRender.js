const questionContent = document.querySelector(".question");
const answerContainer = document.querySelector("#answerContainer");
const wrongAnswerRed = document.querySelector(".wrongAnswerRed");
const wrongAnswerBlue = document.querySelector(".wrongAnswerBlue");


window.api.onDisplayQuestion((question) => {
  questionContent.innerHTML = "";
  answerContainer.innerHTML = "";
  wrongAnswerBlue.innerHTML = "";
  wrongAnswerRed.innerHTML = "";
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
  col.innerHTML = index + ". _____________";
  answerContainer.appendChild(row);
})

window.api.onDisplayAnswer((index) => {
  const col = document.getElementById(index);
  col.innerHTML = index + ". " + col.innerHTML;
});

window.api.onExposeAnswerOnBoard((answer, idAnswer, points) => {
  const col = document.getElementById(idAnswer);
  var numberOfAnswer = col.innerHTML.substring(0, col.innerHTML.indexOf(" "));
  col.innerHTML = numberOfAnswer+ " "+answer+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+points;
});

window.api.onWrongAnswer((team) => {
  var div = document.createElement("div");
  div.innerHTML =  "&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;X<br>&nbsp;&nbsp;X<br> &nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;X<br>";
  if(team == "red") {
    div.classList.add("wrongRed", "mb-4");
    wrongAnswerRed.appendChild(div);
  }
  else{
    div.classList.add("wrongBlue", "mb-4");
    wrongAnswerBlue.appendChild(div);
  }
});

window.api.onDisplayPointsForQuestion((points) => {
  const pointsDiv = document.querySelector(".points");
  pointsDiv.innerHTML = "Suma " + points;
});

window.api.onStatsTeam((redName, blueName, redPoints, bluePoints) => { 
  const redTeam = document.querySelector("#redTeamPoints");
  const blueTeam = document.querySelector("#blueTeamPoints");
  const redTeamName = document.querySelector("#redTeamName");
  const blueTeamName = document.querySelector("#blueTeamName");
  redTeam.innerHTML = redPoints;
  blueTeam.innerHTML = bluePoints;
  redTeamName.innerHTML = redName;
  blueTeamName.innerHTML = blueName;
});

function nextQuestion(){
  window.api.counterValue("NEXT_QUESTION");  // TODO: zmiana nazw funkcji !
}

