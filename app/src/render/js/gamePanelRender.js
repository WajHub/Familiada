const titlediv = document.querySelector("#title");
const questiondiv = document.querySelector("#questionsContainer");
const answerdiv = document.querySelector(".answerContainer");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);
window.api.onDisplayQuestion((question) => {
    questiondiv.innerHTML = question;
});

window.api.onDisplayAnswer((answer, index) => {
    // div row
    const row = document.createElement("div");
    row.classList.add("row");
    // div col
    const col = document.createElement("div");
    col.classList.add("col");

    row.appendChild(col);
    col.innerHTML = index + ". "+answer;
    questiondiv.appendChild(row);
}); 

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




