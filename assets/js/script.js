let playerHealth = 100;
let enemyHealth = 100;
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
let enemyHand = [];
let enemyActions = []; // To display what enemy did
let playerWeaken = 0;
let enemyWeaken = 0;

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
			let drawText = document.createElement("div");
			drawText.className = "card-stat";
			drawText.innerText = `Draw: ${card.draw}`;
			cardDiv.appendChild(drawText);
		}

		if (card.enemyWeaken) {
			let weakenText = document.createElement("div");
			weakenText.className = "card-stat";
			weakenText.innerText = `Weaken Enemy: ${-card.enemyWeaken}`;
			cardDiv.appendChild(weakenText);
		}

		if (card.heavyAttack) {
			let heavyText = document.createElement("div");
			heavyText.className = "card-stat";
			heavyText.innerText = `Skip Enemy Turn`;
			cardDiv.appendChild(heavyText);
		}

		if (card.doubleAttack) {
			let doubleText = document.createElement("div");
			doubleText.className = "card-stat";
			doubleText.innerText = `Damage: ${card.damage} (Double Next Attack)`;
			cardDiv.appendChild(doubleText);
		}

		cardsDiv.appendChild(cardDiv);
	});
}

function playCard(index) {
	let card = hand[index];

	if (card.damage) {
		let damage = card.damage;
		if (enemyWeaken > 0) {
			let reduced = Math.min(enemyWeaken, damage);
			damage -= reduced;
			enemyWeaken = 0;
			console.log(`Enemy attack weakened by ${reduced}`);
		}
		enemyHealth -= damage;
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
		enemyWeaken += Math.abs(card.enemyWeaken);
		console.log(`Enemy next attack reduced by ${Math.abs(card.enemyWeaken)}`);
	}

	hand.splice(index, 1);
	updateUI();
	renderHand();
	checkGameEnd();
}

function endTurn() {
	// Enemy's turn
	enemyActions = [];
	enemyTurn();
	displayEnemyActions();

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
	
	// Update weaken status displays
	const enemyWeakenStatus = document.getElementById("enemy-weaken-status");
	const playerWeakenStatus = document.getElementById("player-weaken-status");
	
	if (enemyWeaken > 0) {
		document.getElementById("enemy-weaken-amount").innerText = enemyWeaken;
		enemyWeakenStatus.classList.remove("hidden");
	} else {
		enemyWeakenStatus.classList.add("hidden");
	}
	
	if (playerWeaken > 0) {
		document.getElementById("player-weaken-amount").innerText = playerWeaken;
		playerWeakenStatus.classList.remove("hidden");
	} else {
		playerWeakenStatus.classList.add("hidden");
	}
	
	// Update card count
	document.getElementById("card-count").innerText = hand.length;
	document.getElementById("enemy-card-count").innerText = enemyHand.length;

    // Update round counter
    document.getElementById("round-number").innerText = currentRound;
    
    // Render enemy hand
    renderEnemyHand();
}

function checkGameEnd() {
	if (playerHealth <= 0) {
		alert("You Lose!");
		restartGame();
	} else if (enemyHealth <= 0) {
		alert("You Win!");
		restartGame();
	}
}

function startGame() {
	// Draw 2 cards for the player to start
	drawCard();
	drawCard();
	
	// Draw 2 cards for the enemy to start
	enemyDrawCard();
	enemyDrawCard();
	
	updateUI();
	
	// Hide start button and show end turn button
	document.getElementById("start-btn").style.display = "none";
	document.getElementById("end-turn-btn").style.display = "block";
}

function restartGame() {
	playerHealth = 100;
	enemyHealth = 100;
	currentRound = 1;
	hand = [];
	enemyHand = [];
	enemyActions = [];
	playerWeaken = 0;
	enemyWeaken = 0;
	updateUI();
	drawCard();
	drawCard();
	enemyDrawCard();
	enemyDrawCard();
}