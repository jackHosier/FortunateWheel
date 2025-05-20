
/*
Author: Jack Hosier
Date: 9/12/2023 
Description: This is a Wheel of Fortune type game written in Javascript
*/

//these are the constants that will be used for the program 
const prompt = require('prompt-sync')() //can promprt for inputs 
const print = console.log //this is for printing outputs
const fs = require('fs') //this is for reading files 

let winner = false //bool flag for if a winner 
let match = false //bool flag for matches 

//Player constructor
function Player (name, roundScore, totalScore) { 
    this.name = name
    this.roundScore = roundScore
    this.totalScore = totalScore
} 

const words = [] //array of words that will be used for the game 
const players = [] //array of all the players in the game 

var numMatches = 0 //this stores the number of matches 

function getPlayers(){
    
    var numPlayers = parseInt(prompt("\nHow many players are playing today (1-3)?")) //get the number of players

    if(isNaN(numPlayers) || numPlayers < 1 || numPlayers > 3){ //do some error checking

        throw("ERROR: Invalid number of players")
    }

   //get the player information and populate player array  
    for(var i = 0; i < numPlayers; i++){
        let name = prompt(`Please enter your name, Player ${i}: `)
        let player = new Player(name, 0, 0)
        players.push(player)
    }

}

//helper function that reads the text file with all the words. 
function readFile(){
   
    //read the lines in the file
    const readFileLines = filename => fs.readFileSync(filename).toString('utf8').split('\n')

    let array = readFileLines('dictionary.txt')

    //copy contents to global array 
    for(let i = 0; i <= array.length; i++){

        words[i] = array[i]
    }
   
}

//this function checks the user input and makes sure it is correct. 
function checkInput(input){

    check = /^[A-Za-z]*$/.test(input) //check if the string is letters. 

    if(check){

        return input.toUpperCase() //return as uppercase 
    } else {
        print("invalid input")
    }

}

//this function generates the puzzle
function getSecretWord(){

    let secretWord = words[Math.floor(Math.random() * words.length)]

    return secretWord

}

//helper func that generates the puzzle string to be displayed 
function generatePuzzle(secretWord){

    var puzzle = ""

    for(let i = 0; i < secretWord.length; i++){

        puzzle += "-"
    }

    return puzzle
}

//helper func that finds all occurences of an element in an array and returns an array of indexes to those elements
function findAllMatchesInString(string, value) 
{
  
    let array = string.split("") //convert string into array 

    let indexes = [] //array of all indexes of the elements 
   
    array.forEach((element, index) => {

        if (element == value){
            indexes.push(index)
        }
        
    });

    return indexes

}

//replace characters in a string at a given index 
function replaceCharsAt(string, index, newChar){ 

    if(index > string.length - 1){ //if index out of bounds, just return the string 

        return string; 
    } 

    return string.substring(0, index) + newChar + string.substring(index + 1)

}

//this function matches the guess with the puzzle string 
function matchString(guess, puzzleString, secretWord){

    guess = checkInput(guess) //check if the input is correct

    if(secretWord.includes(guess)){ //if the letter they guess is in the secretWord

        match = true //flip the bool flag to true 
        
        let indexesOfMatches = []

        //search index of all matching chars within the secret words
        indexesOfMatches = findAllMatchesInString(secretWord, guess) 

        numMatches = indexesOfMatches.length //assign the number of matches to a global var 

        for(index of indexesOfMatches){
            //print(index)
            puzzleString = replaceCharsAt(puzzleString, index, secretWord[index]) //show the cooresponding letter(s) in the word
        }
            
        return puzzleString
    } else { //if guess is NOT in the secret word

        match = false //flag is set to false

        return puzzleString

    } 
   
}

