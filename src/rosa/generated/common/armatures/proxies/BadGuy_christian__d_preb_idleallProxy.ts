
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_christian__prebenHeadProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__prebenHeadProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class BadGuy_christian__d_preb_idleallProxy extends ProxyBase implements IArmatureProxy {


	private head:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getHead():BadGuy_christian__prebenHeadProxy {
		return new BadGuy_christian__prebenHeadProxy(this.head);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoIdle1():void {
		if (this._armature.animation.lastAnimationName != "idle1")
		{
			this._armature.animation.play("idle1");
		}
	}
	public gotoHotdog():void {
		if (this._armature.animation.lastAnimationName != "hotdog")
		{
			this._armature.animation.play("hotdog");
		}
	}
	// </ Animations >
	// < Animations aliases >
	// </ Animations aliases >
	// < Idle number animation aliases >
	public gotoIdle():void {
		let methods:string[] = ["gotoIdle1"];
		let randomIndex:number = Math.floor(Math.random() * methods.length);

		this[methods[randomIndex]]();
	}
	// </ Idle number animation aliases >
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
			if (!slot) {
				throw new Error("Could not find the armature slot");
			}
			if (slot.display) {
				//slot.display.dispose();
			}
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
