class Vector3{
    /**
     * 3 component vector
     * @param {Number|Vector3} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x,y,z){
        if(x instanceof Vector3){
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else if (x instanceof Number){
        this.x = x;
        this.y = y;
        this.z = z;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
    }
    /**
     * Translates the current Vector3
     * @param {Vector3} v 
     */
    translate(v){
        this.x+=v.x;
        this.y+=v.y;
        this.z+=v.z;
    }
    normalize(){
        var len = Math.sqrt(this.x**2+this.y**2+this.z**2)
        this.x = this.x/len;
        this.y = this.y/len;
        this.z = this.z/len;
    }
}
class Transform{
    /**
     * Transform
     * @param {Number|Transform|Vector3} x 
     * @param {Number|Vector3} y 
     * @param {Number} z 
     * @param {Number} w 
     * @param {Number} l 
     * @param {Number} h 
     */
    constructor(x,y,z,w,l,h){
        if(x instanceof Transform){
            this.position = new Vector3(x.position.x,x.position.y,x.position.z);
            this.scale = new Vector3(x.scale.x,x.scale.y,x.scale.z);
        } else if (x instanceof Vector3){
            this.position = x;
            this.scale = y;
        } else {
            this.position = new Vector3(x,y,z);
            this.scale = new Vector3(w,h,l);
        }
    }
    /**
     * 
     * @param {Transform} x 
     */
    collides(t){
        var xpos1 = [this.position.x-this.scale.x,this.position.x+this.scale.x]
        var ypos1 = [this.position.y-this.scale.y,this.position.y+this.scale.y]
        var zpos1 = [this.position.z-this.scale.z,this.position.z+this.scale.z]
        var xpos2 = [t.position.x-t.scale.x,t.position.x+t.scale.x];
        var ypos2 = [t.position.y-t.scale.y,t.position.y+t.scale.y];
        var zpos2 = [t.position.z-t.scale.z,t.position.z+t.scale.z];
        var withinx = xpos1[0] < xpos2[1] & xpos1[2] > xpos2[0];
        var withiny = ypos1[0] < ypos2[1] & ypos1[2] > ypos2[0];
        var withinz = zpos1[0] < zpos2[1] & zpos1[2] > zpos2[0];
        return withinx && withiny && withinz;
    }
}