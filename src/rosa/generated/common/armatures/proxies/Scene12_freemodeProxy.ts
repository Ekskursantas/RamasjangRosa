
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Pic_placeholderProxy} from "src/rosa/generated/common/armatures/proxies/Pic_placeholderProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {HoldingHandLeftProxy} from "src/rosa/generated/common/armatures/proxies/HoldingHandLeftProxy";
import {FreeModeButtonProxy} from "src/rosa/generated/common/armatures/proxies/FreeModeButtonProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {ReplayButtonProxy} from "src/rosa/generated/common/armatures/proxies/ReplayButtonProxy";
import {ShootPictureProxy} from "src/rosa/generated/common/armatures/proxies/ShootPictureProxy";
import {WalkingTilesProxy} from "src/rosa/generated/common/armatures/proxies/WalkingTilesProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene12_freemodeProxy extends ProxyBase implements IArmatureProxy {
	

	private placeholder:dragonBones.Armature;
	private polaorid2:dragonBones.Armature;
	private holdingHandLeft:dragonBones.Armature;
	private holdingHandLeft0:dragonBones.Armature;
	private polaorid1:dragonBones.Armature;
	private polaorid0:dragonBones.Armature;
	private camButton:dragonBones.Armature;
	private nextArrow:dragonBones.Armature;
	private freeModeButton:dragonBones.Armature;
	private shootPicture:dragonBones.Armature;
	private replayButton:dragonBones.Armature;
	private walkingTiles:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getPlaceholder():Pic_placeholderProxy
	{
		return new Pic_placeholderProxy(this.placeholder);
	}
public getPolaorid2():PolaroidProxy
	{
		return new PolaroidProxy(this.polaorid2);
	}
public getHoldingHandLeft():HoldingHandLeftProxy
	{
		return new HoldingHandLeftProxy(this.holdingHandLeft);
	}
public getHoldingHandLeft0():HoldingHandLeftProxy
	{
		return new HoldingHandLeftProxy(this.holdingHandLeft0);
	}
public getPolaorid1():PolaroidProxy
	{
		return new PolaroidProxy(this.polaorid1);
	}
public getPolaorid0():PolaroidProxy
	{
		return new PolaroidProxy(this.polaorid0);
	}
public getCamButton():FreeModeButtonProxy
	{
		return new FreeModeButtonProxy(this.camButton);
	}
public getNextArrow():NextArrowProxy
	{
		return new NextArrowProxy(this.nextArrow);
	}
public getFreeModeButton():FreeModeButtonProxy
	{
		return new FreeModeButtonProxy(this.freeModeButton);
	}
public getReplayButton():ReplayButtonProxy
	{
		return new ReplayButtonProxy(this.replayButton);
	}
public getShootPicture():ShootPictureProxy
	{
		return new ShootPictureProxy(this.shootPicture);
	}
public getWalkingTiles():WalkingTilesProxy
	{
		return new WalkingTilesProxy(this.walkingTiles);
	}
// </ Child Armatures >
// < Animations >
public gotoIntro():void
	{
		if (this._armature.animation.lastAnimationName != "intro")
		{
			this._armature.animation.play("intro");
		}
	}
public gotoLoop():void
	{
		if (this._armature.animation.lastAnimationName != "loop")
		{
			this._armature.animation.play("loop");
		}
	}
public gotoShoot():void
	{
		if (this._armature.animation.lastAnimationName != "shoot")
		{
			this._armature.animation.play("shoot");
		}
	}
public gotoButton():void
	{
		if (this._armature.animation.lastAnimationName != "button")
		{
			this._armature.animation.play("button");
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
