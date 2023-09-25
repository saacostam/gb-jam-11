import {Actor, Engine, SpriteSheet, Vector} from "excalibur";
import {Colour} from "../../constants";
import {Images} from "../../resources";

type ShipArgs = {
    x: number,
    y: number,
    objective: Actor,
    isEnemy: boolean,
}

const spriteSheet = SpriteSheet.fromImageSource({
    image: Images.ship,
    grid: {
        rows: 2,
        columns: 1,
        spriteWidth: 6,
        spriteHeight: 6,
    }
});

export class Ship extends Actor{
    private objective: Actor;
    private isEnemy: boolean;

    constructor(args: ShipArgs) {
        super({
            ...args,
            width: 6,
            height: 6,
            color: Colour.Red,
        });
        this.objective = args.objective;
        this.isEnemy = args.isEnemy;

        const sprite = spriteSheet.getSprite(0, this.isEnemy ? 1: 0);
        if (!sprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(sprite);
    }

    setObjective(newObjective: Actor){
        this.objective = newObjective;
    }

    // @ts-ignore
    update(engine: Engine, delta: number) {
        const VEL = 8;
        let dir = (new Vector(this.objective.pos.x - this.pos.x, this.objective.pos.y - this.pos.y)).normalize().scaleEqual(delta/VEL);
        dir = (this.objective.pos.distance(this.pos) >= 20) ? dir : dir.normal();

        this.rotation = dir.toAngle();
        this.pos = this.pos.add(dir);
    }
}
