import {Actor, ActorArgs} from "excalibur";
import {Colour} from "../../constants";

type BaseArgs = Omit<ActorArgs, 'width' | 'height' | 'color'> & {
    health: number,
}

export class Base extends Actor{
    private health: number;

    constructor(args: BaseArgs) {
        super({
            ...args,
            width: 60,
            height: 100,
            color: Colour.White,
        });
        this.health = args.health;

        // TODO - remove this
        this.health;
    }
}
