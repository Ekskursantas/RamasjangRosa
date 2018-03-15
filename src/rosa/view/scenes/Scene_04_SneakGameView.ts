

import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ISceneView} from "src/rosa/view/ISceneView";
import {SceneEvent} from "src/rosa/events/SceneEvent";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {BarometerProxy} from "src/rosa/generated/common/armatures/proxies/BarometerProxy";
import {TouchGuideProxy} from "src/rosa/generated/common/armatures/proxies/TouchGuideProxy";
import {BadGuy_christian__scene3_spySceneWalk_christianProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__scene3_spySceneWalk_christianProxy";
import {BadGuy_skaeg__scene3_spySceneWalk_skaegProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_skaeg__scene3_spySceneWalk_skaegProxy";
import {BadGuy_mille__scene3_spySceneWalk_milleProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_mille__scene3_spySceneWalk_milleProxy";

import {ISpyScene} from "src/rosa/interfaces/ISpyScene";
import {IDisguise} from "src/rosa/interfaces/IDisguise";
import {StartButtonGameButton} from "src/rosa/generated/common/armatures/buttons/StartButtonGameButton";
import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {FreeModeButtonButton} from "src/rosa/generated/common/armatures/buttons/FreeModeButtonButton";
import {Model} from "src/rosa/model/Model";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";


import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import Matrix = PIXI.Matrix;
import {ticker} from "pixi.js";
import Graphics = PIXI.Graphics;

export class Scene_04_SneakGameView extends SceneBase implements ISceneView {
	private static MOVEMENT_PER_FRAME_DECAY:number = 0.5;
	private static MOVEMENT_ALERT_LIMIT:number = 80; //80
	private static MOVEMENT_PER_CLICK:number = 10; // 10
	private static MAXIMUM_MOVEMENT:number = 100; // 100

	private static TIMESCALE_FACTOR:number = 200;
	private static MOVEMENT_FACTOR:number = 110;

	private static FACTOR:number = 0.25;
	private static EASING_FACTOR:number = 0.5;

	private static MUSIC_VOLUME:number = 0.4;

	private _typeddb:TypedDBFactory;
	private background:Sprite;
	private _sneakScene:ISpyScene;

	private _movableSprite:Sprite;

	private _movementSpeed:number;
	private _charMovementSpeed:number;
	private _characterIsWatching:boolean;

	private disquise:IDisguise;
	private character:IArmatureProxy;

	private progressMeter:BarometerProxy;
	private startButton:StartButtonGameButton;

	private backgroundName:string;

	private blackQuad:Graphics;

	private matrixCopy:Matrix;
    private touchGuide: TouchGuideProxy;

	constructor() {
		super();
		this.name = "Scene_04_SneakGameView";
	}

	public setup(typeddb:TypedDBFactory):void {
		Logger.log(this, "Scene_04_SneakGameView  setup  typeddb == "+typeddb);
		this.alpha = 1;

		this._typeddb = typeddb;

		this.backgroundName = "Scene3" + "_" + Model.getInstance().getSelectedCharName() + "_bg";
		this.background = Sprite.fromFrame(this.backgroundName);

		this._sneakScene = this.getSpyScene();
		Logger.log(this, "Scene_04_SneakGameView  setup  this._sneakScene == "+this._sneakScene);
		this._sneakScene.gotoIntro();

		try{
			this.character = this._sneakScene["getCharacter"]();
			Logger.log(this, "Scene_04_SneakGameView  setup  this.character == "+this.character);
			this.character["gotoIdle"]();
		} catch (error) {
			Logger.log(this, "Scene_04_SneakGameView ERROR this.character = this._sneakScene[getCharacter]()");
		}

		this._movableSprite = new Sprite();
		this._movableSprite.addChild(this.background);
		this._sneakScene.show(this._movableSprite);

		this.disquise = this.getDisguise();
		this.disquise.show(this._movableSprite);
		this.disquise.gotoSit();
		this.disquise.display.x = 200;
		this.disquise.display.y = 600;

		this.addChild(this._movableSprite);

		this._movementSpeed = 50;
		this._charMovementSpeed = 50;
		this._characterIsWatching = false;

		this.progressMeter = this._typeddb.buildBarometerArmature();
		this.progressMeter.show(this);
        // this.progressMeter.display.x = StarlingHelper.rightXOffsetVirtual - 105; //TODO
        this.progressMeter.display.x = AssetLoader.STAGE_WIDTH - 105 - Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2));
        this.progressMeter.display.y = Math.floor(this.progressMeter.display.height * .5) - Math.abs(Math.floor(AssetLoader.getInstance().ratioY / 2));
		this.progressMeter.display.rotation = Math.PI;
		this.progressMeter.gotoStatic();

		this.touchGuide = this._typeddb.buildTouchGuideArmature();
		this.touchGuide.show(this);
		this.touchGuide.display.x = AssetLoader.STAGE_WIDTH / 2;
		this.touchGuide.display.y = AssetLoader.STAGE_HEIGHT - (this.touchGuide.display.height / 2);
		this.touchGuide.display.visible = false;

		this.startButton = this._typeddb.buildStartButtonGameButton();
		this.startButton.show(this);
        this.startButton.display.x = AssetLoader.STAGE_WIDTH/2;
        this.startButton.display.y = AssetLoader.STAGE_HEIGHT/2;

        let ratio = AssetLoader.getInstance().renderer.view.clientWidth / AssetLoader.getInstance().renderer.view.clientHeight;
        this.startButton.display.width = AssetLoader.STAGE_WIDTH * ratio;
        this.startButton.display.height = AssetLoader.STAGE_HEIGHT * ratio;
        
		this.startButton.gotoUp();
		this.startButton.on(ButtonEvent.CLICKED, this.onStartButtonClicked);

		// SoundAS.group("speak").stopAll();
		// SoundAS.group("speak").play(SoundNames.S02_ROSA_02_NU_SKAL_VI_SNIGE_OS_FORBI);

		AudioPlayer.getInstance().stopAllSounds(true);
		AudioPlayer.getInstance().playSound(SoundNames.S02_ROSA_02_NU_SKAL_VI_SNIGE_OS_FORBI);

		// TODO Temp added for testing
		// setTimeout(() => this.playOutroProceed(), MainView.DELAY_TEST_NEXT_SCENE);
	}

	//private onEnterFrame(e:Event):void {
	// private onEnterFrame = (event:Event):void => {
	private onEnterFrame = (deltaTime):void => {
		// let matrix:PIXI.Matrix = this.progressMeter.getBAR().display.transformationMatrix; //TODO
		// let matrix:PIXI.Matrix = this.progressMeter.getBAR().display.localTransform;

		let movementValue:number = this._charMovementSpeed / Scene_04_SneakGameView.MOVEMENT_ALERT_LIMIT;
		let value:number = Math.min(movementValue, 1);

		// Logger.log(this, "this._charMovementSpeed ==== " + this._charMovementSpeed + "   movementValue ==== " + movementValue + "   value ==== " + value + " : this._movementSpeed == " + this._movementSpeed);

		let ib:Sprite = (this.progressMeter.getBAR().display as PIXI.Sprite).getChildAt(0) as Sprite;
		if (value > 0.8) {
			// ib.color = 0xFF0000; //TODO
			ib.tint = 0xFF0000;
		} else {
			// ib.color = 0xFFFFFF; //TODO
			ib.tint = 0xFFFFFF;
		}

		// if (this.matrixCopy == null) {
		// 	this.matrixCopy = matrix.clone();
		// }
		// matrix = this.matrixCopy.clone();
		// matrix.scale(value, value);

		// this.progressMeter.getBAR().display.transformationMatrix = matrix; //TODO
		// this.progressMeter.getBAR().display.localTransform = matrix; //TODO

		this.progressMeter.getBAR().display.scale.x = value;
		this.progressMeter.getBAR().display.scale.y = value;

		if (this._movementSpeed >= Scene_04_SneakGameView.MOVEMENT_PER_FRAME_DECAY) {
			this._movementSpeed -= Scene_04_SneakGameView.MOVEMENT_PER_FRAME_DECAY;
		}
		if (this._movementSpeed < Scene_04_SneakGameView.MOVEMENT_PER_FRAME_DECAY){
			this._movementSpeed = 0;
		}

		if (this._movementSpeed <= Scene_04_SneakGameView.MOVEMENT_PER_FRAME_DECAY) {
			this.disquise.armature.animation.timeScale = 1;
			//dragonBones.WorldClock.clock.timeScale = 1;
			this.disquise.gotoIdle();
		} else {
			this.disquise.armature.animation.timeScale = this._charMovementSpeed / (Scene_04_SneakGameView.TIMESCALE_FACTOR * Scene_04_SneakGameView.FACTOR);
			//dragonBones.WorldClock.clock.timeScale = this._charMovementSpeed / (TIMESCALE_FACTOR * FACTOR);
		}

		this._charMovementSpeed += (this._movementSpeed - this._charMovementSpeed) * Scene_04_SneakGameView.EASING_FACTOR;
		this._charMovementSpeed = this._charMovementSpeed < 0.1 ? 0.1 : this._charMovementSpeed;

		if (this._charMovementSpeed > Scene_04_SneakGameView.MOVEMENT_ALERT_LIMIT) {
			if (Model.getInstance().doesSelectedDisguiseMatchCharacter()) {
				this.characterTurnsAroundAndBack();
			} else {
				this.characterTurnsAround();
			}
		}

		if (this.disquise.armature.animation.lastAnimationName == "walk") {
			this.disquise.display.x += (this._charMovementSpeed / (Scene_04_SneakGameView.MOVEMENT_FACTOR * Scene_04_SneakGameView.FACTOR));
		}

		this.onTweenUpdate();
	}


	//private onStartButtonClicked(event:ButtonEvent):void {
	private onStartButtonClicked = (event:ButtonEvent):void => {
		// SoundAS.group("music").stopAll();
		AudioPlayer.getInstance().stopAllSounds(true);

		let musicName:string = (Model.getInstance().selectedChar == Model.CHAR_CHRISTIAN) ? Model.MUSIC_ROSA_SPION_URBAN : Model.MUSIC_ROSA_SPION_NATURE;
		// SoundAS.group("music").play(musicName, MUSIC_VOLUME, 0, 10, false, true, true);
		AudioPlayer.getInstance().playMusic(musicName, 1000, Scene_04_SneakGameView.MUSIC_VOLUME);

		Logger.log(this, "Scene_04_SneakGameView musicName == "+musicName);

		TweenLite.delayedCall(5, this.playTomgangSound);

		this.startButton.display.visible = false;
		this.startButton.off(ButtonEvent.CLICKED, this.onStartButtonClicked);

		this.touchGuide.display.visible = true;
		this.touchGuide.gotoLoop();

		// this.addListener("ENTER_FRAME", this.onEnterFrame);
		// this.addListener(TouchEvent.TOUCH, this.onTouch);
		// this.on("ENTER_FRAME", this.onEnterFrame);

		ticker.shared.add( this.onEnterFrame, this );
		this.on(TouchEvent.TOUCH, this.onTouch);

		// TODO Temp added for testing
		// setTimeout(() => this.playOutroProceed(), MainView.DELAY_TEST_NEXT_SCENE);
	}

	private onClockRunsOut(event:dragonBones.EventObject):void {
		if (Model.getInstance().doesSelectedDisguiseMatchCharacter()) {
			// you cannot be spotted with the right disguise
		} else {
			this.characterTurnsAround();
		}
	}

	/*
	private idleAnimationComplete(event:dragonBones.EventObject):void
	{
		let animationId:number = Math.floor(Math.random() * 3 + 1);
		character["gotoIdle"]();
	}
	*/

	private getDisguise():IDisguise {
		let proxyDisguise:IDisguise;
		switch (Model.getInstance().selectedDisguise) {
			case Model.CHAR_CHRISTIAN:
				proxyDisguise = this._typeddb.buildDisquise_christianArmature() as IDisguise;
				break;
			case Model.CHAR_BAMSE:
				proxyDisguise = this._typeddb.buildDisquise_bamseArmature() as IDisguise;
				break;
			case Model.CHAR_SKAEG:
				proxyDisguise = this._typeddb.buildDisquise_skaegArmature() as IDisguise;
				break;
			// case Model.CHAR_MILLE:
			// 	proxyDisguise = this._typeddb.buildDisquise_milleArmature() as IDisguise;
			// 	break;
		}
		Logger.log(this, "Scene_04_SneakGameView getDisguise  proxyDisguise == "+proxyDisguise+" : Model.getInstance().selectedDisguise === "+Model.getInstance().selectedDisguise);
		Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_christian__scene3_spySceneWalk_christianArmature() == "+this._typeddb.buildBadGuy_christian__scene3_spySceneWalk_christianArmature());
		Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_bamse__scene3_spySceneWalk_bamseArmature() == "+this._typeddb.buildBadGuy_bamse__scene3_spySceneWalk_bamseArmature());
		Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_skaeg__scene3_spySceneWalk_skaegArmature() == "+this._typeddb.buildBadGuy_skaeg__scene3_spySceneWalk_skaegArmature());
		return proxyDisguise;
	}

	private getSpyScene():ISpyScene {
		let proxyDisguise:ISpyScene;
		switch (Model.getInstance().selectedChar) {
			case Model.CHAR_CHRISTIAN:
				proxyDisguise = this._typeddb.buildBadGuy_christian__scene3_spySceneWalk_christianArmature() as ISpyScene;
				break;
			case Model.CHAR_BAMSE:
				proxyDisguise = this._typeddb.buildBadGuy_bamse__scene3_spySceneWalk_bamseArmature() as ISpyScene;
				break;
			case Model.CHAR_SKAEG:
				proxyDisguise = this._typeddb.buildBadGuy_skaeg__scene3_spySceneWalk_skaegArmature() as ISpyScene;
				break;
			// case Model.CHAR_MILLE:
			// 	proxyDisguise = this._typeddb.buildBadGuy_mille__scene3_spySceneWalk_milleArmature() as ISpyScene;
			// 	break;
		}
		Logger.log(this, "Scene_04_SneakGameView getSpyScene  proxyDisguise == "+proxyDisguise+" : Model.getInstance().selectedChar == "+Model.getInstance().selectedChar);
		Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_christian__scene3_spySceneWalk_christianArmature() == "+this._typeddb.buildBadGuy_christian__scene3_spySceneWalk_christianArmature());
		Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_bamse__scene3_spySceneWalk_bamseArmature() == "+this._typeddb.buildBadGuy_bamse__scene3_spySceneWalk_bamseArmature());
		Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_skaeg__scene3_spySceneWalk_skaegArmature() == "+this._typeddb.buildBadGuy_skaeg__scene3_spySceneWalk_skaegArmature());
		// Logger.log(this, "Scene_04_SneakGameView this._typeddb.buildBadGuy_mille__scene3_spySceneWalk_milleArmature() == "+this._typeddb.buildBadGuy_mille__scene3_spySceneWalk_milleArmature());
		return proxyDisguise;
	}

	private characterTurnsAroundAndBack = ():void => {
		Logger.log(this, "Scene_04_SneakGameView  characterTurnsAroundAndBack");
		this.spotted();
		TweenLite.delayedCall(7, this.characterTurnsBack);
	}

	private characterTurnsBack = ():void => {
		Logger.log(this, "Scene_04_SneakGameView  characterTurnsBack");
		this._characterIsWatching = false;

		// SoundAS.group("music").fadeAllTo(Scene_04_SneakGameView.MUSIC_VOLUME, 1000);
		// AudioPlayer.getInstance().fadeAllTo(Scene_04_SneakGameView.MUSIC_VOLUME, 1000);
		AudioPlayer.getInstance().changeMusicVolume(Scene_04_SneakGameView.MUSIC_VOLUME);

		// // SoundAS.fadeTo(SoundNames.S3_TOMGANG, 1, 10, false);
		TweenLite.killDelayedCallsTo(this.playTomgangSound);
		TweenLite.delayedCall(3, this.playTomgangSound);

		try{
			Logger.log(this, "Scene_04_SneakGameView  characterTurnsBack  this.character == "+this.character);
		} catch (error) {
			Logger.log(this, "Scene_04_SneakGameView ERROR characterTurnsBack this.character");
		}

		try{
			this.character["gotoIdle"]();
		} catch (error) {
			Logger.log(this, "Scene_04_SneakGameView ERROR characterTurnsBack this.character = this.character[gotoIdle]()");
		}

		this.progressMeter.gotoStatic();
	}

	private characterTurnsAround = ():void => {
		Logger.log(this, "Scene_04_SneakGameView  characterTurnsAround");
		this.spotted();
		TweenLite.delayedCall(5, this.playOutroBack);
	}

	private spotted = ():void => {
		this._movementSpeed = 0;
		this._characterIsWatching = true;

		TweenLite.killDelayedCallsTo(this.playTomgangSound);

		// SoundAS.group("music").fadeAllTo(0.02, 10, false);
		// SoundAS.group("fx").play(SoundNames.SPOTTED);

		// AudioPlayer.getInstance().fadeAllTo(0.02, 10);
		AudioPlayer.getInstance().changeMusicVolume(Model.VOLUME_MUSIC_LOW);
		AudioPlayer.getInstance().playSound(SoundNames.SPOTTED);

		TweenLite.delayedCall(1, this.playHovSound);

		this.disquise.gotoSit();
		this.progressMeter.gotoBusted();

		try{
			Logger.log(this, "Scene_04_SneakGameView  spotted  this.character == "+this.character);
			this.character["gotoSpottet"]();
		} catch (error) {
			Logger.log(this, "Scene_04_SneakGameView ERROR spotted this.character = this.character[gotoSpottet]()");
		}
	}

	private playTomgangSound = ():void => {
		// SoundAS.group("speak").stopAll();
		AudioPlayer.getInstance().stopAllSounds();
		let snd:Howl;
		Logger.log(this, "playTomgang");
		switch (Model.getInstance().selectedChar) {
			case Model.CHAR_CHRISTIAN:
				this.prebenTalk();
				snd = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_KRISTIAN_SPEAKS_IDLE1,SoundNames.S03_KRISTIAN_SPEAKS_IDLE2,SoundNames.S03_KRISTIAN_SPEAKS_IDLE3]); //TODO add onComplete
				try{
					snd.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
						snd.off(AudioPlayer.SOUND_COMPLETE);
						TweenLite.delayedCall(0.1, this.prebenIdle);
						TweenLite.delayedCall(3, this.playTomgangSound);
					});
				} catch (error) {
					Logger.log(this, "ERROR : sound : playTomgangSound Model.CHAR_CHRISTIAN onComplete");
				}
				break;
			case Model.CHAR_BAMSE:
				snd = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_BAMSE_SPEAKS_INTRO_BITE00_MOLODI,SoundNames.S03_BAMSE_SPEAKS_INTRO_BITE01_JODLELOHOOHOO,SoundNames.S03_BAMSE_SPEAKS_INTRO_BITE02_JODLESANGEN,SoundNames.S03_BAMSE_SPEAKS_INTRO_BITE04_BUMMELUMMELUM,SoundNames.S03_BAMSE_SPEAKS_INTRO_BITE05_SULTEN]); //TODO add onComplete
				try{
					snd.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                    snd.off(AudioPlayer.SOUND_COMPLETE);
						TweenLite.delayedCall(3, this.playTomgangSound);
					});
				} catch (error) {
					Logger.log(this, "ERROR : sound : playTomgangSound Model.CHAR_BAMSE onComplete");
				}
				break;
			case Model.CHAR_SKAEG:
				snd = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_SKAEG_SPEAKS_EN_TO_OG_DER_ER_TRE,SoundNames.S03_SKAEG_SPEAKS_FIRE_OG_FEM_OG_SEKS_ER_DEROVRE,SoundNames.S03_SKAEG_SPEAKS_HVOR_POKKER_ER_SYV]); //TODO add onComplete
				try{
					snd.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
						snd.off(AudioPlayer.SOUND_COMPLETE);
						TweenLite.delayedCall(3, this.playTomgangSound);
					});
				} catch (error) {
					Logger.log(this, "ERROR : sound : playTomgangSound Model.CHAR_SKAEG onComplete");
				}
				break;
			// case Model.CHAR_MILLE:
			// 	AudioPlayer.getInstance().playRandomSound([SoundNames.S03_MILLE_SPEAKS_HVORFOR_VIRKER_KAMERAET_NU_IKKE, SoundNames.S03_MILLE_SPEAKS_PAS_PAA_FUGLEN_NOEDLANDER, SoundNames.S03_MILLE_SPEAKS_GRIBE_HIMSTERGIMSFUGLEN]); //TODO add onComplete
			// 	// SoundAS.group("speak").playRandomSound([SoundNames.S03_MILLE_SPEAKS_HVORFOR_VIRKER_KAMERAET_NU_IKKE, SoundNames.S03_MILLE_SPEAKS_PAS_PAA_FUGLEN_NOEDLANDER, SoundNames.S03_MILLE_SPEAKS_GRIBE_HIMSTERGIMSFUGLEN]).soundCompleted.addOnce
			// 	// (function (si:SoundInstance){
			// 	// 	TweenLite.delayedCall(3, this.playTomgangSound);
			// 	// });
			// 	break;
		}
	}

	private playHovSound = ():void => {
		// SoundAS.group("speak").stopAll();
		AudioPlayer.getInstance().stopAllSounds();
		let sound:Howl;
		let match:boolean = Model.getInstance().doesSelectedDisguiseMatchCharacter();
			Logger.log(this, "playHovSound match == "+match);
		if (match) {
			switch (Model.getInstance().selectedChar) {
				case Model.CHAR_CHRISTIAN:
					this.prebenIdle();
					this.kristianTalk();
					sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_KRISTIAN_SPEAKS_HOERTE_DU_DET, SoundNames.S03_KRISTIAN_SPEAKS_HOV_HVAD_VAR_DET, SoundNames.S03_KRISTIAN_SPEAKS_SIKKE_EN_UNDERLIG_LYD]); //TODO add onComplete
					//Logger.log(this, "playHovSound CHRISTIAN sound == "+sound+" : "+sound.uniqueId);
					try{
						sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
							Logger.log(this, "playHovSound sound  = "+sound+" : this == "+this);
							sound.off(AudioPlayer.SOUND_COMPLETE);
							TweenLite.delayedCall(0.1, this.kristianIdle);
						});
					} catch (error) {
						Logger.log(this, "ERROR : sound : playHovSound Model.CHAR_CHRISTIAN onComplete");
					}

					// SoundAS.group("speak").playRandomSound([SoundNames.S03_KRISTIAN_SPEAKS_HOERTE_DU_DET, SoundNames.S03_KRISTIAN_SPEAKS_HOV_HVAD_VAR_DET, SoundNames.S03_KRISTIAN_SPEAKS_SIKKE_EN_UNDERLIG_LYD]).soundCompleted.addOnce
					// (function (si:SoundInstance){
					// 	TweenLite.delayedCall(0.1, this.kristianIdle);
					// });
				break;
				case Model.CHAR_BAMSE:
					// AudioPlayer.getInstance().playSound(SoundNames.S03_BAMSE_SPEAKS_HOV_HVAD_VAR_DET_2);
					sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_BAMSE_SPEAKS_HOV_HVAD_VAR_DET, SoundNames.S03_BAMSE_SPEAKS_HOV_HVAD_VAR_DET_2]);
					//Logger.log(this, "playHovSound BAMSE sound == "+sound+" : "+sound.uniqueId);
					// SoundAS.group("speak").playRandomSound([SoundNames.S03_BAMSE_SPEAKS_HOV_HVAD_VAR_DET, SoundNames.S03_BAMSE_SPEAKS_HOV_HVAD_VAR_DET_2]);
				break;
				case Model.CHAR_SKAEG:
					this.skaegTalk();
					sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_SKAEG_SPEAKS_HMMM_MYSTISK, SoundNames.S03_SKAEG_SPEAKS_HOV_HVAD_VAR_DET, SoundNames.S03_SKAEG_SPEAKS_SIKKE_EN_UMDERLIG_LYD]); //TODO add onComplete
					//Logger.log(this, "playHovSound SKAEG sound == "+sound+" : "+sound.uniqueId);
					try{
						sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
							sound.off(AudioPlayer.SOUND_COMPLETE);
							TweenLite.delayedCall(0.1, this.skaegIdle);
						});
					} catch (error) {
						Logger.log(this, "ERROR : sound : playHovSound Model.CHAR_SKAEG onComplete");
					}

					// SoundAS.group("speak").playRandomSound([SoundNames.S03_SKAEG_SPEAKS_HMMM_MYSTISK, SoundNames.S03_SKAEG_SPEAKS_HOV_HVAD_VAR_DET, SoundNames.S03_SKAEG_SPEAKS_SIKKE_EN_UMDERLIG_LYD]).soundCompleted.addOnce
					// (function (si:SoundInstance){
					// 	TweenLite.delayedCall(0.1, this.skaegIdle);
					// });;
				break;
				// case Model.CHAR_MILLE:
				// 	this.milleTalk();
				// 	AudioPlayer.getInstance().playRandomSound([SoundNames.S03_MILLE_SPEAKS_HVAD_ER_DET_FOR_EN_UNDERLIG_LYD, SoundNames.S03_MILLE_SPEAKS_JEG_SYNES_JEG_HORTE_NOGET]); //TODO add onComplete
                //
				// 	// SoundAS.group("speak").playRandomSound([SoundNames.S03_MILLE_SPEAKS_HVAD_ER_DET_FOR_EN_UNDERLIG_LYD, SoundNames.S03_MILLE_SPEAKS_JEG_SYNES_JEG_HORTE_NOGET]).soundCompleted.addOnce
				// 	// (function (si:SoundInstance){
				// 	// 	TweenLite.delayedCall(0.1, this.milleIdle);
				// 	// });
				// 	break;
			}
		} else {
			switch (Model.getInstance().selectedChar) {
				case Model.CHAR_CHRISTIAN:
					this.kristianTalk();
					sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_KRISTIAN_SPEAKS_HVAD_I_ALVERDEN_IKKE_SET_FOER]);
					try{
						sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
							sound.off(AudioPlayer.SOUND_COMPLETE);
							TweenLite.delayedCall(0.1, this.kristianIdle);
							TweenLite.delayedCall(1, this.playOutroBack);
						});
					} catch (error) {
						Logger.log(this, "ERROR : sound : playHovSound Model.CHAR_CHRISTIAN onComplete");
					}
					// SoundAS.group("speak").playRandomSound([SoundNames.S03_KRISTIAN_SPEAKS_HVAD_I_ALVERDEN_IKKE_SET_FOER]).soundCompleted.addOnce
					// (function (si:SoundInstance){
					// 	TweenLite.delayedCall(0.1, this.kristianIdle);
					// 	TweenLite.delayedCall(1, this.playOutroBack);
					// });
					break;
				case Model.CHAR_BAMSE:
					sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_BAMSE_SPEAKS_IKKE_SET_FOER]);
					//Logger.log(this, "playHovSound BAMSE sound == "+sound+" : "+sound.uniqueId);
					try{
						sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                            sound.off(AudioPlayer.SOUND_COMPLETE);
							Logger.log(this, "playHovSound BAMSE sound COMPLETE");
							TweenLite.delayedCall(1, this.playOutroBack);
						});
					} catch (error) {
						Logger.log(this, "ERROR : sound : playHovSound Model.CHAR_BAMSE onComplete");
					}

					// SoundAS.group("speak").playRandomSound([SoundNames.S03_BAMSE_SPEAKS_IKKE_SET_FOER]).soundCompleted.addOnce
					// (function (si:SoundInstance){
					// 	TweenLite.delayedCall(1, this.playOutroBack);
					// });;
					break;
				case Model.CHAR_SKAEG:
					this.skaegTalk();
					sound = AudioPlayer.getInstance().playRandomSound([SoundNames.S03_SKAEG_SPEAKS_HVAD_I_ALVERDEN_ER_DET]);
					try{
						sound.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                            sound.off(AudioPlayer.SOUND_COMPLETE);
							TweenLite.delayedCall(1, this.playOutroBack);
						});
					} catch (error) {
						Logger.log(this, "ERROR : sound : playHovSound Model.CHAR_SKAEG onComplete");
					}

					// SoundAS.group("speak").playRandomSound([SoundNames.S03_SKAEG_SPEAKS_HVAD_I_ALVERDEN_ER_DET]).soundCompleted.addOnce
					// (function (si:SoundInstance){
					// 	TweenLite.delayedCall(0.1, this.skaegIdle);
					// 	TweenLite.delayedCall(1, this.playOutroBack);
					// });
					break;
				// case Model.CHAR_MILLE:
				// 	this.milleTalk();
				// 	AudioPlayer.getInstance().playRandomSound([SoundNames.S03_MILLE_SPEAKS_HVAD_I_ALVERDEN_IKKE_SET_FOER, SoundNames.S03_MILLE_SPEAKS_HVAD_VAR_DET]); //TODO add onComplete
                //
				// 	// SoundAS.group("speak").playRandomSound([SoundNames.S03_MILLE_SPEAKS_HVAD_I_ALVERDEN_IKKE_SET_FOER, SoundNames.S03_MILLE_SPEAKS_HVAD_VAR_DET]).soundCompleted.addOnce
				// 	// (function (si:SoundInstance){
				// 	// 	TweenLite.delayedCall(0.1, this.milleIdle);
				// 	// 	TweenLite.delayedCall(1, this.playOutroBack);
				// 	// });;
				// 	break;
			}
		}
	}

	private kristianTalk = ():void => {
		(this._sneakScene as BadGuy_christian__scene3_spySceneWalk_christianProxy).getCharacter().getHead().gotoTalk();
	}

	private kristianIdle = ():void => {
		(this._sneakScene as BadGuy_christian__scene3_spySceneWalk_christianProxy).getCharacter().getHead().gotoIdle();
	}

	private prebenTalk = ():void => {
		(this._sneakScene as BadGuy_christian__scene3_spySceneWalk_christianProxy).getCharacter().getPreben().getHead().gotoTalk();
	}

	private prebenIdle = ():void => {
		(this._sneakScene as BadGuy_christian__scene3_spySceneWalk_christianProxy).getCharacter().getPreben().getHead().gotoIdle();
	}

	private skaegTalk = ():void => {
		(this._sneakScene as BadGuy_skaeg__scene3_spySceneWalk_skaegProxy).getCharacter().getHead().gotoTalk();
	}

	private skaegIdle = ():void => {
		(this._sneakScene as BadGuy_skaeg__scene3_spySceneWalk_skaegProxy).getCharacter().getHead().gotoIdle();
	}

	// private milleTalk = ():void => {
	// 	(this._sneakScene as BadGuy_mille__scene3_spySceneWalk_milleProxy).getCharacter().getHead().gotoTalk();
	// }
    //
	// private milleIdle = ():void => {
	// 	(this._sneakScene as BadGuy_mille__scene3_spySceneWalk_milleProxy).getCharacter().getHead().gotoIdle();
	// }

	private onTouch = (event:TouchEvent):void => {
		// let touch:Touch = event.getTouch(this, TouchPhase.BEGAN);
		// if (touch) {
			this.touchGuide.display.visible = false;

			if (this._characterIsWatching) {
				return;
			}

			if (this._movementSpeed < Scene_04_SneakGameView.MAXIMUM_MOVEMENT) {
				this._movementSpeed += Scene_04_SneakGameView.MOVEMENT_PER_CLICK;
			}

			this.disquise.gotoWalk();
		// }
	}

	private onTweenUpdate = ():void => {
		this._movableSprite.x = (AssetLoader.STAGE_WIDTH / 2) - this.disquise.display.x;

		if (this._movableSprite.x > 0) {
			this._movableSprite.x = 0;
		}

		if (this._movableSprite.x < (-(this.background.width - AssetLoader.STAGE_WIDTH))) {
			this._movableSprite.x = -(this.background.width - AssetLoader.STAGE_WIDTH);
		}

		if (this.disquise.display.x > 1750) {
			// this.removeListener("ENTER_FRAME", this.onEnterFrame);
			// this.removeListener(TouchEvent.TOUCH, this.onTouch);
			ticker.shared.remove( this.onEnterFrame, this );
			this.off(TouchEvent.TOUCH, this.onTouch);

			this._movementSpeed = 0;
			this._charMovementSpeed = 0;
			this.disquise.gotoIdle();

			this.blackQuad = new Graphics();
			this.blackQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
			this.blackQuad.alpha = 0;
			this.addChild(this.blackQuad);
			TweenLite.to(this.blackQuad, 2, {alpha:1});

			this.killTweens();
			// SoundAS.group("speak").stopAll();
			// SoundAS.group("fx").play(SoundNames.S04_ROSA_01_YES_VI_KLAREDE_DET);
			AudioPlayer.getInstance().stopAllSounds(true);
			AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_01_YES_VI_KLAREDE_DET);

			TweenLite.delayedCall(4, this.playOutroProceed);
		}
	}

	private playOutroProceed = ():void => {
		this._sneakScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this._sneakScene.gotoOuttro();
	}

	private playOutroBack = ():void => {
		// SoundAS.group("music").fadeAllTo(Scene_04_SneakGameView.MUSIC_VOLUME, 1000);
		AudioPlayer.getInstance().fadeAllTo(Scene_04_SneakGameView.MUSIC_VOLUME, 1000);
		this._sneakScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.backToCharacterPicker, this);
		this._sneakScene.gotoOuttro();
	}

	//private proceed(event:dragonBones.EventObject):void{
	private proceed = (event:dragonBones.EventObject):void => {

		Logger.log(this, "Scene_04_SneakGameView proceed  this._sneakScene == "+this._sneakScene);

		this._sneakScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);

		// this._sneakScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.proceed, this);
		// let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		// dispatchEvent(sceneEvent); //TODO
	}

	//private backToCharacterPicker(event:dragonBones.EventObject):void {
	private backToCharacterPicker = (event:dragonBones.EventObject):void => {
		this._sneakScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.backToCharacterPicker, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.PREVIOUS, 0, true);
		this.emit(SceneEvent.PREVIOUS, sceneEvent);

		// this._sneakScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.backToCharacterPicker, this);
		// let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.PREVIOUS, 0, true);
		// dispatchEvent(sceneEvent); //TODO
	}

	private killTweens():void {
		TweenLite.killDelayedCallsTo(this.playTomgangSound);
		TweenLite.killDelayedCallsTo(this.characterTurnsBack);
		TweenLite.killDelayedCallsTo(this.playOutroBack);
		TweenLite.killDelayedCallsTo(this.playHovSound);
		TweenLite.killDelayedCallsTo(this.kristianIdle);
		TweenLite.killDelayedCallsTo(this.skaegIdle);
		TweenLite.killDelayedCallsTo(this.prebenIdle);
	}

	public teardown():void {
		Logger.log(this, "Scene_04_SneakGameView teardown");
		this.killTweens();

		ticker.shared.remove( this.onEnterFrame, this );
		this.off(TouchEvent.TOUCH, this.onTouch);

		// dispose buttons

		if(this.startButton != null) {
			this.startButton.off(ButtonEvent.CLICKED, this.onStartButtonClicked);
			this.startButton.dispose();
			this.startButton = null;
		}

		// if(this._movableSprite != null) {
		// 	this.removeChild(this._movableSprite);
		// 	this._movableSprite = null;
		// }

		// remove scene


			// this.disquise.remove(this._movableSprite);
		if(this._sneakScene != null) {
			try{
				this._sneakScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
				this._sneakScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.backToCharacterPicker, this);
			} catch (Error) {
			}

			if(this._movableSprite != null) {
				if(this.background != null) {
					this._movableSprite.removeChild(this.background);
					this.background = null;
				}
				this._sneakScene.remove(this._movableSprite);
				this.removeChild(this._movableSprite);
				if(this.disquise != null) {
					this.disquise.remove(this._movableSprite);
				}
				this._movableSprite = null;
			}
		}

		if(this.touchGuide != null) {
			this.touchGuide.remove(this);
			this.touchGuide = null;
		}

		if(this.progressMeter != null) {
			this.progressMeter.remove(this);
			this.progressMeter = null;
		}

		AudioPlayer.getInstance().stopAllSounds();
	}
}
