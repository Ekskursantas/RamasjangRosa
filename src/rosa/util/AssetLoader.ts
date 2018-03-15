//package dk.nozebra.rosa.util
//{
//	import dk.nozebra.ramasjangapp.util.CheckDevice;
//
//	CONFIG::compileForAndroid
//	{
//		import dk.nozebra.ramasjangapp.util.ExpansionFileHelper;
//	}
//
//	import flash.filesystem.File;
//
//	import dk.nozebra.ramasjangapp.util.StarlingHelper;
//	import starling.utils.AssetManager;
import { Main } from "src/Main";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {Touch} from "src/loudmotion/events/TouchLoud";
import {Model} from "src/rosa/model/Model";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProgressBar} from "./ProgressBar";
import LoadQueue = createjs.LoadQueue;
import Rectangle = PIXI.Rectangle;
import Container = PIXI.Container;
import {MainView} from "../view/MainView";
import Graphics = PIXI.Graphics;
import Point = PIXI.Point;
import Sprite = PIXI.Sprite;
import WebGLRenderer = PIXI.WebGLRenderer;
import CanvasRenderer = PIXI.CanvasRenderer;
import { AssetHelper } from "../../AssetHelper";
import { ButtonEvent } from "../events/ButtonEvent";

export class AssetLoader extends Sprite {

	public static QUEUE_COMPLETE:string = "complete";
	public static QUEUE_FILE_LOAD:string = "fileload";
	public static QUEUE_PROGRESS:string = "progress";
	public static QUEUE_ERROR:string = "error";

	public static Scene9a_cutOut_additional:boolean;
	public static Scene9_bg_additional:boolean;
	public static handMixer_additional:boolean;
	public static Scene8_bg_additional:boolean;
	public static christian_additional:boolean;
	public static bamse_additional:boolean;
	public static skaeg_additional:boolean;


	get typeddb(): TypedDBFactory {
		return this._typeddb;
	}

	private _typeddb:TypedDBFactory;

	//get assetLoader(): PIXI.loaders.Loader {
	//	return this._assetLoader;
	//}

	// IOS screen info
	// https://developer.apple.com/ios/human-interface-guidelines/graphics/launch-screen/
	// Device							Portrait size				Landscape size
	// iPhone 6s Plus, iPhone 6 Plus 	1080px by 1920px			1920px by 1080px
	// iPhone 6s, iPhone 6				750px by 1334px				1334px by 750px
	// iPhone SE						640px by 1136px				1136px by 640px
	// 12.9-inch iPad Pro				2048px by 2732px			2732px by 2048px
	// 9.7-inch iPad Pro, iPad Air 2,
		//iPad mini 4, iPad mini 2 		1536px by 2048px			2048px by 1536px

	// https://developer.apple.com/ios/human-interface-guidelines/graphics/image-size-and-resolution/
	// Device											Scale factor
	// iPhone 6s Plus and iPhone 6 Plus				@3x
	// All other high-resolution iOS devices			@2x
    //
	// A standard resolution image has a scale factor of 1.0 and is referred to as an @1x image.
	// High resolution images have a scale factor of 2.0 or 3.0 and are referred to as @2x and @3x images.
	// Suppose you have a standard resolution @1x image that’s 100px by 100px, for example.
	// The @2x version of this image would be 200px by 200px.
	// The @3x version would be 300px by 300px.

	// Android screen info
	// https://developer.android.com/guide/practices/screens_support.html


	static ASSET_LOADED:string = "asset_loaded";
	// static STAGE_WIDTH:number = 480;
	// static STAGE_HEIGHT:number = 270;

	// static STAGE_WIDTH:number = 1920;
	// static STAGE_HEIGHT:number = 1080;

	static STAGE_WIDTH:number = 1364; //TODO orig size of as3 project
    static STAGE_HEIGHT: number = 768;

    ratioX: number;
    ratioY: number;
    static newWidth: number;
    static newHeight: number;

	// 2730 x 1534

	static assets:any;
	static MEDIA_PATH:string;

	private progressBar:ProgressBar;

	private static _instance:AssetLoader = null;
	static getInstance():AssetLoader{
		if(AssetLoader._instance == null) {
			AssetLoader._instance = new AssetLoader();
			// AssetLoader._instance.init();
		}
		return AssetLoader._instance;
	}

	public static get instantiated():boolean {
		return Boolean(AssetLoader._instance);
	}

	public static destroySingleton():void {
		if (AssetLoader.instantiated) {
			AssetLoader._instance.destroy();
		}
	}

	public get sprites():any {
		return this._sprites;
	}
	public get renderer():WebGLRenderer | CanvasRenderer {
		return this._renderer;
	}

	public set renderer(value:WebGLRenderer | CanvasRenderer) {
		this._renderer = value;
	}

	get factory(): dragonBones.PixiFactory {
		return this._factory;
	}
	//public static assets:AssetManager;
    assetCanvas: Graphics;
	private _factory:dragonBones.PixiFactory;
	//private _assetLoader:PIXI.loaders.Loader;
	private _renderer:WebGLRenderer | CanvasRenderer;
	private _rendererDraw:CanvasRenderer;
	stage:Container;
    private timePassed: number;
	private _onCompleteCallback:Function;

	//private _loader:PIXI.loaders.Loader;
	private _sprites:any = {};
	//loadedData:any = [];//store json

	protected characterAssets:Object = {};

	dragging:boolean;
	dragPos:Point;
	lastDragPos:Point;
	slice1:Sprite;

    rosaCanvas: HTMLCanvasElement;
    rosaCSS: HTMLStyleElement;
    

	//private _assetLoadQueue:createjs.LoadQueue;
	//public static soundsManifest:any[];
	static safeFrame:Rectangle;

	private mStarted:boolean;
	public get isStarted():boolean {
		return this.mStarted;
	}
	public set isStarted(set:boolean) {
		this.mStarted = set;
	}
	public phase: string;



	constructor() {
		super();
	}

