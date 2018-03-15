
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class Scene5_picturesProxy extends ProxyBase implements IArmatureProxy {

	private polaorid0:dragonBones.Armature;
	private polaorid1:dragonBones.Armature;
	private polaorid2:dragonBones.Armature;
	private nextButton:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;

		// Logger.log(this, "Scene5_picturesProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >

public getPolaorid0():PolaroidProxy
	{
		Logger.log(this, "Scene5_picturesProxy getPolaorid0 this.polaorid0 == "+this.polaorid0);
		return new PolaroidProxy(this.polaorid0);
	}
public getPolaorid1():PolaroidProxy
	{
		Logger.log(this, "Scene5_picturesProxy getPolaorid1 this.polaorid1 == "+this.polaorid1);

		return new PolaroidProxy(this.polaorid1);
	}
public getPolaorid2():PolaroidProxy
	{

		Logger.log(this, "Scene5_picturesProxy getPolaorid2 this.polaorid2 == "+this.polaorid2);
		return new PolaroidProxy(this.polaorid2);
	}
public getNextButton():NextArrowProxy
	{
		return new NextArrowProxy(this.nextButton);
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
public gotoHint():void
	{
		if (this._armature.animation.lastAnimationName != "hint")
		{
			this._armature.animation.play("hint");
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
	public get display():Sprite
	{
		return this._armature.display as Sprite;
	}
	public set display(newDisplay:Sprite)
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
	public show(container:Container):void
	{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:Container):void
	{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
