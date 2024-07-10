const selected_set = document.querySelector(".form-select");
var container = document.getElementById("container");

// Document ready
document.addEventListener("DOMContentLoaded", displayCollections);


// Functions implementations
function displayOverlayForNewCollection(event) {
    event.preventDefault();
    document.getElementById("overlay").style.display = "block";
    // Reszta logiki funkcji
  }

function choseCollection(event){
    event.preventDefault();
    window.api.setCurrentCollection(selected_set.value); 
    window.location.href = "questionsPanel.html";
}

function displayOverlayForDeleteCollection(event){
    event.preventDefault();
    document.querySelector("#overlayDeletion").style.display = "block";
}

function deleteCollection(e) {
    window.api.deleteCollection(selected_set.value).then(
        location.reload()
    );   
}

function cancelDeleteCollection(){
    document.querySelector("#overlayDeletion").style.display = "none";
}

async function createNewCollection(event){
    event.preventDefault();
    var title = document.querySelector("#title").value;
    document.getElementById("overlay").style.display = "none";

    // create new set of questions
    window.api.saveCollection(title)
    location.reload();
}

function cancelCreatingCollection(){
    document.getElementById("title").value = "";
    document.getElementById("overlay").style.display = "none";
}

async function displayCollections(){
    var selectElement = document.querySelector('.form-select');

    window.api.getCollections().then(sets => {
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
