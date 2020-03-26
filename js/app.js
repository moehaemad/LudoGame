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
    }

    getCanvas(){
        return document.querySelector(this.DOMItems.game);
    }

    displayPiecesCount(x){
        //TODO: Update right after the player switches not once an roll occurs
        const dom = document.getElementById(this.DOMItems.pieces);
        x <= 0 ? dom.textContent = "0": dom.textContent = x.toString(); 
    }

    insertControlItem(item){
        let icon = `<div class="control-option">Move Piece ${item}<i class="fas fa-chess-pawn fa-3x"></i></div>`;
        let insert = this.DOMItems.controlBoard;
        document.querySelector(insert).insertAdjacentHTML('beforebegin', icon);
        
    }

    
}

class Board{
    constructor(xunit, yunit, ctx){
        this.x = xunit;
        this.y = yunit;
        this.ctx = ctx;
        //each are coordinates of the starting coordinates for each piece
        //The coordinates are green, red, yellow, blue
        this.startCoord = [[1, 6], [8, 1], [13, 8], [6, 13]]
        //coordinates are in x, y
        this.coord = {
            green: [[1, 1], [1, 4], [4, 1], [4, 4]],
            red: [[10, 1], [10, 4], [13, 1], [13, 4]],
            yellow: [[10, 10], [10, 13], [13, 10], [13, 13]],
            blue: [[1, 10], [1, 13], [4, 10], [4, 13]],
        };
        this.greenInactive = [[1, 1], [1, 4], [4, 1], [4, 4]];
        this.redInactive = [[9+1, 1], [9+1, 4], [9+4, 1], [9+4, 4]];
        this.yellowInactive = [[9+1, 9+1], [9+1, 9+4], [9+4, 9+1], [9+4, 9+4]];
        this.blueInactive = [[1, 9+1], [1, 9+4], [4, 9+1], [4, 9+4]];
    }

    makePiece(color, x, y){
        //This is the x and y coordinate
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
        for(let i=0; i<=arr.length; i++){
            try{
                this.makePiece(color, ...arr[i]);
            }catch(err){
                //error of Symbol(Symbol.iterator) not iterable, don't understand yet
                    //the code should execute though
            }
        }
    }