    public init(onCompleteCallback: Function): void {
        //Logger.log(this, "init");
        //Logger.log(this, "init  AssetLoader.STAGE_WIDTH == "+AssetLoader.STAGE_WIDTH);
        //Logger.log(this, "init  AssetLoader.STAGE_HEIGHT == "+AssetLoader.STAGE_HEIGHT);
        //Logger.log(this, "init  window.devicePixelRatio == "+window.devicePixelRatio);

        //// let devicePixelRatio:number = window.devicePixelRatio;
        //let devicePixelRatio:number = 1; //TODO TEMP added for testing

        this._onCompleteCallback = onCompleteCallback;
        this.ratioX = 0;
        this.ratioY = 0;
        //AssetLoader.STAGE_WIDTH *= devicePixelRatio; //TODO do we need to take devicePixelRatio into account?
        //AssetLoader.STAGE_HEIGHT *= devicePixelRatio;
        //Logger.log(this, "init  NOW AssetLoader.STAGE_WIDTH == "+AssetLoader.STAGE_WIDTH);
        //Logger.log(this, "init  NOW AssetLoader.STAGE_HEIGHT == "+AssetLoader.STAGE_HEIGHT);


        //// this._renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0x1099bb});
        //// document.body.appendChild(this._renderer.view);

        //// create stage and point it to the canvas:
        this.rosaCanvas = <HTMLCanvasElement>document.getElementById('canvas_rosa');
        this.rosaCSS = <HTMLStyleElement>document.getElementsByTagName('style')[1];
        
        //Logger.log(this, "init  this.rosaCanvas == "+this.rosaCanvas);
        this._renderer = PIXI.autoDetectRenderer(AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT, { view: this.rosaCanvas, transparent: true});
        //// this._renderer = new PIXI.CanvasRenderer(AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT, {view: this.rosaCanvas, transparent: true});

        // this._renderer.backgroundColor = 0x1099bb;

		/*
		 * Fix for iOS GPU issues
		 */
          this._renderer.view.style['transform'] = 'translatez(0)'; //TODO do we need this? https://codepen.io/osublake/pen/ORJjGj

        //AssetLoader.getInstance().stage = new Container();
        //
        //AssetLoader.getInstance().stage.hitArea = new Rectangle(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
        AssetLoader.getInstance().stage = new PIXI.Container();
        AssetLoader.getInstance().stage.interactive = true;
        AssetLoader.getInstance().stage.hitArea = new Rectangle(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
        //this._renderer = PIXI.autoDetectRenderer(1364, 768, {
        //    resolution: 0.50
        //    // view:Main.DIV_ELEMENT
        //});
      
        ////this.addListener()

        //Logger.log(this, "AssetLoader.getInstance().stage == "+ AssetLoader.getInstance().stage);

        this.assetCanvas = new Graphics();
        this.assetCanvas.interactive = true;
        this.assetCanvas.beginFill(0xFFFFFF);
        this.assetCanvas.alpha = 0.05;
        this.assetCanvas.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
        this.stage.addChild(this.assetCanvas);
        
		//this.assetCanvas.on(TouchEvent.TOUCH, this.onTouch);
		//this.assetCanvas.on(TouchEvent.TOUCH_END, this.onTouch);
		//// this.assetCanvas.on(TouchEvent.TOUCH_OUT, this.onTouch);
		//this.assetCanvas.on(TouchEvent.TOUCH_MOVE, this.onTouch);

	//	//you need to run dragonBones.WorldClock like this to run the armature

        
        //Main.DIV_ELEMENT.appendChild(AssetLoader.getInstance().renderer.view);

        

		this.timePassed = new Date().getTime();
        //AssetLoader.getInstance().renderer.render(AssetLoader.getInstance().stage);
        requestAnimationFrame(this.update);
	}

	// public addCanvasDraw(fromx:number, fromy:number, tox:number, toy:number):void{



	//private onTouch = (event:TouchEvent):void => {
	//	let mousePosition:Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
 //       console.log("CLICKED FUCKING FINALLY");
	//	if (this.isStarted) {

	//		switch (event.type) {
	//			case TouchEvent.TOUCH:
	//				this.phase = TouchPhase.BEGAN;
	//				break;
	//			case TouchEvent.TOUCH_MOVE:
	//				this.phase = TouchPhase.MOVED;
	//				break;
	//			case TouchEvent.TOUCH_END:
	//				this.phase = TouchPhase.ENDED;
	//				break;
	//		}
	//	}
	//}

    update = (): void => {
        if (!MainView.destroying && AssetLoader.getInstance().stage && AssetLoader.getInstance().stage.children.length > 0) {
            this._renderer.render(AssetLoader.getInstance().stage);


			 //if(this.stageDraw != null) {
			 //	this._rendererDraw.render(this.stageDraw);
			 //}

			 //dragonBones.WorldClock.clock.advanceTime(e.delta * 0.001);
			 //dragonBones.WorldClock.clock.advanceTime(-1);

			let now = new Date().getTime();
			dragonBones.WorldClock.clock.advanceTime((now - this.timePassed)*0.001);
			// dragonBones.WorldClock.clock.advanceTime(-1);
			this.timePassed = now;
			// Main.applyRatio(this.stage, Main.ratio);
		}
		requestAnimationFrame(this.update);
	}

	//public removeProgressBar():void{
	//	if(this.progressBar != null) {
	//		// this.stage.removeChild(this.progressBar);
	//		this.progressBar.visible = false;
	//		// this.progressBar = null;
	//	}
	//}

	//public loadAssets():void{
	//	Logger.log(this, "loadAssets");

	//	this.progressBar = new ProgressBar(AssetLoader.STAGE_WIDTH * .5, ProgressBar.PROGRESS_BAR_HEIGHT);
	//	this.stage.addChild(this.progressBar);
	//	Logger.log(this, "loadAssets this.progressBar == "+this.progressBar);

	//	// PIXI.loader
 //        //    .add("dragonBonesData0", AssetLoader.MEDIA_PATH + "common/dragonbones/texture0.json")
 //        //    .add("textureData0", AssetLoader.MEDIA_PATH + "common/dragonbones/texture0.json")
 //        //    .add("texture0", AssetLoader.MEDIA_PATH + "common/dragonbones/texture0.png");
	//	// PIXI.loader.once("complete", this.loadCompleteHandler, this);
	//	// PIXI.loader.load();
	//	//LOAD SPRITESHEET
	//	//let assetsToLoad:any = ["./rosa_game_assets/common/texture0.json"];
	//	//let assetsToLoad:any = ["dragon_atlas.json"];
	//	// let assetsToLoad:any = ["texture0.json"];
	//	//this._assetLoader = new PIXI.AssetLoader(assetsToLoad);

	//	this._assetLoader = PIXI.loader; //baseUrl?
	//	this._assetLoader.on("progress", this.loadProgressHandler);
	//	this._assetLoader.on('complete', this.onAssetsLoaded);

	//	//this._assetLoader.add("./rosa_game_assets/common/texture0.xml");
	//	//this._assetLoader.add(assetsToLoad);

	//	this._assetLoader

 //           .add("textureSkeletonData", AssetLoader.MEDIA_PATH + "scenes/skeleton_ske_tex.json")
 //           .add("textureSkeleton", AssetLoader.MEDIA_PATH + "scenes/skeleton_ske_tex.png")
 //           .add("dragonBonesData", AssetLoader.MEDIA_PATH + "scenes/skeleton_ske_ske.json")


	//		.add("textureData0", AssetLoader.MEDIA_PATH + "common/dragonbones/texture0.json")
	//		.add("textureData1", AssetLoader.MEDIA_PATH + "common/dragonbones/texture1.json")
	//		.add("textureData2", AssetLoader.MEDIA_PATH + "common/dragonbones/texture2.json")

 //           .add("texture0", AssetLoader.MEDIA_PATH + "common/dragonbones/texture0.png")
 //           .add("texture1", AssetLoader.MEDIA_PATH + "common/dragonbones/texture1.png")
 //           .add("texture2", AssetLoader.MEDIA_PATH + "common/dragonbones/texture2.png")

	//		.add("BackArrow", AssetLoader.MEDIA_PATH + "system/BackArrow.png")

	//		// .add("handMixer", AssetLoader.MEDIA_PATH + "common/backgrounds/handMixer.jpg")
	//		// .add("Scene8_bg", AssetLoader.MEDIA_PATH + "common/backgrounds/Scene8_bg.jpg")
	//		// .add("Scene9_bg", AssetLoader.MEDIA_PATH + "common/backgrounds/Scene9_bg.jpg")
	//		// .add("Scene9a_cutOut", AssetLoader.MEDIA_PATH + "common/backgrounds/Scene9a_cutOut.jpg")

 //           .add("Scene3_bamse_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-bamse/Scene3_bamse_bg.jpg")
 //           .add("Scene4_bamse_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-bamse/Scene4_bamse_bg.jpg")

 //           .add("Scene3_christian_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-christian/Scene3_christian_bg.jpg")
 //           .add("Scene4_christian_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-christian/Scene4_christian_bg.jpg")

 //           // .add("Scene3_mille_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-mille/Scene3_mille_bg.jpg")
 //           // .add("Scene4_mille_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-mille/Scene4_mille_bg.jpg")

 //           .add("Scene3_skaeg_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-skaeg/Scene3_skaeg_bg.jpg")
 //           .add("Scene4_skaeg_bg", AssetLoader.MEDIA_PATH + "common/backgrounds-skaeg/Scene4_skaeg_bg.jpg")

 //           .add("Scene0_bg", AssetLoader.MEDIA_PATH + "common/preloaded-backgrounds/Scene0_bg.jpg")
 //           .add("Scene1_bg", AssetLoader.MEDIA_PATH + "common/preloaded-backgrounds/Scene1_bg.jpg");

 //           // .add("skeletonxml", AssetLoader.MEDIA_PATH + "scenes/skeleton.json");

	//	this._assetLoader.load();
	//}

	public onAssetsLoaded = () :void => {

		this._factory = dragonBones.PixiFactory.factory;
		this._typeddb = new TypedDBFactory(this._factory);

        let dragonBonesData = this.factory.parseDragonBonesData(JSON.parse(Main.ASSETS["media/rosa/scenes/skeleton_ske_ske.json"]));
		//Logger.log(this, "MainView loadCompleteHandler  dragonBonesData === " + dragonBonesData);

        let textureAtlasData = this.factory.parseTextureAtlasData(JSON.parse(Main.ASSETS["media/rosa/scenes/skeleton_ske_tex.json"]), PIXI.Texture.fromFrame("textureSkeleton"));
        //Logger.log(this, "MainView loadCompleteHandler  textureAtlasData === " + textureAtlasData);

        let textureAtlasData0 = this.factory.parseTextureAtlasData(JSON.parse(Main.ASSETS["media/rosa/common/dragonbones/texture0.json"]), PIXI.Texture.fromFrame("texture0"));
        let textureAtlasData1 = this.factory.parseTextureAtlasData(JSON.parse(Main.ASSETS["media/rosa/common/dragonbones/texture1.json"]), PIXI.Texture.fromFrame("texture1"));
        let textureAtlasData2 = this.factory.parseTextureAtlasData(JSON.parse(Main.ASSETS["media/rosa/common/dragonbones/texture2.json"]), PIXI.Texture.fromFrame("texture2"));

		//this.factory.addDragonBonesData(dragonBonesData, "dragonBonesData");

        this.factory.addTextureAtlasData(textureAtlasData0, "atlas0");
        this.factory.addTextureAtlasData(textureAtlasData1, "atlas1");
        this.factory.addTextureAtlasData(textureAtlasData2, "atlas2");

		if(this._onCompleteCallback != null) {
			this._onCompleteCallback();
		}
	}

	//// public loadAdditional(additionalDir:string, callback:Function):void {
	public loadAdditional(item:string, onCompleteCallback:Function):void {

		//Logger.log(this, "loadAdditional  this._assetLoader == " + this._assetLoader);
		//Logger.log(this, "loadAdditional  item == " + item);
		//// this._assetLoader.reset();

		//Logger.log(this, "loadAdditional  AFTER this._assetLoader == " + this._assetLoader);

	// CHRISTIAN:number = 0;
	// CHAR_BAMSE:number = 1;
	// CHAR_SKAEG:number = 2;
	// CHAR_MILLE:number = 3;
	// 	AssetLoader.MEDIA_PATH + "common/backgrounds-" + characterName
	// 	AssetLoader.MEDIA_PATH + "levels/" + characterName

		this._onCompleteCallback = onCompleteCallback;

		switch (item) {
			case "Scene9a_cutOut":
				if(AssetLoader.Scene9a_cutOut_additional){
					if(this._onCompleteCallback != null) {
						this._onCompleteCallback();
					}
                } else {

                    var sprite9 = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/common/backgrounds/Scene9a_cutOut.jpg"]);
                    PIXI.Texture.addTextureToCache(sprite9, "Scene9a_cutOut");
					AssetLoader.Scene9a_cutOut_additional = true;



					//TODO for testing only
                    if (!AssetLoader.christian_additional) {
                        
                        
                        //var texture_christian = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/christian/texture-christian.png"]);
                        var background_christian = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/christian/backgrounds/background-christian.jpg"]);
                        var inside_christian = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/christian/backgrounds/inside-christian.jpg"]);

                        //PIXI.Texture.addTextureToCache(texture_christian, "texture-christian");
                        PIXI.Texture.addTextureToCache(background_christian, "background-christian");
                        PIXI.Texture.addTextureToCache(inside_christian, "inside-christian");

                        AssetLoader.christian_additional = true;
                       
					}
					//TODO for testing only

                    this._onCompleteCallback();
					//this._assetLoader.load();
				}
				break;
			case "Scene9_bg":
				if(AssetLoader.Scene9_bg_additional){
					if(this._onCompleteCallback != null) {
						this._onCompleteCallback();
					}
                } else {
                    var Scene9_bg = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/common/backgrounds/Scene9_bg.jpg"]);

                    PIXI.Texture.addTextureToCache(Scene9_bg, "Scene9_bg");
					AssetLoader.Scene9_bg_additional = true;
					//this._assetLoader.load();
                    this._onCompleteCallback();
				}
				break;
			case "handMixer":
				if(AssetLoader.handMixer_additional){
					if(this._onCompleteCallback != null) {
						this._onCompleteCallback();
					}
				}else{
                    var handMixer = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/common/backgrounds/handMixer.jpg"]);
                    PIXI.Texture.addTextureToCache(handMixer, "handMixer");
					AssetLoader.handMixer_additional = true;
					//this._assetLoader.load();
                    this._onCompleteCallback();
				}
				break;
			case "Scene8_bg":
				if(AssetLoader.Scene8_bg_additional){
					if(this._onCompleteCallback != null) {
						this._onCompleteCallback();
					}
				}else{
                    var Scene8_bg = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/common/backgrounds/Scene8_bg.jpg"]);
                    PIXI.Texture.addTextureToCache(Scene8_bg, "Scene8_bg");
					AssetLoader.Scene8_bg_additional = true;
					//this._assetLoader.load();
                    this._onCompleteCallback();
				}
				break;
			case "christian":
				if(AssetLoader.christian_additional){
					if(this._onCompleteCallback != null) {
						this._onCompleteCallback();
					}
				}else{
                    
                    //var texture_christian = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/christian/texture-christian.png"]);
                    var background_christian = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/christian/backgrounds/background-christian.jpg"]);
                    var inside_christian = PIXI.Texture.fromImage(Main.ASSETS["levels/christian/backgrounds/inside-christian.jpg"]);

                    //PIXI.Texture.addTextureToCache(texture_christian, "texture-christian");
                    PIXI.Texture.addTextureToCache(background_christian, "background-christian");
                    PIXI.Texture.addTextureToCache(inside_christian, "inside-christian");

                    AssetLoader.christian_additional = true;
                    this._onCompleteCallback();
				}
				break;
			case "bamse":
				if(AssetLoader.bamse_additional){
					if(this._onCompleteCallback != null) {
						this._onCompleteCallback();
					}
                } else {
                    //var texture_bamse = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/bamse/texture-bamse.png"]);
                    var background_bamse = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/bamse/backgrounds/background-bamse.jpg"]);
                    var inside_bamse = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/bamse/backgrounds/inside-bamse.jpg"]);

                    //PIXI.Texture.addTextureToCache(texture_bamse, "texture-bamse");
                    PIXI.Texture.addTextureToCache(background_bamse, "background-bamse");
                    PIXI.Texture.addTextureToCache(inside_bamse, "inside-bamse");
                    AssetLoader.bamse_additional = true;
                    this._onCompleteCallback();
					//this._assetLoader.load();
				}
				break;
			case "skaeg":
				if(AssetLoader.skaeg_additional){
                    if (this._onCompleteCallback != null) {
                        console.log("LET'S GO!")
						this._onCompleteCallback();
					}
                } else {
                    
                    //var texture_skaeg = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/skaeg/texture-skaeg.png"]);
                    var background_skaeg = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/skaeg/backgrounds/background-skaeg.jpg"]);
                    var inside_skaeg = PIXI.Texture.fromImage(Main.ASSETS["media/rosa/levels/skaeg/backgrounds/inside-skaeg.jpg"]);

                    //PIXI.Texture.addTextureToCache(texture_skaeg, "texture-skaeg");
                    PIXI.Texture.addTextureToCache(background_skaeg, "background-skaeg");
                    PIXI.Texture.addTextureToCache(inside_skaeg, "inside-skaeg");
                        
                    AssetLoader.skaeg_additional = true;
                    console.log("Before");
                    this._onCompleteCallback();
                    console.log("After");
					//this._assetLoader.load();
				}
				break;
			// case "mille":
			// 	this._assetLoader
             //        .add("texture-mille_data", AssetLoader.MEDIA_PATH + "levels/mille/texture-mille.json")
             //        .add("texture-mille", AssetLoader.MEDIA_PATH + "levels/mille/texture-mille.png")
             //        .add("background-mille", AssetLoader.MEDIA_PATH + "levels/mille/backgrounds/background-mille.jpg")
             //        .add("inside-mille", AssetLoader.MEDIA_PATH + "levels/mille/backgrounds/inside-mille.jpg");
			// 	break;
		}
	}

	//// private additionalAssetsLoaded = (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) :void => {
	//// 	Logger.log(this, "additionalAssetsLoaded  resources == " + resources);
 //   //
	//// 	let characterName:string = Model.getInstance().getSelectedCharName();
	//// 	let textureName:string = "texture-" + characterName;
 //   //
	//// 	let textureAtlasData = this.factory.parseTextureAtlasData(resources[textureName].data, resources[textureName].texture);
 //   //
	//// 	// let textureAtlas:TextureAtlas = AssetLoader.getInstance().assets.getTextureAtlas(textureName); //TODO
	//// 	// this.factory.addTextureAtlas(textureAtlasData, characterName);
 //   //
	//// 	// .add("texture-christian_data", AssetLoader.MEDIA_PATH + "levels/christian/texture-christian.json")
 //    //     //    .add("texture-christian", AssetLoader.MEDIA_PATH + "levels/christian/texture-christian.png")
 //    //     //    .add("background-christian", AssetLoader.MEDIA_PATH + "levels/christian/backgrounds/background-christian.jpg")
 //    //     //    .add("inside-christian", AssetLoader.MEDIA_PATH + "levels/christian/backgrounds/inside-christian.jpg");
 //   //
	//// 	if(this._onCompleteCallback != null) {
	//// 		this._onCompleteCallback();
	//// 	}
	//// }

	private loadProgressHandler = (loader, resource) :void => {
		//Display the file `url` currently being loaded  console.log("loading: " + resource.url);
		// Display the precentage of files currently loaded  console.log("progress: " + loader.progress + "%");


		// If you gave your files names with the `add` method, you can access
		// them like this
		// Logger.log(this, "loadProgressHandler loading: " + resource.name+" : loader.progress == "+loader.progress);



		// Logger.log(this, "* load: " + resource.url);
		// Logger.log(this, "* load: " + resource.json);
		// Logger.log(this, "* load: " + loader.progress);
		//let key = resource.url;
		//let json = resource.json;
		//
		//this.loadedData[key] = json;

		// function setup() {  console.log("All files loaded");}
	}


	//public loadSoundUrl(onCompleteCallback:Function):void{

	//	this._onCompleteCallback = onCompleteCallback;
	//	Logger.log(this, "loadSoundUrl   this._onCompleteCallback == "+this._onCompleteCallback);
	//	this._assetLoadQueue = new LoadQueue(true, null, true);
	//	this._assetLoadQueue.installPlugin(<any>createjs.Sound);
	//	//this._assetLoadQueue.setMaxConnections(8); // Allow multiple concurrent loads - taken out, was causing hang on load for slower connections july_15
	//	this._assetLoadQueue.on(AssetLoader.QUEUE_COMPLETE, (e: createjs.Event) => { this.onSoundLoadComplete(e) });
	//	this._assetLoadQueue.on(AssetLoader.QUEUE_PROGRESS, (e: createjs.Event) => { this.handleSoundProgress(e) });
	//	// this._assetLoadQueue.on(AssetLoader.QUEUE_FILE_LOAD, (e: createjs.Event) => { this.handleFileLoad(e) });
	//	this._assetLoadQueue.on(AssetLoader.QUEUE_ERROR, (e: createjs.Event) => { this.loadSoundError(e) });


	//	// TODO sound manifests not working on external load
	//	AssetLoader.soundsManifest = [];

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/04_Rosa_02-billeder-af-farve.mp3", id:"04_Rosa_02-billeder-af-farve"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/04_Rosa_02-billeder-af-form.mp3", id:"04_Rosa_02-billeder-af-form"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/04_Rosa_02-billeder-af-smag.mp3", id:"04_Rosa_02-billeder-af-smag"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/08_Rosa_02-saa-er-kagen-klar-til-ovn.mp3", id:"08_Rosa_02-saa-er-kagen-klar-til-ovn"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/08_Rosa_04-vil-du-saette-aeggeuret.mp3", id:"08_Rosa_04-vil-du-saette-aeggeuret"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/08_Rosa_05-saa-er-der-vist-en-kage-der-vil-ud-af-ovnen.mp3", id:"08_Rosa_05-saa-er-der-vist-en-kage-der-vil-ud-af-ovnen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/08_Rosa_06-uhm-den-dufter-godt.mp3", id:"08_Rosa_06-uhm-den-dufter-godt"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/10_Rosa_01-saa-er-kagen-faerdig-lad-os-komme-afsted-med-den.mp3", id:"10_Rosa_01-saa-er-kagen-faerdig-lad-os-komme-afsted-med-den"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/10_Rosa_03-lad-os-komme-afsted-med-den.mp3", id:"10_Rosa_03-lad-os-komme-afsted-med-den"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/11_Rosa_01-ok-nu-ringer-jegpaa-saa.mp3", id:"11_Rosa_01-ok-nu-ringer-jegpaa-saa"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/11_Rosa_02-det-harvaeret-superfedt-at-bage-med-dig.mp3", id:"11_Rosa_02-det-harvaeret-superfedt-at-bage-med-dig"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/11_Rosa_03-held-og-lykke-med-at-aflevere-kagen.mp3", id:"11_Rosa_03-held-og-lykke-med-at-aflevere-kagen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/12_Rosa_01-godt-gaaet.mp3", id:"12_Rosa_01-godt-gaaet"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/diceSwing3.mp3", id:"diceSwing3"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/ffffffp.mp3", id:"ffffffp"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/fx_hologram_zapzoing.mp3", id:"fx_hologram_zapzoing"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/fx_mysterio_boot_dr.mp3", id:"fx_mysterio_boot_dr"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/fx_swish01_low.mp3", id:"fx_swish01_low"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/fx_swish02.mp3", id:"fx_swish02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/fx_tok.mp3", id:"fx_tok"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/hardStep_A.mp3", id:"hardStep_A"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/hardStep_B.mp3", id:"hardStep_B"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/rub-squeak.mp3", id:"rub-squeak"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s03-skridt-1.mp3", id:"s03-skridt-1"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s03-skridt-A.mp3", id:"s03-skridt-A"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s03-skridt-B.mp3", id:"s03-skridt-B"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s04-kamera.mp3", id:"s04-kamera"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s05-magnetklik_01.mp3", id:"s05-magnetklik_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s05-magnetklik_02.mp3", id:"s05-magnetklik_02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-dej-aaeg.mp3", id:"s06-dej-aaeg"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_kakao_01.mp3", id:"s06-ny_kakao_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_maelk_01.mp3", id:"s06-ny_maelk_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_maelk_haelder.mp3", id:"s06-ny_maelk_haelder"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_mel_01.mp3", id:"s06-ny_mel_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_mel_kommer_i_01.mp3", id:"s06-ny_mel_kommer_i_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_olie_01.mp3", id:"s06-ny_olie_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_olie_02.mp3", id:"s06-ny_olie_02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_sukker_01.mp3", id:"s06-ny_sukker_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s06-ny_sukker_haelder03.mp3", id:"s06-ny_sukker_haelder03"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08a-dej-kant-ny.mp3", id:"s08a-dej-kant-ny"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08a-dej-splat.mp3", id:"s08a-dej-splat"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-ny_ovn_01.mp3", id:"s08b-ny_ovn_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-ny_ovn_02.mp3", id:"s08b-ny_ovn_02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-ny_ovn_03.mp3", id:"s08b-ny_ovn_03"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-ny_ovn_04.mp3", id:"s08b-ny_ovn_04"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-nyt_ur_ding03.mp3", id:"s08b-nyt_ur_ding03"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-nyt_ur_saettes01.mp3", id:"s08b-nyt_ur_saettes01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08b-nyt_ur_tikker02.mp3", id:"s08b-nyt_ur_tikker02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s11-Bamse-speaks-nej-en-laekker-kage-du-har-bagt.mp3", id:"s11-Bamse-speaks-nej-en-laekker-kage-du-har-bagt"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s11-door_open_01.mp3", id:"s11-door_open_01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s11-klokke_02.mp3", id:"s11-klokke_02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/scene0Swing.mp3", id:"scene0Swing"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/smallTableSound1.mp3", id:"smallTableSound1"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/smallTableSound2.mp3", id:"smallTableSound2"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/smallTableSound3.mp3", id:"smallTableSound3"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/smallTableSound4.mp3", id:"smallTableSound4"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/smallTableSound5.mp3", id:"smallTableSound5"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/smallTableSound6.mp3", id:"smallTableSound6"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/stufIntheback.mp3", id:"stufIntheback"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/swish_fast_low.mp3", id:"swish_fast_low"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/swish.mp3", id:"swish"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/triple_swoosh_hi.mp3", id:"triple_swoosh_hi"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/hov/s03-Bamse-speaks-Hov-hvad-var-det-2.mp3", id:"s03-Bamse-speaks-Hov-hvad-var-det-2"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/hov/s03-Bamse-speaks-Hov-hvad-var-det.mp3", id:"s03-Bamse-speaks-Hov-hvad-var-det"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite00-molodi.mp3", id:"s03-bamse-speaks-intro-bite00-molodi"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite01-jodlelohoohoo.mp3", id:"s03-bamse-speaks-intro-bite01-jodlelohoohoo"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite02-jodlesangen.mp3", id:"s03-bamse-speaks-intro-bite02-jodlesangen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite04-bummelummelum.mp3", id:"s03-bamse-speaks-intro-bite04-bummelummelum"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite05-sulten.mp3", id:"s03-bamse-speaks-intro-bite05-sulten"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/slut/S11_bamse_thanks.mp3", id:"S11_bamse_thanks"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/slut/s11-01-Bamse-speaks-nej-en-laekker-kage-du-har-bagt.mp3", id:"s11-01-Bamse-speaks-nej-en-laekker-kage-du-har-bagt"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/bamse/spotted/s03-Bamse-speaks-ikke-set-foer.mp3", id:"s03-Bamse-speaks-ikke-set-foer"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/hov/s03-kristian-speaks-hmm.mp3", id:"s03-kristian-speaks-hmm"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/hov/s03-kristian-speaks-hoerte_du_det.mp3", id:"s03-kristian-speaks-hoerte_du_det"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/hov/s03-kristian-speaks-hov_hvad_var_det.mp3", id:"s03-kristian-speaks-hov_hvad_var_det"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/hov/s03-kristian-speaks-sikke_en_underlig_lyd.mp3", id:"s03-kristian-speaks-sikke_en_underlig_lyd"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle1.mp3", id:"s03-kristian-speaks-idle1"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle2.mp3", id:"s03-kristian-speaks-idle2"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle3.mp3", id:"s03-kristian-speaks-idle3"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/slut/S11_christian_thanks.mp3", id:"S11_christian_thanks"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/slut/s11-01-kristian-speaks-ej_hvor_ser_den_kage_laekker_ud_er_den_til_mig.mp3", id:"s11-01-kristian-speaks-ej_hvor_ser_den_kage_laekker_ud_er_den_til_mig"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/kristian/spotted/s03-kristian-speaks-hvad_i_alverden_ikke_set_foer.mp3", id:"s03-kristian-speaks-hvad_i_alverden_ikke_set_foer"});

	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/hov/s03-mille-speaks-hvad_er_det_for_en_underlig_lyd.mp3", id:"s03-mille-speaks-hvad_er_det_for_en_underlig_lyd"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/hov/s03-mille-speaks-jeg_synes_jeg_horte_noget.mp3", id:"s03-mille-speaks-jeg_synes_jeg_horte_noget"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/idle/s03_mille_speaks_gribe_himstergimsfuglen.mp3", id:"s03_mille_speaks_gribe_himstergimsfuglen"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/idle/s03_mille_speaks_hvorfor_virker_kameraet_nu_ikke.mp3", id:"s03_mille_speaks_hvorfor_virker_kameraet_nu_ikke"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/idle/s03-mille_speaks_pas_paa_fuglen_noedlander.mp3", id:"s03-mille_speaks_pas_paa_fuglen_noedlander"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/slut/s11_1_mille_speaks_hyggeligt_du_kom.mp3", id:"s11_1_mille_speaks_hyggeligt_du_kom"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/slut/s11_2_mille_speaks_megasjov_kage.mp3", id:"s11_2_mille_speaks_megasjov_kage"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/spotted/s03-mille-speaks-hvad_i_alverden_ikke_set_foer.mp3", id:"s03-mille-speaks-hvad_i_alverden_ikke_set_foer"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/spotted/s03-mille-speaks-hvad_var_det.mp3", id:"s03-mille-speaks-hvad_var_det"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/ubrugt/s01-mille-speaks-boernebanden_til_at_hjaelpe.mp3", id:"s01-mille-speaks-boernebanden_til_at_hjaelpe"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/ubrugt/s01-mille-speaks-byde_fuglen_paa_kage.mp3", id:"s01-mille-speaks-byde_fuglen_paa_kage"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/mille/ubrugt/s01-mille-speaks-hej_godt_at_se_dig.mp3", id:"s01-mille-speaks-hej_godt_at_se_dig"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-hmmm_mystisk.mp3", id:"s03-skaeg-speaks-hmmm_mystisk"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-hov_hvad_var_det.mp3", id:"s03-skaeg-speaks-hov_hvad_var_det"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-sikke_en_umderlig_lyd.mp3", id:"s03-skaeg-speaks-sikke_en_umderlig_lyd"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-en_to_og_der_er_tre.mp3", id:"s03-skaeg-speaks-en_to_og_der_er_tre"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-fire_og_fem_og_seks_er_derovre.mp3", id:"s03-skaeg-speaks-fire_og_fem_og_seks_er_derovre"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-hvor_pokker_er_syv.mp3", id:"s03-skaeg-speaks-hvor_pokker_er_syv"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/slut/s11-01-skaeg-speaks-kage_til_mig.mp3", id:"s11-01-skaeg-speaks-kage_til_mig"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/slut/s11-02-skaeg-speaks-skal_vi_ikke_smage_paa_kagen.mp3", id:"s11-02-skaeg-speaks-skal_vi_ikke_smage_paa_kagen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/char-speaks/skaeg/spotted/s03-skaeg-speaks-hvad_i_alverden_er_det.mp3", id:"s03-skaeg-speaks-hvad_i_alverden_er_det"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/00_Rosa_12-ejd-det-tror-jeg-ikke-er-den-helt-rigtige.mp3", id:"00_Rosa_12-ejd-det-tror-jeg-ikke-er-den-helt-rigtige"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/00_Rosa_36-det-tror-jeg-han-bliver-glad-for-det-her.mp3", id:"00_Rosa_36-det-tror-jeg-han-bliver-glad-for-det-her"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/01_Rosa_01-hej-vil-du-vaere.mp3", id:"01_Rosa_01-hej-vil-du-vaere"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/02_Rosa_01-ok-nu-gaelder-det-om.mp3", id:"02_Rosa_01-ok-nu-gaelder-det-om"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/02_Rosa_02-nu-skal-vi-snige-os-forbi.mp3", id:"02_Rosa_02-nu-skal-vi-snige-os-forbi"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/03_Rosa_01-ja.mp3", id:"03_Rosa_01-ja"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/03_Rosa_02-hvor-er-du-god.mp3", id:"03_Rosa_02-hvor-er-du-god"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/03_Rosa_03-forsigtig.mp3", id:"03_Rosa_03-forsigtig"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/03_Rosa_04-aah-nej.mp3", id:"03_Rosa_04-aah-nej"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/03_Rosa_05-oev-vi-maa-proeve-igen.mp3", id:"03_Rosa_05-oev-vi-maa-proeve-igen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/03_Rosa_06-tryk-paa-skaermen-for-at-gp.mp3", id:"03_Rosa_06-tryk-paa-skaermen-for-at-gp"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_01-yes-vi-klarede-det.mp3", id:"04_Rosa_01-yes-vi-klarede-det"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_02-nu-skal-vi-tage-billeder.mp3", id:"04_Rosa_02-nu-skal-vi-tage-billeder"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_03-ja-saadan-se-ud.mp3", id:"04_Rosa_03-ja-saadan-se-ud"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_04-super-det-er-en-god-smag.mp3", id:"04_Rosa_04-super-det-er-en-god-smag"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_05-ja-flot-farve.mp3", id:"04_Rosa_05-ja-flot-farve"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_06-det-tror-jeg-smag.mp3", id:"04_Rosa_06-det-tror-jeg-smag"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_07-snupper-du-ikke-et-spionbillede-af-den.mp3", id:"04_Rosa_07-snupper-du-ikke-et-spionbillede-af-den"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_08-godt-klaret-lad-os-komme-tilbage.mp3", id:"04_Rosa_08-godt-klaret-lad-os-komme-tilbage"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_09-tryk-rund-til-du-finder.mp3", id:"04_Rosa_09-tryk-rund-til-du-finder"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/04_Rosa_10-mon-vi-kan-taende-for-mysterio.mp3", id:"04_Rosa_10-mon-vi-kan-taende-for-mysterio"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/05_Rosa_01-ok-kagespion.mp3", id:"05_Rosa_01-ok-kagespion"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_01-vi-starter-med-at-lave-en-dej.mp3", id:"06_Rosa_01-vi-starter-med-at-lave-en-dej"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_02-yes-den-skal-i.mp3", id:"06_Rosa_02-yes-den-skal-i"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_03-ja-den-skal-i.mp3", id:"06_Rosa_03-ja-den-skal-i"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_04-yes.mp3", id:"06_Rosa_04-yes"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_05-den-er-god.mp3", id:"06_Rosa_05-den-er-god"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_06-ja.mp3", id:"06_Rosa_06-ja"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_07-saadan.mp3", id:"06_Rosa_07-saadan"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_19-smag_milk.mp3", id:"06_Rosa_19-smag_milk"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_20-smag_sugar.mp3", id:"06_Rosa_20-smag_sugar"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_21-smag_yeast.mp3", id:"06_Rosa_21-smag_yeast"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/06_Rosa_24-smag_cacao.mp3", id:"06_Rosa_24-smag_cacao"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_01-vi-skal-finde-den-helt-rigtige-kagesmag.mp3", id:"07_Rosa_01-vi-skal-finde-den-helt-rigtige-kagesmag"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_03-uf-den-er-sur.mp3", id:"07_Rosa_03-uf-den-er-sur"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_07-ahr-det-er-laekkert.mp3", id:"07_Rosa_07-ahr-det-er-laekkert"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_10-det-smager-ikke-rigtig-afsaa-meget-det-her.mp3", id:"07_Rosa_10-det-smager-ikke-rigtig-afsaa-meget-det-her"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_11-smag_flour.mp3", id:"07_Rosa_11-smag_flour"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_12-smag_oil.mp3", id:"07_Rosa_12-smag_oil"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_14-uh-det-er--en-god-kagesamg.mp3", id:"07_Rosa_14-uh-det-er--en-god-kagesamg"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/07_Rosa_18-uhmm-der-har-du-fundet-noget_hodt_noget.mp3", id:"07_Rosa_18-uhmm-der-har-du-fundet-noget_hodt_noget"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/08_Rosa_01-saa-ksla-der-blandes-med-fingere-eller-haandmixer.mp3", id:"08_Rosa_01-saa-ksla-der-blandes-med-fingere-eller-haandmixer"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/09_Rosa_01-nu-er-det-tid-til-at-skaere-kagen.mp3", id:"09_Rosa_01-nu-er-det-tid-til-at-skaere-kagen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/09_Rosa_02-nu-skal-vi-have-pyntet-kagen.mp3", id:"09_Rosa_02-nu-skal-vi-have-pyntet-kagen"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/09_Rosa_03-ej-hvor-bliver-den-flot.mp3", id:"09_Rosa_03-ej-hvor-bliver-den-flot"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/09_Rosa_04-det-bliver-atlsaa-en-superflot-kage.mp3", id:"09_Rosa_04-det-bliver-atlsaa-en-superflot-kage"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/09_Rosa_05-ja-det-ser-godt-ud.mp3", id:"09_Rosa_05-ja-det-ser-godt-ud"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/09_Rosa_06-uhm-den-bliver-rigtig-laekker.mp3", id:"09_Rosa_06-uhm-den-bliver-rigtig-laekker"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/Freemode_rosa.mp3", id:"Freemode_rosa"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/s08a-dej_rammer_kant-01.mp3", id:"s08a-dej_rammer_kant-01"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/s08a-dej_rammer_kant-02.mp3", id:"s08a-dej_rammer_kant-02"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/spotted.mp3", id:"spotted"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/ui/ui_klik.mp3", id:"ui_klik"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/music/rosa-hyggeloop.mp3", id:"MUSIC_ROSA_HYGGE"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/music/rosa-spion-nature.mp3", id:"MUSIC_ROSA_SPION_NATURE"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/music/rosa-spion-urban.mp3", id:"MUSIC_ROSA_SPION_URBAN"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/music/rosa-walking-loop.mp3", id:"MUSIC_ROSA_WALKING"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/music/rosa-spion.mp3", id:"MUSIC_ROSA_SPION_INSIDE"});

	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/S08a-dej_mixer_loop_01.mp3", id:"mixer1"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/S08a-dej_mixer_loop_02.mp3", id:"mixer2"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/S08a-dej_mixer_loop_03.mp3", id:"mixer3"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/S06-ny_finger_i_dej_01.mp3", id:"finger"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/S08a_dej_rammer_kant_01", id:"mixerkant1"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/code-triggered/S08a_dej_rammer_kant_02", id:"mixerkant2"});
	//	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/S08a-dej-kant-ny.mp3", id:"mixerkant3"});
	//	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "sounds/s08a-dej-splat.mp3", id:"dejsplat"});

	//	this._assetLoadQueue.loadManifest(AssetLoader.soundsManifest, true);

	//}

	//private loadSoundError = (event:createjs.Event):void => {
	//	try{
	//		Logger.log(this, "AssetLoader loadSoundError event == "+event);
	//	} catch (error) {
	//		Logger.log(this, "AssetLoader loadSoundError");
	//	}
	//}

	//private onSoundLoadComplete = (e:createjs.Event):void => {
	//	Logger.log(this, "AssetLoader onSoundLoadComplete");

	//	Logger.log(this, "AssetLoader onSoundLoadComplete   this._onCompleteCallback ===== "+this._onCompleteCallback);
	//	this._assetLoadQueue.off(AssetLoader.QUEUE_COMPLETE, (e: createjs.Event) => { this.onSoundLoadComplete(e) });
	//	// this._assetLoadQueue.off(AssetLoader.QUEUE_FILE_LOAD, (e: createjs.Event) => { this.handleFileLoad(e) });
	//	this._assetLoadQueue.off(AssetLoader.QUEUE_PROGRESS, (e: createjs.Event) => { this.handleSoundProgress(e) });
	//	this._assetLoadQueue.off(AssetLoader.QUEUE_ERROR, (e: createjs.Event) => { this.loadSoundError(e) });

	//	if(this._onCompleteCallback != null) {
	//		this._onCompleteCallback();
	//		this._onCompleteCallback = null;
	//	}
	//}

	//private handleSoundProgress = (event:createjs.Event):void => {
	//	if(this._assetLoadQueue.progress < 1) {
	//		var val:number = this._assetLoadQueue.progress;
	//		// this.loaderProgressGx.scaleX = Number(val * 1);
	//		// Logger.log(this, "handleSoundProgress loading: val ======= " + val);
	//		this.progressBar.ratio = val;
	//	}
	//}


	//public removeTexture(name:string, dispose:boolean):void {
	//	AssetLoader.assets.removeTexture(name, dispose);
	//}

	public removeTexture(name:string, dispose:boolean):void {
		// AssetLoader.assets.removeTexture(name, dispose);
		Logger.log(this, "removeTexture TODO  name == "+name);
	}
    //
	//public removeTextureAtlas(name:string, dispose:boolean):void {
	//	let ass:AssetManager = AssetLoader.assets;
	//	AssetLoader.assets.removeTextureAtlas(name, dispose);
	//}

	public removeTextureAtlas(name:string, dispose:boolean):void {
		// let ass:AssetManager = AssetLoader.assets;
		// AssetLoader.assets.removeTextureAtlas(name, dispose);
		Logger.log(this, "removeTextureAtlas TODO  name == "+name);
	}
    //
	//public dispose():void{
	//	AssetLoader.assets.purge();
	//}
    //
	////public static listLoadedAssets():void {
	////	for (let ib:string of AssetLoader.assets.getTextureNames()) {
	////	//for each (let ib:string in AssetLoader.assets.getTextureNames()){
	////		Logger.log(this, "Asset:" + ib);
	////	}
	////}

	//destroy() :void {
	//	if(this.progressBar != null) {
	//		this.stage.removeChild(this.progressBar);
	//		this.progressBar.destroy();
	//		this.progressBar = null;
	//	}

	//	if(this._assetLoadQueue != null) {
	//		this._assetLoadQueue.off(AssetLoader.QUEUE_COMPLETE, (e: createjs.Event) => {
	//			this.onSoundLoadComplete(e)
	//		});
	//		// this._assetLoadQueue.off(AssetLoader.QUEUE_FILE_LOAD, (e: createjs.Event) => { this.handleFileLoad(e) });
	//		this._assetLoadQueue.off(AssetLoader.QUEUE_PROGRESS, (e: createjs.Event) => {
	//			this.handleSoundProgress(e)
	//		});
	//		this._assetLoadQueue.off(AssetLoader.QUEUE_ERROR, (e: createjs.Event) => {
	//			this.loadSoundError(e)
	//		});
	//		this._assetLoadQueue = null;
	//	}
	//}




	/////////////////////TEMP TEST /////////////////////////////////////////////////////////

	// this.dragPos = new PIXI.Point();
	// this.lastDragPos = new PIXI.Point();
	//
	// let sprite:PIXI.Sprite = new PIXI.Sprite(resources["Scene4_bamse_bg"].texture);
	// AssetLoader.getInstance().stage.addChild(sprite);

	//let slice1 = PIXI.Sprite.fromFrame("edge_01");
	// this.slice1 = PIXI.Sprite.fromFrame("cameraFreemode.png");
	// Logger.log(this, "onAssetsLoaded slice1 == "+this.slice1);
	//
	// if(this.slice1) {
	//
	// 	// enable the bunny to be interactive... this will allow it to respond to mouse and touch events
	// 	this.slice1.interactive = true;
	// 	// this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
	// 	this.slice1.buttonMode = true;
	// 	// center the bunny's anchor point
	// 	this.slice1.anchor.set(0.5);
	//
	//
	// 	// events for drag start
	// 	this.slice1.on('mousedown', this.onDragStart);
	// 	this.slice1.on('touchstart', this.onDragStart);
	// 	// events for drag end
	// 	this.slice1.on('mouseup', this.onDragEnd);
	// 	this.slice1.on('mouseupoutside', this.onDragEnd);
	// 	this.slice1.on('touchend', this.onDragEnd);
	// 	this.slice1.on('touchendoutside', this.onDragEnd);
	// 	// events for drag move
	// 	this.slice1.on('mousemove', this.onDragMove);
	// 	this.slice1.on('touchmove', this.onDragMove);
	//
	// 	// move the sprite to its designated position
	// 	this.slice1.position.x = 300;
	// 	this.slice1.position.y = 200;
	// 	// this.slice1.alpha = .5;
	//
	// 	AssetLoader.getInstance().stage.addChild(this.slice1);
	// }

	// Logger.log(this, "onAssetsLoaded this._onCompleteCallback == "+this._onCompleteCallback);

