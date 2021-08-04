// Create canvas
const cvs = document.getElementById("blast");
const ctx = cvs.getContext("2d");

// Declare Images for drawing
const main = new Image(),
	blueBlock = new Image(),
	redBlock = new Image(),
	yellowBlock = new Image(),
	purpleBlock = new Image(),
	greenBlock = new Image();
	mainProgressRect = new Image();
	roundedRect = new Image();
	roundedRectLiveProgress = new Image();
	progressText = new Image();
	pointsMainRect = new Image();
	pointsRoundedRect = new Image();
	pointsText = new Image();
	stepsEllips = new Image();
	movesRect = new Image();


main.src = "img/main.png";
blueBlock.src = "img/blue.png";
redBlock.src = "img/red.png";
yellowBlock.src = "img/yellow.png";
purpleBlock.src = "img/purple.png";
greenBlock.src = "img/green.png";
mainProgressRect.src = "img/rounded-rectangle-5.png";
roundedRect.src = "img/rounded-rectangle.png";
roundedRectLiveProgress.src = "img/rounded-rectangle-progress.png";
progressText.src = "img/progress.png";
pointsMainRect.src = "img/points-main.png";
pointsRoundedRect.src = "img/rounded-rectangle-points.png";
pointsText.src = "img/points.png";
movesRect.src = "img/moves.png";
stepsEllips.src = "img/ellipse.png";

//

// Audio for game
let clickThePage = new Audio();
let winGame = new Audio();
let lostGame = new Audio();

clickThePage.src = "audio/sfx-2.mp3";
winGame.src = "audio/win.mp3";
lostGame.src = "audio/lose.mp3";
//

let blockWidth,
	blockHeight,
	block = [blueBlock, redBlock, yellowBlock, purpleBlock, greenBlock],
	blockArr = [],
	progress = 0,
	steps = 45;
	moves = 30;
	isMoved = false;

// Blocks to be swapped
let block_A;
let block_B;

// Drawing page
function draw(){
	ctx.drawImage(main, 0, 0);
	ctx.drawImage(mainProgressRect, 1000, 0);
	ctx.drawImage(roundedRect, 1018, 80);
	ctx.drawImage(progressText, 1170, 30);
	ctx.drawImage(roundedRectLiveProgress, 1018, 82, progress * 2, 34);

	ctx.drawImage(pointsMainRect, 1000, 300);
	ctx.drawImage(pointsRoundedRect, 1090, 650);
	ctx.drawImage(pointsText, 1200, 665);
	ctx.drawImage(stepsEllips, 1109, 380);

	ctx.drawImage(movesRect, 1170, 200);

	ctx.font = "35px cursive";
	ctx.fillStyle = "bleck";
	ctx.fillText("Перемещении:", 1115, 195);

	ctx.font = "35px cursive";
	ctx.fillStyle = "white";
	ctx.fillText(moves, 1225, 245);

	ctx.font = "45px cursive";
	ctx.fillStyle = "#000";
	ctx.fillText("Ходы:", 1180, 350);

	ctx.font = "80px cursive";
	ctx.fillStyle = "white";
	ctx.fillText(steps, 1200, 550);

	blockWidth = blueBlock.width;
	blockHeight = blueBlock.height;

	for (let i = 0; i <= 4; i++) {
		fillField(i);
	}

	for(let i = 0; i < blockArr.length; i++){
		ctx.drawImage(blockArr[i].item, blockArr[i].cordX, blockArr[i].cordY);
	}
}

// Fill an array with blocks 
function fillField(pos){
	for(let i = 0; i <= 4; i++){
		let item = block[Math.floor(Math.random() * block.length)];
		blockArr.push({
			item: item,
			color: item.currentSrc.split("/").pop().split(".")[0],
			cordX: (blockWidth * i) + 20,
			cordY: (blockHeight * pos) + 20
		});
	}
}

stepsEllips.onload = draw;

