
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {MilleFront_headProxy} from "src/rosa/generated/common/armatures/proxies/MilleFront_headProxy";
import {MilleMouthProxy} from "src/rosa/generated/common/armatures/proxies/MilleMouthProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class BadGuy_mille__caracter_milleProxy extends ProxyBase implements IArmatureProxy {


	private head:dragonBones.Armature;
	private milleFront_mouth:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getHead():MilleFront_headProxy {
		return new MilleFront_headProxy(this.head);
	}
	public getMilleFront_mouth():MilleMouthProxy
	{
		return new MilleMouthProxy(this.milleFront_mouth);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoIdle1():void {
		if (this._armature.animation.lastAnimationName != "idle1")
		{
			this._armature.animation.play("idle1");
		}
	}
	public gotoIdle2():void {
		if (this._armature.animation.lastAnimationName != "idle2")
		{
			this._armature.animation.play("idle2");
		}
	}
	public gotoIdle3():void {
		if (this._armature.animation.lastAnimationName != "idle3")
		{
			this._armature.animation.play("idle3");
		}
	}
	public gotoSpottet():void {
		if (this._armature.animation.lastAnimationName != "spottet")
		{
			this._armature.animation.play("spottet");
		}
	}
	// </ Animations >
	// < Animations aliases >
	// </ Animations aliases >
	// < Idle number animation aliases >
	public gotoIdle():void {
		let methods:string[] = ["gotoIdle1", "gotoIdle2", "gotoIdle3"];
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
