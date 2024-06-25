const form_new_set = document.querySelector("#form_new_set");
const form_create_new_set = document.querySelector("#form_create_new_set");
var container = document.getElementById("container");

// Document ready
document.addEventListener("DOMContentLoaded", display_sets);

// Event listeners
document.getElementById('form_create_new_set').addEventListener('submit', function() {
    document.getElementById('title').value = '';
});
document.querySelector('#overlay > button').addEventListener('click', function() {
    document.getElementById("overlay").style.display = "none";
});
form_new_set.addEventListener('submit', new_set);
form_create_new_set.addEventListener('submit', create_new_set);

// Functions implementations
function new_set(e){
    e.preventDefault(); 
    // create overlay for creating new set of questions
    document.getElementById("overlay").style.display = "block";
}

async function create_new_set(e){
    e.preventDefault();
    var title = document.querySelector("#title").value;
    document.getElementById("overlay").style.display = "none";

    // create new set of questions
    window.api.create_new_set(title);
    const sets = await window.api.get_sets();
    console.log("Sets: ", sets);
}

async function display_sets(){
    var selectElement = document.getElementById('sets');

    window.api.get_sets().then(sets => {
        // console.log("Sets: ", sets);
        sets.forEach(set=> {
            const id = set.dataValues.id;
            const title = set.dataValues.title;
            var option = document.createElement("option");
            option.value = id;
            option.text = title;
            selectElement.innerHTML += option.outerHTML;
        })
        }
    );
}


