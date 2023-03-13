class Vector3{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
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
        var len = Math.sqrt(this.x**2,this.y**2,this.z**2)
        this.x = this.x/len;
        this.y = this.y/len;
        this.z = this.z/len;
    }
}
class Transform{

}