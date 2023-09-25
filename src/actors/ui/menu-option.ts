import {Actor, ActorArgs, Engine, Text, Vector} from "excalibur";
import {Colour} from "../../constants";
import {gbfont} from "../../fonts";
import {Sounds} from "../../resources";

type ButtonArgs = ActorArgs & {
    onSubmit: (engine: Engine) => void,
    text: string,
}

export class MenuOption extends Actor{
    private onSubmit: (engine: Engine) => void;
    private text: Text;

    constructor(args: ButtonArgs){
        super({
            ...args,
        });
        this.onSubmit = args.onSubmit;
        this.text = new Text({
            text: args.text,
            color: Colour.White,
            font: gbfont,
        });
        this.graphics.use(this.text);
        this.graphics.anchor = Vector.Zero;
    }

    submit(){
        this.onSubmit(this.scene.engine);
        Sounds.yeah.play();
    }

    setState(activeState: boolean){
        this.text.color = activeState ? Colour.Blue : Colour.White
    }
}
