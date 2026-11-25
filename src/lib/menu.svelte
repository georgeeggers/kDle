<script lang='ts'>
    import { push } from "svelte-spa-router";
    import { manager } from "./gameManager.svelte";
    import Toggle from "./toggle.svelte";


</script>


<div class="container">
    <div class="menu">
        <p class='logo'><i>k</i>Dle</p>
        <div class="spacer"></div>

        <div class="row">
            <div class="text">
                <p class='heading'>Board count</p>
                <p class='body'>Number of boards being solved</p>
            </div>
            <input bind:value={manager.boardCount} placeholder='1'>
        </div>

        <div class="row">
            <div class="text">
                <p class='heading'>Spare guesses</p>
                <p class='body'>Number of guesses you have to spare</p>
            </div>
            <input bind:value={manager.spareGuesses} placeholder='0'>
        </div>

        <div class="row">
            <div class="text">
                <p class='heading'>Autosolve</p>
                <p class='body'>Automatically solve boards with 5 green letters</p>
            </div>
            <Toggle bind:value={manager.autoSolve} />
        </div>

        <button class='btn main' onclick={() => push('/game')}>Start</button>
    </div>
</div>


<style>

    .spacer {
        width: 100%;
        border-bottom: 1px solid var(--bg2);
    }

    .logo {
        font-size: 40px;
        font-weight: bold;
        margin-left: auto;
        margin-right: auto;

    }

    .logo i {
        font-style: normal;
        color: var(--main3);
    }

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .menu {
        width: 100%;
        max-width: 440px;
        height: 100%;
        max-height: 660px;
        background-color: var(--bg1);
        border: 1px solid var(--bg2);
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;   
        gap: 10px;     
    }

    .row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .row .text {
        display: flex;
        flex-direction: column;
        max-width: 40%;
        width: 100%;
        display: flex;
        margin-top: 10px;
    }

    .heading {
        font-weight: bold;
        font-size: 16px;
    }

    .body {
        font-size: 14px;
        color: var(--text2);
    }

    input {
        background-color: var(--bg2);
        font-size: 16px;
        width: 40%;
        height: fit-content;
        border: 1px solid var(--bg3);
    }

    button.main {
        margin-top: auto;
        font-size: 16px;
        font-weight: bold;
        align-items: center;
        justify-content: center;
    }

</style>