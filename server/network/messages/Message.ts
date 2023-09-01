import Pako from "pako";

export { Message };

class Message
{

    dataType: number = -1;
    data: any = { code: 3002 };
    time: number = 0;

    /**
     * A generic message type.
     * @param {number} type
     * @param {object} data 
     */
    constructor(type: number, data: object)
    {
        this.dataType = type;
        this.data = data;
        this.time = Date.now();
    }

    compress ()
    {
        return Pako.deflate(JSON.stringify(this));
    }

}