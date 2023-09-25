import {BaseAlign, Direction, Font, FontStyle, FontUnit, TextAlign} from "excalibur";

export const gbfont = new Font({
    size: 8,
    unit: FontUnit.Px,
    family: 'gbFont',
    style: FontStyle.Normal,
    bold: false,
    textAlign: TextAlign.Center,
    baseAlign: BaseAlign.Alphabetic,
    direction: Direction.LeftToRight,
})
