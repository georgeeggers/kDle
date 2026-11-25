<script lang='ts'>
    import { onMount } from "svelte";
    import { WORDS } from "./wordlist";
    import { getGuessColor, getHelperData, getRandomInt, LetterStatus, testWord, type ThingProps } from "./utils";
    import { manager } from "./gameManager.svelte";

    const classes = ['incorrect', 'misplaced', 'correct'];

    let { currentGuess, guesses, word, index }: ThingProps = $props();
    let guessColor = $derived(manager.isValidGuess ?( getGuessColor(guesses, word, currentGuess) ? "" : "color: var(--warn3);") : "color: var(--fail3);");

</script>


<div class="wordleThing {manager.focused == index ? "focused" : ""}">
    {#each guesses as guess }
        {@const data = testWord(word, guess)}
        <div class="row">
            {#each {length: 5} as _, i}
                <div class="letter {classes[data[i]]}">
                    <p>{guess.toUpperCase()[i]}</p>
                </div>
            {/each}
        </div>
    {/each}
    <div id="scrollHelper{index}" style='transform: translateY(-180px);'></div>
    <div class="row bottom">
        {#each getHelperData(guesses, word) as helper, i}
            <div class="letter">
                {#if currentGuess.length - 1< i}
                    <p style='color: var(--text3);'>{helper}</p>
                {:else}
                    <p style='{guessColor}'>{currentGuess[i].toUpperCase()}</p>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>

    .bottom {
        position: sticky;
        bottom: -10px;
        background-color: var(--bg1);
    }

    .incorrect {
        background-color: var(--bg3);

    }

    .misplaced {
        background-color: var(--warn3);
    }

    .correct {
        background-color: var(--main3);
    }

    .misplaced p, .correct p {
        color: var(--bg1);
    }

    .letter {
        width: 20%;
        height: auto;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 1px solid var(--bg2);
    }

    .letter p {
        font-size: 100%;
        font-weight: bold;
    }

    .row {
        display: flex;
        flex-direction: row;

    }

    .wordleThing {
        width: 100%;
        height: fit-content;
        background-color: var(--bg1);
        border: 2px solid var(--bg2);
        display: flex;
        flex-direction: column;
    }

    .focused {
        border: 2px solid var(--main3);
    }

</style>