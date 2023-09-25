import {Actor, Engine, SpriteSheet, Vector} from "excalibur";
import {Colour} from "../../constants";
import {Images} from "../../resources";
import {KamiBoom} from "./kami-boom.ts";

type KamiKamiArgs = {
    x: number,
    y: number,
    objective: Actor,
    isEnemy: boolean,
}

const spriteSheet = SpriteSheet.fromImageSource({
    image: Images.kami,
    grid: {
        rows: 2,
        columns: 1,
        spriteWidth: 6,
        spriteHeight: 6,
    }
});

export class KamiKami extends Actor{
    private objective: Actor;
    private isEnemy: boolean;

    constructor(args: KamiKamiArgs) {
        super({
            ...args,
            width: 6,
            height: 6,
            color: Colour.Red,
        });
        this.objective = args.objective;
        this.isEnemy = args.isEnemy;
        this.vel.add(new Vector(Math.random()*5, Math.random()*5));

        this.rotation = 2*Math.PI*Math.random();
        const sprite = spriteSheet.getSprite(0, this.isEnemy ? 1: 0);
        if (!sprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(sprite);
    }

    setObjective(newObjective: Actor){
        this.objective = newObjective;
    }

    // @ts-ignore
    update(engine: Engine, delta: number) {
        const VEL = 2;
        const {pos: {x: objX, y: objY}} = this.objective;

        const move = new Vector(objX - this.pos.x, objY - this.pos.y);
        const deltaAngle = this.rotation - move.toAngle();

        this.rotation += Math.abs(deltaAngle) < 0
            ? Math.max(-Math.PI/8, deltaAngle)
            : Math.min(+Math.PI/8, deltaAngle);

        this.pos = this.pos.add(
            new Vector(Math.cos(this.rotation) * VEL, Math.sin(this.rotation) * VEL),
        )

        if (this.pos.distance(new Vector(objX, objY)) < 5){
            const boom = new KamiBoom({
                x: this.pos.x,
                y: this.pos.y,
                isEnemy: this.isEnemy,
            })
            this.scene.engine.add(boom);
            this.kill();
        }
    }
}
