function Message(type,data){
    return JSON.stringify({
        type:type,
        data:data,
        timestamp:new Date().toString()
    })
}
module.exports = {Message}