<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import { attemptAddLetter, attemptGuess, deleteLetter, GameState, keydownLogic, manager, restartGame } from "./gameManager.svelte";
    import { getKeyboardData, testWord } from "./utils";
    import WordleThing from "./wordleThing.svelte";
    import { WORDS } from "./wordlist";
    import { flip } from "svelte/animate";
    import { Send, Delete, ChevronLeft, RefreshCcw, defaultAttributes } from "@lucide/svelte";
    import { replace } from "svelte-spa-router";

    $effect(() => {
      if(manager.guess.length == 5){
        manager.isValidGuess = WORDS.includes(manager.guess);
      } else {
        manager.isValidGuess = true;
      }
    })

    onMount(() => {
      restartGame();
      document.addEventListener('keydown', keydownLogic);
    })

    onDestroy(() => {
      document.removeEventListener('keydown', keydownLogic);
    })

    const focusBoard = (i: number) => {
        if(manager.focused == i){
            manager.focused = -1;
        } else {
            manager.focused = i;
        }
    }

    const getKeyboardHighlightingData = (index: number) => {
        if(manager.words.length == 1){
          return {
            highlighting: true,
            data: getKeyboardData(manager.guessHistory, manager.words[0])
          }
        }
        if(index == -1){
          return {
            highlighting: false,
            data: {}
          }
        } else {
          return {
            highlighting: true,
            data: getKeyboardData(manager.guessHistory, manager.words[index])
          }
        }
    }

    let keyboardData = $derived(getKeyboardHighlightingData(manager.focused));

    const classes = ['incorrect', 'misplaced', 'correct', ""]

    let showPopup = $state(false);
    let deltaTime = $state(0);

    const formatTime = (ms: number) => {
      const milliseconds = ms % 1000;
      ms -= milliseconds;
      ms /= 1000;
      const seconds = ms % 60;
      ms -= seconds;
      ms /= 60;
      if(ms > 0){
        return `${ms}:${seconds}.${milliseconds}`
      }
      return `${seconds}.${milliseconds}`
    }

    $effect(() => {
      if(manager.gameState != GameState.InProgress){
        if(manager.started){
          const now = new Date();
          // @ts-ignore
          deltaTime = now - manager.started;
          console.log(formatTime(deltaTime));
        }
        
        showPopup = true;
      } else {
        showPopup = false;
      }
    })

</script>

