import { ipcRenderer } from 'electron';
const questionContent = document.querySelector(".question");

ipcRenderer.on('questionMessage', displayQuestion);


async function displayQuestion(event, question){
  console.log("TEST");
  console.log(question);

}


