import {Engine, Keys, Scene} from "excalibur";
import {Base, CameraAnchorSp, Ship, Wall} from "../actors";

export class Battle extends Scene{
    private cameraAnchor: CameraAnchorSp = new CameraAnchorSp();
    private activeCameraMovement: boolean = true;
    private myBase: Base = new Base({health: 10});
    private enemyBase: Base = new Base({health: 10});

    private timeOut: Date = new Date();

    private createBounds(drawWidth: number, drawHeight: number){
        this.add(new Wall({
            x: drawWidth,
            y: -10,
            width: drawWidth*3,
            height: 20,
        }));

        this.add(new Wall({
            x: (drawWidth*2)+10,
            y: drawHeight/2,
            width: 20,
            height: drawHeight*2,
        }));

        this.add(new Wall({
            x: drawWidth,
            y: drawHeight+10,
            width: drawWidth*3,
            height: 20,
        }));

        this.add(new Wall({
            x: -10,
            y: drawHeight/2,
            width: 20,
            height: drawHeight*2,
        }));
    }

    public onInitialize(_engine: Engine) {
        const { drawWidth, drawHeight } = _engine;

        this.cameraAnchor = new CameraAnchorSp({
            x: drawWidth/2,
            y: drawHeight/2,
            visible: false,
        });
        this.add(this.cameraAnchor);

        this.myBase = new Base({
            health: 100,
            x: 15,
            y: drawHeight - 15,
        });

        this.enemyBase = new Base({
            health: 100,
            x: drawWidth*2 - 15,
            y: drawHeight - 15,
        });

        this.add(this.myBase);
        this.add(this.enemyBase);

        this.camera.strategy.elasticToActor(
            this.cameraAnchor,
            0.3,
            0.1,
        );

        this.createBounds(drawWidth, drawHeight);
    }

    update(engine: Engine, delta: number) {
        super.update(engine, delta);

        const { drawWidth, drawHeight } = engine;
        const DELTA = delta/10;

        if (this.activeCameraMovement){
            let cameraX = this.cameraAnchor.pos.x;

            if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)){
                cameraX += DELTA;
            }else if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)){
                cameraX += -DELTA;
            }

            this.cameraAnchor.pos.x = Math.max(Math.min(cameraX, drawWidth*3/2), drawWidth/2);
        }

        const now = new Date();
        if (now.getTime() - this.timeOut.getTime() >= 1500){
            this.add(new Ship({
                x: 30,
                y: drawHeight - 50,
                objective: this.enemyBase,
                isEnemy: false,
            }))

            this.timeOut = new Date();
        }
    }
}