{#if showPopup}
  <div class="popup">
    <div class="innerPopup">
      <p class='title'>{["You won", "Not enough guesses", "You Lost", ""][manager.gameState]}</p>
      <p class='body'>{["You won! Congratulations!", "You dont have enough guesses to complete all boards", "You lost... womp womp :(", ""][manager.gameState]}</p>

      {#if manager.gameState == GameState.Won}
        <div class="stats">
          <p>Time - {formatTime(deltaTime)}</p>
          <p>{Math.round(deltaTime / 10 / parseInt("" + manager.boardCount)) / 100} seconds / board</p>
        </div>
      {/if}


      <div class="popupActions">
        {#if manager.gameState == GameState.Hopeless}
          <button class='btn fail' onclick={restartGame}>Restart</button>
          <button class='btn main' onclick={() => {showPopup = false}}>Continue</button>
        {:else if manager.gameState == GameState.Lost}
          <button class='btn fail' onclick={restartGame}>Restart</button>
        {:else}
          <button class='btn main' onclick={restartGame}>Restart</button>
        {/if}
      </div>
    </div>

  </div>
{/if}

<div class="topbar">

  <div class="buttons">
    <button onclick={() => replace('/')}>
      <div class="svgWrapper">
        <ChevronLeft size=20 />
      </div>
    </button>

    <button onclick={restartGame}>
      <div class="svgWrapper">
        <RefreshCcw size=20 />
      </div>
    </button>
  </div>

  <div class="progressContainer">
    <p>{manager.words.length} left ({manager.remainingGuesses} guesses)</p>
    <div class="progressBar" style='width: {Math.round(100 - (manager.words.length / (manager.boardCount as number) * 100))}%;'>
    </div>
  </div>
</div>

<div class="boardContainer scrollOverflow">
  {#each manager.words as word, i (word)}
      <label id='board{i}' class="wordleThingContainer" animate:flip ={{ duration: 250 }} for='focus{i}'>
          <WordleThing currentGuess={manager.guess} guesses={manager.guessHistory} word={word} index={i} />
          <button onclick={() => focusBoard(i)} class='invis' id='focus{i}'>Focus{i}</button>  
      </label>
  {/each}
</div>

<div class="keyboard">
  <div class="row">
      {#each 'qwertyuiop' as l}
          <button onclick={() => attemptAddLetter(l)} class="{keyboardData.highlighting ? classes[keyboardData.data[l as keyof typeof keyboardData.data]] : ""}">{l.toUpperCase()}</button>
      {/each}
  </div>

  <div class="row">
      {#each 'asdfghjkl' as l}
          <button onclick={() => attemptAddLetter(l)} class="{keyboardData.highlighting ? classes[keyboardData.data[l as keyof typeof keyboardData.data]] : ""}">{l.toUpperCase()}</button>
      {/each}  
  </div>

  <div class="row">
      <button onclick={deleteLetter} style='width: 96px;'>
          <div class="svgWrapper">
              <Delete size=22 />
          </div>
      </button>
      {#each 'zxcvbnm' as l}
          <button onclick={() => attemptAddLetter(l)} class="{keyboardData.highlighting ? classes[keyboardData.data[l as keyof typeof keyboardData.data]] : ""}">{l.toUpperCase()}</button>
      {/each}
      <button onclick={attemptGuess}>
          <div class="svgWrapper">
              <Send size=22 />
          </div>
      </button>
  </div>

</div>

<style>

  .stats {
    font-size: 14px;
    display: flex;
    flex-direction: column;
  }

  .popupActions {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: auto;
    gap: 10px;
    box-sizing: border-box;
  }

  .popupActions button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .popup {
    display: flex;
    position: fixed;
    left: 0px;
    top: 72px;
    width: 100vw;
    height: calc(100% - 72px);
    backdrop-filter: brightness(0.4);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .innerPopup {
    width: 240px;
    height: 160px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    box-sizing: border-box;
    background-color: var(--bg2);
    border: 1px solid var(--bg3);
    padding: 10px;
  }

  .innerPopup  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .innerPopup .body {
    font-size: 14px;
    color: var(--text2);
  }
  
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    box-sizing: border-box;
    width: 100%;
  }

  .buttons button {
    width: fit-content;
    background: none;
    border: none;
  }

  .progressContainer {
    display: flex;
    flex-direction: row;
    position: relative;
    height: 20px;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--bg1);
    border: 1px solid var(--bg3)
  }

  .progressContainer p {
    position: absolute;
    right: 5px;
    font-size: 12px;
  }

  .progressBar {
    height: 100%;
    display: flex;
    background-color: var(--main3);
    transition: width .25s ease;
  }

  .topbar {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: var(--bg2);
    height: 72px;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .keyboard {
    width: 100%;
    height: 200px;
    padding: 20px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 10px;
  }

  .keyboard .row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .row button {
    width: 48px;
    height: 48px;
    border: 1px solid var(--bg3);
    background-color: var(--bg2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
  }

  .boardContainer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    gap: 10px;
    box-sizing: border-box;
    padding: 10px;
    height: calc(100% - 272px);
  }

  .wordleThingContainer {
    width: 140px;
    height: fit-content;
    margin-bottom: auto;
  }

  .incorrect {
      background-color: var(--bg1) !important;
      color: var(--text3);
  }



  .misplaced {
      background-color: var(--warn3) !important;
      color: var(--bg1);
  }

  .correct {
      background-color: var(--main3) !important;
      color: var(--bg1);
  }

</style>
