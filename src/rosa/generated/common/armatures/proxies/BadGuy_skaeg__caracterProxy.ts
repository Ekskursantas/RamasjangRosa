
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {SkaegFrontHeadProxy} from "src/rosa/generated/common/armatures/proxies/SkaegFrontHeadProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class BadGuy_skaeg__caracterProxy extends ProxyBase implements IArmatureProxy {


	private head:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getHead():SkaegFrontHeadProxy {
		return new SkaegFrontHeadProxy(this.head);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoIdle():void {
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
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
