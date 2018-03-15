
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {CakeArmProxy} from "src/rosa/generated/common/armatures/proxies/CakeArmProxy";
import {DecoSelectionProxy} from "src/rosa/generated/common/armatures/proxies/DecoSelectionProxy";
import {DragablesProxy} from "src/rosa/generated/common/armatures/proxies/DragablesProxy";
import {GlazeingButtonProxy} from "src/rosa/generated/common/armatures/proxies/GlazeingButtonProxy";
import {UndoButtonProxy} from "src/rosa/generated/common/armatures/proxies/UndoButtonProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {BadGuy_skaeg__pic_placeholderProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_skaeg__pic_placeholderProxy";
import {ClearButtonProxy} from "src/rosa/generated/common/armatures/proxies/ClearButtonProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";


export class Scene9_DecorationProxy extends ProxyBase implements IArmatureProxy {
	

	private hardCake:dragonBones.Armature;
	private decoSelectionColorkrymmel:dragonBones.Armature;
	private decoSelectionChocolate:dragonBones.Armature;
	private decoSelectionFlag:dragonBones.Armature;
	private decoSelectionBluekrymmel:dragonBones.Armature;
	private decoSelectionCocos:dragonBones.Armature;
	private decoSelectionPineapple:dragonBones.Armature;
	private decoSelectionStrawberry:dragonBones.Armature;
	private decoSelectionKiwi:dragonBones.Armature;
	private decoSelectionLakrids:dragonBones.Armature;
	private dragables:dragonBones.Armature;
	private glazeingButtonRed:dragonBones.Armature;
	private glazeingButtonOrange:dragonBones.Armature;
	private glazeingButtonWhite:dragonBones.Armature;
	private glazeingButtonBlue:dragonBones.Armature;
	private undoButton:dragonBones.Armature;
	private nextArrow:dragonBones.Armature;
	private placeholder:dragonBones.Armature;
	private clearButton:dragonBones.Armature;
	private polaroid:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getHardCake():CakeArmProxy
	{
		return new CakeArmProxy(this.hardCake);
	}
public getDecoSelectionColorkrymmel():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionColorkrymmel);
	}
public getDecoSelectionChocolate():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionChocolate);
	}
public getDecoSelectionFlag():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionFlag);
	}
public getDecoSelectionBluekrymmel():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionBluekrymmel);
	}
public getDecoSelectionCocos():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionCocos);
	}
public getDecoSelectionPineapple():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionPineapple);
	}
public getDecoSelectionStrawberry():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionStrawberry);
	}
public getDecoSelectionKiwi():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionKiwi);
	}
public getDecoSelectionLakrids():DecoSelectionProxy
	{
		return new DecoSelectionProxy(this.decoSelectionLakrids);
	}
public getDragables():DragablesProxy
	{
		return new DragablesProxy(this.dragables);
	}
public getGlazeingButtonRed():GlazeingButtonProxy
	{
		return new GlazeingButtonProxy(this.glazeingButtonRed);
	}
public getGlazeingButtonOrange():GlazeingButtonProxy
	{
		return new GlazeingButtonProxy(this.glazeingButtonOrange);
	}
public getGlazeingButtonWhite():GlazeingButtonProxy
	{
		return new GlazeingButtonProxy(this.glazeingButtonWhite);
	}
public getGlazeingButtonBlue():GlazeingButtonProxy
	{
		return new GlazeingButtonProxy(this.glazeingButtonBlue);
	}
public getUndoButton():UndoButtonProxy
	{
		return new UndoButtonProxy(this.undoButton);
	}
public getNextArrow():NextArrowProxy
	{
		return new NextArrowProxy(this.nextArrow);
	}
public getPlaceholder():BadGuy_skaeg__pic_placeholderProxy
	{
		return new BadGuy_skaeg__pic_placeholderProxy(this.placeholder);
	}
public getClearButton():ClearButtonProxy
	{
		return new ClearButtonProxy(this.clearButton);
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
public gotoOutro():void
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
public gotoOuttro():void
	{
		this.gotoOutro();
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
