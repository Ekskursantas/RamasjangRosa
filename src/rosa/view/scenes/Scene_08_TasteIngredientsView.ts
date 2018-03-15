
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {DragManager} from "src/rosa/dragdrop/DragManager";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {ISceneView} from "src/rosa/view/ISceneView";
import {IDragable} from "src/rosa/typeddb/interfaces/IDragable";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Scene7_specialTasteProxy} from "src/rosa/generated/common/armatures/proxies/Scene7_specialTasteProxy";
import {Wrongtaste_potatosProxy} from "src/rosa/generated/common/armatures/proxies/Wrongtaste_potatosProxy";
import {Wrongtaste_strawberriesProxy} from "src/rosa/generated/common/armatures/proxies/Wrongtaste_strawberriesProxy";
import {Wrongtaste_watermelonProxy} from "src/rosa/generated/common/armatures/proxies/Wrongtaste_watermelonProxy";
import {Taste_christianProxy} from "src/rosa/generated/common/armatures/proxies/Taste_christianProxy";
import {Taste_2_bamseProxy} from "src/rosa/generated/common/armatures/proxies/Taste_2_bamseProxy";
import {PandekageogIsProxy} from "src/rosa/generated/common/armatures/proxies/PandekageogIsProxy";

import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;
import InteractionEvent = PIXI.interaction.InteractionEvent;
import {SpriteHelper} from "../../../loudmotion/utils/SpriteHelper";
import {MagreteBowlProxy} from "../../generated/common/armatures/proxies/MagreteBowlProxy";
import Rectangle = PIXI.Rectangle;
import Graphics = PIXI.Graphics;

