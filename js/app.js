class UI{
    constructor(){
        let DOMItems = {
            toggleBanner: '.banner-up',
            banner: '.banner',
            bannerName: '.banner-name',
            game: '.gameScreen',
            dice: '.control-dice',
            controlBoard: '.control',
            controlOpt: '.control-option',
            activePlayer: ['.green', '.red', '.yellow', '.blue'],
            pieces: 'num-pieces'
        }
        this.DOMItems = DOMItems;
        //This is the canvas element that's used in 2 functions which is why it's in the
            //constructor.
        this.canvas = document.querySelector(this.DOMItems.game);
    }

    getCanvasXY(){
        //set canvas width and height
        this.canvas.width = (3*window.innerWidth)/4;
        this.canvas.height = (3*window.innerHeight)/4;
        //Ludo board is 15x15 matrix so x and y units must reflect that
        let x = Math.round(this.canvas.width/15);
        let y = Math.round(this.canvas.height/15);
        return [x, y];
    }

    getCtx(){
        //this is the context in which the MDN Canvas API uses to draw items
        return this.canvas.getContext('2d');
    }

    displayPiecesCount(x){
        //TODO: Update right after the player switches not once an roll occurs
        const dom = document.getElementById(this.DOMItems.pieces);
        x <= 0 ? dom.textContent = "0": dom.textContent = x.toString(); 
    }

    setDice(val){
        //Adds the icon of the dice on the fly by using innerHTML property
        let icon = `<i class="fas fa-dice-${val} fa-4x"></i>`;
        document.querySelector(this.DOMItems.dice).innerHTML = icon
    }

    insertOptionItem(item, message){
        //This inserts an icon to let player choose how to move each respective piece
        //Item is the piece number (i.e. 1, 2, etc.) and message is string to move or
            //add.
        let icon = `<div class="control-option">${message} ${item}<i class="fas fa-chess-pawn fa-3x"></i></div>`;
        let insert = this.DOMItems.controlBoard;
        document.querySelector(insert).insertAdjacentHTML('afterbegin', icon);
    }

    clearControlItems(){
        //This clears all the options created and sends a promise to handle addding 
            //options on the fly.
        return new Promise((resolve, reject) =>{
            const children = document.querySelectorAll(this.DOMItems.controlOpt);
            if (children.length === 0){
                //if no child exists, return a rejection
                reject('no options available');
            }
            //use first child in case there's only 1. if it hasn't returned a rejection,
                //there should be atleast 1 child node.
            let parent = children[0].parentNode;
            //if there are child parents then resolve the promise.
            resolve(children.forEach(curr => parent.removeChild(curr)));
        });
    }

    incrementActivePlayer(active){
        //Remove the highlight from the current active player
        document.querySelector(this.DOMItems.activePlayer[active]).classList.toggle('active');
        //check that the active player is 0<= active <=3
        active === 3 ? active = 0 : active++;
        //toggle the incremented active player class for next piece
        document.querySelector(this.DOMItems.activePlayer[active]).classList.toggle('active');
        return active;
    }

    
}

class Board{
    constructor(xunit, yunit, ctx){
        //x and y are the units on the 15x15 Ludo board grid
        this.x = xunit;
        this.y = yunit;
        //Ctx is the object used to draw images.
        this.ctx = ctx;
        //The coordinates are indexed green, red, yellow, blue for all objects
            //all coordinates are in x, y.
        //each are the starting coordinates for each piece
        this.startCoord = [[1, 6], [8, 1], [13, 8], [6, 13]]
        //This is an object of coordinates for each pieces and is subject to change
        this.coord = {
            green: [[1, 1], [1, 4], [4, 1], [4, 4]],
            red: [[10, 1], [10, 4], [13, 1], [13, 4]],
            yellow: [[10, 10], [10, 13], [13, 10], [13, 13]],
            blue: [[1, 10], [1, 13], [4, 10], [4, 13]],
        };
        //These are the coordinates of the inactive pieces that should be indexed
            //whenever a player gets eliminated
        this.inactive = {
            green: [[1, 1], [1, 4], [4, 1], [4, 4]],
            red: [[9+1, 1], [9+1, 4], [9+4, 1], [9+4, 4]],
            yellow: [[9+1, 9+1], [9+1, 9+4], [9+4, 9+1], [9+4, 9+4]],
            blue: [[1, 9+1], [1, 9+4], [4, 9+1], [4, 9+4]]
        }
    }

