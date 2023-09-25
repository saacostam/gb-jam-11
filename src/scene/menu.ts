import {Engine, Keys, Scene} from "excalibur";
import {MenuOption} from "../actors";
import {SceneKey} from "./index.ts";
import {Sounds} from "../resources";

export class Menu extends Scene{
    private menuOptions: MenuOption[] = []
    private active: number = 0;

    public onInitialize(_engine: Engine) {
        const { drawWidth: width, drawHeight: height } = _engine;
        const CONTAINER_WIDTH = Math.floor(width/2);
        const X = Math.floor(width/2);
        const Y = Math.floor(height*2/3);
        const HEIGHT = Math.floor(height/12);

        this.menuOptions = [
            new MenuOption({
                onSubmit: _engine => {
                    _engine.goToScene(SceneKey.SPACE_VIEW);
                },
                text: 'START',
                x: X,
                y: Y,
                width: CONTAINER_WIDTH,
                height: HEIGHT,
            }),
            new MenuOption({
                onSubmit: _engine => {
                    _engine.goToScene(SceneKey.SPACE_VIEW);
                },
                text: 'INSTRUCTIONS',
                x: X,
                y: Y + HEIGHT,
                width: CONTAINER_WIDTH,
                height: HEIGHT,
            })
        ]

        this.menuOptions.forEach(
            MO => this.add(MO)
        );

        this.updatePointer();
    }

    private updatePointer(){
        this.menuOptions.map((opt, index) => (opt.setState(index === this.active)));
        Sounds.plop.play();
    }

    update(engine: Engine) {
        const N = this.menuOptions.length;

        if (engine.input.keyboard.wasPressed(Keys.S) || engine.input.keyboard.wasPressed(Keys.Down)){
            this.active = (this.active + 1 + N)%N;
            this.updatePointer();
        }else if (engine.input.keyboard.wasPressed(Keys.W) || engine.input.keyboard.wasPressed(Keys.Up)){
            this.active = (this.active - 1 + N)%N;
            this.updatePointer();
        }else if (engine.input.keyboard.wasPressed(Keys.Enter)){
            const curr = this.menuOptions[this.active];
            curr.submit();
        }
    }
}
