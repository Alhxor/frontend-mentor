"use strict";

/**
 * Create gameState on page load
 * Each round:
 * Player clicks a move ->
 *  Set playerChoice and opponentChoice in gameState
 *  Hide initial layout
 *  Show in-progress layout
 *  Show playerChoice on the left and opponentChoice on the right
 *  Edit score and show game result layout
 *  Setup layout for a new round
 */

document.addEventListener("DOMContentLoaded", function() {
  const MOVES = {
    ROCK: "choice--rock",
    SCISSORS: "choice--scissors",
    PAPER: "choice--paper",
    INVALID: "INVALID_MOVE"
  };

  const RESULTS = {
    "-1": "You lose",
    "0": "Draw",
    "1": "You win"
  };

  const moveIds = ["choice-rock", "choice-paper", "choice-scissors"];

  const stepInterval = 1500;
  let gameState = getNewGameState();

  /**
   * Maps moveIds to MOVES
   * @param  {String} id
   */
  function getMoveById(id) {
    switch (id) {
      case "choice-paper":
        return MOVES.PAPER;
      case "choice-scissors":
        return MOVES.SCISSORS;
      case "choice-rock":
        return MOVES.ROCK;
      default:
        return MOVES.INVALID;
    }
  }

  const layoutStart = document.getElementById("layout-start");
  const layoutInProgress = document.getElementById("layout-in-progress");
  const gameResult = document.getElementById("game-result");
  const gameWinner = document.getElementById("game-result__winner");
  const gameScore = document.getElementById("score");

  const playerChoice = document.getElementById("player-choice");
  const opponentChoice = document.getElementById("opponent-choice");
  const playerBackdrop = document.getElementById("player-backdrop");
  const opponentBackdrop = document.getElementById("opponent-backdrop");

  /**
   * Creates a new gameState object
   * @returns {Object} gameState
   */
  function getNewGameState() {
    const gameState = {
      playerChoice: "",
      opponentChoice: "",
      score: 0
    };

    return { ...gameState };
  }

  /**
   * Returns score change for a single round
   * @param  {String} playerMove
   * @param  {String} opponentMove
   * @returns {Number}
   */
  function roundScore(playerMove, opponentMove) {
    if (playerMove === opponentMove) return 0;

    switch (playerMove) {
      case MOVES.PAPER:
        return opponentMove === MOVES.ROCK ? 1 : -1;
      case MOVES.SCISSORS:
        return opponentMove === MOVES.PAPER ? 1 : -1;
      case MOVES.ROCK:
        return opponentMove === MOVES.SCISSORS ? 1 : -1;
      default:
        return 0;
    }
  }

  /**
   * Call this from the onclick event for initial choices
   * Move value must match a class for one of the game choices
   * Example: newRound("choice--paper", "choice--rock", getNewGameState())
   * @param  {String} playerMove
   * @param  {String} opponentMove
   * @param  {Object} gameState
   * @returns {Object} gameState
   */
  function newRound(playerMove, opponentMove, gameState) {
    const state = { ...gameState };

    state.playerChoice = playerMove;
    state.opponentChoice = opponentMove;

    const scoreChange = roundScore(playerMove, opponentMove);
    state.score += scoreChange;

    let winnerBackdrop;
    if (scoreChange)
      winnerBackdrop = scoreChange == 1 ? playerBackdrop : opponentBackdrop;

    // Step 2
    playerChoice.classList.add(playerMove);
    layoutStart.style.display = "none";
    layoutInProgress.style.display = "flex";

    // Step 3
    setTimeout(function() {
      opponentChoice.classList.add(opponentMove);
      opponentChoice.classList.remove("choice--none");
    }, stepInterval);

    // Step 4
    setTimeout(function() {
      if (winnerBackdrop) winnerBackdrop.classList.add("backdrop--winner");
      gameResult.style.display = "flex";
      gameWinner.textContent = RESULTS[scoreChange.toString()];
      gameScore.textContent = state.score.toString();
    }, stepInterval * 2);

    return state;
  }

  /**
   * Click on any of the initial choices
   */
  document.querySelectorAll("#layout-start .game__choice").forEach((v, i) => {
    v.onclick = function onChoice({ target }) {
      const playerMove = getMoveById(target.id);

      const randomId = moveIds[Math.floor(Math.random() * moveIds.length)];
      const opponentMove = getMoveById(randomId);

      const newGameState = newRound(playerMove, opponentMove, gameState);
      gameState = { ...newGameState };

      console.log(gameState);
    };
  });

  /**
   * Setup new round on "Play again" click
   */
  document.getElementById("btn-play-again").onclick = function setupNewRound() {
    layoutInProgress.style.display = "none";
    gameResult.style.display = "none";
    layoutStart.style.display = "flex";

    playerChoice.classList.remove(gameState.playerChoice);
    opponentChoice.classList.remove(gameState.opponentChoice);
    opponentChoice.classList.add("choice--none");

    playerBackdrop.classList.remove("backdrop--winner");
    opponentBackdrop.classList.remove("backdrop--winner");
  };

  /**
   * Show an overlay with rules on "Rules" click
   * Close overlay on cross click
   */

  const modalRules = document.getElementById("js-rules-modal");

  document.getElementById("js-btn-rules").onclick = function openRulesModal(e) {
    e.preventDefault();
    modalRules.style.visibility = "visible";
  };

  document.getElementById(
    "js-btn-rules-modal-close"
  ).onclick = function closeRulesModal(e) {
    e.preventDefault();
    modalRules.style.visibility = "hidden";
  };
});
