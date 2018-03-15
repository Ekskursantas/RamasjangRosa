import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {SoundNames} from "src/rosa/generated/SoundNames";
import { Helper } from "src/loudmotion/utils/Helper";
import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {SceneEvent} from "src/rosa/events/SceneEvent";
import {ISceneView} from "src/rosa/view/ISceneView";
import {Scene9b_cutCakeProxy} from "src/rosa/generated/common/armatures/proxies/Scene9b_cutCakeProxy";

import {ClearButtonButton} from "src/rosa/generated/common/armatures/buttons/ClearButtonButton";
import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";

import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Graphics = PIXI.Graphics;
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;
import {CakeCutShapesProxy} from "../../generated/common/armatures/proxies/CakeCutShapesProxy";
import Texture = PIXI.Texture;
import Rectangle = PIXI.Rectangle;
import BaseTextureCache = PIXI.utils.BaseTextureCache;
import TextureCache = PIXI.utils.TextureCache;
import BaseTexture = PIXI.BaseTexture;
import RenderTexture = PIXI.RenderTexture;

export class Scene_080_CutCakeView extends SceneBase implements ISceneView {
	rectCover: Graphics;

	private readonly cakeLocX:number = 416;
	private readonly cakeLocY:number = 134;

	private cakeRect:Rectangle;

	private _typeddb:TypedDBFactory;
	private _background:Sprite;

	private cutScene:Scene9b_cutCakeProxy;

	private cuttingShape:Graphics;
	private cuttingShapeFinal:Graphics;
	private cuttingShapePerDraw:Graphics;
	private cakeDisplayCloneMask:Sprite;
	private cakeDisplay:Sprite;
	private cakeDisplayClone:Sprite;

	private cakeCutShape:CakeCutShapesProxy;

	private clearButton:ClearButtonButton;
	private nextButton:NextArrowButton;

	private drawing:boolean;
	private prevDraw:Point = new Point();
	private currentDraw:Point = new Point();
	private currentPoints:Point[];

	private completeCakeContainer:PIXI.Container;

	private form:Sprite;

	constructor() {
		super();
		this.name = "Scene_080_CutCakeView";

	}



    public setup(typeddb: TypedDBFactory): void {
        console.log("it got here");
		this._typeddb = typeddb;
		AssetLoader.getInstance().loadAdditional("Scene9a_cutOut", this.setupContinued);
	}

	public setupContinued = ():void => {
		this._background = Sprite.fromFrame(Backgrounds.SCENE9A_CUTOUT);

		this.stage.addChild(this._background);
		this.cutScene = this._typeddb.buildScene9b_cutCakeArmature();
		this.cutScene.display.x = 0;
		this.cutScene.display.y = 0;
		this.cutScene.show(this);

		this.cutScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
		this.cutScene.gotoIntro();

		this.form = new Sprite();

		if (Model.getInstance().gameMode == Model.MODE_FREE) {
			if (Model.getInstance().snapShots[1] != null) {
				this.form.addChild(Model.getInstance().snapShots[1]);
			}
		} else {
			let formImage:Sprite = Sprite.fromFrame(this.getPolaroidContent("Form"));
			this.form.addChild(formImage);
		}

		this.cutScene.getPolaroid().get_placeholder().display = this.form;
	}

	private afterIntro = (event:dragonBones.EventObject):void => {
		this.cutScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);

		this.clearButton = new ClearButtonButton(this.cutScene.getClearButton().armature);
		this.clearButton.on(ButtonEvent.CLICKED, this.clearButtonClicked);

		this.nextButton = new NextArrowButton(this.cutScene.getNextArrow().armature);
		this.nextButton.on(ButtonEvent.CLICKED, this.nextButtonClicked);

		this.cakeDisplay = this.cutScene.getHardCake().display;

