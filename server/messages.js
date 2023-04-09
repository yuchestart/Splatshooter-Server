class Message{
    constructor(type,data){
        return JSON.stringify({
            type:type,
            data:data,
            timestamp:new Date().toString()
        })
    }
}
class Transform{
    constructor(){
        
    }
}
module.exports = {Message,Transform}