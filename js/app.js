// cards array contains names for Font Awesome icons that will be visible when the card is flipped over
const cards = ['fa-mobile', 'fa-laptop', 'fa-server', 'fa-bug',
               'fa-download', 'fa-wifi', 'fa-print', 'fa-code'];
const deckElement = document.querySelector('.deck');
const modal = document.getElementById('congratsModal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const movesElement = document.querySelector('.moves');
let openCards = [];
let matchedCards = [];
let moves = 0;
let shuffledCards;

function initGame() {
  shuffledCards = shuffle(cards.concat(cards));
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', outsideClick);

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
      if (isMatch(openCards)) { 
        openCards.forEach((card) => {
          updateMatchedCard(card);
        });
        if (isOver(matchedCards.length, shuffledCards.length)) {
          displayModal();
        }
      }
      if (openCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        if (!isMatch(openCards)) {
          setTimeout(function() {
            openCards.forEach((cardEl) => {
              cardEl.classList.remove('open', 'show');
            });
            resetOpenCards();
           }, 1000);
        } else {
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
  console.log('matchedCards', matchedCards);
  return (matchedCardsLen === cardsLen);
}

function updateMatchedCard(cardElement) {
  cardElement.classList.add('match');
  matchedCards.push(cardElement);
  console.log(matchedCards);
}

function resetOpenCards() {
  openCards = [];
}

function displayModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

initGame();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
