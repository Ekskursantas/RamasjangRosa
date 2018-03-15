//package dk.nozebra.rosa.model
//{
//	import flash.display.BitmapData;
//
//	import dk.nozebra.rosa.util.AssetLoader;
//
//	import dragonBones.factorys.CreatejsFactory;
//
//	import starling.display.HTMLImageElement;
//	import Graphics;
//	import starling.display.Sprite;
//	import starling.textures.RenderTexture;
//	import starling.textures.Texture;
//	import starling.utils.AssetManager;

//import {CreatejsFactory} from "src/dragonBones/factory/CreatejsFactory";

import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import Graphics = PIXI.Graphics;
import RenderTexture = PIXI.RenderTexture;

export class Model {
	public static SNAPSHOTS_TOTAL_NUMBER:number = 3;

	public static CHAR_CHRISTIAN:number = 0;
	public static CHAR_BAMSE:number = 1;
	public static CHAR_SKAEG:number = 2;
	public static CHAR_MILLE:number = 3;

	public static MODE_STORY:number = 0;
	public static MODE_FREE:number = 1;

	public static SCENE_INTRO:number = 0;
	public static SCENE_PICK_CHAR:number = 1;
	public static SCENE_PICK_DISGUISE:number = 2;
	public static SCENE_SNEAK_GAME:number = 3;
	public static SCENE_GATHER_CLUES:number = 4;
	public static SCENE_PRESENT_CLUES:number = 5;
	public static SCENE_BASIC_INGREDIENTS:number = 6;
	public static SCENE_SPECIAL_INGREDIENTS:number = 7;
	public static SCENE_MIXING:number = 8;
	public static SCENE_OVEN:number = 9;
	public static SCENE_CUT_CAKE:number = 10;
	public static SCENE_DECORATE_CAKE:number = 11;
	public static SCENE_WALK:number = 12;
	public static SCENE_CHAR_THANKS:number = 13;
	public static SCENE_PRESENT_CAKE:number = 14;

	// Looping sounds
	public static MUSIC_ROSA_HYGGE:string = "MUSIC_ROSA_HYGGE";
	public static MUSIC_ROSA_SPION_NATURE:string = "MUSIC_ROSA_SPION_NATURE";
	public static MUSIC_ROSA_SPION_URBAN:string = "MUSIC_ROSA_SPION_URBAN";
	public static MUSIC_ROSA_WALKING:string = "MUSIC_ROSA_WALKING";
	public static MUSIC_ROSA_SPION_INSIDE:string = "MUSIC_ROSA_SPION_INSIDE";

	// SoundVolumes
	public static VOLUME_MUSIC:number = 0.4;
	public static VOLUME_MUSIC_LOW:number = 0.2;
	public static VOLUME_SPEAK:number = 1;
	public static VOLUME_FX:number = 1;

	/**
	 * Static: a reference to the instance of the class
	 */
	private static _instance:Model;

	// public characters:string[] = ["christian", "bamse", "skaeg", "mille"]; //TODO missing Mille
	// public tasteArmatureNames:string[] = ["Taste_christian", "Taste_2_bamse", "pandekageogIs", "Taste_4_mille"];

	public characters:string[] = ["christian", "bamse", "skaeg"];
	public tasteArmatureNames:string[] = ["Taste_christian", "Taste_2_bamse", "pandekageogIs"];

	public selectedChar:number = 0;
	public selectedDisguise:number = 0;

	public usedDisguises:boolean[];

	public gameMode:number = Model.MODE_STORY;

	public snapShots:Sprite[]; // TODO was Vector.<HTMLImageElement>

	// public cakeMask:Graphics;
	// public cakeMask:Sprite;
	public cakeCut:Sprite;
	public cake:Sprite;
	public cakeTexture:RenderTexture;

	public charIsSelected:boolean = false;

	public factory:dragonBones.PixiFactory;

	public static currentTimeout:number;

	/**
	 * Singleton enhancer to secure only one instance in the application
	 */
	private static _isSingleton:boolean = false;

	constructor() {
		//super();
	}

	/**
	 * Retrieves the instance available of the class in the application.
	 * If the available instance has yet not been created, the method instantiates the class
	 * @return
	 *
	 */
	public static getInstance():Model{
		if (Model._instance == null){
			Model._instance = new Model();
			Model._instance.init();

		}
		return Model._instance;
	}

	private init():void {
		Logger.log(this, "Model init");


		//BookView.bookviewMC = new libBook.BookViewMC_LFF();
		//BookView.bookviewMC.x = 0;
		//BookView.bookviewMC.y = 3;
		//this.mc.addChild(BookView.bookviewMC);
		//BookView.bookviewMC.name = "bookviewMC";
		//this.pagesView = new PagesView(new createjs.Container());
		//this.onAddedToStage();
		//this.initialize();
	}

	public static destroySingleton():void {
		if (Model._instance) {
			Model._instance.destroy();
		}
	}

	public reset():void {
		if (Model._instance.usedDisguises == null) {
			Model._instance.usedDisguises = [false, false, false]; //TODO was new Vector.<Boolean>(3)
		}

		this.resetSnapshots();
	}

	public resetSnapshots() : void {
		this.snapShots = []; //TODO was new Vector.<HTMLImageElement>(3)

		//let assetManager:AssetManager = AssetLoader.assets;

		//if (!assetManager) {
		//	return; // This was probably called when fetching assets but it'll be falled again in Scene_01
		//}

		for (let i:number = 0; i < Model.SNAPSHOTS_TOTAL_NUMBER; i++) {
			this.snapShots[i] = this.createEmptyPolaroidImage();
		}
	}

	private createEmptyPolaroidImage() : Sprite {
		Logger.log(this, "Model createEmptyPolaroidImage");
		//new Texture(new BaseTexture(someImage));
		let emptyPolaroidImage:Sprite;
		// let texture:Texture = Model.assetLoader.assets.getTexture("cameraFreemode.png");
		//let emptyPolaroidImage:Sprite = new HTMLImageElement(texture);
		emptyPolaroidImage = Sprite.fromFrame("cameraFreemode.png");
		let polaroidScale:number = 0.4;
		emptyPolaroidImage.width = 418 * polaroidScale;
		emptyPolaroidImage.height = 373 * polaroidScale;
		return emptyPolaroidImage;
	}

	public getSelectedCharName():string {
		Logger.log(this, "Model getSelectedCharName == "+this.characters[this.selectedChar]);
		return this.characters[this.selectedChar];
	}

	public doesSelectedDisguiseMatchCharacter():boolean
	{
		Logger.log(this, "Model doesSelectedDisguiseMatchCharacter this.selectedChar == "+this.selectedChar);
		Logger.log(this, "Model doesSelectedDisguiseMatchCharacter this.selectedDisguise == "+this.selectedDisguise);
		return (this.selectedChar == this.selectedDisguise);
	}

	public initialize():void
	{
	}

	public destroy():void {
		//this.removeListeners(); //TODO
		Model._instance = null;
	}

}