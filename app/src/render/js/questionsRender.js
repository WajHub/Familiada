const form = document.querySelector("#form_addNewQuestion");
form.addEventListener('submit', addQuestion);

function backToStartPage(){
    window.api.toStartPage();
}

function displayNewQuestion(){
    document.getElementById("overlay").style.display = "block";
    addNewAnswer();
}

function cancelAddNewQuestion(){
    document.getElementById("overlay").style.display = "none";
}

function addNewAnswer(){
    var numberOfAnswers = document.getElementsByClassName("answer").length/2;
    console.log(numberOfAnswers);

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
    input2.className = "points";
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

function addQuestion(){
    
}