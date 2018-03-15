

import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {AssetLoader} from "src/rosa/util/AssetLoader";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {ISceneView} from "src/rosa/view/ISceneView";
import {SceneEvent} from "src/rosa/events/SceneEvent";
import {Scene1_pickCharProxy} from "src/rosa/generated/common/armatures/proxies/Scene1_pickCharProxy";
import {CharCardFrame0Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame0Button";
import {CharCardFrame1Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame1Button";
import {CharCardFrame2Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame2Button";
import {CharCardFrame3Button} from "src/rosa/generated/common/armatures/buttons/CharCardFrame3Button";
import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {FreeModeButtonButton} from "src/rosa/generated/common/armatures/buttons/FreeModeButtonButton";

import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {BackBtn} from "../buttons/BackBtn";
import Sprite = PIXI.Sprite;

export class Scene_02_PickCharView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;

	private background:Sprite;

	private charFrameButton0:CharCardFrame0Button;
	private charFrameButton1:CharCardFrame1Button;
	private charFrameButton2:CharCardFrame2Button;
	// private charFrameButton3:CharCardFrame3Button; //TODO temp taken out - does this card exist?

	private pickcharScene:Scene1_pickCharProxy;

	constructor() {
		super();
		this.name = "Scene_02_PickCharView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;

		// this.background = new Image(AssetLoader.getInstance().assets.getTexture(Backgrounds.SCENE1_BG));
		this.background = Sprite.fromFrame(Backgrounds.SCENE1_BG);
		this.addChild(this.background);
		// AssetLoader.getInstance().stage.addChild(this.background);

		this.pickcharScene = this._typeddb.buildScene1_pickCharArmature();
		this.pickcharScene.display.x = 0;
		this.pickcharScene.display.y = 0;
		this.pickcharScene.display.visible = true;
		this.pickcharScene.gotoIntro();
		// this.pickcharScene.show(AssetLoader.getInstance().stage);
		this.pickcharScene.show(this);

		// setTimeout(() => this.gotoIntro(), 1000); //TODO added for testing
		// setTimeout(() => this.charFrameButton0Clicked(null), MainView.DELAY_TEST_NEXT_SCENE);

		// this.pickcharScene = this._typeddb.buildScene1_pickCharArmature(); //TODO ORIG
		// this.pickcharScene.display.x = 0;
		// this.pickcharScene.display.y = 0;
		// this.pickcharScene.gotoIntro();
		// this.pickcharScene.show(AssetLoader.getInstance().stage);

		AudioPlayer.getInstance().changeMusicVolume(Model.VOLUME_MUSIC_LOW);
		MainView.rosaSpeak(SoundNames.S01_ROSA_01_HEJ_VIL_DU_VAERE, this.pickcharScene.getRosa());

		this.charFrameButton0 = new CharCardFrame0Button(this.pickcharScene.getCharCardFrame0().armature);
		this.charFrameButton1 = new CharCardFrame1Button(this.pickcharScene.getCharCardFrame1().armature);
		this.charFrameButton2 = new CharCardFrame2Button(this.pickcharScene.getCharCardFrame2().armature);
		// this.charFrameButton3 = new CharCardFrame3Button(this.pickcharScene.getCharCardFrame3().armature); //TODO TEMP taken out

		this.charFrameButton0.on(ButtonEvent.CLICKED, this.charFrameButton0Clicked);
		this.charFrameButton1.on(ButtonEvent.CLICKED, this.charFrameButton1Clicked);
		this.charFrameButton2.on(ButtonEvent.CLICKED, this.charFrameButton2Clicked);
	}

	//private charFrameButton0Clicked(e:ButtonEvent):void {
	private charFrameButton0Clicked = (event:ButtonEvent):void => {
		Logger.log(this, "charFrameButton0Clicked");

		Model.getInstance().selectedChar = 0;
		this.loadCharacterBackgrounds();
	}

	//private charFrameButton1Clicked(e:ButtonEvent):void {
	private charFrameButton1Clicked = (event:ButtonEvent):void => {
		Logger.log(this, "charFrameButton1Clicked");

		Model.getInstance().selectedChar = 1;
		this.loadCharacterBackgrounds();
	}

	//private charFrameButton2Clicked(e:ButtonEvent):void {
	private charFrameButton2Clicked = (event:ButtonEvent):void => {
		Logger.log(this, "charFrameButton2Clicked");

		Model.getInstance().selectedChar = 2;
		this.loadCharacterBackgrounds();
	}

	//private charFrameButton3Clicked(e:ButtonEvent):void {
	// private charFrameButton3Clicked = (event:ButtonEvent):void => {
	// 	Logger.log(this, "charFrameButton3Clicked");
    //
	// 	this.removeButtonListeners();
	// 	Model.getInstance().selectedChar = 3;
	// 	this.loadCharacterBackgrounds();
	// }

	// async methods for loading and setup of assets for chosen character

	private loadCharacterBackgrounds():void {
		let characterName:string = Model.getInstance().getSelectedCharName();
		Logger.log(this, "loadCharacterBackgrounds characterName == " + characterName);
		Model.getInstance().charIsSelected = true;
		// AssetLoader.getInstance().loadAdditional(AssetLoader.MEDIA_PATH + "rosa/common/backgrounds-" + characterName, this.loadCharacterAssets);

		this.charFrameButton0.off(ButtonEvent.CLICKED, this.charFrameButton0Clicked);
		this.charFrameButton1.off(ButtonEvent.CLICKED, this.charFrameButton1Clicked);
		this.charFrameButton2.off(ButtonEvent.CLICKED, this.charFrameButton2Clicked);

		AssetLoader.getInstance().loadAdditional(characterName, this.playOutro);
	}

	// private loadCharacterAssets():void {
	// 	let characterName:string = Model.getInstance().getSelectedCharName();
	// 	Logger.log(this, "loadCharacterAssets(" + characterName + ")");
	// 	// AssetLoader.getInstance().loadAdditional(AssetLoader.MEDIA_PATH + "levels/" + characterName, this.addAtlasToDragonBones);
	// }
    //
	// private addAtlasToDragonBones():void {
	// 	Logger.log(this, "addAtlasToDragonBones");
	// 	let characterName:string = Model.getInstance().getSelectedCharName();
	// 	let textureName:string = "texture-" + characterName;
	// 	// let textureAtlas:TextureAtlas = AssetLoader.getInstance().assets.getTextureAtlas(textureName); //TODO
	// 	// this._typeddb._factory.addTextureAtlas(textureAtlas, characterName); //TODO
	// 	this.playOutro();
	// }

	private playOutro = ():void => {
		Logger.log(this, "Scene_02_PickCharView playOutro");
		this.pickcharScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this.pickcharScene.gotoOuttro();
	}

	//private proceed(event:dragonBones.EventObject):void {
	private proceed = (event:dragonBones.EventObject):void => {
		Logger.log(this, "Scene_02_PickCharView  proceed");
		// SoundAS.group("speak").stopAll(); //TODO
		AudioPlayer.getInstance().stopAllSounds();

		// Model.getInstance().usedDisguises[0] = false;
		// Model.getInstance().usedDisguises[1] = false;
		// Model.getInstance().usedDisguises[2] = false;
		// Model.getInstance().usedDisguises[3] = false;

		// this.pickcharScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.proceed, this); //TODO Orig
		this.pickcharScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);

		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
		//let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.JUMP, Model.SCENE_CUT_CAKE, true);
		// dispatchEvent(sceneEvent); //TODO
	}

	public teardown():void {

		Model.getInstance().usedDisguises[0] = false;
		Model.getInstance().usedDisguises[1] = false;
		Model.getInstance().usedDisguises[2] = false;

		if(this.charFrameButton0 != null) {
			this.charFrameButton0.off(ButtonEvent.CLICKED, this.charFrameButton0Clicked);
			this.charFrameButton0.dispose();
			this.charFrameButton0 = null;
		}

		if(this.charFrameButton1 != null) {
			this.charFrameButton1.off(ButtonEvent.CLICKED, this.charFrameButton1Clicked);
			this.charFrameButton1.dispose();
			this.charFrameButton1 = null;
		}

		if(this.charFrameButton2 != null) {
			this.charFrameButton2.off(ButtonEvent.CLICKED, this.charFrameButton2Clicked);
			this.charFrameButton2.dispose();
			this.charFrameButton2 = null;
		}

		// this.charFrameButton3.dispose();
		// this.pickcharScene.remove(AssetLoader.getInstance().stage);

		if(this.pickcharScene != null) {
			try{
				this.pickcharScene.remove(this);
			} catch (Error) {}
			try{
				this.pickcharScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
			} catch (Error) {}
		}

		if(this.background != null) {
			this.removeChild(this.background);
			this.background = null;
		}


		// if(this.introScene != null) {
		// 	try{
		// 		this.introScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		// 		this.introScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.jumpToPhotos, this);
		// 		this.introScene.remove(this);
		// 	} catch (Error) {
		// 	}
		// }
	}
}
