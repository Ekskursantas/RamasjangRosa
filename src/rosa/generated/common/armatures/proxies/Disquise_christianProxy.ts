
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {IDisguise} from "src/rosa/interfaces/IDisguise";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class Disquise_christianProxy extends ProxyBase implements IArmatureProxy,IDisguise {

	protected _bone:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
	}

	// < Child Armatures >
	// </ Child Armatures >
	// < Animations >
	public gotoWalk():void {
		if (this.armature.animation.lastAnimationName != "walk")
		{
			this.armature.animation.play("walk");
		}
	}
	public gotoSit():void {
		if (this.armature.animation.lastAnimationName != "sit")
		{
			this.armature.animation.play("sit");
		}
	}
	public gotoIdle():void {
		if (this.armature.animation.lastAnimationName != "idle")
		{
			this.armature.animation.play("idle");
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
		if (this.armature.getSlots().length == 1) {
			let slot:dragonBones.Slot = this.armature.getSlots()[0];
			if (!slot) {
				throw new Error("Could not find the armature slot");
			}
			if (slot.display) {
				//slot.display.dispose();
			}
			slot.display = newDisplay;
		} else {
			throw new Error("You cannot change display of armature containing more than one bone!")
		}
	}
	public show(container:PIXI.Container):void {
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this.armature);
	}
	public remove(container:PIXI.Container):void {
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this.armature);
	}
}
