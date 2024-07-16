const form = document.querySelector("#form_addNewQuestion");
const titlediv = document.querySelector("#title");
var containerOfQuestions = document.querySelector("#questionsContainer");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);
document.addEventListener("DOMContentLoaded", display_questions);
document.addEventListener("DOMContentLoaded", changePositionOfQuestion);

// Event listeners
form.addEventListener('submit', addQuestion);

// Functions implementations
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
    var answerContainer =  document.querySelector(".answerContainer");
    var numberOfAnswers = document.getElementsByClassName("answer").length;

    // Col: label
    var label = document.createElement("label");    
    label.setAttribute("for", "answer");
    label.classList.add("col", "mt-2", "mb-2");
    label.textContent = numberOfAnswers+1+":";

    // Col: answer
    var inputAnswerContent = document.createElement("input");
    inputAnswerContent.required = true;
    inputAnswerContent.type = "text";
    inputAnswerContent.classList.add("col-6", "answer", "answerInput", "m-2");
    inputAnswerContent.name = "answer";

    // Col: points
    var inputAnswerPoints = document.createElement("input");
    inputAnswerPoints.required = true;
    inputAnswerPoints.type = "number";
    inputAnswerPoints.classList.add("pointsInput", "col", "m-2");
    inputAnswerPoints.name = "quantity";
    inputAnswerPoints.min = "1";
    inputAnswerPoints.max = "100";

    // Col: delete button 
    var btnDelete = document.createElement("button");
    btnDelete.classList.add("btn", "btn-danger", "btn-sm", "col", "m-2");
    btnDelete.innerHTML = "Delete";
    btnDelete.addEventListener('click', removeAnswer);

    // Row
    var row = document.createElement("div");
    row.className = "row p-3";

    // Append all elements to the body
    row.appendChild(label);
    row.appendChild(inputAnswerContent);
    row.appendChild(inputAnswerPoints);
    row.appendChild(btnDelete);
    answerContainer.appendChild(row);
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

function display_questions(){

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

function editQuestion(event){
    console.log(event.currentTarget.id);
}

function removeAnswer(_event){
    console.log("remove");
}

function deleteQuestion(event){
    window.api.deleteQuestion(event.currentTarget.id);
    const question = document.getElementById(event.currentTarget.id);
    question.parentNode.removeChild(question);
    // location.reload();
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

 async function  getQuestionsId(){
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

function backToStartPage(){
    window.location.href = "index.html";
}