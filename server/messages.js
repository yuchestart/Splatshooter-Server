class Message{
    constructor(type,data){
        return JSON.stringify({
            type:type,
            data:data,
            timestamp:new Date().toString()
        })
    }
}
export {Message}