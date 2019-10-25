import LevelMakerPlay from './level-maker-play.js';


/**
 * Creates an instance of a sokoban levels contructor.
 * 
 * @property {object} boardRowSelectElement - select DOM element
 * @property {object} boardColumnSelectElement - select DOM element
 * @property {object} boardSizeSubmitButtonElement - button DOM element
 * @property {object} levelMakerBoardElement - board DOM element
 * @property {object} playContainerElement - play container DOM element
 * @property {object} notificationElement - notification DOM element
 * @property {object} selectOptionsRange - range of board rows and columns amount
 * @property {string} squareInputCheckedValue - value of currently selected radio input with name="board-square-input"
 */

class LevelMaker {
  constructor() {
    this.boardRowSelectElement = document.querySelector('#board-row');
    this.boardColumnSelectElement = document.querySelector('#board-column');
    this.boardSizeSubmitButtonElement = document.querySelector('.js-board-size-submit');
    this.levelMakerBoardElement = document.querySelector('.js-level-maker-board');
    this.playContainerElement = document.querySelector('.js-play-container');
    this.notificationElement = document.querySelector('.js-notification');
    this.selectOptionsRange = {bottom: 6, top: 18};
    this.squareInputCheckedValue = 'wall';
    this.handleBoardSize = this.handleBoardSize.bind(this);
    this.handleSquareInputChange = this.handleSquareInputChange.bind(this);
    this.handleSquareChange = this.handleSquareChange.bind(this);
    this.playCurrentLevelMaker = this.playCurrentLevelMaker.bind(this);
    this.bindEvents();
    this.renderSelectOptions(this.selectOptionsRange, this.boardRowSelectElement);
    this.renderSelectOptions(this.selectOptionsRange, this.boardColumnSelectElement);
  }

  bindEvents() {
    document.addEventListener('click', this.handleBoardSize);
    document.addEventListener('change', this.handleSquareInputChange);
    document.addEventListener('click', this.handleSquareChange);
    document.addEventListener('click', this.playCurrentLevelMaker);
  }

  /**
   * Renders options for select elements.
   * 
   * @param {object} - range of options
   * @param {object} - select DOM element
   */
  renderSelectOptions(range, DOMelement) {
    const fragment = document.createDocumentFragment();
    let i = range.bottom;
    while (i <= range.top) {
      const option = document.createElement('option');
      option.setAttribute('value', i);
      option.textContent = i;
      fragment.appendChild(option);
      i++;
    }
    fragment.firstChild.setAttribute('selected', true);
    DOMelement.appendChild(fragment);
  }

  /**
   * Handles user input of rows and columns number and creates a new sokoban board accordingly 
   * to the input.
   */
  handleBoardSize(event) {
    if (event.target !== this.boardSizeSubmitButtonElement) { return; };

    const rowsNumber = +this.boardRowSelectElement.value;
    const columnsNumber = +this.boardColumnSelectElement.value;
    const levelArray = this.getLevelArray(rowsNumber, columnsNumber);
    this.makeNewLevelMakerBoard(levelArray);
  }

  /**
   * Creates an array structure representing a sokoban board with selected 
   * number of rows and columns.
   * levelArray is filled with spaces first and then with walls 
   * to make it easier to refactor in case it should not be filled or 
   * should be filled with other values.
   * 
   * @param {number} - number of rows
   * @param {number} - number of columns
   * @returns {object} - array representing a structure of sokoban board
   */
  getLevelArray(rowsNumber, columnsNumber) {
    const levelArray = Array(+rowsNumber).fill(Array(+columnsNumber).fill('space'));
    return levelArray.map((row, rowIndex) => row.map((item, itemIndex) => {
      return (
        rowIndex === 0 || 
        rowIndex === levelArray.length - 1 ||
        itemIndex === 0 ||
        itemIndex === row.length - 1
      ) 
        ? 'wall'
        : item;
    }));
  }

  /**
   * Clears the previous board and creates a new one.
   * 
   * @param {object} levelArray - array representing sokoban board
   */
  makeNewLevelMakerBoard(levelArray) {
    this.clearElementContent(this.levelMakerBoardElement);
    this.renderLevelMakerBoard(levelArray);
  }

  clearElementContent(DOMelement) {
    DOMelement.textContent = '';
  }

  /**
   * Renders board to the DOM.
   * 
   * @param {object} levelArray - array representing sokoban board
   */
  renderLevelMakerBoard(levelArray) {
    const fragment = document.createDocumentFragment();
  
    levelArray.forEach(row => {
      const rowElement = document.createElement('div');
      rowElement.setAttribute('class', 'board__row js-board-row');
  
      row.forEach(item => {
        const squareElement = document.createElement('div');
        squareElement.setAttribute('class', `square js-level-maker-square`);
        squareElement.setAttribute('data-square', `${item}`)
        rowElement.appendChild(squareElement);
      });
  
      fragment.appendChild(rowElement);
    });
  
    this.levelMakerBoardElement.appendChild(fragment);
  }

  /**
   * Handles user input. Captures the value of a currently selected radio input for a board square type.
   */
  handleSquareInputChange(event) {
    if (event.target.name !== 'board-square-input') { return; }

    this.squareInputCheckedValue = event.target.value;
  }

  /**
   * Handles user actions. Changes the type of board squares according to a currently selected 
   * radio input value.
   */
  handleSquareChange(event) {
    if (!event.target.classList.contains('js-level-maker-square')) { return; }

    event.target.dataset.square = (
      event.target.dataset.square === this.squareInputCheckedValue
    )
      ? 'space'
      : this.squareInputCheckedValue;
  }

  /**
   * Creates a new LevelMakerPlay instance to solve a current made by user sokoban puzzle.
   */
  playCurrentLevelMaker(event) {
    if (!event.target.classList.contains('js-play-current-level-maker')) { return; }

    if (this.playContainerElement.classList.contains('play-level-maker-is-hidden')) {
      this.playContainerElement.classList.remove('play-level-maker-is-hidden');
    }

    if (this.newLevelMakerPlay) {
      this.newLevelMakerPlay.board.clearBoard();
      this.newLevelMakerPlay.unbindEvents();
    }

    const currentLevelArray = this.getComposedLevelArray();

    switch (this.checkPerson(currentLevelArray)) {
      case 0:
        this.notificationElement.textContent = 'Please add a person to the board.'
        break;
      case 1:
        this.notificationElement.textContent = '';
        this.newLevelMakerPlay = new LevelMakerPlay(currentLevelArray);
        this.playContainerElement.scrollIntoView({behavior: 'smooth'});
        break;
      default:
        this.notificationElement.textContent = 'There should be only one person on the board.'
    }
  }

  /**
   * Creates an array representing sokoban level maker board made by user.
   * 
   * @returns {object} currentLevelArray - array representation of level maker board
   */
  getComposedLevelArray() {
    return Array.from(this.levelMakerBoardElement.querySelectorAll('.js-board-row'))
      .map(row => Array.from(row.childNodes)
        .map(square => square.dataset.square));
  }

  /**
   * Counts number of persons entered to the level maker board.
   * 
   * @param {object} currentLevelArray - array representation of level maker board
   * @returns {number} persons.length - amount of persons entered by user to the level maker board
   */
  checkPerson(currentLevelArray) {
    const persons = currentLevelArray.reduce((acc, currentValue) => {
      currentValue = currentValue.filter(item => item === 'person');
      acc = [...acc, ...currentValue];
      return acc;
    }, []);
    
    return persons.length;
  }
}

const newLevelMaker = new LevelMaker();