// Click event each block in game
cvs.addEventListener("click", event => {
	let foundedNeighbours = [],
		x = event.layerX,
		y = event.layerY,
		blockIndex = blockArr.findIndex(elem => elem.cordX + blockWidth > x && elem.cordY + blockHeight > y);

	isMoved = false;
	steps--;

	if(steps == 0){
		palyGameLostAudio();
	}

	if(blockIndex != -1){
		clickThePage.play();

		// We are looking for neighbors by the color of the selected block
		let rightNb =  blockArr.find(elem => elem.cordX == blockArr[blockIndex].cordX + blockWidth && elem.cordY == blockArr[blockIndex].cordY && elem.color == blockArr[blockIndex].color);
		let leftNb =  blockArr.find(elem => elem.cordX == blockArr[blockIndex].cordX - blockWidth && elem.cordY == blockArr[blockIndex].cordY && elem.color == blockArr[blockIndex].color);
		let topNb =  blockArr.find(elem => elem.cordX == blockArr[blockIndex].cordX && elem.cordY == blockArr[blockIndex].cordY - blockHeight && elem.color == blockArr[blockIndex].color);
		let bottomNb =  blockArr.find(elem => elem.cordX == blockArr[blockIndex].cordX && elem.cordY == blockArr[blockIndex].cordY + blockHeight && elem.color == blockArr[blockIndex].color);

		if(rightNb) foundedNeighbours.push(blockArr.indexOf(rightNb));
		if(leftNb) foundedNeighbours.push(blockArr.indexOf(leftNb));
		if(topNb) foundedNeighbours.push(blockArr.indexOf(topNb));
		if(bottomNb) foundedNeighbours.push(blockArr.indexOf(bottomNb));

		let rights = [],
			left = [],
			top = [],
			bottom = [],
			revivalBlocks = [];

		findeNeighbours(blockArr, blockIndex, 'right', foundedNeighbours, rights);
		findeNeighbours(blockArr, blockIndex, 'left', foundedNeighbours, left);
		findeNeighbours(blockArr, blockIndex, 'top', foundedNeighbours, top);
		findeNeighbours(blockArr, blockIndex, 'bottom', foundedNeighbours, bottom);
		
		foundedNeighbours.push(blockIndex);

		if(rights.length > 0){
			for (let i = 0; i < rights.length; i++) {
				findeNeighbours(blockArr, rights[i], 'top', foundedNeighbours, top);
				findeNeighbours(blockArr, rights[i], 'bottom', foundedNeighbours, bottom);
			}
		}

		if(left.length > 0){
			for (let i = 0; i < left.length; i++) {
				findeNeighbours(blockArr, left[i], 'top', foundedNeighbours, top);
				findeNeighbours(blockArr, left[i], 'bottom', foundedNeighbours, bottom);
			}
		}

		if(top.length > 0){
			for (let i = 0; i < top.length; i++) {
				findeNeighbours(blockArr, top[i], 'right', foundedNeighbours, rights);
				findeNeighbours(blockArr, top[i], 'left', foundedNeighbours, left);
			}
		}

		if(bottom.length > 0){
			for (let i = 0; i < bottom.length; i++) {
				findeNeighbours(blockArr, bottom[i], 'right', foundedNeighbours, rights);
				findeNeighbours(blockArr, bottom[i], 'left', foundedNeighbours, left);
			}
		}

		foundedNeighbours = [...new Set(foundedNeighbours)].sort((a, b) => a - b);

		if(progress < 460){
			if(foundedNeighbours.length > 1 && foundedNeighbours.length <= 4) progress += foundedNeighbours.length * 2;
			if(foundedNeighbours.length > 4 && foundedNeighbours.length <= 6) progress += foundedNeighbours.length * 3;
			if(foundedNeighbours.length > 6) progress += foundedNeighbours.length * 5;
		}else{
			playGameWinAudio();
		}

		if(foundedNeighbours.length > 1){
			for (let i = 0; i <= foundedNeighbours.length; i++) {
				revivalBlocks.push(blockArr[foundedNeighbours[i]]);
				delete blockArr[foundedNeighbours[i]];
			}
		}

		reDraw();

		// Wwait for half a second and fill in the empty spaces after deleting
		setTimeout(function (){
			let emptySpaces = getEmptySpaces();

			for (let i = 0; i < emptySpaces.length; i++) {
				let item = block[Math.floor(Math.random() * block.length)];

				blockArr[emptySpaces[i]] = { item: item,
								color: item.currentSrc.split("/").pop().split(".")[0],
								cordX: revivalBlocks[i].cordX,
								cordY: revivalBlocks[i].cordY
							};
			}
			reDraw();
		}, 500);

		// After filling in, we check whether there are available moves
		setTimeout(function (){
			if(moves == 0 && isWayToBurnTheTiles() === undefined){
				palyGameLostAudio();
			}
		}, 800);
	}
});


