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
		let cardDiv = document.createElement("div");
		cardDiv.className = "card bg-primary text-white";
		cardDiv.style.width = "120px";
		cardDiv.style.cursor = "pointer";

		let cardBody = document.createElement("div");
		cardBody.className = "card-body p-2";

		let cardTitle = document.createElement("h6");
		cardTitle.className = "card-title mb-2";
		cardTitle.innerText = card.name;

		cardBody.appendChild(cardTitle);

		if (card.damage) {
			let damageText = document.createElement("p");
			damageText.className = "card-text mb-0 small";
			damageText.innerText = `Damage: ${card.damage}`;
			cardBody.appendChild(damageText);
		}

		if (card.block) {
			let blockText = document.createElement("p");
			blockText.className = "card-text mb-0 small";
			blockText.innerText = `Block: ${card.block}`;
			cardBody.appendChild(blockText);
		}

		if (card.heal) {
			let healText = document.createElement("p");
			healText.className = "card-text mb-0 small";
			healText.innerText = `Heal: ${card.heal}`;
			cardBody.appendChild(healText);
		}

		cardDiv.appendChild(cardBody);
		cardDiv.onclick = () => playCard(index);

		cardsDiv.appendChild(cardDiv);
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