		if (Model.getInstance().gameMode == Model.MODE_STORY) {
			let uppercaseCharName:string = Model.getInstance().getSelectedCharName();
			let cap = String(uppercaseCharName).substr(0,1);
			uppercaseCharName = String(cap).toUpperCase()+String(uppercaseCharName).slice(1);

			this.cakeCutShape = this.cutScene.getCakeCutShape();
			this.cakeCutShape["goto" + uppercaseCharName]();
			TweenLite.delayedCall(.01, this.delayedGotoCharacterFrame, [uppercaseCharName]);
        }
        if (Model.getInstance().gameMode == Model.MODE_FREE) {
            let char: string = Model.getInstance().characters[Helper.randomRange(0, 2, true)];
            let uppercaseCharName: string = char;
            let cap = String(uppercaseCharName).substr(0, 1);
            uppercaseCharName = String(cap).toUpperCase() + String(uppercaseCharName).slice(1);

            this.cakeCutShape = this.cutScene.getCakeCutShape();
            this.cakeCutShape["goto" + uppercaseCharName]();
            TweenLite.delayedCall(.01, this.delayedGotoCharacterFrame, [uppercaseCharName]);
        }
		this.cutScene.getPolaroid().gotoForm();

		// SoundAS.group("speak").stopAll();
		// SoundAS.group("speak").play(SoundNames.S09_ROSA_01_NU_ER_DET_TID_TIL_AT_SKAERE_KAGEN);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound(SoundNames.S09_ROSA_01_NU_ER_DET_TID_TIL_AT_SKAERE_KAGEN);

	}

	private delayedGotoCharacterFrame = (uppercaseCharName:string):void => { //TODO work around for pixi / dragonbones weirdness
		this.cakeCutShape["goto" + uppercaseCharName]();

		this.addCanvasDraw();
	}

	public addCanvasDraw():void{

		// TODO BUG PIXI 4.0+ with mask having cutouts on intersect
		// https://github.com/pixijs/pixi.js/issues/2877

		this.cakeRect = new Rectangle(this.cakeDisplay.x, this.cakeDisplay.y, this.cakeDisplay.width, this.cakeDisplay.height);
		this.cakeDisplay.setTransform();

		let renderTextureCake = RenderTexture.create(this.cakeDisplay.width, this.cakeDisplay.height);
		AssetLoader.getInstance().renderer.render(this.cakeDisplay, renderTextureCake);
		this.cakeDisplay.x = Math.floor(this.cakeRect.x);
		this.cakeDisplay.y = Math.floor(this.cakeRect.y);
		this.cakeDisplay.width = Math.floor(this.cakeRect.width);
		this.cakeDisplay.height = Math.floor(this.cakeRect.height);

		this.cakeDisplayClone = new Sprite(renderTextureCake);
		this.cakeDisplayClone.x = Math.floor(this.cakeRect.x);
		this.cakeDisplayClone.y = Math.floor(this.cakeRect.y);
		this.cakeDisplayClone.visible = false;

		this.cuttingShape = new Graphics();
		this.cuttingShapeFinal = new Graphics();

		this.cuttingShapePerDraw = new Graphics();
		this.addChild(this.cuttingShapePerDraw);
		this.addChild(this.cuttingShape);

		this.cakeDisplayCloneMask = new Sprite();

		this.completeCakeContainer = new PIXI.Container();
		this.addChild(this.completeCakeContainer);

		this.completeCakeContainer.addChild(this.cakeDisplayClone);

		this.rectCover = new Graphics();
		this.rectCover.beginFill(0x444444);
		this.rectCover.interactive = true;
		this.rectCover.buttonMode = true;
		this.rectCover.alpha = SceneBase.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.cakeDisplay.x, this.cakeDisplay.y, this.cakeDisplay.width, this.cakeDisplay.height);

		this.rectCover.on(TouchEvent.TOUCH, this.drawDown);
		this.rectCover.on(TouchEvent.TOUCH_MOVE, this.drawMove);
		this.rectCover.on(TouchEvent.TOUCH_END, this.drawDone);
		this.rectCover.on(TouchEvent.TOUCH_OUT, this.drawDone);

		this.currentPoints = [];
	}

	private drawDown = (event:TouchEvent):void => {
		this.drawing = true;

		this.cakeDisplay.alpha = .8;
		this.cakeDisplayClone.alpha = .6;

		this.cuttingShape.alpha = .01;

		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

		this.prevDraw.x = Math.floor(mousePositionCanvas.x);
		this.prevDraw.y = Math.floor(mousePositionCanvas.y);

		this.currentPoints = [];
		let correctedDrawPoints:Point = new Point((this.prevDraw.x - this.cakeDisplay.x), (this.prevDraw.y - this.cakeDisplay.y));
		this.currentPoints.push(correctedDrawPoints.clone());

		this.cuttingShapePerDraw.lineStyle(5, 0xFFFFFF, .6);

		this.cuttingShape.drawCircle(-2, -2, 1); //creates and places upper left corner
		this.cuttingShape.drawCircle(AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT, 2); //creates and places lower right corner
	}

	private drawMove = (event:TouchEvent):void => {
		if (this.drawing) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

			this.currentDraw.x = Math.floor(mousePositionCanvas.x);
			this.currentDraw.y = Math.floor(mousePositionCanvas.y);

			this.cuttingShape.moveTo(this.prevDraw.x, this.prevDraw.y);
			this.cuttingShape.lineTo(this.currentDraw.x, this.currentDraw.y);

			this.cuttingShapePerDraw.moveTo(this.prevDraw.x, this.prevDraw.y);
			this.cuttingShapePerDraw.lineTo(this.currentDraw.x, this.currentDraw.y);

			let correctedDrawPoints:Point = new Point((this.currentDraw.x - this.cakeDisplay.x), (this.currentDraw.y - this.cakeDisplay.y));
			this.currentPoints.push(correctedDrawPoints.clone());
			this.prevDraw.x = Math.floor(this.currentDraw.x);
			this.prevDraw.y = Math.floor(this.currentDraw.y);
		}
	}

	private drawDone = (event:TouchEvent):void => {
		if (this.drawing) {
			this.cuttingShape.lineStyle(0);
			this.cuttingShape.beginFill(0xFFFFFF);
			this.cuttingShape.drawPolygon(this.currentPoints);
			this.cuttingShape.endFill();
			this.cuttingShapeFinal = this.cuttingShape.clone();
			this.cuttingShape.alpha = 0;
			this.cakeDisplay.alpha = .7;
			this.cuttingShapeFinal.x = Math.floor(this.cakeLocX);
			this.cuttingShapeFinal.y = Math.floor(this.cakeLocY);
			this.cakeDisplayCloneMask.width = Math.floor(this.cuttingShapeFinal.width);
			this.cakeDisplayCloneMask.height = Math.floor(this.cuttingShapeFinal.height);
			this.cakeDisplayCloneMask.texture = this.cuttingShapeFinal.generateCanvasTexture(1, 1);
			this.cakeDisplayCloneMask.x = Math.floor(this.cakeDisplay.x);
			this.cakeDisplayCloneMask.y = Math.floor(this.cakeDisplay.y);
			this.cakeDisplayClone.mask = this.cakeDisplayCloneMask;
			this.cakeDisplayClone.visible = true;
			this.addChild(this.rectCover);
		}
		this.drawing = false;
	}

	private nextButtonClicked = (event:ButtonEvent):void => {
		// this.removeChild(this.cutShape);
		// if we didn't cut anything, then use the whole cake
		if (this.currentPoints.length < 1) {
			this.cakeDisplayClone.visible = true;
			let startX:number = 0; //this.cakeDisplay.x;
			let startY:number = 0; //this.cakeDisplay.y;

			this.currentPoints = [];
			this.currentPoints.push(new Point(startX, startY));
			this.currentPoints.push(new Point(startX + this.cakeDisplay.width, startY));
			this.currentPoints.push(new Point(startX + this.cakeDisplay.width, startY + this.cakeDisplay.height));
			this.currentPoints.push(new Point(startX, startY + this.cakeDisplay.height));
			this.currentPoints.push(new Point(startX, startY));

			this.cuttingShape.alpha = 1;
			this.cuttingShape.lineStyle(0);
			this.cuttingShape.beginFill(0xFF0000);
			this.cuttingShape.drawPolygon(this.currentPoints);

			this.cakeDisplayCloneMask.width = Math.floor(this.cuttingShape.width);
			this.cakeDisplayCloneMask.height = Math.floor(this.cuttingShape.height);
			this.cakeDisplayCloneMask.texture = this.cuttingShape.generateCanvasTexture(1, 1);
			this.cakeDisplayCloneMask.x = Math.floor(this.cakeDisplay.x);
			this.cakeDisplayCloneMask.y = Math.floor(this.cakeDisplay.y);
		}else{
			this.cuttingShape.alpha = 1;
			this.cuttingShape.lineStyle(0);
			this.cuttingShape.beginFill(0xFFFFFF);
			this.cuttingShape.drawPolygon(this.currentPoints);
			this.cakeDisplayCloneMask.width = Math.floor(this.cuttingShape.width);
			this.cakeDisplayCloneMask.height = Math.floor(this.cuttingShape.height);
			this.cakeDisplayCloneMask.texture = this.cuttingShape.generateCanvasTexture(1, 1);
			this.cakeDisplayCloneMask.x = Math.floor(this.cakeDisplay.x);
			this.cakeDisplayCloneMask.y = Math.floor(this.cakeDisplay.y);

			this.cakeDisplayClone.mask = this.cakeDisplayCloneMask;
		}

		this.cuttingShape.alpha = 0;
		this.cakeDisplayClone.mask = null;

		this.cakeDisplayClone.alpha = 1;
		this.cakeDisplayClone.setTransform(0, 0);

		this.completeCakeContainer.updateTransform();
        this.cakeDisplayClone.mask = this.cakeDisplayCloneMask;

        this.removeChild(this.cakeDisplayClone);
        this.removeChild(this.cakeDisplayCloneMask);
        this.cuttingShapePerDraw.clear();
        this.cuttingShape.clear();
        this.cuttingShapeFinal.clear();

		this.createRenderTextureOfCake();
	}

	private createRenderTextureOfCake():void {

		//RENDER
		let renderTextureCake = RenderTexture.create(this.cakeDisplay.width, this.cakeDisplay.height);
		AssetLoader.getInstance().renderer.render(this.completeCakeContainer, renderTextureCake);
		let cake:Sprite = new Sprite(renderTextureCake);
		Model.getInstance().cakeCut = cake;

		this.cakeDisplayClone.visible = false;

		setTimeout(() => this.playOutro(), 500);
	}

	private playOutro = ():void => {
		Logger.log(this, "Scene_080_cutCakeView  playOutro ");
		this.cutScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this.cutScene.gotoOuttro();
	}

	private proceed = (event:dragonBones.EventObject):void => {
		this.cutScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	private clearButtonClicked = (event:ButtonEvent):void => {
        Logger.log(this, "clearButtonClicked");
        this.cuttingShapePerDraw.clear();
        this.cuttingShape.clear();
		this.cuttingShapeFinal.clear();

        if (this.cakeDisplayCloneMask != null) {

            this.removeChild(this.cakeDisplayCloneMask);
            this.cakeDisplayCloneMask = new Sprite();

		}
		this.cakeDisplayClone.mask = null;
	}

	private getPolaroidContent(type:string):string {
		let atlasName:string = "texture-" + Model.getInstance().getSelectedCharName();
		let textureName:string = "badGuy_" + Model.getInstance().getSelectedCharName() + "/polaroid" + type;
		return textureName;
	}

	public teardown():void {
		// remove eventlisteners
		if(this.clearButton) {
			this.clearButton.off(ButtonEvent.CLICKED, this.clearButtonClicked);
			this.clearButton.dispose();
		}
		if(this.nextButton) {
			this.nextButton.off(ButtonEvent.CLICKED, this.nextButtonClicked);
			this.nextButton.dispose();
		}

		if(this.rectCover) {
			this.removeChild(this.rectCover);
			this.rectCover.off(TouchEvent.TOUCH, this.drawDown);
			this.rectCover.off(TouchEvent.TOUCH_MOVE, this.drawMove);
			this.rectCover.off(TouchEvent.TOUCH_END, this.drawDone);
			this.rectCover.off(TouchEvent.TOUCH_OUT, this.drawDone);
			this.rectCover = null;
		}

		if(this.form != null) {
			this.removeChild(this.form);
			this.form = null;
		}

		if(this.cutScene != null) {
			this.cutScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
			this.cutScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
			this.cutScene.remove(this);
		}

		// remove background
		if(this._background != null) {
			this.removeChild(this._background);
			this._background = null;
		}

		AssetLoader.getInstance().removeTexture(Backgrounds.SCENE9A_CUTOUT, true);


		if(this.cuttingShapePerDraw != null) {
			this.removeChild(this.cuttingShapePerDraw);
			this.cuttingShapePerDraw = null;
		}
		if(this.cuttingShape != null) {
			this.removeChild(this.cuttingShape);
			this.cuttingShape = null;
		}

		if(this.completeCakeContainer != null) {
			this.completeCakeContainer.removeChildren();
			this.removeChild(this.completeCakeContainer);
			this.completeCakeContainer = null;
		}
	}

}