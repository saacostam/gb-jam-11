import {Actor, ActorArgs, SpriteSheet} from "excalibur";
import {Images} from "../../resources";

export enum PlanetState{
    NEUTRAL,
    RED ,
    BLUE,
}

type PlanetArgs = ActorArgs & {
    state?: PlanetState;
}

const planetSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.planets,
    grid: {
        rows: 3,
        columns: 3,
        spriteWidth: 48,
        spriteHeight: 48,
    }
});

export class Planet extends Actor{
    state: PlanetState;
    type: number;

    constructor(args: PlanetArgs) {
        super(args);
        this.state = args.state || PlanetState.NEUTRAL;
        this.type = Math.floor(Math.random() * 3);
        this.updateSprite();
    }

    private updateSprite(){
        const newSprite = planetSpriteSheet.getSprite(this.type, this.state);
        if (!newSprite) throw new Error('Trying to access a undefined sprite');
        this.graphics.use(newSprite);
    }

    setState(state: PlanetState){
        this.state = state;
        this.updateSprite();
    }
}
