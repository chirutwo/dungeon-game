let idToName = {
	1:"dirt",
	2:"nether_wart_block",
	3:"observer_front",
	4:"missing_tile",
	5:"raw_gold_block",
	6:"reactor_core_stage_0",
};

let nameToImage = {
	"dirt":"images/dirt.png",
	"nether_wart_block":"images/nether_wart_block.png",
	"observer_front":"images/observer_front.png",
	"missing_tile":"images/missing_tile.png",
	"raw_gold_block":"images/raw_gold_block.png",
	"reactor_core_stage_0":"images/reactor_core_stage_0.png",
};

let playerX = 0;
let playerY = 0;
let playerXVel = 0;
let playerYVel = 0;
let keys = {
	"ArrowLeft":false,
	"ArrowRight":false,
	"ArrowUp":false,
	"ArrowDown":false,
  "Shift":false,
  "a":false,
  "b":false,
  "c":false,
  "d":false,
  "e":false,
  "f":false,
  "g":false,
  "h":false,
  "i":false,
  "j":false,
  "k":false,
  "l":false,
  "m":false,
  "n":false,
  "o":false,
  "p":false,
  "q":false,
  "r":false,
  "s":false,
  "t":false,
  "u":false,
  "v":false,
  "w":false,
  "x":false,
  "y":false,
  "z":false,
  "A":false,
  "B":false,
  "C":false,
  "D":false,
  "E":false,
  "F":false,
  "G":false,
  "H":false,
  "I":false,
  "J":false,
  "K":false,
  "L":false,
  "M":false,
  "N":false,
  "O":false,
  "P":false,
  "Q":false,
  "R":false,
  "S":false,
  "T":false,
  "U":false,
  "V":false,
  "W":false,
  "X":false,
  "Y":false,
  "Z":false,
};

const canvas = document.getElementById("canvas");

function dealWithCapitals() {
  if (!keys["Shift"]){
    keys["A"] = false;
    keys["B"] = false;
    keys["C"] = false;
    keys["D"] = false;
    keys["E"] = false;
    keys["F"] = false;
    keys["G"] = false;
    keys["H"] = false;
    keys["I"] = false;
    keys["J"] = false;
    keys["K"] = false;
    keys["L"] = false;
    keys["M"] = false;
    keys["N"] = false;
    keys["O"] = false;
    keys["P"] = false;
    keys["Q"] = false;
    keys["R"] = false;
    keys["S"] = false;
    keys["T"] = false;
    keys["U"] = false;
    keys["V"] = false;
    keys["W"] = false;
    keys["X"] = false;
    keys["Y"] = false;
    keys["Z"] = false;
  }
}

function inputHandling() {
  dealWithCapitals();

	if (keys["ArrowLeft"] || keys["a"] || (keys["Shift"] && keys["A"])) {
		playerXVel -= 0.25;
	}
	if (keys["ArrowRight"] || keys["d"] || (keys["Shift"] && keys["D"])) {
		playerXVel += 0.25;
	}
	if (keys["ArrowUp"] || keys["w"] || (keys["Shift"] && keys["W"])) {
		playerYVel += 0.25;
	}
	if (keys["ArrowDown"] || keys["s"] || (keys["Shift"] && keys["S"])) {
		playerYVel -= 0.25;
	}
  playerX += playerXVel;
  playerY += playerYVel;
  playerXVel *= 0.9;
  playerYVel *= 0.9;
  console.log(playerXVel);
}

function main() {
	document.addEventListener("keydown", function(button) {
		keys[button.key] = true;
	});
 	document.addEventListener("keyup", function(button) {
  	keys[button.key] = false;
	});
  inputHandling();
}

setInterval(main, 1000 / 60);


