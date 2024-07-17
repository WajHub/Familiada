const form = document.querySelector("#form_addNewQuestion");
const titlediv = document.querySelector("#title");
var containerOfQuestions = document.querySelector("#questionsContainer");

// Document ready
document.addEventListener("DOMContentLoaded", displayTitle);
document.addEventListener("DOMContentLoaded", displayQuestions);
document.addEventListener("DOMContentLoaded", changePositionOfQuestion);

// Event listeners
form.addEventListener('submit', addQuestion);

// Functions implementations

// Creating Dynamic HTML ---------
function displayTitle(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
}

function displayQuestions(){
    window.api.get_questions().then(questions =>{
        questions.forEach(question => {
            const content = question.dataValues.content;

            // create div for question
            var rowQuestion = document.createElement("div");
            rowQuestion.classList.add("questionRow", "row", "pb-4");
            rowQuestion.id = question.dataValues.id;

            var colQuestion = document.createElement("div");
            colQuestion.classList.add("questionCol","col", "pb-2");
            colQuestion.innerHTML = "Question:  <strong>" + content + "</strong>";
            
             // create button for moving questions
            var btnUp = document.createElement("button");
            btnUp.classList.add("btn", "btn-light", "btn-sm", "m-2","move-up");
            btnUp.innerHTML = "Up";

            var btnDown = document.createElement("button");
            btnDown.classList.add("btn", "btn-light", "btn-sm","m-2", "move-down");
            btnDown.innerHTML = "Down";

            // create button for delete questions 
            var btnDelete = document.createElement("button");
            btnDelete.classList.add("btn", "btn-danger", "btn-sm", "m-2");
            btnDelete.id = question.dataValues.id;
            btnDelete.innerHTML = "Delete";
            btnDelete.addEventListener('click', deleteQuestion);

            // create button for edit question
            var btnEdit = document.createElement("button");
            btnEdit.classList.add("btn", "btn-primary", "btn-sm", "m-2");
            btnEdit.innerHTML = "Edit";
            btnEdit.id = question.dataValues.id;
            btnEdit.addEventListener('click', editQuestion);
            
            // Append elements to the body
            colQuestion.appendChild(btnUp);
            colQuestion.appendChild(btnDown);
            colQuestion.appendChild(btnDelete);
            colQuestion.appendChild(btnEdit);
            rowQuestion.appendChild(colQuestion);
            displayAnswers(question.dataValues.id, rowQuestion);
            containerOfQuestions.appendChild(rowQuestion);
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

function displayOverlayForNewQuestion(){
    document.getElementById("newQuestionOverlay").style.display = "block";
    form.newQuestion = true;
    if(document.getElementsByClassName("answer").length==0) displayAddingNewAnswer();
}

function displayOverlayEditQuestion(questionContent, answersContent, answersPoints, id){
    displayOverlayForNewQuestion();
    form.newQuestion = false;
    document.querySelector(".questionInput").value = questionContent;
    form.questionId = id;
    for (let i = 0; i<answersContent.length; i++){
        if(i<answersContent.length-1) displayAddingNewAnswer();
        document.getElementsByClassName("answerInput")[i].value = answersContent[i];
        document.getElementsByClassName("pointsInput")[i].value = answersPoints[i];
    }
}

function displayAddingNewAnswer(){
    var answerContainer =  document.querySelector(".answerContainer");
    // var numberOfAnswers = document.getElementsByClassName("answer").length;

    // Col: label
    var label = document.createElement("label");    
    label.setAttribute("for", "answer");
    label.classList.add("col-2", "mt-1", "mb-1");
    label.textContent = "Answer:";

    // Col: answer
    var inputAnswerContent = document.createElement("input");
    inputAnswerContent.required = true;
    inputAnswerContent.type = "text";
    inputAnswerContent.classList.add("col-5", "answer", "answerInput", "m-1");
    inputAnswerContent.name = "answer";

    // Col: points
    var inputAnswerPoints = document.createElement("input");
    inputAnswerPoints.required = true;
    inputAnswerPoints.type = "number";
    inputAnswerPoints.classList.add("pointsInput", "col-2", "m-1");
    inputAnswerPoints.name = "quantity";
    inputAnswerPoints.min = "1";
    inputAnswerPoints.max = "100";

    // Col: delete button 
    var btnDelete = document.createElement("button");
    btnDelete.classList.add("btn", "btn-danger", "btn-sm", "col-2", "m-1");
    btnDelete.innerHTML = "Delete";
    btnDelete.addEventListener('click', (_event) => {
        _event.currentTarget.parentNode.remove();
    });

    // Row
    var row = document.createElement("div");
    row.className = "row p-3 answerRow";

    // Append all elements to the body
    row.appendChild(label);
    row.appendChild(inputAnswerContent);
    row.appendChild(inputAnswerPoints);
    row.appendChild(btnDelete);
    answerContainer.appendChild(row);
}

function displaySetNameOfTeams(){
    document.getElementById("nameTeamsOverlay").style.display = "block";
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
// --------------------------------


// Edit Dynamic HTML --------------
function changePositionOfQuestion(){
    containerOfQuestions.addEventListener('click', function(event){
        if (event.target.classList.contains('move-up') || event.target.classList.contains('move-down')){
            const item = event.target.parentElement.parentElement;
            if (event.target.classList.contains('move-up')) {
                const sibling = item.previousElementSibling;
                if (sibling) {
                    containerOfQuestions.insertBefore(item, sibling);
                }
            } else { // Przesuwanie w dół
                const sibling = item.nextElementSibling;
                if (sibling) {
                    // Zmiana polega na wstawieniu `item` przed `sibling.nextSibling`
                    containerOfQuestions.insertBefore(item, sibling.nextSibling);
                }
            }
        }
    });
}
// --------------------------------


// Service functions ---------------
function addQuestion(event){
    event.preventDefault();

    var question  = document.getElementById('questionInput').value;
    var answersForm = document.getElementsByClassName("answerInput");
    var pointsForm = document.getElementsByClassName("pointsInput");
    var id = form.questionId;

    var answers = [];
    var asnwerPoints = [];

    for (let i = 0; i<answersForm.length; i++){
        var answerContent = answersForm[i].value;
        var points = pointsForm[i].value;
        answers.push(answerContent);
        asnwerPoints.push(points);
    }
    if(form.newQuestion) window.api.addNewQuestion(question, answers, asnwerPoints);
    else window.api.updateQuestion(id, question, answers, asnwerPoints);
    location.reload();
}

function editQuestion(_event){
    var id = _event.currentTarget.id;
    window.api.getQuestions(id).then(question => {
        var questionContent = question.dataValues.content; 
        window.api.get_answers(id).then(answers => {
            var answersContent = [];
            var answersPoints = [];
            answers.forEach(answer => {
                answersContent.push(answer.dataValues.content);
                answersPoints.push(answer.dataValues.points);
            });
            displayOverlayEditQuestion(questionContent, answersContent, answersPoints, id);
        });
    });
}

function deleteQuestion(event){
    window.api.deleteQuestion(event.currentTarget.id);
    const question = document.getElementById(event.currentTarget.id);
    question.parentNode.removeChild(question);
    // location.reload();
}
// ---------------------------------


// Getting correct sequence of questions
async function getQuestionsId(){
    var questionsId = [];
    var questions = document.getElementsByClassName("questionRow");
    for(i=0; i<questions.length; i++){
        questionsId.push(questions[i].id);
    }
    return questionsId;
}

function startGame(){
    var team1 = document.getElementById("team1").value;
    var team2 = document.getElementById("team2").value;
    getQuestionsId().then((questionsId) => {
        window.api.setGameData(team1, team2, questionsId)
    });
    window.location.href = "gamePanel.html";
}

function cancelStartGame(){
    document.getElementById("nameTeamsOverlay").style.display = "none";
}



function backToStartPage(){
    window.location.href = "index.html";
}