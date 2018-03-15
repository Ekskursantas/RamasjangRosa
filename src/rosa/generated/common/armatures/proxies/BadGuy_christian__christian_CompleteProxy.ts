
import {ICharacter} from "src/rosa/interfaces/ICharacter";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_christian__chrHeadProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__chrHeadProxy";
import {BadGuy_christian__d_preb_idleallProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__d_preb_idleallProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class BadGuy_christian__christian_CompleteProxy extends ProxyBase implements IArmatureProxy, ICharacter {


	private chrHead:dragonBones.Armature;
	private preben:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
		this.setSlotChildArmature();
	}

	// Child Armatures
	public getChrHead():BadGuy_christian__chrHeadProxy {
		return new BadGuy_christian__chrHeadProxy(this.chrHead);
	}
	public getPreben():BadGuy_christian__d_preb_idleallProxy {
		return new BadGuy_christian__d_preb_idleallProxy(this.preben);
	}
	// Animations
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
	}

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
	public show(container:PIXI.Container):void{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
