// Player Logic and Functions

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
	if (skipPlayerTurn) {
		skipPlayerTurn = false;
		alert("Your turn is skipped! The enemy's heavy attack left you stunned.");
		endTurn();
		return;
	}

	let card = hand[index];

	if (card.damage) {
		let damage = card.damage;
		if (playerWeaken > 0) {
			let reduced = Math.min(playerWeaken, damage);
			damage -= reduced;
			playerWeaken = 0;
			console.log(`Your attack weakened by ${reduced}`);
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

	if (card.name === "heavyAttack") {
		skipPlayerTurn = true;
		console.log("You deal 30 damage and skip the your next turn!");
	}

	hand.splice(index, 1);
	updateUI();
	renderHand();
	checkGameEnd();
}