// }
//
// private onDragStart = (event: PIXI.interaction.InteractionEvent) => {
// 	if(event && event.data){
// 		try{
// 			let localPoint:PIXI.Point = event.data.getLocalPosition(this.slice1.parent, this.lastDragPos);
// 			// Logger.log(this, "onDragStart localPoint == "+localPoint.x+" : "+localPoint.y);
// 			this.dragging = true;
// 		} catch (Error) {
// 			Logger.log(this, "ERROR onDragStart");
// 		}
// 	}
// }
//
// private onDragEnd = () => {
// 	this.dragging = false;
// }
//
// private onDragMove = (event: PIXI.interaction.InteractionEvent) => {
// 	if (this.dragging) {
// 		// Logger.log(this, "onDragMove event == "+event+"  : event.data == "+event.data);
// 		if(event && event.data){
// 			try{
// 				let localPoint:PIXI.Point = event.data.getLocalPosition(this.slice1.parent, this.dragPos);
// 				// let mouseData = renderer.plugins.interaction.mouse.global;
// 				this.slice1.position.x += (this.dragPos.x - this.lastDragPos.x);
// 				this.slice1.position.y += (this.dragPos.y - this.lastDragPos.y);
// 				localPoint = event.data.getLocalPosition(this.slice1.parent, this.lastDragPos);
// 				// Logger.log(this, "onDragMove localPoint == "+localPoint.x+" : "+localPoint.y);
// 			} catch (Error) {
// 				Logger.log(this, "ERROR onDragMove");
// 			}
//
// 		}
// 	}
// }
//
//
// public loadImages():void{
//
// 	//let loader = PIXI.loader.add('image1', 'image1.png').add('image2', 'image2.png').on("progress", loadProgressHandler).once('complete', this.loadComplete).load();
// 	//PIXI.loader  .add([    "images/one.png",    "images/two.png",    "images/three.png"  ])  .on("progress", loadProgressHandler)  .load(setup);
//
// 	// spritesheet
// 	//PIXI.loader.add("sheet", "mysheet.json").load(this.loadComplete);
// 	//
// 	//this._loader = PIXI.loader.add('cloudstars',"imgs/cloudstars.jpg")
// 	//	.add('star1',"imgs/star1.png").add('star2',"imgs/star2.png")
// 	//	.add('star3',"imgs/star3.png").add('star4',"imgs/star4.png")
// 	//	.add('ship',"imgs/ship_blue.png").add('shield_straight',"imgs/shield_straight.png")
// 	//	.add('shield_edge',"imgs/shield_edge.png").add('title_ship',"imgs/title_ship.png")
// 	//	.load(this.loadComplete);
// }
//