    makePiece(color, x, y){
        //This is the x and y coordinate of a piece that's centered around a grid tile
        x = (this.x * x) + (this.x/2);
        y = (this.y * y) + (this.y/2);
        //This is the width and height of each tile
        const width = Math.ceil(this.x/2);
        const height = Math.ceil(this.y/2);
        //In case of disproportionate window size, adjust radius for the one board tile to be the smaller
            //so that it doesn't draw too large of a circle.
        const circleRad = width < height ? width : height;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, circleRad, 0, 2*Math.PI);
        this.ctx.fill();
    }

    placePiece(color, arr){
        //it'll place the pieces given an array of coordinates
        for(let i=0; i<=arr.length; i++){
            //Using the try catch statement because the spread operater threw an error
                //but still passed the values to makePiece
            try{
                this.makePiece(color, ...arr[i]);
            }catch(err){
                //error of Symbol(Symbol.iterator) not iterable, don't understand yet
                    //the code should execute though
            }
        }
    }

    makeRectangle(color, x, y, width = this.x, height = this.y){
        //adjust the x and y coordinates to scale according to the grid units.
        x = this.x*x;
        y = this.y*y;
        //Make a rectangle with a black border
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y, width, height);
        this.ctx.strokeRect(x, y, width, height);
    }

    makePath(x, y, iterations, incDirec, color = 'white'){
        //Draw a path with a given starting x and y coordinates, number of tiles to
            //lay down and in what direction
        for (let i = 0; i <= iterations; i++){
            if (incDirec == 'vertical'){
                this.makeRectangle(color, x, y + i, this.x, this.y)
            }
            if (incDirec === 'horizontal'){
                this.makeRectangle(color, x + i, y, this.x, this.y);
            }
        }

    }

    setupBoard(){
        //clear the screen in case of previous drawings
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        //All main boxes for not playing players is a 6 unti square.
        const bigX = this.x*6;
        const bigY = this.y*6;
        //Make unit calc easier for home square and easier to understand when debugging later.
        const [homeX, homeY] = [3, 3];
        this.makeRectangle('#004d1a', 0, 0, bigX, bigY);
        this.makeRectangle('#4d0f00', 9, 0, bigX, bigY);
        this.makeRectangle('#00004d', 0, 9, bigX, bigY);
        this.makeRectangle('#4d4d00', 9, 9, bigX, bigY);
        this.makeRectangle('pink', 2*homeX, 2*homeY, this.x*homeX, this.y*homeY);
        // Draw all vertical paths
            //The arrays are coordinates for all the paths going from left->right (vertical) and top->bottom (horizontal)
        const verticalPaths = [[6, 0, 5], [7, 0, 5], [8, 0, 5], [6, 9, 5], [7, 9, 5], [8, 9, 5]];
        const horizontalPaths = [[0, 6, 5], [0, 7, 5], [0, 8, 5], [9, 6, 5], [9, 7, 5], [9, 8, 5]];
        //frist for-loop draws vertical paths and second, horizontal paths
        for (let i=0; i<=verticalPaths.length; i++){
            //This is the same error in placePiece() of the spread operator throwing a
                //non-iterable error but still passing the functions.
            try{
                this.makePath(...verticalPaths[i], 'vertical');
            }catch(err){
                //Do nothing: the error is ...verticalPaths[i] not iterable but the makePath function still receives the parameters
            }
        }
        for (let i=0; i<=horizontalPaths.length; i++){
            try{
                this.makePath(...horizontalPaths[i], 'horizontal');
            }catch(err){
            }
        }
        //Draw colored paths
        //The startCoord is indexed as 0: green, 1: red, 2: yellow, 3: blue
        this.makeRectangle('#004D1A', this.startCoord[0][0], this.startCoord[0][1]);
        this.makePath(1, 7, 4, 'horizontal', '#004D1A');
        this.makeRectangle('#4D0F00', this.startCoord[1][0], this.startCoord[1][1]);
        this.makePath(7, 1, 4, 'vertical', '#4D0F00');
        this.makeRectangle('#4D4D00', this.startCoord[2][0], this.startCoord[2][1]);
        this.makePath(9, 7, 4, 'horizontal', '#4D4D00');
        this.makeRectangle('#00004D', this.startCoord[3][0], this.startCoord[3][1]);
        this.makePath(7, 9, 4, 'vertical', '#00004D');
        //Draw Pieces
        //Green pieces: top-left, bottom-left, top-right, & bottom-right
        this.placePiece('#39e600', this.coord.green);

        //Red pieces: top-left, bottom-left, top-right, & bottom-right
        this.placePiece('#e60000', this.coord.red);

        //Yellow pieces: top-left, bottom-left, top-right, & bottom-right
        this.placePiece('#e6e600', this.coord.yellow);

        //Blue pieces: top-left, bottom-left, top-right, & bottom-right
        this.placePiece('#0000e6', this.coord.blue);

    }

}

