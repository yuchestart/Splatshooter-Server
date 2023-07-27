const transform = require("./transform")
const matchidnumbers = "abcdefghijklmnopqrstuvwxyz01234567890123456789";
class Player{
    constructor(id,transform,username){
        this.id = id;
        this.transform = transform;
        this.knockouts = 0;
        this.areacovered = 0;
        this.health = 0;
        this.username = username?username:`SOCKET${id}`;
    }

}
class Match{
    constructor(id,playersrequired){
        this.id = id;
        if(this.id == "random"){
            
        }
        this.playersrequired = playersrequired;
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
        this.players[i]
    }
    updatePhysics(){
        
    }
}