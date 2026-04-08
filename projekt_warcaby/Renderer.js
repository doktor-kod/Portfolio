class Renderer{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.context2d = this.canvas.getContext("2d");
    }

    getCanvas = () =>{
        return this.canvas;
    }

    getContext2d = () => {
        return this.context2d;
    }

    drawRect = (x, y, width, height, color) => {
        this.context2d.fillStyle = color;
        this.context2d.fillRect(x,y,width,height);
    }

    drawCircle = (x,y,radius,color) => {
        this.context2d.fillStyle = color;
        this.context2d.beginPath();
        this.context2d.arc(x,y,radius,0, Math.PI*2, false);
        this.context2d.closePath();
        this.context2d.fill();
    }

    drawText = (str, x,y,color) => {
        this.context2d.fillStyle = color;
        this.context2d.font = "40px Verdana";
        this.context2d.fillText(str ,x ,y);
    }

    clear = () => {
    
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

    static getInstance(){
        if(!this.instance){
            this.instance = new Renderer();
        }
        return this.instance;
    }

    
}

export default Renderer;