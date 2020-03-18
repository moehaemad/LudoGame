class UI{
    constructor(){
        let DOMItems = {
            toggleBanner: '.banner-up',
            banner: '.banner',
            bannerName: '.banner-name',
            game: '.gameScreen',
            dice: '.control-dice',
            green: '.green',
            red: '.red',
            yellow: '.yellow',
            blue: '.blue',
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
        this.startCord = {
            //each are coordinates of the starting coordinates for each piece
            greenStart: [1*this.x,6*this.y],
            redStart: [8*this.x,1*this.y],
            blueStart: [13*this.x,8*this.y],
            yellowStart: [6*this.x,13*this.y]
        };
        //Number of starting pieces for each player on the board
        this.pieces = 4;
    }
    //TODO: add the piece to the board
    makePiece(color, x, y, width = this.x, height = this.y){
        return 0;
    }

    makeRectangle(color, x, y, width = this.x, height = this.y){
        //Make a rectangle with a black border
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y, width, height);
        this.ctx.strokeRect(x, y, width, height);
    }

    makePath(x, y, iterations, incDirec, color = 'white'){
        //Adjust the given x, y coordinates to the 15x15 matrix.
        x = this.x * x;
        y = this.y * y;
        for (let i = 0; i <= iterations; i++){
            if (incDirec == 'vertical'){
                this.makeRectangle(color, x, y + (this.y*i), this.x, this.y)
            }
            if (incDirec === 'horizontal'){
                this.makeRectangle(color, x + (this.x * i), y, this.x, this.y);
            }
        }

    }

    setupBoard(){
        //All main boxes for not playing players is a 6 unti square.
        const bigX = this.x*6;
        const bigY = this.y*6;
        //Make unit calc easier for home square.
        const [homeX, homeY] = [this.x*3, this.y*3];
        //TODO: eventually add in image for home
        // let homeImg = new Image();
        // homeImg.src = './resources/piece.png';
        // console.log(homeImg);
        // console.log(this.ctx.drawImage(homeImg, 0, 0));
        this.makeRectangle('#004d1a', 0, 0, bigX, bigY);
        this.makeRectangle('#4d0f00', 9*this.x, 0, bigX, bigY);
        this.makeRectangle('#00004d', 0, 9*this.y, bigX, bigY);
        this.makeRectangle('#4d4d00', 9*this.x, 9*this.y, bigX, bigY);
        this.makeRectangle('pink', 2*homeX, 2*homeY, homeX, homeY);
        // Draw all vertical paths
        this.makePath(6, 0, 5, 'vertical');
        this.makePath(7, 0, 5, 'vertical');
        this.makePath(8, 0, 5, 'vertical');
        this.makePath(6, 9, 5, 'vertical');
        this.makePath(7, 9, 5, 'vertical');
        this.makePath(8, 9, 5, 'vertical');
        this.makePath(0, 6, 5, 'horizontal');
        this.makePath(0, 7, 5, 'horizontal');
        this.makePath(0, 8, 5, 'horizontal');
        this.makePath(9, 6, 5, 'horizontal');
        this.makePath(9, 7, 5, 'horizontal');
        this.makePath(9, 8, 5, 'horizontal');
        //Draw colored paths
        this.makeRectangle('green', this.startCord.greenStart[0], this.startCord.greenStart[1]);
        this.makePath(1, 7, 4, 'horizontal', 'green');
        this.makeRectangle('red', this.startCord.redStart[0], this.startCord.redStart[1]);
        this.makePath(7, 1, 4, 'vertical', 'red');
        this.makeRectangle('yellow', this.startCord.blueStart[0], this.startCord.blueStart[1]);
        this.makePath(9, 7, 4, 'horizontal', 'yellow');
        this.makeRectangle('blue', this.startCord.yellowStart[0], this.startCord.yellowStart[1]);
        this.makePath(7, 9, 4, 'vertical', 'blue');
        

    }

    clearScreen(){
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.setupBoard();
    }

}

class MainController{

    constructor(){
        this.uiCtl = new UI();
        const [dx, dy] = this.setupCanvas();
        this.boardCtl = new Board(dx, dy, this.ctx);
        this.pieces = parseInt(document.getElementById('num-pieces').textContent);
    }

    addPlayer(){
        //TODO: Decrease the number of pieces
        return 0;
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
        document.querySelector(domItems.banner).addEventListener('click', e => {
            // let bannerNode = e.target.parentNode.parentNode;
            // //This is the "Ludo by Muhammad Ali" text
            // let textNode = bannerNode.childNodes[1];
            // let iconNode = bannerNode.childNodes[3]
            // bannerNode.removeChild(textNode);
            document.querySelector(domItems.bannerName).classList.toggle('close');
        });
        document.querySelector(domItems.dice).addEventListener('click', e =>{
            const numWord = ['one', 'two', 'three', 'four', 'five', 'six'];
            let roll = Math.round(Math.random()*5);
            let icon = `<i class="fas fa-dice-${numWord[roll]} fa-4x"></i>`;
            document.querySelector(domItems.dice).innerHTML = icon
            this.pieces -= 1;
            this.uiCtl.reducePieces(this.pieces);

            if (roll === 6){
                console.log(`Player rolled a six, update a piece`);
                this.addPlayer();
            }
        })

        //REDUCE SINCE THIS IS REPETITIVE
        document.querySelector(domItems.green).addEventListener('click', () => document.querySelector(domItems.green).classList.toggle('active'));
        document.querySelector(domItems.red).addEventListener('click', () => document.querySelector(domItems.red).classList.toggle('active'));
        document.querySelector(domItems.yellow).addEventListener('click', () => document.querySelector(domItems.yellow).classList.toggle('active'));
        document.querySelector(domItems.blue).addEventListener('click', () => document.querySelector(domItems.blue).classList.toggle('active'));

    }

    init(){
        this.boardCtl.setupBoard();
        this.setupEventListeners();
        // console.log(`${dx} + ${dy}`);
    }
}

mainCtl = new MainController();
ctx = mainCtl.ctx;
mainCtl.init();