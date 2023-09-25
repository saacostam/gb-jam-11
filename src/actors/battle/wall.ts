import {Actor, CollisionType} from "excalibur";
import {Colour} from "../../constants";

type WallArgs = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Wall extends Actor{
    constructor(args: WallArgs) {
        super({
            ...args,
            color: Colour.White,
            collisionType: CollisionType.Fixed,
            name: 'wall',
        });
    }
}