//package dk.nozebra.rosa.generated.common.armatures.proxies
//{
//	import dragonBones.Armature;
//	import dragonBones.Bone;
//	import starling.display.PIXI.Sprite;
//	import starling.events.EventDispatcher;
//	import dragonBones.animation.WorldClock";
//	import dk.nozebra.rosa.typeddb.interfaces.IDragable";
//	import dk.nozebra.rosa.typeddb.interfaces.IArmatureProxy";
//	import dk.nozebra.rosa.generated.common.armatures.TypedDBFactory";

//import {Armature} from "./src.dragonBones.armature.Armature";
//import {Bone} from "./src.dragonBones.armature.Bone";
//import {WorldClock} from "./src.dragonBones.animation.WorldClock";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_bamse__bamseheadProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_bamse__bamseheadProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class BadGuy_bamse__bamseInCardProxy extends ProxyBase implements IArmatureProxy {


	private head:dragonBones.Armature;


	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getHead():BadGuy_bamse__bamseheadProxy {
		return new BadGuy_bamse__bamseheadProxy(this.head);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoIdle():void {
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
		}
	}
	// </ Animations >
	// < Animations aliases >
	public gotoDefault():void {
		this.gotoIdle();
	}
// </ Animations aliases >
	public get armature():dragonBones.Armature {
		return this._armature;
	}
	public get display():PIXI.Sprite {
		return this._armature.display as PIXI.Sprite;
	}
	public set display(newDisplay:PIXI.Sprite) {
		if (this._armature.getSlots().length == 1)
		{
			let slot:dragonBones.Slot = this._armature.getSlots()[0];
			//slot.display.dispose();
			slot.display = newDisplay;
		}
		else
		{
			throw new Error("You cannot change display of armature containing more than one bone!")
		}
	}
	public show(container:PIXI.Container):void {
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void {
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
