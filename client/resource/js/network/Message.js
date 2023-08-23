export default class Message
{

    /**
     * A generic message type.
     * @param {Object} data 
     */
    constructor(type, data)
    {
        this.dataType = type;
        this.data = data;
        this.time = Date.now();
    }

    compress()
    {
        return pako.deflate(JSON.stringify(this), { to: 'string' });
    }

}