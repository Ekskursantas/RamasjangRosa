
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ISceneView} from "src/rosa/view/ISceneView";
import {SceneEvent} from "src/rosa/events/SceneEvent";
import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
import {Scene2_pickDisquiseProxy} from "src/rosa/generated/common/armatures/proxies/Scene2_pickDisquiseProxy";
import {CharCardFrame0Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame0Button";
import {CharCardFrame1Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame1Button";
import {CharCardFrame2Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame2Button";
import {CharCardFrame3Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame3Button";
import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {FreeModeButtonButton} from "src/rosa/generated/common/armatures/buttons/FreeModeButtonButton";

import {Model} from "src/rosa/model/Model";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";


import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {DisguiseBubbleChristianButton} from "../../generated/common/armatures/buttons/DisguiseBubbleChristianButton";
import {DisguiseBubbleBamseButton} from "../../generated/common/armatures/buttons/DisguiseBubbleBamseButton";
import {DisguiseBubbleSkaegButton} from "../../generated/common/armatures/buttons/DisguiseBubbleSkaegButton";



export class Scene_03_PickDisguise extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;

	private background:PIXI.Sprite;

	private buttons:IButtonProxy[]; //TODO was Vector.<IButtonProxy>;

	private pickDisguiseScene:Scene2_pickDisquiseProxy;

	private disguiseFrameButton0:CharCardFrame0Button;
	private disguiseFrameButton1:CharCardFrame1Button;
	private disguiseFrameButton2:CharCardFrame2Button;

	// private disguiseFrameButton0:DisguiseBubbleChristianButton;
	// private disguiseFrameButton1:DisguiseBubbleBamseButton;
	// private disguiseFrameButton2:DisguiseBubbleSkaegButton;




	// private disguiseFrameButton3:CharCardFrame3Button;

	constructor() {
		super();
		this.name = "Scene_03_PickDisguise";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;

		// this.background = new Image(AssetLoader.assets.getTexture(Backgrounds.SCENE1_BG));

		this.background = PIXI.Sprite.fromFrame(Backgrounds.SCENE1_BG);
		this.addChild(this.background);
		// this.addChild(this.background);

		this.pickDisguiseScene = this._typeddb.buildScene2_pickDisquiseArmature();
		this.pickDisguiseScene.display.x = 0;
		this.pickDisguiseScene.display.y = 0;
		this.pickDisguiseScene.gotoIntro();
		// this.pickDisguiseScene.show(AssetLoader.getInstance().stage);
		this.pickDisguiseScene.show(this);

		// switch (Model.getInstance().selectedChar) {
		// 	case Model.CHAR_CHRISTIAN:
		// 		this.pickDisguiseScene.getSpeechBubble().gotoChristian();
		// 		break;
		// 	case Model.CHAR_BAMSE:
		// 		this.pickDisguiseScene.getSpeechBubble().gotoBamse();
		// 		break;
		// 	case Model.CHAR_SKAEG:
		// 		this.pickDisguiseScene.getSpeechBubble().gotoSkaeg();
		// 		break;
		// 	// case Model.CHAR_MILLE:
		// 	// 	this.pickDisguiseScene.getSpeechBubble().gotoMille();
		// 	// 	break;
		// }

		// for (let i:number = 0; i <= 3; i++) { //TODO orig
		for (let i:number = 0; i < 3; i++) {
			this.pickDisguiseScene["getCharCardFrame" + i]().getDisquise().gotoIdle();
		}

		// if (Model.getInstance().usedDisguises[0] == false && Model.getInstance().usedDisguises[1] == false && Model.getInstance().usedDisguises[2] == false && Model.getInstance().usedDisguises[3] == false) {
		if (Model.getInstance().usedDisguises[0] == false && Model.getInstance().usedDisguises[1] == false && Model.getInstance().usedDisguises[2] == false) {
			MainView.rosaSpeak(SoundNames.S02_ROSA_01_OK_NU_GAELDER_DET_OM, this.pickDisguiseScene.getRosa());
		} else {
			MainView.rosaSpeak(SoundNames.S03_ROSA_05_OEV_VI_MAA_PROEVE_IGEN, this.pickDisguiseScene.getRosa());
		}

		this.disguiseFrameButton0 = new CharCardFrame0Button(this.pickDisguiseScene.getCharCardFrame0().armature);
		this.disguiseFrameButton1 = new CharCardFrame1Button(this.pickDisguiseScene.getCharCardFrame1().armature);
		this.disguiseFrameButton2 = new CharCardFrame2Button(this.pickDisguiseScene.getCharCardFrame2().armature);
		// this.disguiseFrameButton3 = new CharCardFrame3Button(this.pickDisguiseScene.getCharCardFrame3().armature);

		Logger.log(this, "this.disguiseFrameButton0== "+this.disguiseFrameButton0);
		Logger.log(this, "this.disguiseFrameButton1== "+this.disguiseFrameButton1);
		Logger.log(this, "this.disguiseFrameButton2== "+this.disguiseFrameButton2);

		this.buttons = []; //TODO was new Vector.<IButtonProxy>();
		this.buttons.push(this.disguiseFrameButton0);
		this.buttons.push(this.disguiseFrameButton1);
		this.buttons.push(this.disguiseFrameButton2);
		// this.buttons.push(this.disguiseFrameButton3);

		this.disguiseFrameButton0.on(ButtonEvent.CLICKED, this.charFrameButton0Clicked);
		this.disguiseFrameButton1.on(ButtonEvent.CLICKED, this.charFrameButton1Clicked);
		this.disguiseFrameButton2.on(ButtonEvent.CLICKED, this.charFrameButton2Clicked);
		// this.disguiseFrameButton3.on(ButtonEvent.CLICKED, this.charFrameButton3Clicked);

		// TODO Temp added for testing
		// setTimeout(() => this.charFrameButton2Clicked(null), MainView.DELAY_TEST_NEXT_SCENE);

		setTimeout(() => this.delayedSpeechBubble(), 100);
	}

	private delayedSpeechBubble = ():void => {
		Logger.log(this, "delayedSpeechBubble");
		switch (Model.getInstance().selectedChar) {
			case Model.CHAR_CHRISTIAN:
			this.pickDisguiseScene.getSpeechBubble().gotoChristian();
			break;
			case Model.CHAR_BAMSE:
			this.pickDisguiseScene.getSpeechBubble().gotoBamse();
			break;
			case Model.CHAR_SKAEG:
			this.pickDisguiseScene.getSpeechBubble().gotoSkaeg();
			break;
			// case Model.CHAR_MILLE:
			// 	this.pickDisguiseScene.getSpeechBubble().gotoMille();
			// 	break;
		}

		this.updateButtonsFromModel();
	}

	//private charFrameButton0Clicked(e:ButtonEvent):void {
	private charFrameButton0Clicked = (event:ButtonEvent):void => {
		this.selectDisguise(0);
	}

	//private charFrameButton1Clicked(e:ButtonEvent):void {
	private charFrameButton1Clicked = (event:ButtonEvent):void => {
		this.selectDisguise(1);
	}

	//private charFrameButton2Clicked(e:ButtonEvent):void {
	private charFrameButton2Clicked = (event:ButtonEvent):void => {
		this.selectDisguise(2);
	}

	private selectDisguise(index:number):void {
		Model.getInstance().selectedDisguise = index;
		Model.getInstance().usedDisguises[index] = true;
		// SoundAS.group("music").fadeTo(Model.MUSIC_ROSA_HYGGE, 0, 3000, true);
		// AudioPlayer.getInstance().playMusic(Model.MUSIC_ROSA_HYGGE, 3000, Model.VOLUME_MUSIC);
		AudioPlayer.getInstance().changeMusicVolume(Model.VOLUME_MUSIC_LOW);

		this.disguiseFrameButton0.off(ButtonEvent.CLICKED, this.charFrameButton0Clicked);
		this.disguiseFrameButton1.off(ButtonEvent.CLICKED, this.charFrameButton1Clicked);
		this.disguiseFrameButton2.off(ButtonEvent.CLICKED, this.charFrameButton2Clicked);

		TweenLite.delayedCall(.4, this.playOutro);
	}

	private updateButtonsFromModel():void {
		for (let i:number = 0; i < this.buttons.length; i++) {
			if (Model.getInstance().usedDisguises[i] == true) {
				switch (i){
					case 0:
						this.disguiseFrameButton0.disabled = true;
						this.disguiseFrameButton0.gotoDisabled();
						break;
					case 1:
						this.disguiseFrameButton1.disabled = true;
						this.disguiseFrameButton1.gotoDisabled();
						break;
					case 2:
						this.disguiseFrameButton2.disabled = true;
						this.disguiseFrameButton2.gotoDisabled();
						break;
				}

			}
		}
	}

	private playOutro = ():void => {
		this.pickDisguiseScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this.pickDisguiseScene.gotoOuttro();
	}

	//private proceed(event:dragonBones.EventObject):void {
	private proceed = (event:dragonBones.EventObject):void => {
		this.pickDisguiseScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	public teardown():void {
		Logger.log(this, "Scene_03_PickDisguise teardown");
		this.buttons = null;

		if(this.disguiseFrameButton0 != null) {
			this.disguiseFrameButton0.off(ButtonEvent.CLICKED, this.charFrameButton0Clicked);
			this.disguiseFrameButton0.dispose();
			this.disguiseFrameButton0 = null;
		}

		if(this.disguiseFrameButton1 != null) {
			this.disguiseFrameButton1.off(ButtonEvent.CLICKED, this.charFrameButton1Clicked);
			this.disguiseFrameButton1.dispose();
			this.disguiseFrameButton1 = null;
		}

		if(this.disguiseFrameButton2 != null) {
			this.disguiseFrameButton2.off(ButtonEvent.CLICKED, this.charFrameButton2Clicked);
			this.disguiseFrameButton2.dispose();
			this.disguiseFrameButton2 = null;
		}

		if(this.pickDisguiseScene != null) {
			this.pickDisguiseScene.remove(this);
			this.pickDisguiseScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
			this.pickDisguiseScene = null;
		}

		if(this.background != null) {
			this.removeChild(this.background);
			this.background = null;
		}



	}

}
