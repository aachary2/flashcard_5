
let question = {
  "What is the capital of Belgium?": "Brussels",
  "What is the capital of United States?": "Washington DC",
  "What is the capital of Japan?": "Tokyo",
  "What is the capital of England?": "London",
  "What is the capital of the Netherlands?": "Amsterdam",
  "What is the capital of Italy?": "Rome",
  "What is the capital of Poland?": "Warsaw",
  "What is the capital of South Korea?": "Seoul",
  "What is the capital of Ireland?": "Dublin"

}
let currIndex = 0;

let data = Object.entries(question);


const q = document.querySelector('.question');
const ans = document.querySelector('.answer');
const checkButton = document.querySelector('#check');
const nextButton = document.querySelector('#next');
const previousButton = document.querySelector('#prev');
const lastQuestion = document.querySelector('#last');
const firstQuestion = document.querySelector('#first');
const cardNumber = document.querySelector(".card-number");

function getQuestion(index) {

  q.innerHTML = `<h3>${data[currIndex][0]}</h3>`;
  ans.innerHTML = `<h3>${data[currIndex][1]}</h3>`
  cardNumber.textContent = `Card: ${currIndex + 1} of ${data.length} `;
  if (data.length === 1) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    firstQuestion.disabled = true;
    lastQuestion.disabled = true;
  } else {
    if (currIndex === data.length - 1) {
      nextButton.disabled = true;
      lastQuestion.disabled = true;
    } else {
      nextButton.disabled = false;
      lastQuestion.disabled = false;
    }

    if (currIndex === 0) {
      previousButton.disabled = true;
      firstQuestion.disabled = true;
    } else {
      previousButton.disabled = false;
      firstQuestion.disabled = false;
    }
  }






}


function nextCard() {

  currIndex++;
  if (currIndex >= data.length) {
    currIndex = 0;
  }
  getQuestion(currIndex);
  ans.style.display = 'none';
}
function previousCards() {

  currIndex--;
  if (currIndex >= data.length) {
    currIndex = 0;
  }
  getQuestion(currIndex);
  ans.style.display = 'none';

}


checkButton.addEventListener('click', function () {
  ans.style.display = (ans.style.display === "none") ? "block" : "none";

});
lastQuestion.addEventListener('click', function () {
  currIndex = 8;
  getQuestion();

});
firstQuestion.addEventListener('click', function () {
  currIndex = 0;
  getQuestion();

});

nextButton.addEventListener('click', nextCard);
previousButton.addEventListener('click', previousCards);
getQuestion(currIndex);

const speakBtn = document.querySelector('.material-symbols-outlined');



speakBtn.addEventListener('click', () => {
  let content = q.textContent.trim();

  if (ans.style.display !== "none") {
    content += ". " + ans.textContent.trim();
  }
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(content));
});
