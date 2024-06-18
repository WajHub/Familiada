const form_new_set = document.querySelector("#form_new_set");
const form_create_new_set = document.querySelector("#form_create_new_set");
form_new_set.addEventListener('submit', new_set);
form_create_new_set.addEventListener('submit', create_new_set);


function new_set(e){
    e.preventDefault(); 
    // create overlay for creating new set of questions
    document.getElementById("overlay").style.display = "block";
}

function create_new_set(e){
    e.preventDefault();
    const title = document.querySelector("#title").value;
    document.getElementById("overlay").style.display = "none";

    // create new set of questions
    window.api.create_new_set(title);
}