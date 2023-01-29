class Renderer2D{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.bgcolor = "#000000";
    }
    /**
     * 
     * @param {Boolean} usebg 
     */
    clear(usebg){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        if(usebg){
            this.ctx.fillStyle = bgcolor;
            
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        }
    }
}