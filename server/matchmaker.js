import { Transform } from "../client/third-party/transform"
class Match{
    constructor(id){
        this.id = id;
        this.players = {};
        this.running = false;
    }
    join(playerid){
        this.players.push(playerid);
    }
    kick(playerid){
        this.players.splice(this.players.indexOf(playerid),1);
    }
    start(){
        this.running = true;
    }
    updateTransform(transformMessage){
        
    }
}