//import {CameraShot} from "./src.NZGenerator.src.dk.nozebra.rosa.components";


	//import flash.display.Bitmap;
	//import flash.display.BitmapData;
	//import flash.display.Loader;
	//import PIXI.Graphics;
	//import flash.events.ErrorEvent;
	//import PIXI.utils.EventEmitter;
	//import PIXI.utils.EventEmitterDispatcher;
	//import flash.events.IOErrorEvent;
	//import flash.events.MediaEvent;
	//import flash.events.ProgressEvent;
	//import flash.geom.Matrix;
	//import flash.geom.Point;
	//import flash.geom.PIXI.Rectangle;
	//import flash.media.CameraRoll;
	//import flash.media.CameraUI;
	//import flash.media.MediaPromise;
	//import flash.media.MediaType;

	//import soulwire.utils.display.Alignment;
	//import soulwire.utils.display.DisplayUtils;
	//
	//import starling.core.Starling;
	//import starling.display.Image;
	//import starling.textures.Texture;

import {Logger} from "src/loudmotion/utils/debug/Logger";

export class CameraShot extends PIXI.utils.EventEmitter {
	// private _cameraUI:CameraUI; //TODO need camera support
	// private _cameraRoll:CameraRoll;
	// private imageLoader:Loader;

	private someTime:number = 0;

	// public lastSnapshotThumbnailPIXI.Sprite; //TODO
	public lastSnapshotThumbnail:PIXI.Sprite;

	// Test Image for desktop
	//[Embed(source = "/../media/rosa/1.jpg"]
	// private Picture:Class; //TODO

	//public CameraShot()
	//{
	//}

	public takeShot():void{
		Logger.log(this, "CameraShot takeShot");
		this.openCamera();
		//asyncImageLoaded(null);
	}

	private openCamera():void{
		Logger.log(this, "CameraShot openCamera : TODO");
		// if(CameraUI.isSupported){ //TODO need camera support
		// 	if(!this._cameraUI) this._cameraUI = new CameraUI();
		// 	this._cameraUI.addListener(MediaEvent.COMPLETE, this.onSelected);
		// 	this._cameraUI.addListener(PIXI.utils.EventEmitter.CANCEL, this.cancelled);
		// 	this._cameraUI.addListener(ErrorEvent.ERROR, this.errorHandler);
		// 	this._cameraUI.launch(MediaType.IMAGE);
		// }
	}

	private openRoll():void{
		Logger.log(this, "CameraShot openRoll : TODO");
		// if(CameraRoll.supportsBrowseForImage){ //TODO need camera support
		// 	if(!this._cameraRoll) this._cameraRoll = new CameraRoll();
		// 	this._cameraRoll.addListener(MediaEvent.SELECT, this.onSelected);
		// 	this._cameraRoll.addListener(PIXI.utils.EventEmitter.CANCEL, this.cancelled);
		// 	this._cameraRoll.browseForImage();
		// } else {
		// 	Logger.log(this, "No way jose");
		// }
	}

	protected errorHandler(event:ErrorEvent):void{
		// TODO Auto-generated method stub

	}

	protected cancelled(event:PIXI.utils.EventEmitter):void{
		// TODO Auto-generated method stub

	}

	// protected onSelected(event:MediaEvent):void{ //TODO
	protected onSelected(event:Event):void{
		// if(this._cameraUI){ //TODO need camera support
		// 	this._cameraUI.removeListener(MediaEvent.COMPLETE, this.onSelected);
		// 	this._cameraUI.removeListener(PIXI.utils.EventEmitter.CANCEL, this.cancelled);
		// 	this._cameraUI.removeListener(ErrorEvent.ERROR, this.errorHandler);
		// }
		// if(this._cameraRoll){
		// 	this._cameraRoll.removeListener(MediaEvent.SELECT, this.onSelected);
		// 	this._cameraRoll.removeListener(PIXI.utils.EventEmitter.CANCEL, this.cancelled);
		// }

		// let imagePromise:MediaPromise = event.data;
		//
		// if( imagePromise.isAsync ){
		// 	this.imageLoader = new Loader();
		// 	this.imageLoader.contentLoaderInfo.addListener( PIXI.utils.EventEmitter.COMPLETE, this.asyncImageLoaded );
		// 	imagePromise.addListener(ProgressEvent.PROGRESS, this.onProgressAsync)
		// 	this.imageLoader.addListener( IOErrorEvent.IO_ERROR, this.cameraError );
		// 	this.imageLoader.loadFilePromise( imagePromise );
		// }else{
		// 	this.imageLoader.loadFilePromise( imagePromise );
		// }
		//addLoaderBar()
	}

	protected onProgressAsync(e:ProgressEvent):void{
		// let progress:number = (e.bytesLoaded/e.bytesTotal)
		//soundBar.scaleY = progress*0.9
	}

