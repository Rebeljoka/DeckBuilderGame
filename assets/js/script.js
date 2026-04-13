let playerHealth = 100;
let enemyHealth = 100;
let currentRound = 1;

let deck = [
    { name: "Attack", damage: 15 },
    { name: "Attack", damage: 15 },
    { name: "Block", block: 8 },
    { name: "Heal", heal: 8 },
    { name: "Double Attack", damage: 22 },
    { name: "Draw", draw: 2},    
    { name: "Draw", draw: 2},
    { name: "Weaken", weaken: 10 },
    { name: "Heavy Attack", damage: 30 },
];


let hand = [];
let enemyHand = [];
let enemyActions = []; // To display what enemy did
let playerWeaken = 0;
let enemyWeaken = 0;
let playerBlock = 0;
let enemyBlock = 0;
let playerExhaustedUntil = 0;
let enemyExhaustedUntil = 0;
let skipEnemyTurn = false;
let skipPlayerTurn = false;
let waitingForNextRound = false;

function endTurn() {
	// If waiting for next round button press, increment round and proceed
	if (waitingForNextRound) {
		waitingForNextRound = false;
		currentRound++;
		drawCard();
		document.querySelector("#end-turn-btn span:first-child").innerText = "End Turn";
		updateUI();
		checkGameEnd();
		return;
	}

	// Enemy's turn
	enemyActions = [];

	if (skipEnemyTurn) {
		skipEnemyTurn = false;
		enemyActions.push("⏭️ Enemy's turn was skipped!");
		displayEnemyActions();
	} else if (currentRound < enemyExhaustedUntil) {
		enemyDrawCard();
		enemyActions.push("😵 Enemy is too exhausted to play a card!");
		displayEnemyActions();
	} else {
		// Show thinking message
		let actionLog = document.getElementById("action-log");
		actionLog.innerHTML = "🤔 Enemy is thinking...";
		actionLog.classList.add("show");
		
		// Delay enemy action by 1.5 seconds
		setTimeout(() => {
			enemyActions = [];
			enemyTurn();
			displayEnemyActions();
			
			// Set flag to wait for next round button press
			waitingForNextRound = true;
			document.querySelector("#end-turn-btn span:first-child").innerText = "End Round";
			updateUI();
			checkGameEnd();
		}, 1500);
		return;
	}

	// Set flag to wait for next round button press (for skipped/exhausted turns)
	waitingForNextRound = true;
	document.querySelector("#end-turn-btn span:first-child").innerText = "End Round";
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
	document.getElementById("enemy-card-count").innerText = enemyHand.length;

    // Update round counter
    document.getElementById("round-number").innerText = currentRound;
    
    // Render enemy hand
    renderEnemyHand();
    
    // Update status effects displays
    updateStatusEffectsDisplay();
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
	playerBlock = 0;
	enemyBlock = 0;
	playerExhaustedUntil = 0;
	enemyExhaustedUntil = 0;
	skipEnemyTurn = false;
	skipPlayerTurn = false;
	waitingForNextRound = false;
	updateUI();
	drawCard();
	drawCard();
	enemyDrawCard();
	enemyDrawCard();
}

function updateStatusEffectsDisplay() {
	const playerEffectsContainer = document.getElementById("player-status-effects");
	const enemyEffectsContainer = document.getElementById("enemy-status-effects");
	
	// Clear containers
	playerEffectsContainer.innerHTML = "";
	enemyEffectsContainer.innerHTML = "";
	
	// Build player status effects
	let playerEffects = [];
	
	if (playerWeaken > 0) {
		playerEffects.push({ icon: "⚡", text: `Weakened - ${playerWeaken}`, type: "weaken" });
	}

	if (playerBlock > 0) {
		playerEffects.push({ icon: "🛡️", text: `Block - ${playerBlock}`, type: "block" });
	}

	if (playerExhaustedUntil > currentRound) {
		const turnsLeft = playerExhaustedUntil - currentRound;
		playerEffects.push({ icon: "😵", text: `Exhausted (${turnsLeft} round${turnsLeft > 1 ? 's' : ''})`, type: "exhaust" });
	}
	
	// Display player effects
	if (playerEffects.length === 0) {
		playerEffectsContainer.innerHTML = '<span class="status-effect-empty">No effects</span>';
	} else {
		playerEffects.forEach(effect => {
			const badge = createStatusBadge(effect.icon, effect.text, effect.type);
			playerEffectsContainer.appendChild(badge);
		});
	}
	
	// Build enemy status effects
	let enemyEffects = [];
	
	if (enemyWeaken > 0) {
		enemyEffects.push({ icon: "⚡", text: `Weakened -${enemyWeaken}`, type: "weaken" });
	}

	if (enemyBlock > 0) {
		enemyEffects.push({ icon: "🛡️", text: `Block -${enemyBlock}`, type: "block" });
	}

	if (enemyExhaustedUntil > currentRound) {
		const turnsLeft = enemyExhaustedUntil - currentRound;
		enemyEffects.push({ icon: "😵", text: `Exhausted (${turnsLeft} round${turnsLeft > 1 ? 's' : ''})`, type: "exhaust" });
	}
	
	// Display enemy effects
	if (enemyEffects.length === 0) {
		enemyEffectsContainer.innerHTML = '<span class="status-effect-empty">No effects</span>';
	} else {
		enemyEffects.forEach(effect => {
			const badge = createStatusBadge(effect.icon, effect.text, effect.type);
			enemyEffectsContainer.appendChild(badge);
		});
	}
}

function createStatusBadge(icon, text, type) {
	const badge = document.createElement("div");
	badge.className = `status-effect-badge status-effect-${type}`;
	badge.innerHTML = `<span>${icon}</span><span>${text}</span>`;
	return badge;
}