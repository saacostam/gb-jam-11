import {Actor, ActorArgs, SpriteSheet} from "excalibur";
import {Images} from "../../resources";

const planetPointerSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.planetPointer,
    grid: {
        rows: 2,
        columns: 1,
        spriteWidth: 42,
        spriteHeight: 42,
    }
});

export class CameraAnchorSp extends Actor{
    constructor(args?: ActorArgs) {
        super(args);
        const sprite = planetPointerSpriteSheet.getSprite(0, 0);
        if (!sprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(sprite);
    }

    setState(activeState: boolean){
        const newSprite =  planetPointerSpriteSheet.getSprite(0, activeState ? 1: 0);
        if (!newSprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(newSprite);
    }
}