//
// private loadComplete = (loader, resources):void => {
// 	Logger.log(this, " load complete");
// 	//this.init();
//
// 	this._sprites.cloudstars = new PIXI.extras.TilingSprite(resources.cloudstars.texture);
// 	this._sprites.star1 = new PIXI.extras.TilingSprite(resources.star1.texture);
// 	this._sprites.star2 = new PIXI.extras.TilingSprite(resources.star2.texture);
// 	this._sprites.star3 = new PIXI.extras.TilingSprite(resources.star3.texture);
// 	this._sprites.star4 = new PIXI.extras.TilingSprite(resources.star4.texture);
// 	this._sprites.ship = new PIXI.Sprite(resources.ship.texture);
// 	this._sprites.shield_straight = new PIXI.Sprite(resources.shield_straight.texture);
// 	this._sprites.shield_edge = new PIXI.Sprite(resources.shield_edge.texture);
// 	this._sprites.title_ship = new PIXI.Sprite(resources.title_ship.texture);
// 	//let ready = setTimeout(accountSetup,3000);
//
//
// 	//spritesheet
// 	resources.sheet.textures['some_frame.png'];
// }

	//public loadAdditional(additionalDir:string, callback:Function):void {
	//	let resolvedDir:File = StarlingHelper.getAppDir().resolvePath(additionalDir);
	//
	//	AssetLoader.assets.enqueue(resolvedDir);
	//
	//	AssetLoader.assets.loadQueue(function(ratio:Number):void
	//	{
	//		Logger.log(this, "Loading assets, progress:", ratio);
	//
	//		if (ratio == 1.0) {
	//			let assets:AssetManager = AssetLoader.assets;
	//			callback();
	//		}
	//	});
	//}
	//

