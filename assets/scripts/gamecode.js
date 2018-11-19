//Initialize wins and LettersGuessed on load
var wins = 0;
var LettersGuessed = []; //array which will contain letters already guessed and use that to prevent repeated inputs
var gamestate = false; //Using state-space methods, write events based on whether this is true or false
var blank = '_';
var winCount = document.getElementById("wins");
var QuitButton = document.getElementById("quit");
var StartState = document.getElementById("start");
var BlankWord = document.getElementById("word");
var remainingGuess = document.getElementById("remainingGuesses");
var guessedLetters = document.getElementById("guessedLetters");
var Answers = ["Megaman", "Metroid", "TheLegendofZelda", "Punchout", "Contra", "DonkeyKong", "MetalGear"]; //Contains possible answer for word guess
var Answer;
var answer;
var Blanks;
var attempts;

//This function will be called to calculate how many attempts the user gets based on the amount of unique letters in the word (works)
function calculateAttempts(word) {
    var uniqueLength = word.length;
    for (i=0; i<word.length; i++)
    {
        if (word.indexOf(word[i], i+1) != -1) {
            uniqueLength--;
        }
    }
    return 2 * uniqueLength;
}

//Is used to fill in the displayed blanks as the word is solved 
function FillinWord(letter, lowercase, Word) {
    Blanks = Blanks.split('');
    for(var i=0; i<lowercase.length; i++) {
        if(letter === lowercase.charAt(i))
            Blanks[i] = (Word.charAt(i)); //Put letters in the actual answer in place of the blanks (underscores)     
        }
    Blanks = Blanks.join('');
    BlankWord.textContent = Blanks;
}

//Function to determine if every letter in the answer has been guessed (true/false output)
function Completed(correct, guessed) { //Remember, correct is a string, guessed is an array (since the guessedLetters array is input)
    var matchcount = 0;
    for(var i=0; i<correct.length; i++) {
        for(var j=0; j<guessed.length; j++) {
            if (correct.charAt(i) === guessed[j]) {
                matchcount++;
                break;
            }
        }
    }
    if (matchcount === correct.length)
        return true;
}

function initialize() { //sets gamestate back to false and re-initializes variables
    gamestate = false;
    LettersGuessed = [];
    Answer = undefined;
    answer = undefined;
    Blanks = undefined;
    attempts = undefined;
    StartState.textContent = "Press any key to start!";
}

//For starting the game
document.onkeyup = function(event) {
    var guess = event.key.toLowerCase();
    QuitButton.className = "d-block";
    StartState.textContent = "Game in Progress";
    if (gamestate === false) {
        gamestate = true;
        Answer = Answers[Math.floor(Math.random() * (Answers.length - 1))]; //Get an answer string randomly from the array of answers
        answer = Answer.toLowerCase(); //A little hard to read and keep track of, but useful for the FillinWord function
        Blanks = blank.repeat(Answer.length);
        attempts = calculateAttempts(Answer); //Calculates how many attempts the user will get based on the amount of unique letters in the word
        BlankWord.textContent = Blanks; //Prints the exact amount of blank spaces (underscores) equivalent to the amount of letters in the word
        remainingGuess.textContent = "Remaining Guesses: " + attempts; //Print the amount of attempts left on the page
    }
    else //will nest conditions from here on to avoid state confusion
    {
        if (LettersGuessed.includes(guess)) //if already guessed
            alert("Letter has already been guessed");
        else if (answer.includes(guess) && !(LettersGuessed.includes(guess))) { //if correct will fill in a letter and add that letter to 'LettersGuessed'
            LettersGuessed.push(guess); //Push in guessed letter
            guessedLetters.textContent = LettersGuessed.toString(); //Print full 'LettersGuessed' array
            FillinWord(guess, answer, Answer);
            //In this next statement, we will check if the requirements to win have occurred
            if(Completed(answer, LettersGuessed)) {
                alert("You're Winner!");
                wins++;
                winCount.textContent = "Wins: " + wins;
                initialize();
            }
        }
        else if (!answer.includes(guess) && !LettersGuessed.includes(guess)) { //if wrong will remove an attempt and add the letter to 'LettersGuessed'
            LettersGuessed.push(guess);
            guessedLetters.textContent = LettersGuessed.toString();
            attempts--;
            remainingGuess.textContent = "Remaining Guesses: " + attempts;
            //We will also check to see if the attempts have run out
            if (attempts<=0) {
                alert("You Lost");
                initialize(); //we will the game back to start
            }
        }
    }
}

//Will call initialize function
QuitButton.onclick = function() {
    if (gamestate === true)
        initialize();
}

