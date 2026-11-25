<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import { attemptAddLetter, attemptGuess, deleteLetter, keydownLogic, manager, restartGame } from "./gameManager.svelte";
    import { getKeyboardData, testWord } from "./utils";
    import WordleThing from "./wordleThing.svelte";
    import { WORDS } from "./wordlist";
    import { flip } from "svelte/animate";
    import { Send, Delete } from "@lucide/svelte";

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

</script>

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
    height: calc(100% - 200px);
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
