export { Logger };

class Logger
{
    private name: String;

    constructor(name: String)
    {
        this.name = name;
    }

    public info (text: any)
    {
        console.log("\x1b[0m", `[${this.getTime()}] (${this.name}) INFO: ${text}`, "\x1b[0m");
    }
    public warn (text: any)
    {
        console.log("\x1b[33m", `[${this.getTime()}] (${this.name}) WARN: ${text}`, "\x1b[0m");
    }
    public error (text: any)
    {
        console.log("\x1b[31m", `[${this.getTime()}] (${this.name}) ERROR: ${text}`, "\x1b[0m");
    }
    private getTime ()
    {
        const date = new Date();
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}:${date.getMilliseconds().toString().padStart(2, "0")}`;
    }
}