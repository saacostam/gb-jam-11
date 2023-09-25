import {Actor, Engine, SpriteSheet, Vector} from "excalibur";
import {Colour} from "../../constants";
import {Images} from "../../resources";
import {Bullet} from "./bullet";
import {KamiBoom} from "./kami-boom";
import {Wall} from "./wall";
import {KamiKami} from "./kami-kami";

type ShipArgs = {
    x: number,
    y: number,
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
    private objective?: Actor;
    isEnemy: boolean;
    private  timeout: Date;
    private objTimeout = new Date();
    askingForObjective: boolean;


    constructor(args: ShipArgs) {
        super({
            ...args,
            width: 6,
            height: 6,
            color: Colour.Red,
            name: 'ship',
        });
        this.isEnemy = args.isEnemy;
        this.timeout = new Date();
        this.objTimeout = new Date();
        this.askingForObjective = true;

        this.on('collisionstart', (e) => {
            const {other } = e;

            if (
                other instanceof Wall
                || other instanceof KamiKami
                || (other instanceof Bullet && other.isEnemy != this.isEnemy)
            ){
                this.kill();
                this.scene.add(new KamiBoom({
                    x: this.pos.x,
                    y: this.pos.y,
                    isEnemy: this.isEnemy,
                }))
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

        const VEL = 8;
        let dir = (new Vector(this.objective.pos.x - this.pos.x, this.objective.pos.y - this.pos.y)).normalize().scaleEqual(delta/VEL);
        dir = (this.objective.pos.distance(this.pos) >= 20) ? dir : dir.normal();

        this.rotation = dir.toAngle();
        this.pos = this.pos.add(dir);

        const DELAY = 1000;
        const now = new Date();
        if (now.getTime() - this.timeout.getTime() >= DELAY){
            this.scene.add(new Bullet({
                x: this.pos.x,
                y: this.pos.y,
                dir: dir,
                isEnemy: this.isEnemy,
            }))
            this.timeout = new Date();
        }

        const OBJ_DELAY = 500;
        if (now.getTime() - this.objTimeout.getTime() >= OBJ_DELAY){
            this.askingForObjective = true;
        }
    }
}
