
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Ingredience_yeastProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_yeastProxy";
import {MagreteBowlProxy} from "src/rosa/generated/common/armatures/proxies/MagreteBowlProxy";
import {Ingredience_sugarProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_sugarProxy";
import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {Ingredience_milkProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_milkProxy";
import {Ingredience_flourProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_flourProxy";
import {Ingredience_oilProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_oilProxy";
import {Ingredience_cacaoProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_cacaoProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class Scene6_mixDefaultsProxy extends ProxyBase implements IArmatureProxy {
	

	private ingredience_yeast:dragonBones.Armature;
	private magreteBowl:dragonBones.Armature;
	private ingredience_sugar:dragonBones.Armature;
	private rosa:dragonBones.Armature;
	private ingredience_milk:dragonBones.Armature;
	private ingredience_flour:dragonBones.Armature;
	private ingredience_oil:dragonBones.Armature;
	private ingredience_cacao:dragonBones.Armature;
	private nextArrow:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getIngredience_yeast():Ingredience_yeastProxy
	{
		return new Ingredience_yeastProxy(this.ingredience_yeast);
	}
public getMagreteBowl():MagreteBowlProxy
	{
		return new MagreteBowlProxy(this.magreteBowl);
	}
public getIngredience_sugar():Ingredience_sugarProxy
	{
		Logger.log(this, "Scene6_mixDefaultsProxy getIngredience_sugar ingredience_sugar === "+this.ingredience_sugar);
		return new Ingredience_sugarProxy(this.ingredience_sugar);
	}
public getRosa():RosaProxy
	{
		return new RosaProxy(this.rosa);
	}
public getIngredience_milk():Ingredience_milkProxy
	{
		Logger.log(this, "Scene6_mixDefaultsProxy getIngredience_milk ingredience_milk === "+this.ingredience_milk);
		return new Ingredience_milkProxy(this.ingredience_milk);
	}
public getIngredience_flour():Ingredience_flourProxy
	{
		Logger.log(this, "Scene6_mixDefaultsProxy getIngredience_flour ingredience_flour === "+this.ingredience_flour);
		return new Ingredience_flourProxy(this.ingredience_flour);
	}
public getIngredience_oil():Ingredience_oilProxy
	{
		Logger.log(this, "Scene6_mixDefaultsProxy getIngredience_oil ingredience_oil === "+this.ingredience_oil);
		return new Ingredience_oilProxy(this.ingredience_oil);
	}
public getIngredience_cacao():Ingredience_cacaoProxy
	{
		Logger.log(this, "Scene6_mixDefaultsProxy getIngredience_cacao ingredience_cacao === "+this.ingredience_cacao);
		return new Ingredience_cacaoProxy(this.ingredience_cacao);
	}
public getNextArrow():NextArrowProxy
	{
		return new NextArrowProxy(this.nextArrow);
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
