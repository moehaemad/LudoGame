class UI{
    constructor(){
        let DOMItems = {
            toggleBanner: '.banner-up',
            game: '.gameScreen'
        }
        this.DOMItems = DOMItems;
    }

    getCanvas(){
        return document.querySelector(this.DOMItems.game);
    }
}

class Board{
    constructor(xunit, yunit, ctx){
        this.x = xunit;
        this.y = yunit;
        this.ctx = ctx;
    }

    makeRectangle(color, x, y, width, height){
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y, width, height);
        this.ctx.strokeRect(x, y, width, height);
    }

    makePath(x, y, iterations, incDirec, color = 'white'){
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
        let homeImg = new Image();
        homeImg.src = './resources/piece.png';
        console.log(homeImg);
        console.log(this.ctx.drawImage(homeImg, 0, 0));
        this.makeRectangle('#004d1a', 0, 0, bigX, bigY);
        this.makeRectangle('#4d0f00', 9*this.x, 0, bigX, bigY);
        this.makeRectangle('#00004d', 0, 9*this.y, bigX, bigY);
        this.makeRectangle('#4d4d00', 9*this.x, 9*this.y, bigX, bigY);
        this.makeRectangle('pink', 2*homeX, 2*homeY, homeX, homeY);
        // Draw all vertical paths
        this.makePath(this.x*6, 0, 5, 'vertical');
        this.makePath(this.x*7, 0, 5, 'vertical');
        this.makePath(this.x*8, 0, 5, 'vertical');
        this.makePath(this.x*6, this.y*9, 5, 'vertical');
        this.makePath(this.x*7, this.y*9, 5, 'vertical');
        this.makePath(this.x*8, this.y*9, 5, 'vertical');
        this.makePath(0, this.y*6, 5, 'horizontal');
        this.makePath(0, this.y*7, 5, 'horizontal');
        this.makePath(0, this.y*8, 5, 'horizontal');
        this.makePath(this.x*9, this.y*6, 5, 'horizontal');
        this.makePath(this.x*9, this.y*7, 5, 'horizontal');
        this.makePath(this.x*9, this.y*8, 5, 'horizontal');
    }

    clearScreen(){
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.setupBoard();
    }

}

class MainController{

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

    init(){
        this.uiCtl = new UI();
        const [dx, dy] = this.setupCanvas();
        this.boardCtl = new Board(dx, dy, this.ctx);
        this.boardCtl.setupBoard();
        // console.log(`${dx} + ${dy}`);
    }
}

mainCtl = new MainController();
ctx = mainCtl.ctx;
mainCtl.init();