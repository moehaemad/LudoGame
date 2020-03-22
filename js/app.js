class UI{
    constructor(){
        let DOMItems = {
            toggleBanner: '.banner-up',
            banner: '.banner',
            bannerName: '.banner-name',
            game: '.gameScreen',
            dice: '.control-dice',
            activePlayer: ['.green', '.red', '.yellow', '.blue'],
            pieces: 'num-pieces'
        }
        this.DOMItems = DOMItems;
    }

    getCanvas(){
        return document.querySelector(this.DOMItems.game);
    }

    reducePieces(x){
        const dom = document.getElementById(this.DOMItems.pieces);
        x <= 0? dom.textContent = "0": dom.textContent = x.toString(); 
    }
}

class Board{
    constructor(xunit, yunit, ctx){
        this.x = xunit;
        this.y = yunit;
        this.ctx = ctx;
        // this.startCoord = {
        //     //each are coordinates of the starting coordinates for each piece
        //     greenStart: [1, 6],
        //     redStart: [8, 1],
        //     blueStart: [13, 8],
        //     yellowStart: [6, 13]
        // };
        //The coordinates are green, red, yellow, blue
        this.startCoord = [[1, 6], [8, 1], [13, 8], [6, 13]]
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

class MainController{

    constructor(){
        this.uiCtl = new UI();
        const [dx, dy] = this.setupCanvas();
        this.boardCtl = new Board(dx, dy, this.ctx);
        this.pieces = parseInt(document.getElementById('num-pieces').textContent);
        this.players = [this.boardCtl.coord.green, this.boardCtl.coord.red, this.boardCtl.coord.yellow,this.boardCtl.coord.blue];
        //First player is always green
        this.activePlayer = 0;
    }
    
    incrementActivePlayer(){
        //Remove the highlight from the current active player
        document.querySelector(this.uiCtl.DOMItems.activePlayer[this.activePlayer]).classList.toggle('active');
        this.activePlayer === 3 ? this.activePlayer = 0 : this.activePlayer++;
        document.querySelector(this.uiCtl.DOMItems.activePlayer[this.activePlayer]).classList.toggle('active');
    }

    addPlayer(){
        //Check if no pieces are on board
            //If none -> add onto board
            //If 1 >= pieces >= 3  ask player to add a piece onto the board or move pieces on board
            //If 6 ask player to move piece on board

        //Decrease the number of pieces from UI
        this.pieces -=1;
        this.uiCtl.reducePieces(this.pieces);
        //Draw the board with a piece on the starting line
        let startCoord = this.boardCtl.startCoord[this.activePlayer]
        this.players[this.activePlayer][this.pieces] = startCoord;
        // this.boardCtl.coord.green[this.pieces] = startCoord;
        // console.log(`The starting coordinates are ...`);
        // console.log(startCoord);
        console.log(`The active player is`);
        console.log(this.players[this.activePlayer]);
        console.log(`The active player number is ${this.activePlayer}`);
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
                console.log(`Player rolled a six, update a piece`);
                this.addPlayer();
            }
            this.incrementActivePlayer();
        })
    }

    init(){
        this.boardCtl.setupBoard();
        this.setupEventListeners();
        this.activePlayer = 3;
        this.addPlayer();
    }
}

mainCtl = new MainController();
ctx = mainCtl.ctx;
mainCtl.init();