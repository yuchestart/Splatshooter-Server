export { Message }

class Message {

    /**
     * A generic message type.
     * @param {*} data 
     */
    constructor(data, type) {
        this.data = data;
        this.dataType = type;
    }

}