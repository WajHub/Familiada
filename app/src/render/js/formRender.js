const form = document.querySelector("#form_getStarted");
const checkBoxNewSet = document.querySelector("input[id=newSetCheckBox]");
const selectFile = document.querySelector(".selectFile");
const newFile = document.querySelector(".newFile");

form.addEventListener('submit', getStarted);
checkBoxNewSet.addEventListener('change', checkBoxChange);

function getStarted(e){
    e.preventDefault(); 
    let fileSelected = document.getElementById('myfile').value;
    let fileName = document.getElementById('nameNewSet').value;

    const button = document.getElementsByClassName('error')[0];
    if (checkBoxNewSet.checked==true && (fileName=="" ) || 
        (checkBoxNewSet.checked==false && (fileSelected==""))
    ) {
        button.style.display = "block";
    }
    else{
        button.style.display = "none";
        if(checkBoxNewSet.checked==true ){
            window.api.setFilePath(fileName+".txt", true);
        }else{
            var pieces = fileSelected.split('\\');
            fileSelected = pieces[pieces.length-1];
            window.api.setFilePath(fileName, false);
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

