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
            width: 30,
            height: 50,
            color: Colour.White,
            name: 'base',
        });
        this.health = args.health;

        this.on('collisionstart', (e) => {
            const {other: {name}} = e;

            if (name === 'bullet') {
                this.health -= 1;
            }else if (name==='kami-kami'){
                this.health -= 5;
            }
        })

        // TODO - remove this
        this.health;
    }
}
