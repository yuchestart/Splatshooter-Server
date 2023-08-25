export { Vector3d };

class Vector3d
{
    readonly x: number;
    readonly y: number;
    readonly z: number;
    static readonly ZERO: Vector3d = new Vector3d(0, 0, 0);

    constructor(x: number, y: number, z: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}