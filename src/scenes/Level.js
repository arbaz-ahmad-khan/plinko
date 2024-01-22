
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// scoreNumberContainer
		const scoreNumberContainer = this.add.container(0, 0);

		// score_0_2
		const score_0_2 = this.add.image(890, 1000, "0.2");
		scoreNumberContainer.add(score_0_2);

		// score_2
		const score_2 = this.add.image(820, 1000, "2");
		scoreNumberContainer.add(score_2);

		// score_4
		const score_4 = this.add.image(750, 1000, "4");
		scoreNumberContainer.add(score_4);

		// score_9
		const score_9 = this.add.image(680, 1000, "9");
		scoreNumberContainer.add(score_9);

		// score_26
		const score_26 = this.add.image(610, 1000, "26");
		scoreNumberContainer.add(score_26);

		// score_130
		const score_130 = this.add.image(540, 1000, "130");
		scoreNumberContainer.add(score_130);

		// score_1000
		const score_1000 = this.add.image(470, 1000, "1000");
		scoreNumberContainer.add(score_1000);

		// score
		const score = this.add.image(960, 1000, "0.2");
		scoreNumberContainer.add(score);

		// score_1
		const score_1 = this.add.image(1030, 1000, "0.2");
		scoreNumberContainer.add(score_1);

		// score_3
		const score_3 = this.add.image(1100, 1000, "2");
		scoreNumberContainer.add(score_3);

		// score_5
		const score_5 = this.add.image(1170, 1000, "4");
		scoreNumberContainer.add(score_5);

		// score_6
		const score_6 = this.add.image(1240, 1000, "9");
		scoreNumberContainer.add(score_6);

		// score_7
		const score_7 = this.add.image(1310, 1000, "26");
		scoreNumberContainer.add(score_7);

		// score_8
		const score_8 = this.add.image(1380, 1000, "130");
		scoreNumberContainer.add(score_8);

		// score_10
		const score_10 = this.add.image(1450, 1000, "1000");
		scoreNumberContainer.add(score_10);

		this.scoreNumberContainer = scoreNumberContainer;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Container} */
	scoreNumberContainer;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();

		this.pegs = [];
		this.scores = [];
		this.scoresContainer = this.add.container(0, 0);
		this.selectedLineCount = null;
		this.ball = null;
		this.betAmountValue = 0;
		this.winAmountValue = 0;
		this.betAmount();
		this.setScoreBox();
		this.setPegPosition(16);
		this.matter.world.setBounds(0, 0, 1920, 1080);
		this.lineSelectionContainer = this.add.container(0, 0);
		this.createRowSelectionButtons();

		// start btn
		this.startButton = this.add.text(1700, 48, "START", {
			fontSize: "30px",
			fontFamily: "Futura",
			// fontStyle: "bold",
			backgroundColor: "#30b21a",
			padding: { x: 20, y: 10, },
		});
		this.startButton.setOrigin(0, 0.5);
		this.startButton.setInteractive();
		this.startButton.on("pointerdown", this.startGame, this);
		this.startButton.setAlpha(0.5);

		// win amount
		this.add.text(1600, 100, "Win Amount:", {
			fontSize: "30px",
			fontFamily: "Futura",
		});
		this.winAmountNumberText = this.add.text(1800, 100, "0", {
			fontSize: "30px",
			fontFamily: "Futura",
		});

		// Rows
		this.add.text(50, 150, "Rows:", {
			fontSize: "30px",
			fontFamily: "Futura",
		});
		// Text element to display the selected number of lines
		this.selectedLinesText = this.add.text(150, 150, "", {
			fontSize: "30px",
			fontFamily: "Futura",
		});
	}

	createRowSelectionButtons() {
		const lines = [16, 17, 18, 19, 20];
		let x = 125;

		lines.forEach((lineCount) => {
			const button = this.add.text(x, 220, lineCount.toString(), {
				fontSize: "30px",
				fontFamily: "Futura",
				backgroundColor: "#2b6be4",
				padding: {
					x: 20,
					y: 10,
				},
			});

			button.setOrigin(1, 0.5);
			button.setInteractive();

			// Disable line selection if bet amount is 0
			if (this.betAmountValue > 0) {
				// button.setAlpha(1);
				button.on("pointerdown", () => {
					this.startButton.setAlpha(1);
					this.selectLineCount(lineCount);
				}, this);
			}
			this.lineSelectionContainer.add(button);
			x += 100;
		});
	}

	selectLineCount(lineCount) {
		this.selectedLineCount = lineCount;
		this.destroyPegs();
		this.setPegPosition(lineCount);
		this.selectedLinesText.setText(lineCount);
	}

	setScoreBox() {
		this.staticObstacles = [];
		this.scoreNumberContainer.iterate((child) => {
			this.staticObstacles.push(this.matter.add.gameObject(child, { isStatic: true }));
			// console.log(child);
		});
	}

	setPegPosition(lines) {
		const minY = 100;
		const maxY = 900;
		let pegSize = 10;  // space between pegs
		const centerX = 1920 / 2;
		const pegsInBottomLine = lines + 1; // Number of pegs in the bottom line

		for (let line = 1; line <= lines; line++) {
			const pegsInLine = line + 2; // Number of pegs in the current line
			const y = minY + ((maxY - minY) / (lines - 1)) * (line - 1);

			// Calculate the horizontal spacing between pegs in the current line
			const spacing = pegSize * 7;

			// Calculate the starting x-position for the first peg in the current line
			const startX = centerX - (spacing * (pegsInLine - 1)) / 2;

			for (let i = 0; i < pegsInLine; i++) {
				const x = startX + i * spacing;
				this.createPeg(x, y, pegSize);
			}
		}
	}

	createPeg(x, y, r) {
		const peg = this.matter.add.image(x, y, 'peg').setScale(0.6);
		peg.setCircle(r - 2);
		peg.setStatic(true);
		this.pegs.push(peg);
	}

	destroyPegs() {
		for (const peg of this.pegs) {
			peg.destroy();
		}
		this.pegs = [];
	}

	createBall(lines) {
		const scale = this.calculateBallScale(lines);
		const ballRadius = 15 * scale;
		if (this.ball) {
			this.ball.destroy();
		}

		let randomX;
		// Define arrays for each set of lines
		const line16Array = [945, 947, 951, 955, 956, 957, 958, 959, 962, 963, 964, 965, 966, 969, 970, 971];
		const line17Array = [955, 956, 958, 959, 961, 963, 964, 965, 967, 970, 971];
		const line18Array = [955, 956, 957, 958, 962, 963, 964, 965, 969];
		const line19Array = [950, 951, 952, 953, 954, 956, 957, 959, 962, 963, 964, 965];
		const line20Array = [955, 956, 957, 958, 959, 962, 964, 965, 968, 969, 970];
		// const line16Array = [947];

		// Choose the array based on the number of lines
		let selectedArray;
		if (lines === 17) {
			selectedArray = line17Array;
		} else if (lines === 18) {
			selectedArray = line18Array;
		} else if (lines === 19) {
			selectedArray = line19Array;
		} else if (lines === 20) {
			selectedArray = line20Array;
		} else {
			selectedArray = line16Array;
		}

		// Choose a random number from the selected array
		randomX = Phaser.Math.RND.pick(selectedArray);
		// console.log(randomX);

		this.ball = this.matter.add.image(randomX, 0, 'ball-2').setScale(scale);
		this.ball.setCircle(ballRadius);
		this.ball.setBounce(0.5);
		this.ball.inSlingshot = false;
	}

	calculateBallScale(lines) {
		switch (lines) {
			case 15:
				return 1.2;
			case 14:
				return 1.3;
			case 13:
				return 1.4;
			case 12:
				return 1.5;
			default:
				return 1;
		}
	}

	startGame() {
		if (this.selectedLineCount !== null) {
			if (!this.ball) {
				this.createBall(this.selectedLineCount);
			}
			if (!this.ball.inSlingshot) {
				this.createBall(this.selectedLineCount);
				this.ball.inSlingshot = true;
				this.startButton.setAlpha(0.5);
			}
		}
	}

	playTween(score) {
		// console.log(score.texture.key);
		this.ball.destroy();
		setTimeout(() => {
			this.ball.inSlingshot = false;
			this.startButton.setAlpha(1);
		}, 500);

		// Calculate win amount based on bet amount and score
		this.winAmountValue += this.betAmountValue * parseFloat(score.texture.key);

		// win amount tween
		this.tweens.add({
			targets: this.winAmountValue,
			x: 1800,
			y: 100,
			duration: 200,
			onComplete: () => {

			},
		});

		// Update and show the win amount text
		this.winAmountNumberText.setText(this.winAmountValue);
		this.winAmountNumberText.setVisible(true);

		this.tweens.add({
			targets: score,
			y: 1030,
			duration: 200,
			onComplete: () => {
				this.tweens.add({
					targets: score,
					y: 1000,
					duration: 200,
					onComplete: () => {

					},
				});
			},
		});
	}

	showScores() {
		this.tweens.add({
			targets: this.scoresContainer,
			y: '+=60',
			duration: 300,
			onComplete: () => {
				this.scoresContainer.y = 150;
				if (this.scores.length > 0) {
					const score = this.scores.shift();
					this.displayScore(score);
				}
			},
		});
	}

	displayScore(score) {
		const x = 1800;
		const yOffset = 60;
		const scoreSprite = this.add.sprite(x, 0, score.texture.key);
		scoreSprite.setScale(0.9);
		this.scoresContainer.add(scoreSprite);
		this.scoresContainer.list.forEach((sprite, index) => {
			sprite.y = 500 - (index * yOffset);
		});
		if (this.scoresContainer.list.length > 3) {
			const removedScore = this.scoresContainer.list[0];
			removedScore.destroy();
			this.scoresContainer.remove(removedScore, true, true);
		}
	}

	update() {
		// for (const peg of this.pegs) {
		// 	this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
		// 		if ((bodyA === this.ball.body || bodyB === this.ball.body) && (bodyA === peg.body || bodyB === peg.body)) {
		// 			this.glowPeg(peg);
		// 		}
		// 	});
		// }

		for (const score of this.staticObstacles) {
			this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
				if ((bodyA === this.ball.body || bodyB === this.ball.body) && (bodyA === score.body || bodyB === score.body)) {
					this.scores.push(score);
					this.showScores();
					this.playTween(score);
				}
			});
		}
	}

	glowPeg(peg) {
		this.tweens.add({
			targets: peg,
			alpha: 0.4,
			duration: 500,
			yoyo: true,
		});
	}


	betAmount() {
		this.add.text(50, 30, "Bet Amount:", {
			fontSize: "30px",
			// fontFamily: "RifficFree-Bold",
			fontFamily: "Futura",
		});
		this.betAmountNumber = this.add.text(250, 30, "0", {
			fontSize: "30px",
			// fontFamily: "RifficFree-Bold",
			fontFamily: "Futura",
		});

		this.betAmountTxt = this.add.text(180, 100, "0", {
			fontSize: "30px",
			// fontFamily: "RifficFree-Bold",
			fontFamily: "Futura",
			backgroundColor: "#2b6be4",
			padding: { x: 20, y: 10 },
		});
		this.betAmountTxt.setOrigin(0.5);

		// Create the + button
		this.plusButton = this.add.text(280, 100, "+", {
			fontSize: "30px",
			// fontFamily: "RifficFree-Bold",
			fontFamily: "Futura",
			backgroundColor: "#2b6be4",
			padding: { x: 20, y: 10 },
		});
		this.plusButton.setOrigin(0.5);
		this.plusButton.setInteractive();
		this.plusButton.on("pointerdown", () => {
			this.updatebetAmountValue(50);
			this.updateBetAmountText();
		}, this);

		// Create the - button
		this.minusButton = this.add.text(80, 100, "-", {
			fontSize: "30px",
			// fontFamily: "RifficFree-Bold",
			fontFamily: "Futura",
			backgroundColor: "#2b6be4",
			padding: { x: 20, y: 10 },
		});
		this.minusButton.setOrigin(0.5);
		this.minusButton.setInteractive();
		this.minusButton.on("pointerdown", () => {
			this.updatebetAmountValue(-50);
			this.updateBetAmountText();
		}, this);
	}

	updatebetAmountValue(value) {
		this.betAmountValue = Phaser.Math.Clamp(this.betAmountValue + value, 0, 1000);
		this.betAmountTxt.setText(this.betAmountValue.toString());
	}

	updateBetAmountText() {
		this.betAmountNumber.setText(this.betAmountValue);
		this.updateLineSelectionInteractive();
	}

	updateLineSelectionInteractive() {
		this.betAmountValue = parseInt(this.betAmountNumber.text);
		this.createRowSelectionButtons();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
