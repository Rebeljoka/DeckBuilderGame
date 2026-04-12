let playerHealth = 20;
let enemyHealth = 20;
let currentRound = 1;

let deck = [
	{ name: "Attack", damage: 15 },
	{ name: "Attack", damage: 15 },
	{ name: "Block", block: 8 },
	{ name: "Heal", heal: 8 },
	{ name: "doubleAttack", damage: 22 },
	{ name: "heavyAttack", damage: 30 },	// skip turn..?
	{ name: "Draw", draw: 2},	
	{ name: "Draw", draw: 2},
	{ name: "Weaken", enemyWeaken: -10 },
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
		
		// Determine card type for styling
		let cardType = "default";
		if (card.damage) cardType = "attack";
		if (card.heal) cardType = "heal";
		if (card.block) cardType = "block";
		
		cardDiv.className = `card-item ${cardType}`;
		cardDiv.onclick = () => playCard(index);

		let cardName = document.createElement("div");
		cardName.className = "card-name";
		cardName.innerText = card.name;
		cardDiv.appendChild(cardName);

		if (card.damage) {
			let damageStat = document.createElement("div");
			damageStat.className = "card-stat";
			damageStat.innerText = `⚔️ ${card.damage} Damage`;
			cardDiv.appendChild(damageStat);
		}

		if (card.block) {
			let blockStat = document.createElement("div");
			blockStat.className = "card-stat";
			blockStat.innerText = `🛡️ ${card.block} Block`;
			cardDiv.appendChild(blockStat);
		}

		if (card.heal) {
			let healStat = document.createElement("div");
			healStat.className = "card-stat";
			healStat.innerText = `💚 ${card.heal} Heal`;
			cardDiv.appendChild(healStat);
		}

		if (card.draw) {
			let drawText = document.createElement("p");
			drawText.className = "card-text mb-0 small";
			drawText.innerText = `Draw: ${card.draw}`;
			cardBody.appendChild(drawText);
		}

		if (card.enemyWeaken) {
			let weakenText = document.createElement("p");
			weakenText.className = "card-text mb-0 small";
			weakenText.innerText = `Weaken Enemy: ${-card.enemyWeaken}`;
			cardBody.appendChild(weakenText);
		}

		if (card.heavyAttack) {
			let heavyText = document.createElement("p");
			heavyText.className = "card-text mb-0 small";
			heavyText.innerText = `Skip Enemy Turn`;
			cardBody.appendChild(heavyText);
		}

		if (card.doubleAttack) {
			let doubleText = document.createElement("p");
			doubleText.className = "card-text mb-0 small";
			doubleText.innerText = `Damage: ${card.damage} (Double Next Attack)`;
			cardBody.appendChild(doubleText);
		}

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

		if (card.draw) {
		for (let i = 0; i < card.draw; i++) {
			drawCard();
		}
	}

	if (card.enemyWeaken) {
		// % decrease enemy damage next turn
	}

	hand.splice(index, 1);
	updateUI();
	renderHand();
	checkGameEnd();
}

function endTurn() {
	// enemy attacks
	playerHealth -= 15; // fixed damage for now, can be randomized or based on enemy cards later

    currentRound++;
	drawCard();
	updateUI();
	checkGameEnd();
}

function updateUI() {
	// Update health values
	document.getElementById("player-health").innerText = playerHealth;
	document.getElementById("enemy-health").innerText = enemyHealth;
	
	// Update health bars (0-20)
	const maxHealth = 100;
	const playerHealthPercent = Math.max(0, (playerHealth / maxHealth) * 100);
	const enemyHealthPercent = Math.max(0, (enemyHealth / maxHealth) * 100);
	
	document.getElementById("player-health-bar").style.width = playerHealthPercent + "%";
	document.getElementById("enemy-health-bar").style.width = enemyHealthPercent + "%";
	

	
	// Update card count
	document.getElementById("card-count").innerText = hand.length;

    // Update round counter
    document.getElementById("round-number").innerText = currentRound;
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
