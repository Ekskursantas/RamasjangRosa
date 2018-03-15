//package dk.nozebra.rosa.dragdrop
//{
//	import flash.geom.Point;
//	import flash.geom.PIXI.Rectangle;
//
//	import starling.core.Starling;
//	import starling.display.PIXI.DisplayObject;
//	import starling.display.Image;
//	import starling.display.PIXI.Sprite;
//	import starling.display.Stage;
//	import starling.events.EventDispatcher;
//	import starling.events.Touch;
//	import starling.events.TouchEvent;
//	import starling.events.TouchPhase;


import {AssetLoader} from "src/rosa/util/AssetLoader";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";
import Point = PIXI.Point;
import InteractionEvent = PIXI.interaction.InteractionEvent;
import {SpriteHelper} from "../../loudmotion/utils/SpriteHelper";
import {SceneEvent} from "../events/SceneEvent";
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import Graphics = PIXI.Graphics;

//export final class DragManager extends EventDispatcher {
// export class DragManager extends PIXI.utils.EventEmitter {
export class DragManager extends Sprite {
	/**
	 * Static: a reference to the instance of the class
	 */
	private static _instance:DragManager;

	/**
	 * Singleton enhancer to secure only one instance in the application
	 */
	private static _isSingleton:boolean   = false;


	private _isDragging:boolean  = false;
	public _draggedObject:Sprite;
	public _dropTarget:Sprite;
	public _rosaTarget:Sprite;
	private _draggedPuzzleId:number;
	private _startDragPoint:Point = new Point();
	private _stage:Container;

	private touchOffset:Point;
	private mouseDown: boolean;

	private _startingPoint:Point;

	set startingPoint(value: Point) {
		this._startingPoint = value;
	}

	get startingPoint():Point {
		return this._startingPoint;
	}

	private _scene:Sprite;


	constructor() {
		super();
		if(!DragManager._isSingleton){
			throw(new Error());
		}
		this.initialize();
	}

	public get isDragging():boolean  {
		return this._isDragging;
	}

	/**
	 * Retrieves the instance available of the class in the application.
	 * If the available instance has yet not been created, the method instantiates the class
	 * @return
	 *
	 */
	public static getInstance():DragManager {
		if(!DragManager._instance) {
			DragManager._isSingleton = true;
			DragManager._instance = new DragManager();
			DragManager._isSingleton = false;
		}
		return DragManager._instance;
	}


	public initialize():void {
		// this._stage = Starling.current.stage;
		//this._stage = AssetLoader.getInstance().stage;
	}

	public startDrag(scene:Sprite, sprite:Sprite, puzzleId:number, startingPoint:Point):void {

			this._scene = scene;
			this._startingPoint = startingPoint;
			this._isDragging = true;
			this._draggedObject = sprite;
			this._draggedPuzzleId = puzzleId;
			this._startDragPoint.x = this._draggedObject.x;
			this._startDragPoint.y = this._draggedObject.y;

			Logger.log(this, "startDrag this._rosaTarget == "+this._rosaTarget.x+" : "+this._rosaTarget.y+" : "+this._rosaTarget.getBounds().width+" : "+this._rosaTarget.getBounds().height);
			Logger.log(this, "startDrag this._dropTarget == "+this._dropTarget.x+" : "+this._dropTarget.y+" : "+this._dropTarget.getBounds().width+" : "+this._dropTarget.getBounds().height);
			Logger.log(this, "startDrag this._draggedObject == "+this._draggedObject.x+" : "+this._draggedObject.y+" : "+this._draggedObject.getBounds().width+" : "+this._draggedObject.getBounds().height);

			try{
				this._scene.setChildIndex(this._draggedObject, this._scene.children.length-1);
			} catch (Error) {
				Logger.log(this, "ERROR this._scene.setChildIndex(this._draggedObject, this._scene.children.length-1)");
			}


			this._draggedObject.x = this.startingPoint.x;
			this._draggedObject.y = this.startingPoint.y;


			Logger.log(this, "startDrag touchDown  this._draggedObject.x === "+this._draggedObject.x+" : "+this._draggedObject.y);

			this._draggedObject.on(TouchEvent.TOUCH, this.touchDown);
			this._draggedObject.on(TouchEvent.TOUCH_END, this.touchDone);
			this._draggedObject.on(TouchEvent.TOUCH_OUT, this.touchDone);
			this._draggedObject.on(TouchEvent.TOUCH_MOVE, this.touchMove);

	}

	public reset():void {
		this._draggedObject = null;
	}

	public stopDrag = ():void => {
		Logger.log(this, "stopDrag");
		if(this._isDragging){
			this._isDragging = false;
			// this._stage.removeListener("TOUCH", this.onStageTouch);
			this._draggedObject.off(TouchEvent.TOUCH, this.touchDown);
			this._draggedObject.off(TouchEvent.TOUCH_END, this.touchDone);
			this._draggedObject.off(TouchEvent.TOUCH_OUT, this.touchDone);
			this._draggedObject.off(TouchEvent.TOUCH_MOVE, this.touchMove);
		}
	}

