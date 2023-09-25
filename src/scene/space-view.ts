import {Engine, Keys, Scene} from "excalibur";
import {CameraAnchorSp, Planet, PlanetState, SetMessageArgs, SpaceViewMessage} from "../actors";
import {SceneKey} from "./index.ts";
import {Sounds} from "../resources";

export class SpaceView extends Scene{
    private planets: Planet[] = [];
    private cameraAnchor: CameraAnchorSp = new CameraAnchorSp();
    private currentIndex: number = 0;
    private activeCameraMovement: boolean = true;
    private message: SpaceViewMessage = new SpaceViewMessage({x: 0, y: 0, height: 0, width: 0});
    // @ts-ignore
    private setMessage: (args: SetMessageArgs) => void;

    public onInitialize(_engine: Engine) {
        const { drawWidth, drawHeight } = _engine
        const x = drawWidth/2;
        const y = drawHeight/2;
        const {planets: inBetweenPlanets, end} = this.getBetweenPlanets(x, y, drawHeight);

        this.cameraAnchor = new CameraAnchorSp({
            x: drawWidth/2,
            y: drawHeight/2,
        });
        this.add(this.cameraAnchor);

        this.camera.strategy.elasticToActor(
            this.cameraAnchor,
            0.3,
            0.1,
        );

        this.planets = [
            new Planet({
                x: drawWidth/2,
                y: drawHeight/2,
                state: PlanetState.RED,
            }),
            ...inBetweenPlanets,
            new Planet({
                x: end.x,
                y: drawHeight/2,
                state: PlanetState.BLUE,
            })
        ];

        this.planets.forEach(
            PL => this.add(PL)
        )

        this.message = new SpaceViewMessage({
            x: drawWidth/2,
            y: drawHeight/8,
            width: drawWidth,
            height: drawHeight/4
        });

        const { setMessage } = this.message.useSpaceViewMessage();
        this.setMessage = setMessage;

        this.add(this.message);
    }

    private updateCurrentIndex(index: number){
        const N = this.planets.length;

        if (index<0 || N <= index) return;

        Sounds.plop.play();

        this.currentIndex = index;
        const currPlanet = this.planets[this.currentIndex];

        this.cameraAnchor.pos.x = currPlanet.pos.x;
        this.cameraAnchor.pos.y = currPlanet.pos.y;

        this.pointCurrentPlanet();
    }

    private getBetweenPlanets(currX: number, currY: number, height: number): {
        planets: Planet[],
        end: {
            x: number,
            y: number,
        }
    }{
        const N = 4;
        const L = 60;
        const R = 100;
        const planets: Planet[] = [];

        for (let i = 0; i < N; i++){
            currX += this.getNumberFromRange(L, R);
            currY = this.getNumberFromRange(32, height-32);

            planets.push(
                new Planet({
                    x: currX,
                    y: currY,
                })
            )
        }

        return {
            planets,
            end: {
                x: currX + this.getNumberFromRange(L, R),
                y: this.getNumberFromRange(0, height),
            }
        };
    }

    private getNumberFromRange(l: number, r: number){
        const range = r-l;
        return l + Math.floor(Math.random() * range);
    }

    private getRightMostConqueredPlanetIndex(){
        let rightMostConqueredPlanetIndex = 0;
        for (let i = 0; i < this.planets.length; i++){
            if (this.planets[i].state !== PlanetState.RED){
                rightMostConqueredPlanetIndex = i-1;
                break;
            }
        }
        return rightMostConqueredPlanetIndex;
    }

    private pointCurrentPlanet(){
        const currentPlanet = this.planets[this.currentIndex];
        this.cameraAnchor.setState(currentPlanet.state === PlanetState.NEUTRAL || currentPlanet.state === PlanetState.BLUE);
    }

    private profileCurrentPlanet(){
        const rightMostConqueredPlanetIndex = this.getRightMostConqueredPlanetIndex();
        const currentPlanet = this.planets[this.currentIndex];

        if (this.currentIndex === (rightMostConqueredPlanetIndex + 1) && (currentPlanet.state === PlanetState.NEUTRAL || currentPlanet.state === PlanetState.BLUE)){
            Sounds.yeah.play();

            this.engine.goToScene(SceneKey.BATTLE, {
                from: SceneKey.SPACE_VIEW,
                data: {
                    enemy: currentPlanet.state,
                }
            });
        }else{
            if (currentPlanet.state === PlanetState.RED){
                this.setMessage({
                    text: 'THIS IS YOUR PLANET',
                    type: 'info',
                    duration: 1000,
                })
                Sounds.info.play();
            }else{
                this.setMessage({
                    text: 'BLOCKED PLANET',
                    type: 'error',
                    duration: 1000,
                })
                Sounds.nope.play();
            }
        }
    }

    update(engine: Engine, duration: number) {
        super.update(engine, duration);

        if (this.activeCameraMovement){
            if (engine.input.keyboard.wasPressed(Keys.D) || engine.input.keyboard.wasPressed(Keys.Right)) {
                this.updateCurrentIndex(this.currentIndex + 1);
            }else if (engine.input.keyboard.wasPressed(Keys.A) || engine.input.keyboard.wasPressed(Keys.Left)){
                this.updateCurrentIndex(this.currentIndex - 1);
            }else if (engine.input.keyboard.wasPressed(Keys.Enter)){
                this.profileCurrentPlanet();
            }
        }
    }
}
