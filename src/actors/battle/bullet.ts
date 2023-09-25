import {Actor, CollisionType, Engine, Vector} from "excalibur";
import {Colour} from "../../constants";
import {KamiBoom} from "./kami-boom";

type BulletArgs = {
    x: number;
    y: number;
    dir: Vector;
    isEnemy: boolean;
}

export class Bullet extends Actor{
    private dir: Vector;
    private isEnemy: boolean;

    constructor(args: BulletArgs) {
        super({
            ...args,
            color: args.isEnemy ? Colour.Blue : Colour.Red,
            width: 1,
            height: 1,
            collisionType: CollisionType.Active,
            name: 'bullet',
        });
        this.dir = args.dir;
        this.isEnemy = args.isEnemy;

        this.on('collisionstart', () => {
            this.scene.add(new KamiBoom({x: this.pos.x, y: this.pos.y, isEnemy: this.isEnemy}))
            this.kill();
        });
    }

    update(engine: Engine, delta: number) {
        super.update(engine, delta);
        const VEL = 2;

        this.pos.x += this.dir.x*VEL;
        this.pos.y += this.dir.y*VEL;
    }
}