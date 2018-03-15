
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {HoldingHandLeftProxy} from "src/rosa/generated/common/armatures/proxies/HoldingHandLeftProxy";
import {Pic_placeholderProxy} from "src/rosa/generated/common/armatures/proxies/Pic_placeholderProxy";
import {EndShoe1Proxy} from "src/rosa/generated/common/armatures/proxies/EndShoe1Proxy";
import {WalkingTilesProxy} from "src/rosa/generated/common/armatures/proxies/WalkingTilesProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene10_walksceneProxy extends ProxyBase implements IArmatureProxy {
	

	private rightHand:dragonBones.Armature;
	private leftHand:dragonBones.Armature;
	private placeholder:dragonBones.Armature;
	private endShoe1_0:dragonBones.Armature;
	private walkingTils2:dragonBones.Armature;
	private endShoe1:dragonBones.Armature;
	private walkingTils1:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getRightHand():HoldingHandLeftProxy
	{
		return new HoldingHandLeftProxy(this.rightHand);
	}
public getLeftHand():HoldingHandLeftProxy
	{
		return new HoldingHandLeftProxy(this.leftHand);
	}
public getPlaceholder():Pic_placeholderProxy
	{
		return new Pic_placeholderProxy(this.placeholder);
	}
public getEndShoe1_0():EndShoe1Proxy
	{
		return new EndShoe1Proxy(this.endShoe1_0);
	}
public getWalkingTils2():WalkingTilesProxy
	{
		return new WalkingTilesProxy(this.walkingTils2);
	}
public getEndShoe1():EndShoe1Proxy
	{
		return new EndShoe1Proxy(this.endShoe1);
	}
public getWalkingTils1():WalkingTilesProxy
	{
		return new WalkingTilesProxy(this.walkingTils1);
	}
// </ Child Armatures >
// < Animations >
public gotoDefault():void
	{
		if (this._armature.animation.lastAnimationName != "default")
		{
			this._armature.animation.play("default");
		}
	}
public gotoIntro():void
	{
		if (this._armature.animation.lastAnimationName != "intro")
		{
			this._armature.animation.play("intro");
		}
	}
public gotoOuttro():void
	{
		if (this._armature.animation.lastAnimationName != "outtro")
		{
			this._armature.animation.play("outtro");
		}
	}
// </ Animations >
// < Animations aliases >
public gotoIdle():void
	{
		this.gotoDefault();
	}
public gotoOutro():void
	{
		this.gotoOuttro();
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
