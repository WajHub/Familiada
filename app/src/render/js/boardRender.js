import { ipcRenderer } from 'electron';
const questionContent = document.querySelector(".question");

ipcRenderer.on('question', (event, question) => {
    console.log("TEST: ");
  console.log('Received question:', question);
  // Process the question here
});