class Quadrant{
    constructor(x, y){
        //x and y are integer coordiantes
        this.x = x;
        this.y = y;
        //This is all the illegal values that the pieces can never be drawn in
        this.illegalValues = {
            //the arrays are in x1, y1, x2, y2
            absolute: [[0,0,5,5], [9,0,14,5], [9,9,14,14], [0,9,5,14], [6,6,8,8]],
            greenBase: [1,7,5,7],
            redBase: [7,1,7,5],
            yellowBase: [9,7,13,7],
            blueBase: [7,9,7,13]
        };
        //This map object lists in which way to move a piece i.e. +dx, -dy, +dy etc.
        this.quadrants = new Map();
        //Using a function to set the values of the Map object
        this.setQuadrants();
        //The currKey is the value of which path the piece is on; the keys are labeled
            //clockwise starting from the horizontal path above the blue home.
        this.currKey = 1;
    }
    
    setQuadrants(){
        //Each 'quadrant is a path as outlined in the Github README.md
            //no path has overlapping tiles and starts from green clockwise to blue area.
        this.quadrants.set(1, '-dx');
        this.quadrants.set(2, '-dy');
        this.quadrants.set(3, '+dx');

        this.quadrants.set(4, '-dy');
        this.quadrants.set(5, '+dx');
        this.quadrants.set(6, '+dy');

        this.quadrants.set(7, '+dx');
        this.quadrants.set(8, '+dy');
        this.quadrants.set(9, '-dx');

        this.quadrants.set(10, '+dy');
        this.quadrants.set(11, '-dx');
        this.quadrants.set(12, '-dy');
    }

    getQuadrant(x, y){
        //Most inefficient code ever but I want to see it work before anything.
        //Will only run once to determine which key (i.e. direction) to use at first.
        if (1<= x && x<=5 && y===9){
            this.currKey = 1;
        }else if(x===0 && 7<=y && y<=8){
            this.currKey = 2;
        }else if(0<=x&& x<=5 && y===6){
            this.currKey = 3;
        }else if(x===6 && 1<=y && y<=5){
            this.currKey = 4;
        }else if(6<=x && x<=7 && y===0){
            this.currKey = 5;
        }else if(x===8 && 0<=y && y<=5){
            this.currKey = 6;
        }else if(9<=x && x<=13 && y===6){
            this.currKey = 7;
        }else if(x===14 && 6<=y && y<=7){
            this.currKey = 8;
        }else if(9<=x && x<=14 && y===8){
            this.currKey = 9;
        }else if(x===8 && 9<=y && y<=13){
            this.currKey = 10;
        }else if(7<=x && x<=8 && y===14){
            this.currKey = 11;
        }else if(x===6 && 9<=y && y<=14){
            this.currKey = 12;
        }

        return this.quadrants.get(this.currKey);
    }

    isInHome(x, y, base){
        //This is an extension of isLegal but to check that the piece hasn't been moved
            //to be drawn on the home base.
        let x1 = base[0];
        let x2 = base[2];
        let y1 = base[1];
        let y2 = base[3];
        if (x1 <= x <= x2 && y1<= y <= y2){
            return false;
        }
        return true;
    }
    