export class Scene_08_TasteIngredientsView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
	private _background:Sprite;

	private static POTATO:string = "rosa_potato";
	private static STAWBERRIES:string = "rosa_strawberries";
	private static WATERMELON:string = "rosa_watermelon";
	private static TASTE_CHRISTIAN:string = "rosa_tast_christian";
	private static TASTE_BAMSE:string = "rosa_taste_bamse";
	private static PANCAKE:string = "rosa_pancake";

	private potato:Wrongtaste_potatosProxy;
	private strawberries:Wrongtaste_strawberriesProxy;
	private watermelon:Wrongtaste_watermelonProxy;
	private tasteChristian:Taste_christianProxy;
	private tasteBamse:Taste_2_bamseProxy;
	private pancake:PandekageogIsProxy;

	// MagreteBowlProxy

	private dragable:IDragable;

	private nextButton:NextArrowButton;

	private tasteIngScenes:Scene7_specialTasteProxy;
	private done:boolean;

	private rectCover:Graphics;
	private rectDropTargetCover:Graphics;

	private bowl:Sprite;
	private rosaHead:Sprite;
	private hitRosaHead:boolean;
	private startPoint:Point;
	private smag:Sprite;

	constructor(){
		super();
		this.name = "Scene_08_TasteIngredientsView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;

		// this._background = new Image(AssetLoader.assets.getTexture(Backgrounds.SCENE1_BG));
		this._background = Sprite.fromFrame(Backgrounds.SCENE1_BG);
		this.addChild(this._background);

		this.tasteIngScenes = this._typeddb.buildScene7_specialTasteArmature();
		this.tasteIngScenes.display.x = 0;
		this.tasteIngScenes.display.y = 0;
		this.tasteIngScenes.gotoIntro();
		this.tasteIngScenes.show(this);

		this.potato = this.tasteIngScenes.getWrongtaste_potatos();
		this.potato.display.name = Scene_08_TasteIngredientsView.POTATO;
		this.potato.display.interactive = true;
		this.potato.display.buttonMode = true;
		this.potato.display.on(TouchEvent.TOUCH, this.touchDown);
		this.potato.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.potato.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.strawberries = this.tasteIngScenes.getWrongtaste_strawberries();
		this.strawberries.display.name = Scene_08_TasteIngredientsView.STAWBERRIES;
		this.strawberries.display.interactive = true;
		this.strawberries.display.buttonMode = true;
		this.strawberries.display.on(TouchEvent.TOUCH, this.touchDown);
		this.strawberries.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.strawberries.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.watermelon = this.tasteIngScenes.getWrongtaste_watermelon();
		this.watermelon.display.name = Scene_08_TasteIngredientsView.WATERMELON;
		this.watermelon.display.interactive = true;
		this.watermelon.display.buttonMode = true;
		this.watermelon.display.on(TouchEvent.TOUCH, this.touchDown);
		this.watermelon.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.watermelon.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.tasteChristian = this.tasteIngScenes.getTaste_1_christian();
		this.tasteChristian.display.name = Scene_08_TasteIngredientsView.TASTE_CHRISTIAN;
		this.tasteChristian.display.interactive = true;
		this.tasteChristian.display.buttonMode = true;
		this.tasteChristian.display.on(TouchEvent.TOUCH, this.touchDown);
		this.tasteChristian.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.tasteChristian.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.tasteBamse = this.tasteIngScenes.getTaste_2_bamse();
		this.tasteBamse.display.name = Scene_08_TasteIngredientsView.TASTE_BAMSE;
		this.tasteBamse.display.interactive = true;
		this.tasteBamse.display.buttonMode = true;
		this.tasteBamse.display.on(TouchEvent.TOUCH, this.touchDown);
		this.tasteBamse.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.tasteBamse.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.pancake = this.tasteIngScenes.getTaste_3_skaeg();
		this.pancake.display.name = Scene_08_TasteIngredientsView.PANCAKE;
		this.pancake.display.interactive = true;
		this.pancake.display.buttonMode = true;
		this.pancake.display.on(TouchEvent.TOUCH, this.touchDown);
		this.pancake.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.pancake.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.nextButton = new NextArrowButton(this.tasteIngScenes.getArrowNext().armature);
		this.nextButton.on(ButtonEvent.CLICKED, this.nextButtonClicked);

		this.tasteIngScenes.getMagreteBowl().gotoDej_6();

		this.bowl = this.tasteIngScenes.getMagreteBowl().display;
		this.bowl.interactive = true;
		this.bowl.buttonMode = true;

		this.rosaHead = this.tasteIngScenes.getRosa().getHead().display;
		this.rosaHead.interactive = true;
		this.rosaHead.buttonMode = true;

		this.tasteIngScenes.getMagreteBowl().gotoDej_6();
		this.done = false;

		MainView.rosaSpeak(SoundNames.S07_ROSA_01_VI_SKAL_FINDE_DEN_HELT_RIGTIGE_KAGESMAG, this.tasteIngScenes.getRosa());

		let smagImage:Sprite = Sprite.fromFrame(this.getPolaroidContent("Smag"));
		this.smag = new Sprite();
		this.smag.addChild(smagImage);
		this.tasteIngScenes.getPolaroid().get_placeholder().display = this.smag;
		this.tasteIngScenes.getPolaroid().gotoSmag();

		this.rectDropTargetCover = new Graphics();
		this.rectDropTargetCover.beginFill(0xFFFFFF);
		this.rectDropTargetCover.alpha = .3;
		this.addChild(this.rectDropTargetCover);
		this.rectDropTargetCover.drawRect(this.bowl.getLocalBounds().x, this.bowl.getLocalBounds().y, this.bowl.getBounds().width, this.bowl.getBounds().height);

		// TODO Temp added for testing
		// setTimeout(() => this.nextButtonClicked(null), MainView.DELAY_TEST_NEXT_SCENE);
	}

	// private getPolaroidContent(type:string):PIXI.RenderTexture {
	private getPolaroidContent(type:string):string {
		// let atlasName:string = "texture-" + Model.getInstance().getSelectedCharName();
		// let textureName:string = "badGuy_" + Model.getInstance().getSelectedCharName() + "/polaroid" + type;
		// let assetMan:AssetManager = AssetLoader.assets;
		//
		// Logger.log(this, "get polaroid content:" + atlasName + "/" + textureName);
		//
		// let texture:Texture = assetMan.getTexture(textureName);
		// return texture;

		let atlasName:string = "texture-" + Model.getInstance().getSelectedCharName();
		let textureName:string = "badGuy_" + Model.getInstance().getSelectedCharName() + "/polaroid" + type;
		// let assetMan:AssetManager = AssetLoader.assets
		Logger.log(this, "get polaroid content:" + atlasName + "/" + textureName);
		// let texture:PIXI.Texture = assetMan.getTexture(textureName);
		// return texture;
		return textureName;
	}


	private touchDown = (event:InteractionEvent):void => {
		let rosa:RosaProxy = this.tasteIngScenes.getRosa();

		switch(event.currentTarget.name) {
			case Scene_08_TasteIngredientsView.POTATO:
				this.dragable = this.potato;
				break;
			case Scene_08_TasteIngredientsView.STAWBERRIES:
				this.dragable = this.strawberries;
				break;
			case Scene_08_TasteIngredientsView.WATERMELON:
				this.dragable = this.watermelon;
				break;
			case Scene_08_TasteIngredientsView.TASTE_CHRISTIAN:
				this.dragable = this.tasteChristian;
				break;
			case Scene_08_TasteIngredientsView.TASTE_BAMSE:
				this.dragable = this.tasteBamse;
				break;
			case Scene_08_TasteIngredientsView.PANCAKE:
				this.dragable = this.pancake;
				break;
		}

		if(this.dragable != null) {
			this.mouseDown = true;
			this.startPoint = new Point(this.dragable.display.x, this.dragable.display.y);
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.dragable.display.x = Math.abs(mousePositionCanvas.x);
			this.dragable.display.y = Math.abs(mousePositionCanvas.y);

			this.dragable.gotoDrag(); //TODO add tween here
		}
	}

	private touchMove = (event:TouchEvent):void => {
		let rosa:RosaProxy = this.tasteIngScenes.getRosa();
		if(this.mouseDown && this.dragable != null) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.dragable.display.x = Math.abs(mousePositionCanvas.x);
			this.dragable.display.y = Math.abs(mousePositionCanvas.y);

			if(this.bowl != null) {
				let hit:boolean = this.testForIntersection(this.dragable.display.getBounds(), this.tasteIngScenes.getMagreteBowl());
				if (hit) {
				}
			}

			if(this.rosaHead != null) {
				this.hitRosaHead = SpriteHelper.hitTest(this.dragable.display.getBounds(), this.rosaHead.getBounds());
				if (this.hitRosaHead) {
					if (rosa.armature.animation.lastAnimationName != "taste") {
						rosa.gotoTaste();
					}
				} else {
					if (rosa.armature.animation.lastAnimationName != "idle") {
						rosa.gotoIdle();
					}
				}
			}
		}
	}

	private touchDone = (event:TouchEvent):void => {
		this.mouseDown = false;
		if(this.dragable != null) {
			let rosa: RosaProxy = this.tasteIngScenes.getRosa();
			if (this.bowl != null) {
				let hit:boolean = this.testForIntersection(this.dragable.display.getBounds(), this.tasteIngScenes.getMagreteBowl());
				if(hit) {
					if (!this.done) {

						// TODO: Wrong taste should snap back
						// TODO: Correct taste -> goto next scene
						// TODO: Correct taste should probably come from model

						if (this.dragable.armature.name == Model.getInstance().tasteArmatureNames[Model.getInstance().selectedChar]) {
							// correct taste
							rosa.gotoOk();
							MainView.rosaSpeakWithoutState(SoundNames.S00_ROSA_36_DET_TROR_JEG_HAN_BLIVER_GLAD_FOR_DET_HER, this.tasteIngScenes.getRosa());

							this.tasteIngScenes.getWrongtaste_potatos().display.visible = false;
							this.tasteIngScenes.getWrongtaste_strawberries().display.visible = false;
							this.tasteIngScenes.getWrongtaste_watermelon().display.visible = false;
							this.tasteIngScenes.getTaste_1_christian().display.visible = false;
							this.tasteIngScenes.getTaste_2_bamse().display.visible = false;
							this.tasteIngScenes.getTaste_3_skaeg().display.visible = false;
							// this.tasteIngScenes.getTaste_4_mille().display.visible = false;

							this.done = true;

							this.dragable.gotoDrop();
							this.dragable.display.off(TouchEvent.TOUCH, this.touchDown);
							this.dragable.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
							this.dragable.display.off(TouchEvent.TOUCH_END, this.touchDone);
							this.dragable.display.visible = false;
							this.tasteIngScenes.gotoReady();
						} else {
							// wrong taste
							rosa.gotoNogo();
							MainView.rosaSpeakWithoutState(SoundNames.S00_ROSA_12_EJD_DET_TROR_JEG_IKKE_ER_DEN_HELT_RIGTIGE, this.tasteIngScenes.getRosa());
							this.dragable.gotoDefault();
							if(this.startPoint != null){
								this.dragable.display.x = this.startPoint.x;
								this.dragable.display.y = this.startPoint.y;
							}
						}

					} else {
						if(this.startPoint != null){
							this.dragable.display.x = this.startPoint.x;
							this.dragable.display.y = this.startPoint.y;
						}
						this.dragable.gotoDefault();
					}
				}else{
					if(this.startPoint != null){
						this.dragable.display.x = this.startPoint.x;
						this.dragable.display.y = this.startPoint.y;
					}
					this.dragable.gotoDefault();
				}

				if (rosa.armature.animation.lastAnimationName == "taste") {
					if (this.dragable instanceof Wrongtaste_potatosProxy) {
						rosa.gotoSour();
					} else {
						rosa.gotoSweet();
					}
					this.playRosaTasteSound(this.dragable);
				}
			}

			this.hitRosaHead = false;
			this.dragable.gotoDefault();
		}
	}

	private testForIntersection(rect:Rectangle, armature:IArmatureProxy):boolean {
		let target:Sprite = armature.display;
		let targetRect:Rectangle = rect;
		let hit:boolean = this.isIntersecting(target, targetRect);
		return hit;
	}

	private playRosaTasteSound(armature:IDragable):void {
		// SoundAS.group("speak").stopAll();
		AudioPlayer.getInstance().stopAllSounds();
		Logger.log(this, "Scene_08_TasteIngredientsView playRosaTasteSound armature == "+armature+" : armature instanceof Wrongtaste_potatosProxy == "+(armature instanceof Wrongtaste_potatosProxy));

		if (armature instanceof Wrongtaste_potatosProxy) {
			MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_03_UF_DEN_ER_SUR, this.tasteIngScenes.getRosa());
		}
		if (armature instanceof Wrongtaste_strawberriesProxy) { MainView.rosaSpeakWithoutState(SoundNames.S06_ROSA_19_SMAG_MILK, this.tasteIngScenes.getRosa()); }
		if (armature instanceof Wrongtaste_watermelonProxy) { MainView.rosaSpeakWithoutState(SoundNames.S06_ROSA_19_SMAG_MILK, this.tasteIngScenes.getRosa()); }
		if (armature instanceof Taste_christianProxy) { MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_18_UHMM_DER_HAR_DU_FUNDET_NOGET_HODT_NOGET, this.tasteIngScenes.getRosa()); }
		if (armature instanceof Taste_2_bamseProxy) { MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_07_AHR_DET_ER_LAEKKERT, this.tasteIngScenes.getRosa()); }
		if (armature instanceof PandekageogIsProxy) { MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_14_UH_DET_ER__EN_GOD_KAGESAMG, this.tasteIngScenes.getRosa()); }
	}

	private nextButtonClicked = (event:ButtonEvent):void => {
		this.playOutro();
	}

	private playOutro():void {
		this.tasteIngScenes.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this.tasteIngScenes.gotoOuttro();
	}

	private proceed = (event:dragonBones.EventObject):void => {
		this.tasteIngScenes.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	public teardown():void {
		if(this.rectDropTargetCover != null) {
			this.removeChild(this.rectDropTargetCover);
			this.rectDropTargetCover = null;
		}

		if(this.potato != null) {
			this.potato.display.off(TouchEvent.TOUCH, this.touchDown);
			this.potato.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.potato.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.strawberries != null) {
			this.strawberries.display.off(TouchEvent.TOUCH, this.touchDown);
			this.strawberries.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.strawberries.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.watermelon != null) {
			this.watermelon.display.off(TouchEvent.TOUCH, this.touchDown);
			this.watermelon.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.watermelon.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.tasteChristian != null) {
			this.tasteChristian.display.off(TouchEvent.TOUCH, this.touchDown);
			this.tasteChristian.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.tasteChristian.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.tasteBamse != null) {
			this.tasteBamse.display.off(TouchEvent.TOUCH, this.touchDown);
			this.tasteBamse.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.tasteBamse.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.pancake != null) {
			this.pancake.display.off(TouchEvent.TOUCH, this.touchDown);
			this.pancake.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.pancake.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.tasteIngScenes != null) {
			this.tasteIngScenes.remove(this);
			this.tasteIngScenes.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		}

		if(this.nextButton != null) {
			this.nextButton.off(ButtonEvent.CLICKED, this.nextButtonClicked);
			this.nextButton = null;
		}

		if(this._background != null) {
			this.removeChild(this._background);
			this._background = null;
		}

		if(this.smag != null) {
			this.smag.removeChildren();
			this.smag = null;
		}
	}

}
