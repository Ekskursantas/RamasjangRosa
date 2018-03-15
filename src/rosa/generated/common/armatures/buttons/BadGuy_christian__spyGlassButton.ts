

import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {SoundNames} from "src/rosa/generated/SoundNames";

import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
import {BadGuy_christian__spyGlassProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__spyGlassProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Logger} from "src/loudmotion/utils/debug/Logger";

export class BadGuy_christian__spyGlassButton extends BadGuy_christian__spyGlassProxy implements IButtonProxy {
	private _selected:boolean;
	private _disabled:boolean;
	private _isToggle:boolean;
	private btn:BadGuy_christian__spyGlassProxy;

	constructor(armature:dragonBones.Armature) {
		super(armature);
		this._selected = false;
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as BadGuy_christian__spyGlassProxy;
		// armature.display.addListener("TOUCH", this.buttonTouched);
		this.armature.display.interactive = true;
		this.armature.display.buttonMode = true;
		this.armature.display.on(TouchEvent.TOUCH, this.touchDown);
		this.armature.display.on(TouchEvent.TOUCH_END, this.touchDone);
		Logger.log(this, "BadGuy_christian__spyGlassButton this.btn constructor == "+this.btn);
	}

	public get isToggle():boolean
	{
		return this._isToggle;
	}
	public set isToggle(value:boolean) {
		this._isToggle = value;
	}
	public get disabled():boolean {
		return this._disabled;
	}
	public set disabled(value:boolean) {
		Logger.log(this, "BadGuy_christian__spyGlassButton this.btn disabled == "+this.btn);
		this._disabled = value;
		// this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display) as BadGuy_christian__spyGlassProxy;
		// this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as BadGuy_christian__spyGlassProxy;
		Logger.log(this, "BadGuy_christian__spyGlassButton set disabled this.btn == "+this.btn+" : this._disabled == "+this._disabled);
		// let btn:BadGuy_christian__spyGlassProxy = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as BadGuy_christian__spyGlassProxy;
		if (this._disabled)
		{
			try{
				this.btn.gotoDisabled();
			} catch (Error) {
				Logger.log(this, "ERROR BadGuy_christian__spyGlassButton this.btn.gotoDisabled()");
			}
		}
		else
		{
			this.btn.gotoUp();
		}
	}
	public get selected():boolean {
		return this._selected;
	}
	public set selected(value:boolean) {
		Logger.log(this, "BadGuy_christian__spyGlassButton this.btn selected == "+this.btn);
		this._selected = value;
		// this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as BadGuy_christian__spyGlassProxy;
		// let btn:BadGuy_christian__spyGlassProxy = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as BadGuy_christian__spyGlassProxy;
		if (this._selected) {
			this.btn.gotoDown();
		} else {
			this.btn.gotoUp();
		}
	}

	private touchDown = (event:TouchEvent):void => {
		if (!this._disabled) {
			this.btn.gotoDown();
		}
	}

	private touchDone = (event:TouchEvent):void => {
		if (!this._disabled) {
			if (this._isToggle) {
				this.selected = !this._selected;
			}
			AudioPlayer.getInstance().playSound(SoundNames.UI_KLIK);
			// this.btn.gotoUp();
			this.emit(ButtonEvent.CLICKED, this);
		}
	}

	private touchOut = (event:TouchEvent):void => {
		if (!this._disabled) {
			this.btn.gotoUp();
		}
	}

	// private buttonTouched(event:TouchEvent):void {
	// 	let touch:Touch = event.getTouch(this.armature.display as PIXI.DisplayObject);
	// 	if (touch) {
	// 		let btn:BadGuy_christian__spyGlassProxy = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as BadGuy_christian__spyGlassProxy;
    //
	// 		if (this._disabled) {
	// 			return;
	// 		}
    //
	// 		switch (touch.phase) {
	// 			case TouchPhase.BEGAN:
	// 				btn.gotoDown();
	// 				break;
	// 			case TouchPhase.ENDED:
	// 				if (this._isToggle)
	// 				{
	// 					this.selected = !this._selected;
	// 				}
    //
	// 				// SoundAS.group("fx").play(SoundNames.UI_KLIK);
	// 				AudioPlayer.getInstance().playSound(SoundNames.UI_KLIK);
    //
	// 				btn.gotoUp();
	// 				this.emit(ButtonEvent.CLICKED, this);
	// 				break;
	// 		}
	// 	}
	// }

	public dispose():void {
		// this.armature.display.removeListener("TOUCH", this.buttonTouched);
		this.armature.display.off(TouchEvent.TOUCH, this.touchDown);
		this.armature.display.off(TouchEvent.TOUCH_END, this.touchDone);
	}
}
