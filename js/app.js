// cards array contains names for Font Awesome icons that will be visible when the card is flipped over
const cards = ['fa-mobile', 'fa-laptop', 'fa-server', 'fa-bug',
               'fa-download', 'fa-wifi', 'fa-print', 'fa-code'];
const deckElement = document.querySelector('.deck');
const modal = document.querySelector('.modal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const movesElement = document.querySelector('.moves');
const timeElement = document.querySelector('.time');
const starElements = document.querySelectorAll('.star');
const modalMoves = document.querySelector('.modal-moves');
const modalStars = document.querySelector('.modal-stars');
const modalTime = document.querySelector('.modal-time');
const restartBtn = document.querySelector('.restart');
const modalRestartBtn = document.querySelector('.modal-restart-btn');
let openCards = [];
let matchedCards = [];
let moves = 0;
let timerInterval;
let seconds = 0;
let minutes = 0;
let hours = 0 ;
let shuffledCards;
let gameStarted = false;
let stars = 3;

function initGame() {
  shuffledCards = shuffle(cards.concat(cards));
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', outsideClick);
  restartBtn.addEventListener('click', restartGame);
  modalRestartBtn.addEventListener('click', restartGame);

  // Dynamically add shuffled cards with icons from Font Awesome to the deck element
  shuffledCards.forEach(card => {
    const cardElement = document.createElement('li');
    const iconElement = document.createElement('i');
    cardElement.classList.add('card');
    iconElement.classList.add('fa', card);
    cardElement.appendChild(iconElement);
    deckElement.appendChild(cardElement);
    cardElement.addEventListener('click', (event) => {
      flipCard(event.target);
    });
  });
}

function flipCard(cardElement) {
  if (isValidCardClick(cardElement)) {
    displayCard(cardElement);
    // timer should start on first card click of a game.
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    if (openCards.length === 2) {
      moves++;
      updateDisplayedMoves();
      updateStars();
      if (!isMatch(openCards)) {
        setTimeout(function() {
          openCards.forEach((cardEl) => {
            cardEl.classList.remove('open', 'show');
          });
          resetOpenCards();
          }, 1000);
      } else {    // Match
        openCards.forEach((card) => {
          updateMatchedCard(card);
        });
          // Temporarily updated to test end game so one match wins game
        if (isOver(matchedCards.length, shuffledCards.length)) { 
          clearInterval(timerInterval);
          displayModal();
        }
        resetOpenCards();
      }
    }
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976 (changed var to let)
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Ensure only 2 cards can be clicked per turn and the same card cannot be clicked twice
function isValidCardClick(cardElement) {
  if ((openCards.length) >= 2 || openCards.includes(cardElement)) {
    return false;
  }
  return true;
}

// Flip a card over and display the icon, add it to list of open cards.
function displayCard(cardElement) {
    cardElement.classList.add('open', 'show');
    openCards.push(cardElement);
}

function isMatch(openCards) {
  if (openCards.length === 2 && openCards[0].innerHTML === openCards[1].innerHTML) {
    return true;
  }
  return false;
}

function isOver(matchedCardsLen, cardsLen) {
  return (matchedCardsLen === cardsLen);
}

function updateStars() {
  if (moves <= 15) {
    stars = 3
  } else if (moves <= 20) {
    stars = 2
    starElements[2].classList.replace('fa-star', 'fa-star-o');
  } else {
    stars = 1
    starElements[1].classList.replace('fa-star', 'fa-star-o');
  }
}

function resetStars() {
  stars = 3;
  starElements.forEach(star => {
    if (star.classList.contains('fa-star-o')) {
      star.classList.replace('fa-star-o', 'fa-star');
    }
  })
}

function updateDisplayedMoves() {
  movesElement.textContent = moves;
}

function updateMatchedCard(cardElement) {
  cardElement.classList.add('match');
  matchedCards.push(cardElement);
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      minutes ++;
      seconds = seconds % 60;
      
    }
    if (minutes >= 60) {
      hours++;
      minutes = minutes % 60;
    }
    updateDisplayedTime();
  }, 1000)
}

function updateDisplayedTime() {
  timeElement.innerText = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
}

function resetOpenCards() {
  openCards = [];
}

function displayModal() {
  addStarsToModal();
  let finalTime = hours > 0 ? `${hours} hour${hours === 1 ? '' : 's'} ` : '';
  finalTime += hours > 0 && minutes > 0 ? ', ' : '';
  finalTime += minutes > 0 ? `${minutes} minute${minutes === 1 ? '' : 's'} ` : '';
  finalTime += finalTime ? ' and ' : '';
  finalTime += `${seconds} second${seconds === 1 ? '' : 's'}`;
  modalTime.textContent = finalTime;
  modalMoves.textContent = moves;
  modal.style.display = 'block';
}

function addStarsToModal() {
  let starElement,
      iconElement,
      faIcon;
  for (let i = 0; i < 3; i++) {
    starElement = document.createElement('li');
    starElement.classList.add('modal-star');
    iconElement = document.createElement('li');
    if ((stars === 2 && i === 2) || (stars === 1 && i >= 1)) {
      faIcon = 'fa-star-o'
     } else {
      faIcon = 'fa-star'
    }
    iconElement.classList.add('fa', faIcon);
    starElement.append(iconElement);
    modalStars.appendChild(starElement);
  }
}

function closeModal() {
  modal.style.display = 'none';
}

function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

function resetModal() {
  const modalStarList = document.querySelectorAll('.modal-star')
  modalTime.textContent = '';
  modalMoves.textContent = '';
  if (modalStarList && modalStarList.length > 0) {
    modalStarList.forEach(star => {
      star.parentElement.removeChild(star);
    });
  }
}

function restartGame() {
  closeModal();
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.parentElement.removeChild(card);
  });
  clearInterval(timerInterval);
  moves = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  matchedCards = [];
  openCards = [];
  gameStarted = false;
  updateDisplayedMoves();
  updateDisplayedTime();
  resetStars();
  resetModal();
  initGame();
}

initGame();