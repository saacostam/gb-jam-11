import {Actor, Engine, SpriteSheet, Vector} from "excalibur";
import {Colour} from "../../constants";
import {Images} from "../../resources";
import {KamiBoom} from "./kami-boom.ts";
import {Wall} from "./wall";
import {Base} from "./base";
import {Ship} from "./ship";

type KamiKamiArgs = {
    x: number,
    y: number,
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
    private objective?: Actor;
    isEnemy: boolean;
    private objTimeout = new Date();
    askingForObjective: boolean;

    constructor(args: KamiKamiArgs) {
        super({
            ...args,
            width: 6,
            height: 6,
            color: Colour.Red,
            name: 'kami-kami',
        });
        this.isEnemy = args.isEnemy;
        this.objTimeout = new Date();
        this.askingForObjective = true;

        this.on('collisionstart', (e) => {
            const {other} = e;

            if (other instanceof Wall){
                this.kill();
                this.scene.add(new KamiBoom({
                    x: this.pos.x,
                    y: this.pos.y,
                    isEnemy: this.isEnemy,
                }));
            }else if (other instanceof Base || other instanceof KamiKami || other instanceof Ship){
                if (other.isEnemy !== this.isEnemy){
                    this.kill();
                    this.scene.add(new KamiBoom({
                        x: this.pos.x,
                        y: this.pos.y,
                        isEnemy: this.isEnemy,
                    }));
                }
            }
        })

        const sprite = spriteSheet.getSprite(0, this.isEnemy ? 1: 0);
        if (!sprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(sprite);
    }

    setObjective(newObjective: Actor){
        this.objective = newObjective;
        this.askingForObjective = false;
        this.objTimeout = new Date();
    }

    // @ts-ignore
    update(engine: Engine, delta: number) {
        if (!this.objective) return;

        if (this.objective.pos.distance(this.pos) < 10){
            this.scene.add(new KamiBoom({x: this.pos.x, y: this.pos.y, isEnemy: this.isEnemy}));
            this.kill();
        }

        const VEL = 8;
        let dir = (new Vector(this.objective.pos.x - this.pos.x, this.objective.pos.y - this.pos.y)).normalize().scaleEqual(delta/VEL);

        this.rotation = dir.toAngle();
        this.pos = this.pos.add(dir);

        const now = new Date();

        const OBJ_DELAY = 1000;
        if (now.getTime() - this.objTimeout.getTime() >= OBJ_DELAY){
            this.askingForObjective = true;
        }
    }
}
