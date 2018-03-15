
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ISceneView} from "src/rosa/view/ISceneView";
import {SceneEvent} from "src/rosa/events/SceneEvent";
import {IInsideScene} from "src/rosa/interfaces/IInsideScene";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
import {ShootPictureProxy} from "src/rosa/generated/common/armatures/proxies/ShootPictureProxy";
import {PolaroidProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProxy";
import {BadGuy_christian__Scene4_InsideSpyProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__Scene4_InsideSpyProxy";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Color_clueButton} from "src/rosa/generated/common/armatures/buttons/Color_clueButton";
import {Form_clueButton} from "src/rosa/generated/common/armatures/buttons/Form_clueButton";
import {Taste_clueButton} from "src/rosa/generated/common/armatures/buttons/Taste_clueButton";
import {BadGuy_christian__spyGlassButton} from "src/rosa/generated/common/armatures/buttons/BadGuy_christian__spyGlassButton";
import {Model} from "src/rosa/model/Model";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {MainView} from "src/rosa/view/MainView";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import {SpySceneTouchProxy} from "../../generated/common/armatures/proxies/SpySceneTouchProxy";
import Graphics = PIXI.Graphics;
import Point = PIXI.Point;

export class Scene_05_GatherCluesView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;

	private _background:Sprite;
	private _gatherCluesScene:IInsideScene;

	private _cluesFound:number;

	private _colorClueButton:Color_clueButton;
	private _formClueButton:Form_clueButton;
	private _tasteClueButton:Taste_clueButton;

	private _redButtonButton:BadGuy_christian__spyGlassButton;

	private backgroundName:string;
	private clueIsFound:boolean[]; //TODO was Vector.<Boolean>;
	private clueButtons:IButtonProxy[]; //TODO was Vector.<IButtonProxy>;

	private blackQuad:Graphics;
	private christianScene:BadGuy_christian__Scene4_InsideSpyProxy;
	private buttonStatus:any;
	private shootPicture:ShootPictureProxy;

	private touchGuide:SpySceneTouchProxy;

	private rectCover: Graphics;

	constructor() {
		super();
		this.name = "Scene_05_GatherCluesView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;

		this.buttonStatus = {
			"form": false,
			"taste": false,
			"color": false
		};

		this.backgroundName = "Scene4" + "_" + Model.getInstance().getSelectedCharName() + "_bg";
		this._background = Sprite.fromFrame(this.backgroundName);

		this.addChild(this._background);

		this._gatherCluesScene = this.getInsideScene();
		this._gatherCluesScene.show(this);
		this._gatherCluesScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
		this._gatherCluesScene.gotoIntro();

		this.touchGuide = this._gatherCluesScene.getTouch();
		this.touchGuide.show(this);

		this.touchGuide.display.x = AssetLoader.STAGE_WIDTH / 2;
		this.touchGuide.display.y = AssetLoader.STAGE_HEIGHT - (this.touchGuide.display.height / 2);
		this.touchGuide.display.visible = false;

		this.rectCover = new Graphics();
		this.rectCover.beginFill(0x444444);
		this.rectCover.interactive = true;
		this.rectCover.buttonMode = true;
		this.rectCover.alpha = SceneBase.RECT_COVER_ALPHA;

		this.addChildAt(this.rectCover, this.getChildIndex(this._background) + 1);
		this.rectCover.drawRect(this._background.x, this._background.y, this._background.width, this._background.height);

		this.rectCover.on(TouchEvent.TOUCH_END, this.touchHandler);
		this.shootPicture = this._gatherCluesScene.getShootPicture();

		this._colorClueButton = new Color_clueButton(this._gatherCluesScene.getColor_clue().armature);
		this._formClueButton = new Form_clueButton(this._gatherCluesScene.getForm_clue().armature);
		this._tasteClueButton = new Taste_clueButton(this._gatherCluesScene.getTaste_clue().armature);

		this._colorClueButton.disabled = true; //TODO add back
		this._formClueButton.disabled = true;
		this._tasteClueButton.disabled = true;

		this.clueButtons = []; //TODO was new Vector.<IButtonProxy>();
		this.clueButtons.push(this._colorClueButton);
		this.clueButtons.push(this._formClueButton);
		this.clueButtons.push(this._tasteClueButton);

		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playMusic(Model.MUSIC_ROSA_SPION_INSIDE, 1000, Model.VOLUME_MUSIC);

		let rosaSpeakDelay:number = 0;
		if (Model.getInstance().selectedChar == Model.CHAR_CHRISTIAN) {
			rosaSpeakDelay = 4;
			TweenLite.delayedCall(15, this.mysterioHint);
		}

		TweenLite.delayedCall(300, this.showHint);
		AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_02_NU_SKAL_VI_TAGE_BILLEDER);

		this._cluesFound = 0;
		this.clueIsFound = new Array(3); //TODO was new Vector.<Boolean>(3);
		this.clueIsFound[0] = false;

		this._gatherCluesScene.getProgress().display.on(TouchEvent.TOUCH_END, this.showHintNow);
		this._background.on(ButtonEvent.CLICKED, this.touchHandler);
		this._gatherCluesScene.getShootPicture().gotoDefault();
	}

	private afterIntro = (event:dragonBones.EventObject):void => {
		this._gatherCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);

		setTimeout(() => this.addButtonClick(), 400);
	}

	private addButtonClick = ():void => {
		this._colorClueButton.disabled = false;
		this._formClueButton.disabled = false;
		this._tasteClueButton.disabled = false;

		this._colorClueButton.on(ButtonEvent.CLICKED, this.onColorClueClicked);
		this._formClueButton.on(ButtonEvent.CLICKED, this.onFormClueClicked);
		this._tasteClueButton.on(ButtonEvent.CLICKED, this.onTasteClueClicked);

		if (Model.getInstance().selectedChar == Model.CHAR_CHRISTIAN) {
			this.christianScene = this._gatherCluesScene as BadGuy_christian__Scene4_InsideSpyProxy;
			this._redButtonButton = new BadGuy_christian__spyGlassButton(this.christianScene.getSpyGlassArm().armature);
			this._redButtonButton.on(ButtonEvent.CLICKED, this.onRedButtonClicked);

			this._formClueButton.off(ButtonEvent.CLICKED, this.onFormClueClicked);
			this._formClueButton.disabled = true; //TODO add back
		}

		this.shootPicture.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.shootPictureArmatureComplete, this);
		this.shootPicture.armature.eventDispatcher.addEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);
	}

	private playDBSound = (event:dragonBones.EventObject):void => {
		try{
			AudioPlayer.getInstance().playSound(event.name);
		} catch (error) {
			Logger.log(this, "ERROR : sound : playDBSound");
		}
	}

	private touchHandler = (event:TouchEvent):void => {
		Logger.log(this, "Scene_05_GatherCluesView touchHandler");
		this.touchGuide.display.visible = true;
		let mousePositionCanvas:Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

		this.touchGuide.display.x = mousePositionCanvas.x;
		this.touchGuide.display.y = mousePositionCanvas.y;
		this.touchGuide.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.touchGuideHide, this);
		this.touchGuide.gotoTouch();
	}

	private touchGuideHide = ():void => {
		Logger.log(this, "Scene_05_GatherCluesView touchGuideHide");
		this.touchGuide.display.visible = false;
		this.touchGuide.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.touchGuideHide, this);
		this.touchGuide.gotoIdle();
	}

	private mysterioHint():void {
		TweenLite.killDelayedCallsTo(this.mysterioHint);
		// SoundAS.group("speak").play(SoundNames.S04_ROSA_10_MON_VI_KAN_TAENDE_FOR_MYSTERIO);
		AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_10_MON_VI_KAN_TAENDE_FOR_MYSTERIO);
	}

	private showHintNow = (event:TouchEvent):void => {
		this.showHint();
	}

	private showHint = ():void => {
		TweenLite.killDelayedCallsTo(this.showHint);
		if (this._cluesFound < 3) {
			TweenLite.delayedCall(20, this.showHint);
		}

		for (let i:number = 0; i < 3; i++) {
			if (!this.clueIsFound[i]) {
				// Logger.log(this, "showHint i === "+i);
				let button:IButtonProxy = this.clueButtons[i];
				if (!button.disabled) {
					button["gotoHint"]();
					break;
				}
			}
		}
	}

	private onRedButtonClicked = (event:ButtonEvent):void => {
		this._redButtonButton.off(ButtonEvent.CLICKED, this.onRedButtonClicked);
		TweenLite.killDelayedCallsTo(this.mysterioHint);

		this._formClueButton.on(ButtonEvent.CLICKED, this.onFormClueClicked);
		TweenLite.delayedCall(.5, this.delayedRedButtonDisabled); //TODO add on complete for animation
	}

	private delayedRedButtonDisabled = ():void => {
		this._redButtonButton.disabled = true;
	}

	private delayedSpeak = ():void => {
		AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_05_JA_FLOT_FARVE);
	}

	private onColorClueClicked = (event:ButtonEvent):void => {
		Logger.log(this, "Scene_05_GatherCluesView onColorClueClicked");
		this.clueIsFound[0] = true;
		this._colorClueButton.disabled = true; //TODO add back
		this.buttonStatus.color = true;
		this.setTextureOnPolariod("Farve");
		this.updateProgress();

		// SoundAS.group("speak").stopAll();
		// TweenLite.delayedCall(1.5, SoundAS.group("speak").play, [SoundNames.S04_ROSA_05_JA_FLOT_FARVE]);
		AudioPlayer.getInstance().stopAllSounds();
		TweenLite.delayedCall(1.5, this.delayedSpeak);
	}

	private onFormClueClicked = (event:ButtonEvent):void => {
		this.clueIsFound[1] = true;

		this._formClueButton.disabled = true; //TODO add back

		this.buttonStatus.form = true;

		this.setTextureOnPolariod("Form");

		if(this._redButtonButton != null) {
			this._redButtonButton.disabled = true;
		}

		this.updateProgress();

		// SoundAS.group("speak").stopAll();
		// TweenLite.delayedCall(1.5, SoundAS.group("speak").play, [SoundNames.S04_ROSA_03_JA_SAADAN_SE_UD]);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_03_JA_SAADAN_SE_UD);
	}

	//private onTasteClueClicked(e:ButtonEvent):void {
	private onTasteClueClicked = (event:ButtonEvent):void => {
		Logger.log(this, "Scene_05_GatherCluesView onTasteClueClicked");
		this.clueIsFound[2] = true;

		this._tasteClueButton.disabled = true; //TODO add back
		this.buttonStatus.taste = true;

		this.setTextureOnPolariod("Smag");

		this.updateProgress();

		// SoundAS.group("speak").stopAll();
		// TweenLite.delayedCall(1.5, SoundAS.group("speak").play, [SoundNames.S04_ROSA_06_DET_TROR_JEG_SMAG]);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_06_DET_TROR_JEG_SMAG);
	}

	private setTextureOnPolariod(id:string):void {
		this.shootPicture.gotoDefault();
		this.shootPicture.getPolaoridImg().get_placeholder().display.addChild(Sprite.fromFrame(this.getPolaroidContent(id))); //TODO
		setTimeout(() => this.shootPicture.getPolaoridImg()["goto" + id](), 300);
		this.shootPicture.gotoAnimation();
	}

	private shootPictureArmatureComplete = (event:dragonBones.EventObject):void => {
		let buttonStatus:any = {
			"form": this._formClueButton.disabled,
			"taste": this._tasteClueButton.disabled,
			"color": this._colorClueButton.disabled
		};

		this.shootPicture.gotoDefault();
		this._formClueButton.disabled = this.buttonStatus.form; //TODO add back
		this._tasteClueButton.disabled = this.buttonStatus.taste; //TODO add back
		this._colorClueButton.disabled = this.buttonStatus.color; //TODO add back
	}

	private getPolaroidContent = (type:string):string => {
		let atlasName:string = "texture-" + Model.getInstance().getSelectedCharName();
		let textureName:string = "badGuy_" + Model.getInstance().getSelectedCharName() + "/polaroid" + type;
		return textureName;
	}

	private getInsideScene():IInsideScene {
		let proxyScene:IInsideScene;
		switch (Model.getInstance().selectedChar) {
			case Model.CHAR_CHRISTIAN:
				proxyScene = this._typeddb.buildBadGuy_christian__Scene4_InsideSpyArmature() as IInsideScene;
				break;
			case Model.CHAR_BAMSE:
				proxyScene = this._typeddb.buildBadGuy_bamse__Scene4_insideSpyArmature() as IInsideScene;
				break;
			case Model.CHAR_SKAEG:
				proxyScene = this._typeddb.buildBadGuy_skaeg__Scene4_InsideSpyArmature() as IInsideScene;
				break;
			// case Model.CHAR_MILLE:
			// 	proxyScene = this._typeddb.buildBadGuy_mille__Scene4_InsideSpyArmature() as IInsideScene;
			// 	break;
		}
		return proxyScene;
	}

	private updateProgress():void {
		this._cluesFound++;
		Logger.log(this, "_gatherCluesScene", "goto_" + this._cluesFound);
		let progress = this._gatherCluesScene.getProgress();
		if (this._cluesFound >= 0 && this._cluesFound < 4) {
			progress["goto_" + this._cluesFound]();
		}
		if (this._cluesFound >= 3) {
			this.blackQuad = new Graphics();
			this.blackQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
			this.blackQuad.alpha = 0;
			this.addChild(this.blackQuad);
			TweenLite.to(this.blackQuad, 2, {delay:4, alpha:1, onComplete:this.playOutro});

			AudioPlayer.getInstance().stopAllSounds(true);
			AudioPlayer.getInstance().playSound(SoundNames.S04_ROSA_08_GODT_KLARET_LAD_OS_KOMME_TILBAGE);
		}
	}

	private playOutro = ():void => {
		this._gatherCluesScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this); //TODO add back
		this._gatherCluesScene.gotoOuttro();
	}

	private proceed = (event:dragonBones.EventObject):void => {
		this._gatherCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	public teardown():void {
		TweenLite.killDelayedCallsTo(this.mysterioHint);
		TweenLite.killDelayedCallsTo(this.showHint);

		this.shootPicture.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.shootPictureArmatureComplete, this);
		this.shootPicture.armature.eventDispatcher.removeEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);

		if(this.touchGuide != null) {
			this.off(TouchEvent.TOUCH, this.touchHandler);
			this.touchGuide.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.touchGuideHide, this);

			this.touchGuide.remove(this);
			this.touchGuide = null;
		}

		if(this._colorClueButton != null) {
			this._colorClueButton.off(ButtonEvent.CLICKED, this.onColorClueClicked);
		}
		if(this._formClueButton != null) {
			this._formClueButton.off(ButtonEvent.CLICKED, this.onFormClueClicked);
		}
		if(this._tasteClueButton != null) {
			this._tasteClueButton.off(ButtonEvent.CLICKED, this.onTasteClueClicked);
		}

		if(this.rectCover != null) {
			this.removeChild(this.rectCover);
			this.rectCover.off(TouchEvent.TOUCH_END, this.touchHandler);
		}

		// dispose buttons
		this._colorClueButton.dispose();
		this._formClueButton.dispose();
		this._tasteClueButton.dispose();

		if (this._redButtonButton != null) {
			this._redButtonButton.off(ButtonEvent.CLICKED, this.onRedButtonClicked);
			this._redButtonButton.dispose();
		}

		// remove scene
		if(this._gatherCluesScene != null) {
			this._gatherCluesScene.getProgress().display.off(TouchEvent.TOUCH_END, this.showHintNow);
			this._gatherCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
			this._gatherCluesScene.remove(this);
		}
		if(this.blackQuad != null) {
			this.removeChild(this.blackQuad); //TODO
		}

		// remove background
		if(this._background != null) {
			this._background.off(ButtonEvent.CLICKED, this.touchHandler);
			this.removeChild(this._background);
		}
	}
}
