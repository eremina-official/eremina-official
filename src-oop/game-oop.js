import levels from '../levels.js';
import Board from './board-oop.js';


class Game {
  constructor(levelArray) {
    this.levelArray = levelArray;
    this.board = new Board(this.levelArray);
    this.move = this.move.bind(this);
    this.init();
  }

  bindEvents() {
    document.addEventListener('keyup', this.move);
  }

  unbindEvents() {
    document.removeEventListener('keyup', this.move);
  }

  move(event) {
    const personIndex = this.levelArray.findIndex(element => element === 'person');
    let nextPersonIndex;

    switch (event.keyCode) {
      case 39:
        nextPersonIndex = personIndex + 1;
        break;
      case 37:
        nextPersonIndex = personIndex - 1;
        break;
      case 38:
        nextPersonIndex = personIndex - 8;
        break;
      case 40:
        nextPersonIndex = personIndex + 8;
        break;
    }

    if (this.levelArray[nextPersonIndex] === '') {
      //pushBox
    }
    
    if (this.levelArray[nextPersonIndex] === 'space') {
      this.makeStep(personIndex, nextPersonIndex);
    } 
  }

  makeStep(personIndex, nextPersonIndex) {
    this.levelArray.splice(personIndex, 1, 'space');
    this.levelArray.splice(nextPersonIndex, 1, 'person');
    const nextPersonPosition = document.querySelector(`.js-${nextPersonIndex}`);
    document.querySelector(`.js-${personIndex}`).textContent = '';
    nextPersonPosition.textContent = 'p';
  }

  init() {
    this.bindEvents();
  }
}

const levelOne = new Game(levels[0]);
console.log(levelOne);

//select level from a list
//after selecting level create a new Game instance
//Game keeps state of levelArray (model), has eventListeners for moves with buttons and keyboard, passes commands to Board to update the view, keeps state and shows the number of moves, optionally timer, restart game (update the model and send command to Board to update the view)
//Game creates a new Board instance, Boards has a logic for updating the view

export default Game;