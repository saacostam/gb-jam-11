import {Actor, Engine, SpriteSheet } from "excalibur";
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
            name: 'kami-kami',
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
        if (this.objective.pos.distance(this.pos) < 5){
            this.scene.add(new KamiBoom({x: this.pos.x, y: this.pos.y, isEnemy: this.isEnemy}));
            this.kill();
        }

        const VEL = 10;
        this.actions.moveTo(this.objective.pos, VEL*delta);
    }
}