// Swapping blocks with each other
cvs.addEventListener("mousedown", function(e){
	
	let blockIndex = blockArr.findIndex(elem => elem.cordX + blockWidth > e.layerX && elem.cordY + blockHeight > e.layerY);

	if(blockIndex != -1 && moves > 0){
		isMoved = false;
		block_A = blockArr[blockIndex];
	}
});

cvs.addEventListener('mousemove', () => isMoved = true);

// Swapping blocks with each other
cvs.addEventListener("mouseup", function(e){

	let blockIndex = blockArr.findIndex(elem => elem.cordX + blockWidth > e.layerX && elem.cordY + blockHeight > e.layerY);
	let rightNb, leftNb, topNb, bottomNb;

	if(block_A){
		rightNb =  blockArr.find(elem => elem.cordX == blockArr[blockArr.indexOf(block_A)].cordX + blockWidth && elem.cordY ==blockArr[blockArr.indexOf(block_A)].cordY);
		leftNb =  blockArr.find(elem => elem.cordX == blockArr[blockArr.indexOf(block_A)].cordX - blockWidth && elem.cordY == blockArr[blockArr.indexOf(block_A)].cordY);
		topNb =  blockArr.find(elem => elem.cordX == blockArr[blockArr.indexOf(block_A)].cordX && elem.cordY == blockArr[blockArr.indexOf(block_A)].cordY - blockHeight);
		bottomNb =  blockArr.find(elem => elem.cordX == blockArr[blockArr.indexOf(block_A)].cordX && elem.cordY == blockArr[blockArr.indexOf(block_A)].cordY + blockHeight);
	}

	if(blockIndex != -1 && moves > 0){
		block_B = blockArr[blockIndex];

		if(JSON.stringify(block_B) === JSON.stringify(rightNb) || JSON.stringify(block_B) === JSON.stringify(leftNb)
			|| JSON.stringify(block_B) === JSON.stringify(topNb) || JSON.stringify(block_B) === JSON.stringify(bottomNb)){

			let tmpColor = block_A.color;
			let tmpImg = block_A.item;

			blockArr[blockArr.indexOf(block_A)].color = block_B.color;
			blockArr[blockArr.indexOf(block_A)].item = block_B.item;
			blockArr[blockIndex].color = tmpColor;
			blockArr[blockIndex].item = tmpImg;

			if(isMoved){
				moves--;
				isMoved = false;
			}
		}
	}
});