//this function completes a turn 
function doTurn(player, secretWord, puzzleString){

    var guess = prompt("\nWhat letter would you like to guess?")

    if(guess == ""){ //if user enters a blank guess
        return
    }

    guess.toUpperCase() //make uppercase 

    puzzleString = matchString(guess, puzzleString, secretWord) //match the guess 

    if(match){ //if the match is correct 

        print("CORRECT! Puzzle: " + puzzleString)

        var choice = prompt("\nEnter 1 to Spin & Guess again, or 2 to solve:") 

        if(choice === "1"){ //the player wants to guess a letter in the word

            var points = spinTheWheel() //spin the wheel 

            points = (points * numMatches) //multiply the winnings by the number of matches 

            print("You spun: " + points)
            
            player.roundScore += points //add points to the user's score 

            var guess = prompt("What letter would you like to guess?")

            guess.toUpperCase()

            puzzleString = matchString(guess, puzzleString, secretWord) //match the guess

            if(match){//if they guessed correctly

                //reveal all instances of the correct letter 
                print("CORRECT! Puzzle:" , puzzleString)

                print("\nPress ENTER to spin the wheel: ")

                var points = spinTheWheel() //let the user spin the wheel 

                player.roundScore += points //add points to their score 
                print('Your round score is: ', player.roundScore)

            } else {

                print(`Sorry, ${guess} is not in the word`)
                player.roundScore = (player.roundScore / 2) //the player loses half their points for a wrong guess
                print('Your round score is: ', player.roundScore)
            }

        } else if (choice === "2"){ //the player wants to guess the full word 

            var fullWordGuess = prompt("Enter the word: ")

            if(fullWordGuess === secretWord){ //if they guess the secret word correctly, they win the game

                print(`YOU WON, ${player.name}!! CONGRATULATIONS!!`)

                winner = true; //the boolean flag is set to true and we exit the game 
                player.totalScore == player.roundScore //round score becomes the player's total score
                player.roundScore == 0 //reset round score to zero
            
            } else { //if they choose the wrong word, the player loses all their round points 

                print("That is not the word :(")

                //reset points to zero 
                player.roundScore == 0
            }

        } else {

            print("Invalid choice")
        }
    } else {
        print(`Sorry, ${guess} is not in the word.`)

        player.roundScore = (player.roundScore / 2) //players loses half their points 

        print("Puzzle: ", puzzleString)
        print("Your round score is ", player.roundScore)

    }
    return puzzleString; 
}


//this is the function that spins the wheel 
function spinTheWheel(){

    let points = [] //set up points array 

    points = [0, 650, 900, 700, 500, 800, 500, 650, 500, 900, 0, 1000, 500, 900, 700, 600, 8000, 500, 700, 600,
        550, 500, 900] 

    let maxVal = points.length //max value of the array 

    let roundPoints = points[Math.floor(Math.random() * maxVal)] //select a random index from the array of points. 

    return roundPoints;

}

//this the function that plays the game 
function playGame(){

    //read the file with the dictionary to initialize the words array
    readFile()

    getPlayers() //get all the players 

    const word = getSecretWord()

    let puzzle = generatePuzzle(word) //this is the initial puzzle string 

    print("Puzzle: ", puzzle) //print out initial puzzle 

    let currentPlayerIndex = 0 //the index of the current player in the player array 

    //print("The word is: ", word) //for debugging purposes only 

    while (!winner){ //repeat until the puzzle is solved
        const currentPlayer = players[currentPlayerIndex]
        print(`\n${currentPlayer.name}, it's your turn!`)
        prompt("press ENTER to spin the wheel")

        puzzle = doTurn(currentPlayer, word, puzzle) //take the turn 

        //if somebody won, end the game
        if (winner){break}
        
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length //else, cycle through the array of players

    }    
}

//this is the main program 
function main(){

    print(" Welcome to Fortunate Wheel!  ") //I legally can not call this Wheel of Fortune, or else Pat Sajak will sue my ass off! 

    let playAgain = "Y" //this is for if the player wants to play again 
    
    while(playAgain.toUpperCase() === "Y"){
        winner = false 
        playGame() //play the game 
        
        playAgain = prompt("Would you like to play again? (Y or N): ")
    }

    print("Thanks for playing!")
    process.exit() //terminate the program 
    
}

main() //play the game