//package dk.nozebra.rosa.typeddb.interfaces
//{
//	import dragonBones.Armature;
//
//	import starling.display.PIXI.Sprite;

//import {Armature} from "./src.dragonBones.armature.Armature";

export interface IArmatureProxy {
	// get armature():dragonBones.Armature;
	// get display():PIXI.Sprite;
	// set display(newDisplay:PIXI.Sprite);
	armature:dragonBones.Armature;
	display:PIXI.Sprite;


	show(container:PIXI.Container):void;
	remove(container:PIXI.Container):void;
}