	protected cameraError(error:ErrorEvent):void{
		// Logger.log(this,  "Error:" + error.text );
		Logger.log(this,  "Error:" + error );
	}

	protected asyncImageLoaded(event:PIXI.utils.EventEmitter):void{
		Logger.log(this, "CameraUI imagePromise DONE loading")

		//removeSoundBar()
		//destroyImage()
		// let snapImgPIXI.Sprite;
		//
		// let bmd:BitmapData = Bitmap(this.imageLoader.content).bitmapData;
		// let bitm:Bitmap = Bitmap(this.imageLoader.content);
		//
		// //let bitm:Bitmap = new Picture();
		//
		// let smallerTexture:BitmapData;
		//
		// let matrix:Matrix = DisplayUtils.fitIntoRect(bitm, new PIXI.Rectangle(0, 0, Starling.current.stage.stageWidth, AssetLoader.STAGE_HEIGHT), true, Alignment.MIDDLE, false);
		// smallerTexture = new BitmapData(bitm.width*matrix.a, bitm.height*matrix.a, false, 0)
		// smallerTexture.draw(bitm, matrix)
		//
		// this.lastSnapshotThumbnail = this.createThumbnail(smallerTexture, 180, 155, false, false);
		//

		// dispatchEvent(new Event(Event.COMPLETE));
	}

	// private createThumbnail(sourceBMD:BitmapData, width:number, height:number, cropToCircle:boolean, center:boolean)PIXI.Sprite{
	private createThumbnail(sourceBMD:PIXI.Sprite, width:number, height:number, cropToCircle:boolean, center:boolean):PIXI.Sprite {
		// let imageSourceBitmapData:BitmapData;
		//
		// if (cropToCircle){
		// 	let ellipse:PIXI.Graphics = new PIXI.Graphics();
		// 	// ellipse.graphics.beginFill(0xFFFFFF);
		// 	ellipse.beginFill(0xFFFFFF);
		// 	ellipse.drawCircle(sourceBMD.width / 2, sourceBMD.height / 2, sourceBMD.height / 2);
		// 	ellipse.endFill();
		//
		// 	let ellipseBitmap:BitmapData = new BitmapData(sourceBMD.width, sourceBMD.height, true, 0x00000000 );
		// 	ellipseBitmap.draw( ellipse );
		//
		// 	imageSourceBitmapData = new BitmapData(sourceBMD.width, sourceBMD.height, true, 0x00000000);
		// 	imageSourceBitmapData.copyPixels(sourceBMD, imageSourceBitmapData.rect, new PIXI.Point(), ellipseBitmap, new PIXI.Point(), true );
		// } else {
		// 	imageSourceBitmapData = sourceBMD;
		// }
		//
		// let thumbBitmap:Bitmap = DisplayUtils.createThumb(imageSourceBitmapData, width, height, Alignment.MIDDLE, true);
		// let thumbNailPIXI.Sprite = new Image(Texture.fromBitmapData(thumbBitmap.bitmapData, true));
		let thumbNail:PIXI.Sprite; //TODO added temp
		// if (center){
		// 	thumbNail.x = -(thumbNail.width/2) - 4;
		// 	thumbNail.y = -(thumbNail.height/2)-4;
		// }

		return thumbNail;
	}

	// private rotateBitmapData( bitmapData:BitmapData, degree:number = 0 ) :BitmapData {
	private rotateBitmapData( bitmapData:PIXI.Sprite, degree:number = 0 ) :PIXI.Sprite {
		// let newBitmap:BitmapData;
		let newBitmap:PIXI.Sprite; //TODO added temp

		// let matrix:Matrix = new Matrix();
		// matrix.rotate( degree * (Math.PI / 180)  );
		//
		// if ( degree == 90 ) {
		// 	newBitmap = new BitmapData( bitmapData.height, bitmapData.width, true );
		// 	matrix.translate( bitmapData.height, 0 );
		// } else if ( degree == -90 || degree == 270) {
		// 	newBitmap = new BitmapData( bitmapData.height, bitmapData.width, true );
		// 	matrix.translate( 0, bitmapData.width );
		// } else if ( degree == 180 ) {
		// 	newBitmap = new BitmapData( bitmapData.width, bitmapData.height, true );
		// 	matrix.translate( bitmapData.width, bitmapData.height );
		// }else if(degree == 0){
		// 	newBitmap = new BitmapData( bitmapData.width, bitmapData.height, true );
		// 	//matrix.translate( bitmapData.width, bitmapData.height );
		// }
		//
		// newBitmap.draw( bitmapData, matrix, null, null, null, true );

		return newBitmap;
	}

	private traceTime(str:string):void {
		// let myDate:Date = new Date();
		// Logger.log(this, str+" timer: "+Number(myDate.time - this.someTime));
		// this.someTime = myDate.time;
		Logger.log(this, str+" timer: "+Number(Date.now() - this.someTime));
		this.someTime = Date.now();
	}
}
