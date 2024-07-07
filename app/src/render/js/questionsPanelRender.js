const form = document.querySelector("#form_addNewQuestion");
const titlediv = document.querySelector("#title");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);
document.addEventListener("DOMContentLoaded", display_questions);

// Event listeners
form.addEventListener('submit', addQuestion);

// Functions implementations
function backToStartPage(){
    window.location.href = "index.html";
}

function display_title(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
}

function displayNewQuestion(){
    document.getElementById("newQuestionOverlay").style.display = "block";
    if(document.getElementsByClassName("answer").length==0) displayAddingNewAnswer();
}

function cancelAddNewQuestion(){
    document.getElementById("newQuestionOverlay").style.display = "none";
    // Remove all answers
    var answers = document.getElementsByClassName("answer");
    while(answers.length>0){
        answers[0].remove();
    }
    var answerContainer = document.querySelector(".answerContainer");
    answerContainer.innerHTML = "";
    document.querySelector(".questionInput").value = "";
    
}

function displayAddingNewAnswer(){
    var numberOfAnswers = document.getElementsByClassName("answer").length;

    // Create label element
    var label = document.createElement("label");    
    label.setAttribute("for", "answer");
    label.className = "col";
    label.textContent = numberOfAnswers+1+":";

    // Create first div and input element
    var div1 = document.createElement("div");
    div1.className = "col";

    var input1 = document.createElement("input");
    input1.type = "text";
    input1.classList.add("col", "answer", "answerInput");
    input1.name = "answer";

    div1.appendChild(input1);

    // Create second div and input element
    var div2 = document.createElement("div");
    div2.className = "col";

    var input2 = document.createElement("input");
    input2.type = "number";
    input2.className = "pointsInput";
    input2.name = "quantity";
    input2.min = "1";
    input2.max = "100";

    div2.appendChild(input2);

    // Create div class container and row (bootstrap)
    var container = document.createElement("div");
    container.className = "container";
    var row = document.createElement("div");
    row.className = "row p-3";
    var answerContainer =  document.querySelector(".answerContainer");

    // Append all elements to the body
    row.appendChild(label);
    row.appendChild(div1);
    row.appendChild(div2);
    container.appendChild(row);
    answerContainer.appendChild(container);
}

function addQuestion(event){
    event.preventDefault();

    var question  = document.getElementById('questionInput').value;
    var answersForm = document.getElementsByClassName("answerInput");
    var pointsForm = document.getElementsByClassName("pointsInput");

    var answers = [];
    var asnwerPoints = [];

    for (let i = 0; i<answersForm.length; i++){
        var answerContent = answersForm[i].value;
        var points = pointsForm[i].value;
        answers.push(answerContent);
        asnwerPoints.push(points);
    }

    window.api.addNewQuestion(question, answers, asnwerPoints);
    location.reload();
}

function display_questions(){
    window.api.get_questions().then(questions =>{
        questions.forEach(question => {
            const content = question.dataValues.content;
            var containter = document.querySelector("#questionsContainer");
            var containerForOneQuestion = document.createElement("div");
            containerForOneQuestion.classList.add("pb-4");
            // create div for question
            var rowQuestion = document.createElement("div");
            rowQuestion.classList.add("questionRow", "row");
            var colQuestion = document.createElement("div");
            colQuestion.classList.add("questionCol","col", "pb-2");
            colQuestion.innerHTML = "Question:  <strong>" + content + "</strong>";
            rowQuestion.appendChild(colQuestion);
            containerForOneQuestion.appendChild(rowQuestion);
            displayAnswers(question.dataValues.id, rowQuestion);
            containter.appendChild(containerForOneQuestion);
        });
    });
}

function displayAnswers(id, rowQuestion){
    window.api.get_answers(id).then(answers => {
        answers.forEach(answer => {
            const content = answer.dataValues.content;
            const points = answer.dataValues.points;
            var div = document.createElement("div");
            div.className = "answerSaved";
            div.innerHTML = "Answer: <strong>"+content+" ("+points+")</strong>";
            rowQuestion.appendChild(div);
        });
    });
}

function displaySetNameOfTeams(){
    document.getElementById("nameTeamsOverlay").style.display = "block";
}

function hideNameOfTeams(){
    document.getElementById("nameTeamsOverlay").style.display = "none";
}

function startGame(){
    var team1 = document.getElementById("team1").value;
    var team2 = document.getElementById("team2").value;
    window.api.setTeams(team1, team2);
    window.location.href = "gamePanel.html";
}