    isLegal(x,y){
        //Determine if the move is legal. I.e. you don't want to draw pieces where there
            //is no path to move.
            let toReturn = true;
            //These are all integer values for comparison
            let x1, x2, y1, y2;
            //valArr is the illegal values for all pieces
            let valArr = this.illegalValues.absolute;

            if (x===-1 || y===-1){
                toReturn = false;
            }
            //iterate over all the illegal values and check whether the coordinates
                //fall in them; in which case return false making it illegal.
            for (let i=0; i<= valArr.length -1; i++){
                x1 = valArr[i][0];
                x2 = valArr[i][2];
                y1 = valArr[i][1];
                y2 = valArr[i][3];
                if (x1<=x && x<=x2 && y1<=y && y<=y2){
                    toReturn = false;
                }
            }
            //check homebase coordinates. this is separate because once a player
                //eliminates another player, the former illegal homebase colored path 
                //becomes legal.
            if (this.isInHome(x,y, this.illegalValues.greenBase)){
                toReturn = false;
            }else if (this.isInHome(x,y, this.illegalValues.redBase)){
                toReturn = false;
            }else if (this.isInHome(x,y, this.illegalValues.yellowBase)){
                toReturn = false;
            }else if (this.isInHome(x,y, this.illegalValues.blueBase)){
                toReturn = false;
            }

            return toReturn;
    }

    transitionQuadrant(){
        //make sure current key is of the quadrant and piece has
            //coordinates of the transition coordinates
            //green->red (5, 6) key=3
            //red->yellow (8,5) key=6
            //yellow->blue (9,8) key=9
            //blue->green (6,9) key=12
        let x = this.x;
        let y = this.y;
        if (this.currKey===3 && x===5 && y===6){
            [x, y] = [x+1, y-1];
        }else if (this.currKey===6 && x===8 && y===5){
            [x, y] = [x+1, y+1];
        }else if (this.currKey===9 && x===9 && y===8){
            [x, y] = [x-1, y+1];
        }else if (this.currKey===12 && x===6 && y===9){
            [x, y] = [x-1, y-1];
            this.currKey = 1;
            return [x, y]
        }
        this.currKey++;
        return [x, y];

    }

    changeInDirection (x, y, delta){
        //helper function to specify which direction coordinates to move the piece to.
        switch(delta){
            case('+dx'):
                return [x + 1, y];
            case('-dx'):
                return [x - 1, y];
            case('+dy'):
                return [x, y+1];
            case('-dy'):
                return [x, y-1];
        }
    }

    moveCoordinates(){
        //get the direction to move the current coordinates.
        const direc = this.getQuadrant(this.x, this.y);

        //move the coordinates in the direction given by getQuadrant.
            //if [dx, dy] is not valid then change currKey
        let [dx, dy] = this.changeInDirection(this.x, this.y, direc);
        // check if the change is valid
        if (this.isLegal(dx, dy)){
            this.x = dx;
            this.y = dy;
        } else{
            //this is where transition to a new quadrant happens
                //recursive function moved the piece in a loop.
                //this is because it's boxed in between illegal values.
            [this.x, this.y] = this.transitionQuadrant();
        }

    }

    getNewCoordinates(){
        //helper function to return the new coordinates.
        this.moveCoordinates();
        return [this.x, this.y];
    }
}

class MainController{

    constructor(){
        this.uiCtl = new UI();
        //units of displacement on the grid
        const [dx, dy] = this.uiCtl.getCanvasXY();
        //Canvas API context to draw images.
        this.ctx = this.uiCtl.getCtx();
        this.boardCtl = new Board(dx, dy, this.ctx);
        this.playerPieces = [4, 4, 4, 4];
        this.players = [this.boardCtl.coord.green, this.boardCtl.coord.red, this.boardCtl.coord.yellow,this.boardCtl.coord.blue];
        //First player is always green
        this.activePlayer = 0;
    }

    movePlayer(roll = 1, player=0){
        //piece is the number of pieces ex. 4 left in order to index the coordinates of the active player 
        //  ex. if there are 3 pieces then index the last element (i.e. the piece on board)
            //and move it by default. If theres < 3 pieces available then move the piece
            //indexed at the given element.

        //x and y are coordinates of the active player indexed at variable 'player' which is 0-3
        let x = this.players[this.activePlayer][player][0];
        let y = this.players[this.activePlayer][player][1];
        let quad = new Quadrant(x, y);
        let dx, dy;
        console.log(`the roll is ${roll}`);
        for (let i=1; i<=roll; i++){
            [dx, dy] = quad.getNewCoordinates();
        }
        this.players[this.activePlayer][player] = [dx, dy];
        this.boardCtl.setupBoard();
    }

    insertOptions(roll, action){
        //if number of pieces <=3
        //update UI to reflect choices (i.e. move current piece, addPlayer)
        const  item = 4 - this.playerPieces[this.activePlayer];
        if (action === 'move'){
            this.moveOption(item, roll);
        }
        if (action === 'add'){
            this.addOption(item);
        }
        
        //this is the class of the active player
        //move player only if number of pieces <=3. if 4
    }

