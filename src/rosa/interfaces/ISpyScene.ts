//package dk.nozebra.rosa.interfaces
//{
//	import dk.nozebra.rosa.typeddb.interfaces.IArmatureProxy";
//
//	import starling.display.createjs.Sprite;

import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";

export interface ISpyScene extends IArmatureProxy {
	gotoDefault():void;
	gotoIntro():void;
	gotoOuttro():void;
}
