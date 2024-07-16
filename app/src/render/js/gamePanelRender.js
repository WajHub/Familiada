const titlediv = document.querySelector("#title");
const questiondiv = document.querySelector("#questionsContainer");
const answerdiv = document.querySelector(".answerContainer");
var correctAnswerAudio = new Audio('../audio/CorrectAnswer.mp3');
var wrongAnswerAudio = new Audio('../audio/WrongAnswer.mp3');
var showAnswerAudio = new Audio('../audio/ShowAnswer.mp3');

// Document ready
document.addEventListener("DOMContentLoaded", display_title);

window.api.onDisplayQuestionMain((question, first, last) => {
    questiondiv.innerHTML = question;
    answerdiv.innerHTML = "";
    document.querySelector("#winRed").disabled = false;
    document.querySelector("#winBlue").disabled = false;
    if(first){
        document.querySelector("#prev").classList.add("disabled");
    }
    else {
        document.querySelector("#prev").classList.remove("disabled");
    }
    if(last){
        document.querySelector("#next").classList.add("disabled");
    }
    else {
        document.querySelector("#next").classList.remove("disabled");
    }
});

window.api.onDisplayAnswer((answer, answerId, index) => {
    // div row
    const row = document.createElement("div");
    row.classList.add("row");
    // div col
    const col = document.createElement("div");
    col.classList.add("col");

    row.appendChild(col);
    
    const btn = document.createElement("button");
    btn.classList.add("btn", "m-1");
    btn.classList.add("btn-secondary");
    btn.classList.add("answer-"+index);
    btn.id = answerId;
    btn.addEventListener("click", exposeAnswer);
    btn.innerHTML = index+". "+answer;
    col.appendChild(btn);
    const btn2 = document.createElement("button");
    btn2.classList.add("btn", "m-1");
    btn2.classList.add("btn-outline-success");
    btn2.classList.add("answer-"+index);
    btn2.id = answerId;
    btn2.addEventListener("click", guessAnswer); 
    btn2.innerHTML = "Correct Answer";
    col.appendChild(btn2);
    answerdiv.appendChild(row);
}); 

window.api.onDisplayPointsForQuestion((points) => {
    const pointsDiv = document.querySelector(".points");
    pointsDiv.innerHTML = "Suma " + points;
  });


window.api.onStatsTeam((redName, blueName, redPoints, bluePoints) => {
    const redTeam = document.querySelector("#redTeam");
    const blueTeam = document.querySelector("#blueTeam");
    redTeam.innerHTML = redName+": "+redPoints;
    blueTeam.innerHTML = blueName+": "+bluePoints;
});

function exposeAnswer(event){
    event.target.disabled = true;
    // Prefix the ID with a string to make it a valid selector
    const selector = "[id='" + event.target.id + "']";
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
        button.disabled = true;
    });
    showAnswerAudio.play();
    window.api.exposeAnswer(event.target.id);
}

function guessAnswer(event){
    event.target.disabled = true;

    const selector = "[id='" + event.target.id +"']";
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
        button.disabled = true;
    });

    correctAnswerAudio.play();
    window.api.guessAnswer(event.target.id);
}

function display_title(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
    window.api.startGame();
}

function backToStartPage(){
    // delete questions
    window.api.deleteCurrentCollection();
    window.location.href = "index.html";
    
}

function nextQuestion(){
    window.api.nextQuestion();
}

function prevQuestion(){
    window.api.prevQuestion();
}

function wrongAnswerRed(){
    wrongAnswerAudio.play();
    window.api.wrongAnswer("red");
}

function wrongAnswerBlue(){
    wrongAnswerAudio.play();
    window.api.wrongAnswer("blue");
}


function winRed(){
    document.querySelector("#winRed").disabled = true;
    document.querySelector("#winBlue").disabled = true;
    window.api.win("red");
}

function winBlue(){
    document.querySelector("#winRed").disabled = true;
    document.querySelector("#winBlue").disabled = true;
    window.api.win("blue");
}