/////////////////////////////////// test webgl resize //////////////////////////////
	// Get A WebGL context
	/** @type {HTMLCanvasElement} */
	// this.rosaCanvas = document.getElementById("rosaCanvas") as HTMLCanvasElement;
	// this.gl = this.rosaCanvas.getContext("webgl");
	// Logger.log(this, "MAIN init   :  rosaCanvas == "+this.rosaCanvas);
	// Logger.log(this, "MAIN init   :  gl == "+this.gl);
	// if (!this.gl) {
	// 	return;
	// }

	// this.resize(this.gl.canvas);
	// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// When you need to set the viewport to match the size of the canvas's
	// drawingBuffer this will always be correct
	// this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

	// let width = this.gl.canvas.clientWidth;
	// let height = this.gl.canvas.clientHeight;

	// gl.canvas.width = width * aspect;
	// gl.canvas.height = height * aspect;

	// perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);




	// checkRender() {
	// 	// Logger.log(this, "Main checkRender  this.gl.canvas == "+this.gl.canvas);
	// 	Logger.log(this, "Main checkRender  this.needToRender == "+this.needToRender);
	// 	// if (this.resize(this.gl.canvas) || this.needToRender) {
	// 	if (this.rescale() || this.needToRender) {
	// 		this.needToRender = false;
	// 		Logger.log(this, "Main checkRender");
	// 		// drawStuff();
	// 	}
	// 	requestAnimationFrame(this.checkRender);
	// }

	// private rescale() {
	// 	Main.ratio = Math.min(window.innerWidth / AssetLoader.STAGE_WIDTH, window.innerHeight / AssetLoader.STAGE_HEIGHT)
	// 	this.width = this.defaultWidth * Main.ratio;
	// 	this.height = this.defaultHeight * Main.ratio;
	// 	if(AssetLoader.getInstance().renderer){
	// 		AssetLoader.getInstance().renderer.resize(this.width, this.height);
	// 	}
	//
	// }
	// public static applyRatio(displayObj: PIXI.DisplayObject, ratio: number) {
	// 	if (ratio == 1) {
	//
	// 	}else{
	// 		let object: any = displayObj;
	// 		object.position.x = object.position.x * ratio;
	// 		object.position.y = object.position.y * ratio;
	// 		object.scale.x = object.scale.x * ratio;
	// 		object.scale.y = object.scale.y * ratio;
	//
	// 		for (let i = 0; i < object.children.length; i++) {
	// 			Main.applyRatio(object.children[i], ratio);
	// 		}
	// 	}
	//
	// }


	// resize(canvas) {
	// 	let realToCSSPixels = window.devicePixelRatio;
	//
	// 	// Lookup the size the browser is displaying the canvas in CSS pixels
	// 	// and compute a size needed to make our drawingbuffer match it in
	// 	// device pixels.
	// 	let displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
	// 	let displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
	//
	// 	// Check if the canvas is not the same size.
	// 	if (canvas.width  !== displayWidth ||
	// 		canvas.height !== displayHeight) {
	//
	// 		// Make the canvas the same size
	// 		canvas.width  = displayWidth;
	// 		canvas.height = displayHeight;
	// 		return true;
	// 	}
	// 	return false;
	//
	// }


///////////////////////////////////////////////////////////////////////////////////////
}
