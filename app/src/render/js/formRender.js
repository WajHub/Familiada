const form_new_set = document.querySelector("#form_new_set");
const form_create_new_set = document.querySelector("#form_create_new_set");
var container = document.getElementById("container");

const sets = window.api.get_sets();
console.log("Sets: ", sets);


// form_new_set.addEventListener('submit', async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     const filePath = await window.api.openFile();
//     console.log('File path:', filePath);
//     container.innerHTML += `<div class="file-path">${filePath}</div>`;
//   })

form_new_set.addEventListener('submit', new_set);
form_create_new_set.addEventListener('submit', create_new_set);

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
document.getElementById('form_create_new_set').addEventListener('submit', function() {
    document.getElementById('title').value = '';
});


