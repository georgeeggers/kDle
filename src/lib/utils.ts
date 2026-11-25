import { manager } from "./gameManager.svelte";
import { WORDS } from "./wordlist";

export enum LetterStatus {
    Incorrect,
    Misplaced,
    Correct,
    Unknown
}

export type ThingProps = {
    currentGuess: string,
    guesses: string[],
    word: string,
    index: number
}

export const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}
 
const encoder = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=_+/?.>,<!@#$%^&*()~`";

export const random = (min: number, max: number) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min)
}

export const getID = () => {
    let id = "";
    for(let i = 0; i < 15; i++){
        id += encoder[random(0, encoder.length - 1)];
    }

    return id;
}


export const testWord = (actualWord: string, guessWord: string) => {
    let a = actualWord.split("");
    let g = guessWord.split("");
    let output: LetterStatus[] = Array(5).fill(LetterStatus.Incorrect, 0, 5);
    let numCorrect = 0;
    for(let i = 0; i < 5; i++){
        if(a[i] == g[i]){
            a[i] = '_'
            g[i] = '_'
            output[i] = LetterStatus.Correct;
            numCorrect++;
        }
    }
    let index = -1;
    for(let guess of g){
        index++;
        if(guess == "_"){
            continue
        }
        for(let i = 0; i < 5; i++){
            if(a[i] == guess){
                output[index] = LetterStatus.Misplaced
                a[i] = '_';
                break;
            }
        }
    }
    return output
}

export const getHelperData = (guesses: string[], word: string,) => {
    let data = [' ', ' ', ' ', ' ', ' '];
    for(let guess of guesses){
        let index = 0;
        for(let i of testWord(word, guess)){
            if(i == LetterStatus.Correct){
                data[index] = word[index];
            }
            index++;
        }
    }
    return data.join("").toUpperCase();
}

export const getAutosolveData = (guesses: string[], word: string,) => {
    let data = [' ', ' ', ' ', ' ', ' '];
    for(let guess of guesses){
        let index = 0;
        for(let i of testWord(word, guess)){
            if(i == LetterStatus.Correct){
                data[index] = word[index];
            }
            index++;
        }
    }
    for(let i of data){
        if(i == " "){
            return false;
        }
    }
    return true;
}

export const getHelperDataBonus = (guesses: string[], word: string,) => {
    let data = [' ', ' ', ' ', ' ', ' '];
    for(let guess of guesses){
        let index = 0;
        for(let i of testWord(word, guess)){
            if(i == LetterStatus.Correct){
                data[index] = word[index];
            }
            index++;
        }
    }
    return data.join("").toUpperCase();
}

export const getGuessColor = (guesses: string[], word: string, currentGuess: string) => {
    let invalidLetters: string[] = [];
    let validLetters: string[] = [];
    for(let guess of guesses){
        const data = testWord(word, guess);
        for(let i = 0; i < 5; i++){
            if(i < currentGuess.length){
                if((data[i] == LetterStatus.Correct && currentGuess[i] != word[i]) || (data[i] == LetterStatus.Misplaced && guess[i] == currentGuess[i])){
                    return false;
                }
            }
            if(!validLetters.includes(guess[i]) && (data[i] == LetterStatus.Correct || data[i] == LetterStatus.Misplaced)){
                validLetters.push(guess[i]);
            }
            if(!invalidLetters.includes(guess[i]) && !validLetters.includes(guess[i]) && data[i] == LetterStatus.Incorrect){
                invalidLetters.push(guess[i]);
            }
        }
    }
    let index = -1;
    const data = getHelperData(guesses, word);

    for(let i of currentGuess){
        index++;
        if(data[index].toLowerCase() == i){
            continue
        }
        if(invalidLetters.includes(i)){
            return false
        }
    }

    return true;

}

export type KeyboardResult = {
    a: LetterStatus,
    b: LetterStatus,
    c: LetterStatus,
    d: LetterStatus,
    e: LetterStatus,
    f: LetterStatus,
    g: LetterStatus,
    h: LetterStatus,
    i: LetterStatus,
    j: LetterStatus,
    k: LetterStatus,
    l: LetterStatus,
    m: LetterStatus,
    n: LetterStatus,
    o: LetterStatus,
    p: LetterStatus,
    q: LetterStatus,
    r: LetterStatus,
    s: LetterStatus,
    t: LetterStatus,
    u: LetterStatus,
    v: LetterStatus,
    w: LetterStatus,
    x: LetterStatus,
    y: LetterStatus,
    z: LetterStatus
}

export const getKeyboardData = (guesses: string[], word: string) => {
    let result = {
        "a": LetterStatus.Unknown,
        "b": LetterStatus.Unknown,
        "c": LetterStatus.Unknown,
        "d": LetterStatus.Unknown,
        "e": LetterStatus.Unknown,
        "f": LetterStatus.Unknown,
        "g": LetterStatus.Unknown,
        "h": LetterStatus.Unknown,
        "i": LetterStatus.Unknown,
        "j": LetterStatus.Unknown,
        "k": LetterStatus.Unknown,
        "l": LetterStatus.Unknown,
        "m": LetterStatus.Unknown,
        "n": LetterStatus.Unknown,
        "o": LetterStatus.Unknown,
        "p": LetterStatus.Unknown,
        "q": LetterStatus.Unknown,
        "r": LetterStatus.Unknown,
        "s": LetterStatus.Unknown,
        "t": LetterStatus.Unknown,
        "u": LetterStatus.Unknown,
        "v": LetterStatus.Unknown,
        "w": LetterStatus.Unknown,
        "x": LetterStatus.Unknown,
        "y": LetterStatus.Unknown,
        "z": LetterStatus.Unknown
    }

    if(manager.words.length == 0){
        return result;
    }

    for(let guess of guesses){
        const data = testWord(word, guess);
        let index = 0;
        for(let i of data){
            if(i == LetterStatus.Correct){
                result[guess[index] as keyof typeof result] = LetterStatus.Correct
            } else if (i == LetterStatus.Misplaced){
                if(result[guess[index] as keyof typeof result] == LetterStatus.Incorrect || result[guess[index] as keyof typeof result] == LetterStatus.Unknown){
                    result[guess[index] as keyof typeof result] = LetterStatus.Misplaced
                }
            } else {
                if(result[guess[index] as keyof typeof result] == LetterStatus.Unknown){
                    result[guess[index] as keyof typeof result] = LetterStatus.Incorrect
                }       
            }
            index++;
        }
    }

    return result;
}