const titlediv = document.querySelector("#title");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);

function display_title(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
    window.api.startGame();
}

function backToStartPage(){
    window.location.href = "index.html";
}

