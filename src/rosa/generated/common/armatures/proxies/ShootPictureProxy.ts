
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class ShootPictureProxy extends ProxyBase implements IArmatureProxy {
	

	protected polaoridImg:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		// Logger.log(this, "ShootPictureProxy armature.animation.animationNames.toString() == "+armature.animation.animationNames.toString());
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}
// < Child Armatures >
public getPolaoridImg():PolaroidProxy
	{
		Logger.log(this, "ShootPictureProxy getPolaoridImg this.polaoridImg == "+this.polaoridImg);

		return new PolaroidProxy(this.polaoridImg);
	}
// </ Child Armatures >
// < Animations >
public gotoDefault():void
	{
		Logger.log(this, "ShootPictureProxy gotoDefault armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());
		if (this._armature.animation.lastAnimationName != "default")
		{
			this._armature.animation.play("default");
		}
	}
public gotoAnimation():void
	{
		Logger.log(this, "ShootPictureProxy gotoAnimation armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());
		if (this._armature.animation.lastAnimationName != "animation")
		{
			this._armature.animation.play("animation");
		}
	}
// </ Animations >
// < Animations aliases >
public gotoIdle():void
	{
		this.gotoDefault();
	}
// </ Animations aliases >
public get armature():dragonBones.Armature
	{
		return this._armature;
	}
	public get display():PIXI.Sprite
	{
		return this._armature.display as PIXI.Sprite;
	}
	public set display(newDisplay:PIXI.Sprite)
	{
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
	public show(container:PIXI.Container):void
	{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void
	{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
