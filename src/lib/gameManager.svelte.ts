import { ANSWER_WORDS } from "./answerList";
import { getRandomInt, LETTERS } from "./utils";
import { WORDS } from "./wordlist";

enum GameState {
    InProgress,
    Won,
    Hopeless,
    Lost
}

export type GameManager = {
    words: string[],
    guessHistory: string[],
    isValidGuess: boolean,
    guess: string,
    remainingGuesses: number,
    boardCount: number,
    gameState: GameState,
    focused: number,
    spareGuesses: number,
}

export let manager: GameManager = $state({
    words: [],
    guessHistory: [],
    isValidGuess: true,
    guess: "",
    remainingGuesses: 6,
    spareGuesses: 5,
    boardCount: 2,
    gameState: GameState.InProgress,
    focused: -1,
});

export const restartGame = () => {
    manager.words.length = 0;
    manager.guessHistory.length = 0;
    manager.guess = "";
    manager.focused = -1;
    manager.gameState = GameState.InProgress
    while(manager.words.length != manager.boardCount){
        let word = ANSWER_WORDS[getRandomInt(2315)];
        while(manager.words.includes(word)){
            word = ANSWER_WORDS[getRandomInt(2315)]
        }
        manager.words.push(word);
    }
    manager.remainingGuesses = manager.boardCount + manager.spareGuesses;
}

export const cycleFocus = () => {
    manager.focused = (manager.focused + 1) % manager.words.length;
    document.getElementById(`scrollHelper${manager.focused}`)?.scrollIntoView({ behavior: 'smooth' });    
}

export const attemptGuess = () => {
    if(manager.gameState == GameState.Lost){
        return;
    }
    if(manager.guess.length == 5){
        if(WORDS.includes(manager.guess)){
            manager.guessHistory.push(manager.guess);
            manager.remainingGuesses--;
        }

        let offset = 0;
        for(let i = 0; i < manager.words.length; i++){
            if(manager.words[i - offset] == manager.guess){
                manager.words.splice(i - offset, 1);
                if(manager.focused >= manager.words.length){
                    manager.focused = 0;
                }
                offset++;
            }
        }
    }
    manager.guess = "";

    if(manager.words.length == 0){
        manager.gameState = GameState.Won
    } else if(manager.remainingGuesses == 0){
        manager.gameState = GameState.Lost
    } else if (manager.words.length > manager.remainingGuesses){
        manager.gameState = GameState.Hopeless
    }

}

export const attemptAddLetter = (letter: string) => {
    if(LETTERS.includes(letter) && manager.guess.length < 5){
        manager.guess = manager.guess + (letter);
    }
}

export const deleteLetter = () => {
    manager.guess = manager.guess.substring(0, manager.guess.length - 1)
}

export const keydownLogic = (e: KeyboardEvent) => {
    if(e.ctrlKey && e.key == 'r'){
        e.preventDefault();
        restartGame();
    } else if (e.ctrlKey && e.key == 'a') {
        e.preventDefault();
        manager.guess = "";
    } else if(e.key == 'Enter'){
        attemptGuess();
    } else if (e.key == "Backspace"){
        deleteLetter();
    } else if (e.key == "Tab") {
        e.preventDefault();
        cycleFocus();  
    } else {
        attemptAddLetter(e.key.toLowerCase());
    }
}

