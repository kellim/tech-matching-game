// cards array contains names for Font Awesome icons that will be visible when the card is flipped over
const cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
               'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const deckElement = document.querySelector('.deck');
const openCards = [];

// Double the array of cards and shuffle them
const shuffledCards = shuffle(cards.concat(cards));

// Dynamically add shuffled cards with icons from Font Awesome to the deck element
shuffledCards.forEach(card => {
  console.log('card: ', card);
  const cardElement = document.createElement('li');
  const iconElement = document.createElement('i');
  cardElement.classList.add('card');
  iconElement.classList.add('fa', card);
  cardElement.appendChild(iconElement);
  deckElement.appendChild(cardElement);
  cardElement.addEventListener('click', () => {
    if (isValidCardClick(cardElement)) {
      displayCard(cardElement);
    }
  });
});

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
    console.log('openCards', openCards);
    console.log('openCards.length', openCards.length);
}

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