    moveOption(item, roll){
        for (let i=1; i<=item; i++){
            this.uiCtl.insertOptionItem(i, 'Move Piece');
            document.querySelector(this.uiCtl.DOMItems.controlOpt).addEventListener('click', () => {
                this.movePlayer(roll, 4 - i);
                this.uiCtl.clearControlItems();
            });
        }
    }

    addOption(item){
        this.uiCtl.insertOptionItem(item, 'Add Piece');
        document.querySelector(this.uiCtl.DOMItems.controlOpt).addEventListener('click', ()=>{
            this.addPlayer();
            this.uiCtl.clearControlItems();
        })
    }

    checkElimination(){
        //check if there are overlapping pieces and eliminate when there is
        return 0;
    }



    addPlayer(){
        //Check if no pieces are on board
            //If none -> add onto board
            //If 1 >= pieces >= 3  ask player to add a piece onto the board or move pieces on board
            //If 6 ask player to move piece on board

        //Decrease the number of pieces from UI
        this.playerPieces[this.activePlayer]--;
        let pieces = this.playerPieces[this.activePlayer];
        this.uiCtl.displayPiecesCount(pieces);
        //Draw the board with a piece on the starting line
        let startCoord = this.boardCtl.startCoord[this.activePlayer]
        this.players[this.activePlayer][pieces] = startCoord;
        this.boardCtl.setupBoard();
    }

    incrementPlayer(){
        this.activePlayer = this.uiCtl.incrementActivePlayer(this.activePlayer);
    }

    clearOptions(){
            //this consumes a promise to clear the options everytime the dice is clicked
        //to prevent overlapping options that are no longer active.
        this.uiCtl.clearControlItems().then(resolve =>{
            console.log(`cleard ${resolve}`);
        }).catch(rejected => null);
    }

    boardLogic(roll){
        this.clearOptions();
        this.incrementPlayer();
        //this is the number (array) of pieces the active player has
        const pieces = this.playerPieces[this.activePlayer];
        const remaining = 4 - pieces;
        console.log(`the current active player is ${this.activePlayer}`);
        if (roll === 6){
            //if you get a 6, depending on the number of pieces already on the board
                //the following logic is executed.
            if (pieces === 4){
                //case 0: if number of pieces is 4 then automatically add player because
                    //you can't add options for a player not on the board
                this.insertOptions(roll, 'add');
            }else if (1 <= pieces && pieces <= 3){
                //case 1: (roll=6 and pieces <=3) insert option to add player or move
                this.insertOptions(roll, 'move');
                this.insertOptions(roll, 'add');
            }else if (remaining === 0){
                //case 2: roll a 6 with 0 remaining pieces
                this.insertOptions(roll, 'move');
            }
        }else {
            //here, you roll any value except 6
            console.log(`checking 2nd; roll isn't 6`);
            //check if there are >=1 pieces already out. so 4 - pieces >=1
                //ex. pieces = 4; no pieces to move so move to incrementing player;
                //ex. pieces = 3; result is 1 piece on board -> insert options
            if (remaining >= 1){
                console.log(`inserting option to move`);
                console.log(`remaining is ${remaining}`);
                console.log(`the playerpieces array is `);
                console.log(this.playerPieces);
                this.insertOptions(roll, 'move');
            }
        }
        console.log(`END active player is ${this.activePlayer}`);
    }


    setupEventListeners(){
        const domItems = this.uiCtl.DOMItems;

        //Close Banner
        document.querySelector(domItems.banner).addEventListener('click', e => {
            document.querySelector(domItems.bannerName).classList.toggle('close');
        });
        //Set an event listener for the dice icon
        document.querySelector(domItems.dice).addEventListener('click', e =>{
            //array to send the UI class to display font-awesome icons
            const numWord = ['one', 'two', 'three', 'four', 'five', 'six'];
            let roll = Math.round(Math.random()*5);
            this.uiCtl.setDice(numWord[roll]);
            //pass in roll+1 because 0<=roll<=5 in order to index numWord so pass
                //boardLogic the true value in order to move player properly.
            this.boardLogic(roll+1);
            // this.clearOptions();
        })
    }

    init(){
        this.boardCtl.setupBoard();
        this.setupEventListeners();
    }
}

mainCtl = new MainController();
ctx = mainCtl.ctx;
mainCtl.init();