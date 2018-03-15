
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Wrongtaste_potatosProxy} from "src/rosa/generated/common/armatures/proxies/Wrongtaste_potatosProxy";
import {MagreteBowlProxy} from "src/rosa/generated/common/armatures/proxies/MagreteBowlProxy";
import {Wrongtaste_strawberriesProxy} from "src/rosa/generated/common/armatures/proxies/Wrongtaste_strawberriesProxy";
import {Wrongtaste_watermelonProxy} from "src/rosa/generated/common/armatures/proxies/Wrongtaste_watermelonProxy";
import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {PandekageogIsProxy} from "src/rosa/generated/common/armatures/proxies/PandekageogIsProxy";
import {Taste_christianProxy} from "src/rosa/generated/common/armatures/proxies/Taste_christianProxy";
import {Taste_2_bamseProxy} from "src/rosa/generated/common/armatures/proxies/Taste_2_bamseProxy";
import {Taste_4_milleProxy} from "src/rosa/generated/common/armatures/proxies/Taste_4_milleProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene7_specialTasteProxy extends ProxyBase implements IArmatureProxy {
	

	private wrongtaste_potatos:dragonBones.Armature;
	private magreteBowl:dragonBones.Armature;
	private wrongtaste_strawberries:dragonBones.Armature;
	private wrongtaste_watermelon:dragonBones.Armature;
	private rosa:dragonBones.Armature;
	private Taste_3_skaeg:dragonBones.Armature;
	private Taste_1_christian:dragonBones.Armature;
	private Taste_2_bamse:dragonBones.Armature;
	private Taste_4_mille:dragonBones.Armature;
	private polaroid:dragonBones.Armature;
	private arrowNext:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}


// < Child Armatures >
public getWrongtaste_potatos():Wrongtaste_potatosProxy
	{
		return new Wrongtaste_potatosProxy(this.wrongtaste_potatos);
	}
public getMagreteBowl():MagreteBowlProxy
	{
		return new MagreteBowlProxy(this.magreteBowl);
	}
public getWrongtaste_strawberries():Wrongtaste_strawberriesProxy
	{
		return new Wrongtaste_strawberriesProxy(this.wrongtaste_strawberries);
	}
public getWrongtaste_watermelon():Wrongtaste_watermelonProxy
	{
		return new Wrongtaste_watermelonProxy(this.wrongtaste_watermelon);
	}
public getRosa():RosaProxy
	{
		return new RosaProxy(this.rosa);
	}
public getTaste_3_skaeg():PandekageogIsProxy
	{
		return new PandekageogIsProxy(this.Taste_3_skaeg);
	}
public getTaste_1_christian():Taste_christianProxy
	{
		return new Taste_christianProxy(this.Taste_1_christian);
	}
public getTaste_2_bamse():Taste_2_bamseProxy
	{
		return new Taste_2_bamseProxy(this.Taste_2_bamse);
	}
public getTaste_4_mille():Taste_4_milleProxy
	{
		return new Taste_4_milleProxy(this.Taste_4_mille);
	}
public getPolaroid():PolaroidProxy
	{
		return new PolaroidProxy(this.polaroid);
	}
public getArrowNext():NextArrowProxy
	{
		return new NextArrowProxy(this.arrowNext);
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
