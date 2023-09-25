import './style.css'
import {DisplayMode, Engine, Input} from "excalibur";
import {Battle, Menu, SceneKey, SpaceView} from "./scene";
import {Colour} from "./constants";
import {loader} from "./resources";

const game = new Engine({
    width: 160,
    height: 144,
    displayMode: DisplayMode.FitScreen,
    pointerScope: Input.PointerScope.Document,
    backgroundColor: Colour.Black,
    antialiasing: false,
    pixelRatio: 1,
});

game.addScene(SceneKey.MENU, new Menu());
game.addScene(SceneKey.SPACE_VIEW, new SpaceView());
game.addScene(SceneKey.BATTLE, new Battle());

game.goToScene(SceneKey.MENU);

await game.start(loader);
