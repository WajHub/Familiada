const form = document.querySelector("#form_getStarted");
const checkBoxNewSet = document.querySelector("input[id=newSetCheckBox]");
const selectFile = document.querySelector(".selectFile");
const newFile = document.querySelector(".newFile");

form.addEventListener('submit', getStarted);
checkBoxNewSet.addEventListener('change', checkBoxChange);

function getStarted(e){
    e.preventDefault(); 
    let file = document.getElementById('myfile').value;
    let teamRed = document.getElementById('teamRed').value;
    let teamBlue = document.getElementById('teamBlue').value;
    let fileName = document.getElementById('nameNewSet').value;

    const button = document.getElementsByClassName('error')[0];
    if (checkBoxNewSet.checked==true && (fileName=="" || teamRed=="" || teamBlue=="") || 
        (checkBoxNewSet.checked==false && (file=="" || teamRed=="" || teamBlue==""))
    ) {
        
        button.style.display = "block";
    }
    else{
        button.style.display = "none";
        if(checkBoxNewSet.checked==true ){
            window.api.createNewSet(fileName);
        }else{

        }
    }
}

function checkBoxChange(e){
    e.preventDefault(); 
    if(this.checked){
        selectFile.style.display = "none";
        newFile.style.display = "block";
    }
    else{
        selectFile.style.display = "block";
        newFile.style.display = "none";
    }
}

