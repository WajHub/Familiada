const titlediv = document.querySelector("#title");
const questiondiv = document.querySelector("#questionsContainer");
const answerdiv = document.querySelector(".answerContainer");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);

window.api.onDisplayQuestionMain((question, first, last) => {
    questiondiv.innerHTML = question;
    answerdiv.innerHTML = "";
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
    btn.classList.add("btn-primary");
    btn.classList.add("ansewr-"+index);
    btn.id = answerId;
    btn.addEventListener("click", exposeAnswer);
    btn.innerHTML = index+". "+answer;
    col.appendChild(btn);
    answerdiv.appendChild(row);
}); 

function exposeAnswer(event){
    event.target.disabled = true;
    window.api.exposeAnswer(event.target.id);
}

function display_title(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
    window.api.startGame();
}

function backToStartPage(){
    window.location.href = "index.html";
}

function nextQuestion(){
    window.api.nextQuestion();
}

function prevQuestion(){
    window.api.prevQuestion();
}




