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
    constructor(xunit, yunit){
        this.x = xunit;
        this.y = yunit;
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
        const xUnit = canvas.width/15;
        const yUnit = canvas.height/15;
        return [xUnit, yUnit];
    }

    init(){
        this.uiCtl = new UI();
        this.setupCanvas();
        

    }
}

mainCtl = new MainController();
mainCtl.init();