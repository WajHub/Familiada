const titlediv = document.querySelector("#title");

// Document ready
document.addEventListener("DOMContentLoaded", display_title);

function display_title(){
    window.api.get_title().then(title => {
        titlediv.innerHTML = title;
    });
}

function backToStartPage(){
    window.api.toStartPage();
}

