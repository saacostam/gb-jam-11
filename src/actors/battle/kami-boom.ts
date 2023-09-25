import {Actor, Engine, SpriteSheet} from "excalibur";
import {Colour} from "../../constants";
import {Images, Sounds} from "../../resources";

type KamiKamiArgs = {
    x: number,
    y: number,
    isEnemy: boolean,
}

const spriteSheet = SpriteSheet.fromImageSource({
    image: Images.kamiBoom,
    grid: {
        rows: 2,
        columns: 5,
        spriteWidth: 6,
        spriteHeight: 6,
    }
});

export class KamiBoom extends Actor{
    private isEnemy: boolean;
    private life: number = 250;
    private counter: number = 0;

    constructor(args: KamiKamiArgs) {
        super({
            ...args,
            width: 6,
            height: 6,
            color: Colour.Red,
        });
        this.isEnemy = args.isEnemy;
        this.rotation = Math.random() < 0.5 ? 0 : Math.PI/2;

        const sprite = spriteSheet.getSprite(0, this.isEnemy ? 1: 0);
        if (!sprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(sprite);

        Sounds.boom.play();
    }

    // @ts-ignore
    update(engine: Engine, delta: number) {
        this.counter += delta;

        if (this.counter >= this.life) {
            this.kill();
            return;
        }

        const spriteX = Math.min(Math.floor(this.counter/(this.life/5)), 4);
        const sprite = spriteSheet.getSprite(spriteX, this.isEnemy ? 1: 0);
        if (!sprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(sprite);
    }
}
