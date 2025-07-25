const box_container = document.querySelector(".container");
const containers = document.querySelector('.containers');
const buttons = document.querySelector("#check");
const q = document.querySelector('.questions');
const ans = document.querySelector('.answers');
const nextButton = document.querySelector('#next');
const previousButton = document.querySelector('#prev');
const view = document.querySelector('.btns');
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const confirms = document.getElementById("confirm");
const lastQuestion = document.querySelector('#last');
const firstQuestion = document.querySelector('#first');

let data = sessionStorage.getItem("card");
if (data) {
  data = JSON.parse(data);
} else {
  data = [];
}

let currIndex = 0;
let cards = [];
let id = 0;

function viewCard() {
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    errorMessage.style.display = "block";
    errorMessage.innerText = "Please enter both a question and an answer.";
    return;
  }

  const isDuplicate = data.some(card =>
    card.question.trim().toLowerCase() === question.toLowerCase() &&
    card.answer.trim().toLowerCase() === answer.toLowerCase()
  );

  if (isDuplicate) {
    errorMessage.style.display = "block";
    errorMessage.innerText = "This card already exists.";
    return;
  }

  errorMessage.style.display = "none";

  const flashCard = {
    question,
    answer,
    id: id++
  };

  data.push(flashCard);
  sessionStorage.setItem("card", JSON.stringify(data));

  createCards();
  setConfirmationMessage(`Card added: “${question}” → “${answer}”`);
  questionInput.value = "";
  answerInput.value = "";
}

function setConfirmationMessage(message) {
  confirms.innerText = message;
  confirms.style.display = "block";
  setTimeout(() => {
    confirms.style.display = "none";
  }, 2500);
}

function create() {
  box_container.style.display = "flex";
  view.style.display = "flex";
}

