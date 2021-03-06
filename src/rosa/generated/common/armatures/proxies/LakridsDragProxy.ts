
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {IDragable} from "src/rosa/typeddb/interfaces/IDragable";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import Graphics = PIXI.Graphics;
import {Signal} from "signals.js";
import {SceneBase} from "../../../../view/scenes/SceneBase";
import {AssetLoader} from "../../../../util/AssetLoader";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class LakridsDragProxy extends ProxyBase implements IArmatureProxy,IDragable {
	
	protected _bone:dragonBones.Armature;

	rectCover:Graphics;
	public signalPiece:Signal;

	constructor(armature:dragonBones.Armature) {
		super();
		this.proxyName = "LakridsDragProxy";
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
		this.setSlotChildArmature();

		this.signalPiece = new Signal();

		this.rectCover = new Graphics();
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.interactive = true;
		this.rectCover.buttonMode = true;
		this.rectCover.alpha = SceneBase.RECT_COVER_ALPHA;
		this.display.addChild(this.rectCover);
		this.rectCover.drawRect(-this.display.width*.5, -this.display.height*.5, this.display.width, this.display.height);

		this.rectCover.on(TouchEvent.TOUCH, this.touchDown);

	}

	private touchDown = (event:TouchEvent):void => {
		this.signalPiece.dispatch(this);
	}

	public getDecoArmature = ():dragonBones.Armature => {
		let armature:dragonBones.Armature = AssetLoader.getInstance().typeddb._factory.buildArmature("deco/lakridsDrag");
		return armature;
	}

// < Child Armatures >
// </ Child Armatures >
// < Animations >
	public gotoDefault():void {
		if (this._armature.animation.lastAnimationName != "idle") {
			this._armature.animation.play("idle");
		}
	}
	public gotoDrag():void {
		Logger.log(this, "LakridsDragProxy gotoDrag this._armature.animation.lastAnimationName ===  "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "drag") {
			this._armature.animation.play("drag");
		}
	}
	public gotoDrag1():void {
		Logger.log(this, "LakridsDragProxy gotoDrag1 this._armature.animation.lastAnimationName ===  "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "drag1") {
			this._armature.animation.play("drag1");
		}
	}
	public gotoDrag2():void {
		Logger.log(this, "LakridsDragProxy gotoDrag2 this._armature.animation.lastAnimationName ===  "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "drag2") {
			this._armature.animation.play("drag2");
		}
	}
	public gotoDrag3():void {
		Logger.log(this, "LakridsDragProxy gotoDrag3 this._armature.animation.lastAnimationName ===  "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "drag3") {
			this._armature.animation.play("drag3");
		}
	}
// </ Animations >
// < Animations aliases >
public gotoIdle():void
	{
		this.gotoDefault();
	}
public gotoDrop():void
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
