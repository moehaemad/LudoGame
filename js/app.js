DOMItems = {
    toggleBanner: '.banner-up',
    game: '.gameScreen'
}

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

uiController = new UI();
const canvas = uiController.getCanvas();
//Give a little bit of space for the canvas
canvas.width = window.innerWidth -10;
canvas.height = window.innerHeight -20;
const ctx = canvas.getContext('2d');

//The Ludo game is a 15x15 matrix
const xUnit = canvas.width/15;
const yUnit = canvas.width/15;
console.log(ctx);
