
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {DoorBellBgProxy} from "src/rosa/generated/common/armatures/proxies/DoorBellBgProxy";
import {EndCaracterProxy} from "src/rosa/generated/common/armatures/proxies/EndCaracterProxy";
import {FreeModeButtonProxy} from "src/rosa/generated/common/armatures/proxies/FreeModeButtonProxy";
import {ReplayButtonProxy} from "src/rosa/generated/common/armatures/proxies/ReplayButtonProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class Scene11_caracterThanksProxy extends ProxyBase implements IArmatureProxy {
	

	private doorBellBg:dragonBones.Armature;
	private caracter:dragonBones.Armature;
	private freeModeButton:dragonBones.Armature;
	private replayButton:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getDoorBellBg():DoorBellBgProxy
	{
		return new DoorBellBgProxy(this.doorBellBg);
	}
public getCaracter():EndCaracterProxy {
		Logger.log(this, "Scene11_caracterThanksProxy getCaracter this.caracter== "+this.caracter);
		return new EndCaracterProxy(this.caracter);
	}
public getFreeModeButton():FreeModeButtonProxy
	{
		return new FreeModeButtonProxy(this.freeModeButton);
	}
public getReplayButton():ReplayButtonProxy
	{
		return new ReplayButtonProxy(this.replayButton);
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
public gotoFadeToBlack():void
	{
		if (this._armature.animation.lastAnimationName != "fadeToBlack")
		{
			this._armature.animation.play("fadeToBlack");
		}
	}
public gotoReplay():void
	{
		if (this._armature.animation.lastAnimationName != "replay")
		{
			this._armature.animation.play("replay");
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
