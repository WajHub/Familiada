const form = document.querySelector("#form_addNewQuestion");
const titlediv = document.querySelector("#title");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);
document.addEventListener("DOMContentLoaded", display_questions);

// Event listeners
form.addEventListener('submit', addQuestion);

// Functions implementations
function backToStartPage(){
    window.api.toStartPage();
}

function display_title(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
}

function displayNewQuestion(){
    document.getElementById("newQuestionOverlay").style.display = "block";
    if(document.getElementsByClassName("answer").length==0) addNewAnswer();
}

function cancelAddNewQuestion(){
    document.getElementById("newQuestionOverlay").style.display = "none";
}

function addNewAnswer(){
    var numberOfAnswers = document.getElementsByClassName("answer").length/2;

    // Create label element
    var label = document.createElement("label");    
    label.setAttribute("for", "answer");
    label.textContent = numberOfAnswers+1+":";

    // Create first div and input element
    var div1 = document.createElement("div");
    div1.className = "answer";

    var input1 = document.createElement("input");
    input1.type = "text";
    input1.className = "answerInput";
    input1.name = "answer";

    div1.appendChild(input1);

    // Create second div and input element
    var div2 = document.createElement("div");
    div2.className = "answer";

    var input2 = document.createElement("input");
    input2.type = "number";
    input2.className = "pointsInput";
    input2.name = "quantity";
    input2.min = "1";
    input2.max = "100";

    div2.appendChild(input2);
    var answerContainer =  document.querySelector(".answerContainer");
    // Append all elements to the body
    answerContainer.appendChild(label);
    answerContainer.appendChild(div1);
    answerContainer.appendChild(div2);
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
            // create div for question
            var divQuestion = document.createElement("div");
            divQuestion.className = "question";
            divQuestion.textContent = "Question: "+content;
            containter.appendChild(divQuestion);
            window.api.get_answers(question.dataValues.id).then(answers => {
                answers.forEach(answer => {
                    const content = answer.dataValues.content;
                    const points = answer.dataValues.points;
                    var div = document.createElement("div");
                    div.className = "answerSaved";
                    div.textContent = "Answer: "+content+" Points: "+points;
                    divQuestion.appendChild(div);
                });
            });
        });
    });
}

function displaySetNameOfTeams(){
    document.getElementById("nameTeamsOverlay").style.display = "block";
}
function hideNameOfTeams(){
    document.getElementById("nameTeamsOverlay").style.display = "none";
}

function setNameTeams(){
    var team1 = document.getElementById("team1").value;
    var team2 = document.getElementById("team2").value;
    window.api.setTeams(team1, team2);
    hideNameOfTeams();
}
