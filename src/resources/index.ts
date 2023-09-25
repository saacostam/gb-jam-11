import * as ex from 'excalibur'
import {ImageSource} from "excalibur";
import {Colour, HexColour} from "../constants";

const Images = {
    mainMenuPointer: new ImageSource('/scenes/menu/pointer.png'),
    planets: new ImageSource('/scenes/space-view/planet.png'),
    planetPointer: new ImageSource('/scenes/space-view/planet-pointer.png'),
    kami: new ImageSource('/scenes/space-view/kami.png'),
    kamiBoom: new ImageSource('/scenes/space-view/kami-boom.png'),
    ship: new ImageSource('/scenes/space-view/ship.png'),
}

const Sounds = {
    nope: new ex.Sound('/audio/nope.mp3'),
    plop: new ex.Sound('/audio/plop.mp3'),
    yeah: new ex.Sound('/audio/yeah.mp3'),
    info: new ex.Sound('/audio/info.mp3'),
    boom: new ex.Sound('/audio/boom.mp3'),
}

const loader = new ex.Loader();
const allResources = {
    ...Images,
    ...Sounds,
}

for (const res in allResources) {
    // @ts-ignore
    loader.addResource(allResources[res])
}

// Customize Loader
loader.loadingBarColor = Colour.White;
loader.backgroundColor = HexColour.Black;
loader.suppressPlayButton = true;

export { loader, Images, Sounds }
