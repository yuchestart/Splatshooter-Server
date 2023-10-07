export { Logger };

class Logger
{
    name;

    constructor(name)
    {
        this.name = name;
    }

    info(text)
    {
        console.log(`%c[${this.getTime()}] (${this.name}) INFO: ${text}`, 'color: white;');
    }
    warn(text)
    {
        console.log(`%c[${this.getTime()}] (${this.name}) WARN: ${text}`, "color: yellow");
    }
    error(text)
    {
        console.log(`%c[${this.getTime()}] (${this.name}) ERROR: ${text}`, "color: red");
    }
    getTime()
    {
        const date = new Date();
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(2, "0")}`;
    }
}