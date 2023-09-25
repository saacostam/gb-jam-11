import {Engine, Keys, Scene} from "excalibur";
import {Base, CameraAnchorSp, KamiKami, Ship, Wall} from "../actors";

export class Battle extends Scene{
    private cameraAnchor: CameraAnchorSp = new CameraAnchorSp();
    private activeCameraMovement: boolean = true;
    private myBase: Base = new Base({health: 10, isEnemy: false});
    private enemyBase: Base = new Base({health: 10, isEnemy: true});

    private timeOut: Date = new Date();

    private findObjective(isEnemy: boolean){
        let obj: Base | KamiKami | Ship = isEnemy ? this.myBase : this.enemyBase;

        this.actors.forEach(
            actor => {
                if (!(actor instanceof Base || actor instanceof KamiKami || actor instanceof Ship)) return;
                if (
                    (
                        isEnemy
                        ? obj.pos.x < actor.pos.x
                        : obj.pos.x > actor.pos.x
                    )
                    && obj.isEnemy === actor.isEnemy
                ){
                    obj = actor;
                }
            }
        )

        return obj;
    }

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
            x: 30,
            y: drawHeight - 40,
            isEnemy: false,
        });

        this.enemyBase = new Base({
            health: 100,
            x: drawWidth*2 - 30,
            y: drawHeight - 40,
            isEnemy: true,
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
        const DELTA = delta/4;

        if (this.activeCameraMovement){
            let cameraX = this.cameraAnchor.pos.x;

            if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)){
                cameraX += DELTA;
            }else if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)){
                cameraX += -DELTA;
            }

            this.cameraAnchor.pos.x = Math.max(Math.min(cameraX, drawWidth*3/2), drawWidth/2);
        }

        const enemyObj = this.findObjective(true);
        const myObj = this.findObjective(false);

        this.actors.forEach(actor => {
            if (actor instanceof Ship || actor instanceof KamiKami){
                if (actor.askingForObjective){
                    actor.setObjective( actor.isEnemy ? enemyObj : myObj );
                }
            }
        })

        const now = new Date();
        if (now.getTime() - this.timeOut.getTime() >= 1500){
            for (let i = 0; i < 3*Math.random(); i++){
                this.add(new Ship({
                    x: 30,
                    y: 20 + (drawHeight - 20) * Math.random(),
                    isEnemy: false,
                }));
            }

            for (let i = 0; i < 3*Math.random(); i++){
                this.add(new Ship({
                    x: 2*drawWidth - 30,
                    y: 20 + (drawHeight - 20) * Math.random(),
                    isEnemy: true,
                }))
            }

            for (let i = 0; i < 3*Math.random(); i++){
                this.add(new KamiKami({
                    x: 30,
                    y: 20 + (drawHeight - 20) * Math.random(),
                    isEnemy: false,
                }));
            }

            for (let i = 0; i < 3*Math.random(); i++){
                this.add(new KamiKami({
                    x: 2*drawWidth - 30,
                    y: 20 + (drawHeight - 20) * Math.random(),
                    isEnemy: true,
                }))
            }

            this.timeOut = new Date();
        }
    }
}