// Find nodes for delete
function findeNeighbours(arr, index, direction, foundedNeighbours, indexArr){
	if(direction == 'right'){
		let tmpItem = arr.find(elem => elem.cordX == arr[index].cordX + blockWidth && elem.cordY == arr[index].cordY && elem.color == arr[index].color);
		if(tmpItem){
			foundedNeighbours.push(arr.indexOf(tmpItem));
			indexArr.push(arr.indexOf(tmpItem));
			findeNeighbours(arr, arr.indexOf(tmpItem), direction, foundedNeighbours, indexArr);
		}
	}

	if(direction == 'left'){
		let tmpItem = arr.find(elem => elem.cordX == arr[index].cordX - blockWidth && elem.cordY == arr[index].cordY && elem.color == arr[index].color);
		if(tmpItem){
			foundedNeighbours.push(arr.indexOf(tmpItem));
			indexArr.push(arr.indexOf(tmpItem));
			findeNeighbours(arr, arr.indexOf(tmpItem), direction, foundedNeighbours, indexArr);
		}
	}

	if(direction == 'top'){
		let tmpItem = arr.find(elem => elem.cordX == arr[index].cordX && elem.cordY == arr[index].cordY - blockHeight && elem.color == arr[index].color);
		if(tmpItem){
			foundedNeighbours.push(arr.indexOf(tmpItem));
			indexArr.push(arr.indexOf(tmpItem));
			findeNeighbours(arr, arr.indexOf(tmpItem), direction, foundedNeighbours, indexArr);
		}
	}

	if(direction == 'bottom'){
		let tmpItem = arr.find(elem => elem.cordX == arr[index].cordX && elem.cordY == arr[index].cordY + blockHeight && elem.color == arr[index].color);
		if(tmpItem){
			foundedNeighbours.push(arr.indexOf(tmpItem));
			indexArr.push(arr.indexOf(tmpItem));
			findeNeighbours(arr, arr.indexOf(tmpItem), direction, foundedNeighbours, indexArr);
		}
	}

	return indexArr;
}

// Lost game
function palyGameLostAudio(){
	lostGame.play();
	setTimeout(function(){
		alert("You lost");
		location.reload();
	}, 1000);
}

// Win game
function playGameWinAudio(){
	winGame.play();
	setTimeout(function(){
		alert("You Win");
		location.reload();
	}, 1000);
}

// Get empty spaces from block array
function getEmptySpaces(){
	let emptySpacesArr = [];
	for(let i = 0; i < blockArr.length; i++){
		if(!blockArr[i]) emptySpacesArr.push(i);
	}
	return emptySpacesArr;
}

// Draw earned points 
function drawPoits() {
	ctx.font = "50px cursive";
	ctx.fillStyle = "white";
	ctx.fillText(progress, 1209, 750);
}

// Draw remaining steps 
function drawSteps() {
	ctx.font = "80px cursive";
	ctx.fillStyle = "white";
	ctx.fillText(steps, 1200, 550);
}

// Draw remaining moves 
function drawMoves() {
	ctx.font = "35px cursive";
	ctx.fillStyle = "white";
	ctx.fillText(moves, 1225, 245);
}

// Redrowing page after events
function reDraw(){
	ctx.drawImage(main, 0, 0);
	ctx.drawImage(roundedRectLiveProgress, 1022, 82, progress, 34);
	ctx.drawImage(pointsRoundedRect, 1090, 650);
	ctx.drawImage(pointsText, 1200, 665);
	ctx.drawImage(stepsEllips, 1109, 380);
	ctx.drawImage(movesRect, 1170, 200);

	drawPoits();
	drawSteps();
	drawMoves();

	for(let i = 0; i < blockArr.length; i++){
		if(blockArr[i]) ctx.drawImage(blockArr[i].item, blockArr[i].cordX, blockArr[i].cordY);
	}
}

// Checking if is way to burn tiles or not
function isWayToBurnTheTiles(){
	return blockArr.find(elem =>
		(blockArr[blockArr.indexOf(elem) + 1] && blockArr[blockArr.indexOf(elem) + 1].color == elem.color)
			|| (blockArr[blockArr.indexOf(elem) - 1] && blockArr[blockArr.indexOf(elem) - 1].color == elem.color)
			|| (blockArr[blockArr.indexOf(elem) + 5] && blockArr[blockArr.indexOf(elem) + 5].color == elem.color)
			|| (blockArr[blockArr.indexOf(elem) - 5] && blockArr[blockArr.indexOf(elem) - 5].color == elem.color));
		
}

