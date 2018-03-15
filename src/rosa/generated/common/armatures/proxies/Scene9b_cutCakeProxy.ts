
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {CakeArmProxy} from "src/rosa/generated/common/armatures/proxies/CakeArmProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {ClearButtonProxy} from "src/rosa/generated/common/armatures/proxies/ClearButtonProxy";
import {CakeCutShapesProxy} from "src/rosa/generated/common/armatures/proxies/CakeCutShapesProxy";
import {HoldingHandLeftProxy} from "src/rosa/generated/common/armatures/proxies/HoldingHandLeftProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {Logger} from "src/loudmotion/utils/debug/Logger";

export class Scene9b_cutCakeProxy extends ProxyBase implements IArmatureProxy {
	

	private hardCake:dragonBones.Armature;
	private nextArrow:dragonBones.Armature;
	private clearButton:dragonBones.Armature;
	private cakeCutShape:dragonBones.Armature;
	private holdingHandLeft:dragonBones.Armature;
	private holdingHandLeft0:dragonBones.Armature;
	private polaroid:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		Logger.log(this, "Scene9b_cutCakeProxy  constructor");
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getHardCake():CakeArmProxy
	{
		return new CakeArmProxy(this.hardCake);
	}
public getNextArrow():NextArrowProxy
	{
		return new NextArrowProxy(this.nextArrow);
	}
public getClearButton():ClearButtonProxy
	{
		return new ClearButtonProxy(this.clearButton);
	}
public getCakeCutShape():CakeCutShapesProxy
	{
		Logger.log(this, "Scene9b_cutCakeProxy getCakeCutShape this.cakeCutShape ==" + this.cakeCutShape);
		return new CakeCutShapesProxy(this.cakeCutShape);
	}
public getHoldingHandLeft():HoldingHandLeftProxy
	{
		return new HoldingHandLeftProxy(this.holdingHandLeft);
	}
public getHoldingHandLeft0():HoldingHandLeftProxy
	{
		return new HoldingHandLeftProxy(this.holdingHandLeft0);
	}
public getPolaroid():PolaroidProxy
	{
		return new PolaroidProxy(this.polaroid);
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
	public gotoOuttro = ():void => {
		if (this._armature.animation.lastAnimationName != "outtro") {
			this._armature.animation.play("outtro");
		}
	}
// </ Animations >
// < Animations aliases >
public gotoIdle():void
	{
		this.gotoDefault();
	}
// public gotoOutro():void {
// 	Logger.log(this, "Scene9b_cutCakeProxy  gotoOutro");
// 		this.gotoOuttro();
// 	}
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
