import { Engine, Label, Vector} from "excalibur";
import {Colour} from "../../constants";
import {gbfont} from "../../fonts";

type SpaceViewMessageArgs = {
    x: number,
    y: number,
    width: number,
    height: number,
}

type MessageType = 'info' | 'error';

export type SetMessageArgs = {
    type: MessageType;
    text: string;
    duration: number;
}

export class SpaceViewMessage extends Label{
    private messageIsVisible: boolean = false;
    private duration: number;
    private timeCounterSinceMessageWasSet: number;
    private relativeX: number;
    private relativeY: number;

    constructor(args: SpaceViewMessageArgs) {
        super({
            color: Colour.Black,
            font: gbfont,
            width: args.width,
            height: args.height,
        });
        this.graphics.opacity = 0;
        this.timeCounterSinceMessageWasSet = 0;
        this.duration = 0;

        this.relativeX = args.x;
        this.relativeY = args.y;
    }

    useSpaceViewMessage(){
        const setMessage = this.setMessage.bind(this);
        return {
            setMessage
        }
    }

    private setMessage({type, duration, text}: SetMessageArgs){
        this.text = text;
        switch (type) {
            case 'error':
                this.color = Colour.Red;
                break;
            default:
                this.color = Colour.White;
                break;
        }

        this.duration = duration;
        this.timeCounterSinceMessageWasSet = 0;
    }

    // @ts-ignore
    update(engine: Engine, delta: number) {
        this.timeCounterSinceMessageWasSet += delta;
        const counterFinished = this.timeCounterSinceMessageWasSet >= this.duration;

        if (counterFinished && this.messageIsVisible){
            this.graphics.opacity = 0;
            this.messageIsVisible = false;
        }else if (!counterFinished && !this.messageIsVisible){
            this.graphics.opacity = 1;
            this.messageIsVisible = true;
        }

        const {x, y} = engine.screen.screenToWorldCoordinates(new Vector(
            this.relativeX,
            this.relativeY,
        ));

        this.pos.x = x;
        this.pos.y = y;
    }
}
