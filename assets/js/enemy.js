// Enemy AI and Logic Functions

function enemyDrawCard() {
	if (deck.length === 0) return;
	let card = deck[Math.floor(Math.random() * deck.length)];
	enemyHand.push(card);
}

function enemyTurn() {
	// Draw a card for the enemy
	enemyDrawCard();
	
	// Enemy picks a card to play with some AI logic
	if (enemyHand.length > 0) {
		let cardIndex = selectEnemyCard();
		let card = enemyHand[cardIndex];
		
		// Apply card effects
		if (card.damage) {
			let damage = card.damage;
			if (enemyWeaken > 0) {
				let reduced = Math.min(enemyWeaken, damage);
				damage -= reduced;
				enemyWeaken = 0;
				enemyActions.push(`🧪 Enemy attack weakened by ${reduced}!`);
			}
			if (playerBlock > 0) {
				let blocked = Math.min(playerBlock, damage);
				damage -= blocked;
				playerBlock -= blocked;
				enemyActions.push(`🛡️ Player's attack blocked for ${blocked} damage!`);
			}
			playerHealth -= damage;
			enemyActions.push(`⚔️ Enemy dealt ${damage} damage!`);
		}
		
		if (card.heal) {
			enemyHealth += card.heal;
			if (enemyHealth > 100) enemyHealth = 100;
			enemyActions.push(`💚 Enemy healed ${card.heal} health!`);
		}
		
		if (card.draw) {
			for (let i = 0; i < card.draw; i++) {
				enemyDrawCard();
			}
			enemyActions.push(`🎴 Enemy drew ${card.draw} cards!`);
		}
		
		if (card.weaken) {
			playerWeaken += Math.abs(card.weaken);
			enemyActions.push(`🧪 Enemy weakened your next attack by ${Math.abs(playerWeaken)}.`);
		}

		if (card.block) {
			enemyBlock += card.block;
			enemyActions.push(`🛡️ Enemy gains ${card.block} block for its next defense!`);
		}

		if (card.name === "Heavy Attack") {
			enemyExhaustedUntil = currentRound + 2;
			enemyActions.push(`⏭️ Enemy used Heavy Attack and will be exhausted for the next round!`);
		}
		
		// Remove played card from enemy hand
		enemyHand.splice(cardIndex, 1);
	}
}

function selectEnemyCard() {
	// AI logic for choosing the best card
	
	// Priority 1: If enemy health is low, heal if possible
	if (enemyHealth < 40) {
		let healIndex = enemyHand.findIndex(card => card.heal);
		if (healIndex !== -1) return healIndex;
	}
	
	// Priority 2: Play damage cards
	let damageCards = enemyHand.map((card, index) => ({ card, index }))
		.filter(item => item.card.damage)
		.sort((a, b) => (b.card.damage || 0) - (a.card.damage || 0));
	
	if (damageCards.length > 0) {
		return damageCards[0].index;
	}
	
	// Priority 3: Play heal cards if not critically low
	let healIndex = enemyHand.findIndex(card => card.heal);
	if (healIndex !== -1) return healIndex;
	
	// Priority 4: Play draw cards
	let drawIndex = enemyHand.findIndex(card => card.draw);
	if (drawIndex !== -1) return drawIndex;
	
	// Default: Play first card in hand
	return 0;
}

function displayEnemyActions() {
	if (enemyActions.length > 0) {
		let actionLog = document.getElementById("action-log");
		actionLog.innerHTML = enemyActions.join(" ");
		actionLog.classList.add("show");
		console.log("Enemy's turn:", enemyActions.join(" "));
		
		// Remove the show class after a few seconds
		setTimeout(() => {
			actionLog.classList.remove("show");
		}, 3000);
	}
}

function renderEnemyHand() {
	let enemyCardsDiv = document.getElementById("enemy-cards");
	enemyCardsDiv.innerHTML = "";

	enemyHand.forEach((card, index) => {
		let cardDiv = document.createElement("div");
		
		// Determine card type for styling
		let cardType = "default";
		if (card.damage) cardType = "attack";
		if (card.heal) cardType = "heal";
		if (card.block) cardType = "block";
		
		cardDiv.className = `card-item ${cardType}`;
		
		let cardName = document.createElement("div");
		cardName.className = "card-name";
		cardName.innerText = "Card Back";
		cardDiv.appendChild(cardName);
		
		enemyCardsDiv.appendChild(cardDiv);
	});
}