    makeRectangle(color, x, y, width = this.x, height = this.y){
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
        //Adjust the given x, y coordinates to the 15x15 matrix.
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
        //Clear screen in case of any previous drawings
        //All main boxes for not playing players is a 6 unti square.
        const bigX = this.x*6;
        const bigY = this.y*6;
        //Make unit calc easier for home square and easier to understand when debugging later.
        const [homeX, homeY] = [3, 3];
        //TODO: eventually add in image for home
        this.makeRectangle('#004d1a', 0, 0, bigX, bigY);
        this.makeRectangle('#4d0f00', 9, 0, bigX, bigY);
        this.makeRectangle('#00004d', 0, 9, bigX, bigY);
        this.makeRectangle('#4d4d00', 9, 9, bigX, bigY);
        this.makeRectangle('pink', 2*homeX, 2*homeY, this.x*homeX, this.y*homeY);
        // Draw all vertical paths
            //The arrays are coordinates for all the paths going from left->right (vertical) and top->bottom (horizontal)
        const verticalPaths = [[6, 0, 5], [7, 0, 5], [8, 0, 5], [6, 9, 5], [7, 9, 5], [8, 9, 5]];
        const horizontalPaths = [[0, 6, 5], [0, 7, 5], [0, 8, 5], [9, 6, 5], [9, 7, 5], [9, 8, 5]];
        for (let i=0; i<=verticalPaths.length; i++){
            try{
                this.makePath(...verticalPaths[i], 'vertical');
            }catch(err){
                //Do nothing: the error is ...verticalPaths[i] not iterable but the makePath function still receives the parameters
            }
        }
        for (let i=0; i<=verticalPaths.length; i++){
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
        //x and y are coordinates
        this.x = x;
        this.y = y;
        //these are displacement vectors for each piece in a quadrant
        //Quad1: green, Quad2: red, Quad3: yellow, & Quad4: blue
            //The 2nd ex. quad1[2] is the direction of the home path.
        //has unintended effect of moving pieces backwards.
        this.illegalValues = {
            //the arrays are in x1, y1, x2, y2
            absolute: [[0,0,5,5], [9,0,14,5], [9,9,14,14], [0,9,5,14], [6,6,8,8]],
            greenBase: [1,7,5,7],
            redBase: [7,1,7,5],
            yellowBase: [9,7,13,7],
            blueBase: [7,9,7,13]
        };
        this.quadrants = new Map();
        this.setQuadrants();
        this.currKey = 1;
    }
    
    setQuadrants(){
        //Each 'quadrant if a path as outlined in the Github README.md
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
        //Determine if the move is legal. I.e. you don't want to draw pieces where there's no
            //path.
            let toReturn = true;
            let x1, x2, y1, y2;
            let valArr = this.illegalValues.absolute;

            if (x===-1 || y===-1){
                toReturn = false;
            }

            for (let i=0; i<= valArr.length -1; i++){
                x1 = valArr[i][0];
                x2 = valArr[i][2];
                y1 = valArr[i][1];
                y2 = valArr[i][3];
                if (x1<=x && x<=x2 && y1<=y && y<=y2){
                    toReturn = false;
                }
            }
            //check homebase coordinates. this is separate because once a player eliminates
                //another player, the former illegal homebase colored path becomes legal.
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
        console.log(`TRANSITION FUNCTION: x=${x} y=${y}`);
        this.currKey++;
        return [x, y];

    }
    changeInDirection (x, y, delta){
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

    moveCoordinates(direc=''){
        //'quadrant' is a string of displacement vector ex. '+dx'.
        if (direc === '')
            direc = this.getQuadrant(this.x, this.y);
            console.log(`FIRST IF: current key is ${this.currKey}`);

        //move the coordinates in the direction given by getQuadrant.
            //if [dx, dy] is not valid then change currKey
        let [dx, dy] = this.changeInDirection(this.x, this.y, direc);
        // check if the change is valid
        if (this.isLegal(dx, dy)){
            this.x = dx;
            this.y = dy;
            console.log(`SUCCESS: x is ${this.x} and y is ${this.y}`);
        } else{
            //this is where transition to a new quadrant happens
                //recursive function moved the piece in a loop.
                //this is because it's boxed in between illegal values.
            [this.x, this.y] = this.transitionQuadrant();
            console.log(`TRANSITION: unsuccessfull move, x=${this.x} and y=${this.y}`);
            
        }
        console.log(`END: direction is ${direc}`);
        console.log(`END: current key is ${this.currKey}`);

    }

    getNewCoordinates(){
        this.moveCoordinates();
        return [this.x, this.y];
    }
}

class MainController{

    constructor(){
        this.uiCtl = new UI();
        const [dx, dy] = this.setupCanvas();
        this.boardCtl = new Board(dx, dy, this.ctx);
        // this.pieces = parseInt(document.getElementById('num-pieces').textContent);
        this.playerPieces = [4, 4, 4, 4];
        this.players = [this.boardCtl.coord.green, this.boardCtl.coord.red, this.boardCtl.coord.yellow,this.boardCtl.coord.blue];
        //First player is always green
        this.activePlayer = 0;
        this.roll = 0;
    }
    
    incrementActivePlayer(){
        //Remove the highlight from the current active player
        document.querySelector(this.uiCtl.DOMItems.activePlayer[this.activePlayer]).classList.toggle('active');
        this.activePlayer === 3 ? this.activePlayer = 0 : this.activePlayer++;
        document.querySelector(this.uiCtl.DOMItems.activePlayer[this.activePlayer]).classList.toggle('active');
    }

    movePlayer(roll = this.roll){
        //piece is the number of pieces ex. 4 left in order to index the coordinates of the active player 
        //  ex. if there are 3 pieces then index the last element (i.e. the piece on board)
            //and move it by default. If theres < 3 pieces available then move the piece
            //indexed at the given element.
        const piece = this.playerPieces[this.activePlayer];
        console.log(`the active player is ${this.activePlayer} and piece index is ${piece}`);
        console.log(`the following is the coordinates of the active player`);
        console.log(this.players[this.activePlayer]);
        let x = this.players[this.activePlayer][piece][0];
        let y = this.players[this.activePlayer][piece][1];
        let quad = new Quadrant(x, y);
        let [dx, dy] = quad.getNewCoordinates();
        //change the coordinates of the active player.
        this.players[this.activePlayer][piece] = [dx, dy];
        this.boardCtl.setupBoard();
    }

    insertOptions(roll){
        //if number of pieces <=3
        //update UI to reflect choices (i.e. move current piece, addPlayer)
        const  item = 4 - this.playerPieces[this.activePlayer];
        for (let i=1; i<=item; i++){
            this.uiCtl.insertControlItem(i);
            document.querySelector(this.uiCtl.DOMItems.controlOpt).addEventListener('click', e => {
                this.movePlayer();
            });
        }
        
        //this is the class of the active player
        //move player only if number of pieces <=3. if 4

        //Returning a promise to do Asynchronous function calls
        // return new Promise ((resolve, reject) => {
        //     const  item = 4 - this.playerPieces[this.activePlayer];
        //     for (let i=1; i<=item; i++){
        //         this.uiCtl.insertControlItem(i);
        //         document.querySelector(this.uiCtl.DOMItems.controlOpt).addEventListener('click', e => {
        //             this.movePlayer();
        //         });
        //     }
        //     resolve ('done');
        // });
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

    setupCanvas(){
        const canvas = this.uiCtl.getCanvas()
        //Make Canvas resizeable
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 20;
        const ctx = canvas.getContext('2d');
        this.ctx = ctx;

        //The Ludo game is a 15x15 matrix
        const xUnit = Math.round(canvas.width/15);
        const yUnit = Math.round(canvas.height/15);
        return [xUnit, yUnit];
    }


    setupEventListeners(){
        const domItems = this.uiCtl.DOMItems;

        //Close Banner
        document.querySelector(domItems.banner).addEventListener('click', e => {
            document.querySelector(domItems.bannerName).classList.toggle('close');
        });
        //Roll Dice and add player if dice 6
        document.querySelector(domItems.dice).addEventListener('click', e =>{
            const numWord = ['one', 'two', 'three', 'four', 'five', 'six'];
            let roll = Math.round(Math.random()*5);
            let icon = `<i class="fas fa-dice-${numWord[roll]} fa-4x"></i>`;
            document.querySelector(domItems.dice).innerHTML = icon
            if (roll === 6 -1){
                console.log(`Player ${this.activePlayer} rolled a six, update a piece`);
                this.addPlayer();
                this.insertOptions(roll);
                // this.checkElimination();
            }else{
                // this.insertOptions(roll).then(resolved => {
                //     this.incrementActivePlayer();
                // });

                this.insertOptions(roll);
                this.incrementActivePlayer();
                //increment player after insertOptions has resolved.   
                // this.incrementActivePlayer();
            }
            
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
// mainCtl.addPlayer();
// mainCtl.players[0][3] = [6, 9];
// mainCtl.boardCtl.setupBoard();