	private touchDown = (event:TouchEvent):void => {
		this.mouseDown = true;
		// this._target.showOpened();
		// this.playExpressionSpeak();

	}

	private touchMove = (event:InteractionEvent):void => {
		if(this.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			let mousePosition: Point = event.data.getLocalPosition(this);
			this._draggedObject.x = Math.abs(mousePositionCanvas.x);
			this._draggedObject.y = Math.abs(mousePositionCanvas.y);

			if(this._dropTarget != null) {
				let hit: boolean = SpriteHelper.hitTest(this._draggedObject.getBounds(), this._dropTarget.getBounds());
				Logger.log(this, "touchDone this._draggedObject === " + this._draggedObject + " : this._draggedObject.getBounds ==  " + this._draggedObject.getBounds());
				Logger.log(this, "touchDone this._dropTarget === " + this._dropTarget + " : this._dropTarget.getBounds ==  " + this._dropTarget.getBounds());
				Logger.log(this, "touchMove hit === " + hit);
			}


			if(this._rosaTarget != null) {
				let hitRosa: boolean = SpriteHelper.hitTest(this._draggedObject.getBounds(), this._rosaTarget.getBounds());
				// Logger.log(this, "touchDone this._draggedObject === "+this._draggedObject+" : this._draggedObject.getBounds ==  "+this._draggedObject.getBounds());
				// Logger.log(this, "touchDone this._dropTarget === "+this._dropTarget+" : this._dropTarget.getBounds ==  "+this._dropTarget.getBounds());
				Logger.log(this, "touchMove hitRosa === " + hitRosa);
			}
		}
	}

	private touchDone = (event:InteractionEvent):void => {
		this.mouseDown = false;

		if(this._dropTarget != null) {
			let hit: boolean = SpriteHelper.hitTest(this._draggedObject.getBounds(), this._dropTarget.getBounds());
			Logger.log(this, "touchDone this._draggedObject === " + this._draggedObject + " : this._draggedObject.getBounds ==  " + this._draggedObject.getBounds());
			Logger.log(this, "touchDone this._dropTarget === " + this._dropTarget + " : this._dropTarget.getBounds ==  " + this._dropTarget.getBounds());
			Logger.log(this, "touchDone hit === " + hit);

			if (hit) {
				// this._draggedObject.off(TouchEvent.TOUCH, this.touchDown);
				// this._draggedObject.off(TouchEvent.TOUCH_END, this.touchDone);
				// this._draggedObject.off(TouchEvent.TOUCH_OUT, this.touchDone);
				// this._draggedObject.off(TouchEvent.TOUCH_MOVE, this.touchMove);
                //
				// this._draggedObject.x = this.startingPoint.x;
				// this._draggedObject.y = this.startingPoint.y;

				this.emit(SceneEvent.DRAG_ITEM_DROPPED, this);
			} else {
				TweenLite.to(this._draggedObject, .4, {
					x: this._startingPoint.x,
					y: this._startingPoint.y
				});
			}
		}

		if(this._rosaTarget != null) {
			let hitRosa: boolean = SpriteHelper.hitTest(this._draggedObject.getBounds(), this._rosaTarget.getBounds());
			// Logger.log(this, "touchDone this._draggedObject === "+this._draggedObject+" : this._draggedObject.getBounds ==  "+this._draggedObject.getBounds());
			// Logger.log(this, "touchDone this._dropTarget === "+this._dropTarget+" : this._dropTarget.getBounds ==  "+this._dropTarget.getBounds());
			Logger.log(this, "touchDone hitRosa === " + hitRosa);
		}
	}


	// private onStageTouch (event:TouchEvent):void {
	private onStageTouch = (event:PIXI.utils.EventEmitter):void => {
		Logger.log(this, "onStageTouch");


		// let t:Touch = event.getTouch(this._stage, TouchPhase.MOVED);


		// if(t) {
		// 	let deltaX:number = (t.globalX - t.previousGlobalX);
		// 	let deltaY:number = (t.globalY - t.previousGlobalY);
		//
		// 	//Logger.log(this, "deltaX:" + deltaX);
		// 	//Logger.log(this, "before:" + _draggedObject.x);
		//
		// 	this._draggedObject.x += deltaX;
		// 	this._draggedObject.y += deltaY;
		//
		// 	//Logger.log(this, "after:" + _draggedObject.y);
		//
		// 	// let location:PIXI.Point = t.getLocation(Starling.current.stage)
		// 	let location:PIXI.Point = t.getLocation(PIXI.Container);
		// 	//Logger.log(this, "point:" + location);
		//
		// 	// let ib:PIXI.DisplayObject = Starling.current.stage.hitTest(location, true);
		// 	// let ib:PIXI.DisplayObject = PIXI.DisplayObject.hitTest(location, true); //TODO ?
		// 	let ib:PIXI.Graphics = new PIXI.Graphics();
		// 	ib.containsPoint(location); //contains


		//Logger.log(this, "target:" + ib);
		// }
	}
}
