import {Actor, ActorArgs} from "excalibur";
import {Colour} from "../../constants";

type BaseArgs = Omit<ActorArgs, 'width' | 'height' | 'color'> & {
    health: number,
    isEnemy: boolean,
}

export class Base extends Actor{
    private health: number;
    // @ts-ignore
    isEnemy: boolean;

    constructor(args: BaseArgs) {
        super({
            ...args,
            width: 30,
            height: 80,
            color: args.isEnemy ? Colour.Blue : Colour.Red,
            name: 'base',
        });
        this.health = args.health;
        this.isEnemy = args.isEnemy;

        this.on('collisionstart', (e) => {
            const {other: {name}} = e;

            if (name === 'bullet') {
                this.health -= 1;
            }else if (name==='kami-kami'){
                this.health -= 3;
            }

            if (this.health <= 0) console.log(this.isEnemy? 'You' : 'The Enemy', ' won!');
        })

        // TODO - remove this
        this.health;
    }
}
