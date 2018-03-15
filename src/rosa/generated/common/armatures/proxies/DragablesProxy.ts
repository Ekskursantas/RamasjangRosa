
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {StrawberryDragProxy} from "src/rosa/generated/common/armatures/proxies/StrawberryDragProxy";
import {BlueKrymmelDragProxy} from "src/rosa/generated/common/armatures/proxies/BlueKrymmelDragProxy";
import {ColorKrymmelDragProxy} from "src/rosa/generated/common/armatures/proxies/ColorKrymmelDragProxy";
import {PineappleDragProxy} from "src/rosa/generated/common/armatures/proxies/PineappleDragProxy";
import {CocosDragProxy} from "src/rosa/generated/common/armatures/proxies/CocosDragProxy";
import {KiwiDragProxy} from "src/rosa/generated/common/armatures/proxies/KiwiDragProxy";
import {Deco__flagDragProxy} from "src/rosa/generated/common/armatures/proxies/Deco__flagDragProxy";
import {LakridsDragProxy} from "src/rosa/generated/common/armatures/proxies/LakridsDragProxy";
import {Deco__chocolateDragProxy} from "src/rosa/generated/common/armatures/proxies/Deco__chocolateDragProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class DragablesProxy extends ProxyBase implements IArmatureProxy {


	protected strawberryDrag:dragonBones.Armature;
	protected blueKrymmelDrag:dragonBones.Armature;
	protected colorKrymmelDrag:dragonBones.Armature;
	protected pineappleDrag:dragonBones.Armature;
	protected cocosDrag:dragonBones.Armature;
	protected kiwiDrag:dragonBones.Armature;
	protected flagDrag:dragonBones.Armature;
	protected lakridsDrag:dragonBones.Armature;
	protected chocolateDrag:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getStrawberryDrag():StrawberryDragProxy
	{
		return new StrawberryDragProxy(this.strawberryDrag);
	}
public getBlueKrymmelDrag():BlueKrymmelDragProxy
	{
		return new BlueKrymmelDragProxy(this.blueKrymmelDrag);
	}
public getColorKrymmelDrag():ColorKrymmelDragProxy
	{
		return new ColorKrymmelDragProxy(this.colorKrymmelDrag);
	}
public getPineappleDrag():PineappleDragProxy
	{
		return new PineappleDragProxy(this.pineappleDrag);
	}
public getCocosDrag():CocosDragProxy
	{
		return new CocosDragProxy(this.cocosDrag);
	}
public getKiwiDrag():KiwiDragProxy
	{
		return new KiwiDragProxy(this.kiwiDrag);
	}
public getFlagDrag():Deco__flagDragProxy
	{
		return new Deco__flagDragProxy(this.flagDrag);
	}
public getLakridsDrag():LakridsDragProxy
	{
		return new LakridsDragProxy(this.lakridsDrag);
	}
public getChocolateDrag():Deco__chocolateDragProxy
	{
		return new Deco__chocolateDragProxy(this.chocolateDrag);
	}
// </ Child Armatures >
// < Animations >
public gotoDefault():void
	{
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
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
