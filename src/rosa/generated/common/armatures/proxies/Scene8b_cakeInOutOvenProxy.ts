
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {DragHelpArrowProxy} from "src/rosa/generated/common/armatures/proxies/DragHelpArrowProxy";
import {SmokeAnimArmatureProxy} from "src/rosa/generated/common/armatures/proxies/SmokeAnimArmatureProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene8b_cakeInOutOvenProxy extends ProxyBase implements IArmatureProxy {
	

	private arrowHitter:dragonBones.Armature;
	private steam:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getArrowHitter():DragHelpArrowProxy
	{
		return new DragHelpArrowProxy(this.arrowHitter);
	}
public getSteam():SmokeAnimArmatureProxy
	{
		return new SmokeAnimArmatureProxy(this.steam);
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
public gotoSetClock():void
	{
		if (this._armature.animation.lastAnimationName != "setClock")
		{
			this._armature.animation.play("setClock");
		}
	}
public gotoPause():void
	{
		if (this._armature.animation.lastAnimationName != "pause")
		{
			this._armature.animation.play("pause");
		}
	}
public gotoReady():void
	{
		if (this._armature.animation.lastAnimationName != "ready")
		{
			this._armature.animation.play("ready");
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
	public show(container:PIXI.Container):void{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