function createCards() {
  box_container.style.display = "none";
  containers.style.display = "block";
  nextButton.style.display = "inline-block";
  previousButton.style.display = "inline-block";
  firstQuestion.style.display = "inline-block";
  lastQuestion.style.display = "inline-block";
  buttons.style.display = "inline-block";
  view.style.display = "none";
  containers.innerHTML = "";
  cards = [];

  let showCounter = 1;
  for (let index = data.length - 1; index >= 0; index--, showCounter++) {
    const cardData = data[index];
    const flashcard = document.createElement("div");
    flashcard.classList.add("flashcard");

    flashcard.innerHTML = `
    <span class="material-symbols-outlined">text_to_speech</span>
      <span class="material-icons" idx="${cardData.id}">delete</span>
      <div class="card-front"><h3>${cardData.question}</h3></div>
      <div class="hidden-div" style="display:none;"><h3>${cardData.answer}</h3></div>
      <div class="card-number">Card ${showCounter} of ${data.length}</div>
    `;
    const trash_ = flashcard.querySelector('.material-icons');
    trash_.classList.add('trash-icon');
    trash_.title = "remove from deck";
    const speak = flashcard.querySelector('.material-symbols-outlined');
    speak.classList.add('speak');
    speak.title = "Speak text"

    containers.appendChild(flashcard);
    cards.push(flashcard);
    flashcard.style.display = "none";
    const speakBtn = flashcard.querySelector('.speak');
    const cardFront = flashcard.querySelector('.card-front');
    const speakAnswer = flashcard.querySelector('.hidden-div');

    speakBtn.addEventListener('click', () => {
      let content = cardFront.textContent.trim();
      if (speakAnswer.style.display !== "none") {
        content += ". " + speakAnswer.textContent.trim();
      }
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(content));
    });
  }

  currIndex = 0;
  cards.forEach(card => card.style.display = "none");

  if (cards[currIndex]) {
    const the_answer = cards[currIndex].querySelector(".hidden-div");
    cards[currIndex].style.display = "block";
    the_answer.style.display = "none";
    buttons.onclick = () => {
      if ((the_answer.style.display === "none")) {
        the_answer.style.display = "block"
      } else {
        the_answer.style.display = "none"
      }
    };
  }
  if (cards.length === 1) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    firstQuestion.disabled = true;
    lastQuestion.disabled = true;
  } else {
    if (currIndex === cards.length - 1) {
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

  const remove_btns = document.querySelectorAll(".material-icons");
  for (let i = 0; i < remove_btns.length; i++) {
    remove_btns[i].addEventListener("click", (e) => {
      const targetId = parseInt(e.target.getAttribute("idx"));
      const indexToRemove = data.findIndex(card => card.id === targetId);

      if (indexToRemove !== -1) {
        const deletedCard = data[indexToRemove];
        const confirmed = window.confirm(`Are you sure you want to delete:\n"${deletedCard.question}" → "${deletedCard.answer}"?`);
        if (!confirmed) {
          return;
        }
        data.splice(indexToRemove, 1);
        sessionStorage.setItem("card", JSON.stringify(data));
        createCards();
        setConfirmationMessage(`Card deleted: “${deletedCard.question}” → “${deletedCard.answer}”`);
      }
    });
  }
}

function previous() {
  if (currIndex > 0) {
    currIndex--;
    cards.forEach(card => card.style.display = "none");
    if (cards[currIndex]) {
      const the_answer = cards[currIndex].querySelector(".hidden-div");
      cards[currIndex].style.display = "block";
      the_answer.style.display = "none";
      buttons.onclick = () => {
        if ((the_answer.style.display === "none")) {
          the_answer.style.display = "block"
        } else {
          the_answer.style.display = "none"
        }
      };
    }
  }
  if (cards.length === 1) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    firstQuestion.disabled = true;
    lastQuestion.disabled = true;
  } else {
    if (currIndex === cards.length - 1) {
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
previousButton.addEventListener('click', previous);

function viewNextCard() {
  if (currIndex < cards.length - 1) {
    currIndex++;
    cards.forEach(card => card.style.display = "none");
    if (cards[currIndex]) {
      const the_answer = cards[currIndex].querySelector(".hidden-div");
      cards[currIndex].style.display = "block";
      the_answer.style.display = "none";
      buttons.onclick = () => {
        if ((the_answer.style.display === "none")) {
          the_answer.style.display = "block"
        } else {
          the_answer.style.display = "none"
        }
      };
    }
  }
  if (cards.length === 1) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    firstQuestion.disabled = true;
    lastQuestion.disabled = true;
  } else {
    if (currIndex === cards.length - 1) {
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
nextButton.addEventListener("click", viewNextCard);

if (data.length > 0) {
  createCards();
} else {
  containers.style.display = "none";
  box_container.style.display = "flex";
  view.style.display = "flex";
  firstQuestion.style.display = 'none';
  lastQuestion.style.display = 'none';
}

lastQuestion.addEventListener('click', function () {
  currIndex = cards.length - 1;
  cards.forEach(card => card.style.display = "none");
  const the_answer = cards[currIndex].querySelector(".hidden-div");

  if (cards[currIndex]) {
    cards[currIndex].style.display = "block";
    the_answer.style.display = "none";
    buttons.onclick = () => {
      if ((the_answer.style.display === "none")) {
        the_answer.style.display = "block"
      } else {
        the_answer.style.display = "none"
      }
    };
  }
  if (cards.length === 1) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    firstQuestion.disabled = true;
    lastQuestion.disabled = true;
  } else {
    if (currIndex === cards.length - 1) {
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
});

firstQuestion.addEventListener('click', function () {
  currIndex = 0;
  cards.forEach(card => card.style.display = "none");
  const the_answer = cards[currIndex].querySelector(".hidden-div");

  if (cards[currIndex]) {
    cards[currIndex].style.display = "block";
    the_answer.style.display = "none";
    buttons.onclick = () => {
      if ((the_answer.style.display === "none")) {
        the_answer.style.display = "block"
      } else {
        the_answer.style.display = "none"
      }
    };
  }
  if (cards.length === 1) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    firstQuestion.disabled = true;
    lastQuestion.disabled = true;
  } else {
    if (currIndex === cards.length - 1) {
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
});
