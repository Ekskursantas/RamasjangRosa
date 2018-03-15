


import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {ISceneView} from "src/rosa/view/ISceneView";
import {Scene10_walksceneProxy} from "src/rosa/generated/common/armatures/proxies/Scene10_walksceneProxy";


import {Model} from "src/rosa/model/Model";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {MainView} from "src/rosa/view/MainView";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {CakeArmProxy} from "../../generated/common/armatures/proxies/CakeArmProxy";
import Rectangle = PIXI.Rectangle;
import Sprite = PIXI.Sprite;
import RenderTexture = PIXI.RenderTexture;

export class Scene_10_WalkView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
	private _walkScene:Scene10_walksceneProxy;
	private cake:Sprite;

	constructor() {
		super();
		this.name = "Scene_10_WalkView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;
		this._walkScene = this._typeddb.buildScene10_walksceneArmature();
		this._walkScene.display.x = 0;
		this._walkScene.display.y = 0;
		this._walkScene.gotoIntro();
		this._walkScene.show(this);
		AudioPlayer.getInstance().stopAllSounds(true);
		AudioPlayer.getInstance().playSound(Model.MUSIC_ROSA_WALKING, 0, Model.VOLUME_MUSIC);
		this._walkScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.playOutro, this);
		this._walkScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);
		this._walkScene.getEndShoe1().display.visible = false;
		this._walkScene.getEndShoe1_0().display.visible = false;

		this.setShoes();
		setTimeout(() => this.setShoes(), 50);
		this.addCake();
	}

	private addCake = ():void => {
		this.cake = Model.getInstance().cake;
		this.cake.x = 416;
		this.cake.y = 137;
		this._walkScene.getPlaceholder().display.addChild(this.cake);
	}

	private playDBSound = (event:dragonBones.EventObject):void => {
		if(event.name === SoundNames.S11_DOOR_OPEN_01){
			setTimeout(() => this.showShoes(), 100);
		}

		try{
			AudioPlayer.getInstance().playSound(event.name);
		} catch (error) {
			Logger.log(this, "ERROR : sound : playDBSound");
		}
	}

	private showShoes = ():void => {
		this._walkScene.getEndShoe1().display.visible = true;
		this._walkScene.getEndShoe1_0().display.visible = true;
	}

	private setShoes = ():void => {
		switch (Model.getInstance().selectedChar){
			case Model.CHAR_BAMSE:
				this._walkScene.getEndShoe1().gotoRed();
				this._walkScene.getEndShoe1_0().gotoRed();
				break;

			case Model.CHAR_CHRISTIAN:
			case Model.CHAR_SKAEG:
				this._walkScene.getEndShoe1().gotoBrown();
				this._walkScene.getEndShoe1_0().gotoBrown();
				break;
			// case Model.CHAR_MILLE:
			// 	this._walkScene.getEndShoe1().gotoMille();
			// 	this._walkScene.getEndShoe1_0().gotoMille();
			// 	break;
		}
	}

	private playOutro = (event:dragonBones.EventObject):void => {
		this._walkScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.playOutro, this);
		this._walkScene.gotoOuttro();

		this.setShoes();
		setTimeout(() => this.setShoes(), 50);

		let sound:Howl;
		switch (Model.getInstance().selectedChar){
			case Model.CHAR_CHRISTIAN:
				sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S11_01_KRISTIAN_SPEAKS_EJ_HVOR_SER_DEN_KAGE_LAEKKER_UD_ER_DEN_TIL_MIG]);
				try{
					sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
						sound.off(AudioPlayer.SOUND_COMPLETE);
						TweenLite.delayedCall(1, this.proceed);
					});
				} catch (error) {
					Logger.log(this, "ERROR : sound : playOutro Model.CHAR_CHRISTIAN onComplete");
				}

				AudioPlayer.getInstance().playSound(SoundNames.S11_01_KRISTIAN_SPEAKS_EJ_HVOR_SER_DEN_KAGE_LAEKKER_UD_ER_DEN_TIL_MIG); //TODO add onComplete
				break;
			case Model.CHAR_BAMSE:
				sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S11_01_BAMSE_SPEAKS_NEJ_EN_LAEKKER_KAGE_DU_HAR_BAGT]);
				try{
					sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
						sound.off(AudioPlayer.SOUND_COMPLETE);
						TweenLite.delayedCall(1, this.proceed);
					});
				} catch (error) {
					Logger.log(this, "ERROR : sound : playOutro Model.CHAR_BAMSE onComplete");
				}
				AudioPlayer.getInstance().playSound(SoundNames.S11_01_BAMSE_SPEAKS_NEJ_EN_LAEKKER_KAGE_DU_HAR_BAGT); //TODO add onComplete

				break;
			case Model.CHAR_SKAEG:
				sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S11_01_SKAEG_SPEAKS_KAGE_TIL_MIG]);
				try{
					sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                        sound.off(AudioPlayer.SOUND_COMPLETE);
                        TweenMax.delayedCall(1, this.proceed);
					});
				} catch (error) {
                    Logger.log(this, "ERROR : sound : playOutro Model.CHAR_SKAEG onComplete");
                    Logger.log(error);
				}

				AudioPlayer.getInstance().playSound(SoundNames.S11_01_SKAEG_SPEAKS_KAGE_TIL_MIG); //TODO add onComplete
				break;
			// case Model.CHAR_MILLE:
			// 	// SoundAS.group("speak").play(SoundNames.S11_1_MILLE_SPEAKS_HYGGELIGT_DU_KOM).soundCompleted.addOnce
			// 	// (function (si:SoundInstance){
			// 	// 	TweenLite.delayedCall(1, this.proceed);
			// 	// });
			// 	setTimeout(() => this.proceed(), 1000); //TODO temp addition
            //
			// 	AudioPlayer.getInstance().playSound(SoundNames.S11_1_MILLE_SPEAKS_HYGGELIGT_DU_KOM); //TODO add onComplete
			// 	break;
		}
	}

	private proceed = ():void => {
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	public teardown():void {

		if(this._walkScene != null) {
			this._walkScene.remove(this);
			this._walkScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.playOutro, this);
			this._walkScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);

			if(this.cake != null) {
				try{
					this._walkScene.getPlaceholder().display.removeChild(this.cake);
					this.cake = null;
				} catch (Error) {
				}
			}
		}
	}
}
