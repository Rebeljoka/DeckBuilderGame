let playerHealth = 20;
let enemyHealth = 20;

let deck = [
	{ name: "Attack", damage: 3 },
	{ name: "Attack", damage: 3 },
	{ name: "Block", block: 3 },
	{ name: "Heal", heal: 2 },
];

let hand = [];

function drawCard() {
	if (deck.length === 0) return;
	let card = deck[Math.floor(Math.random() * deck.length)];
	hand.push(card);
	renderHand();
}

function renderHand() {
	let cardsDiv = document.getElementById("cards");
	cardsDiv.innerHTML = "";

	hand.forEach((card, index) => {
		let btn = document.createElement("button");
		btn.className = "btn btn-primary";
		btn.innerText = card.name;

		btn.onclick = () => playCard(index);

		cardsDiv.appendChild(btn);
	});
}

function playCard(index) {
	let card = hand[index];

	if (card.damage) {
		enemyHealth -= card.damage;
	}

	if (card.heal) {
		playerHealth += card.heal;
	}

	hand.splice(index, 1);
	updateUI();
	renderHand();
	checkGameEnd();
}

function endTurn() {
	// enemy attacks
	playerHealth -= 2;

	drawCard();
	updateUI();
	checkGameEnd();
}

function updateUI() {
	document.getElementById("player-health").innerText = playerHealth;
	document.getElementById("enemy-health").innerText = enemyHealth;
}

function checkGameEnd() {
	if (playerHealth <= 0) {
		alert("You Lose!");
	} else if (enemyHealth <= 0) {
		alert("You Win!");
	}
}

// start game
drawCard();
drawCard();
updateUI();
