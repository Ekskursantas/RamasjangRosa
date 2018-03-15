//package dk.nozebra.rosa.events
//{
//	import starling.events.Event;

export class SceneEvent extends PIXI.utils.EventEmitter {
// export class SceneEvent extends PIXI.DisplayObject {
	public static SCENEEVENT:string = "SceneEvent";
	public static JUMP:string = "SceneEvent.jump";
	public static NEXT:string = "SceneEvent.next";
	public static PREVIOUS:string = "SceneEvent.previous";
	public static REPLAY_FREEMODE:string = "SceneEvent.replayFreeMode";
	public static REPLAY_STORY:string = "SceneEvent.replayStoryMode";

	static FRONTPAGE_EXITED:string = "SceneEvent.frontpageExited";
	static DRAG_ITEM_DROPPED:string = "SceneEvent.dragItemDropped";

	static QUIT_APP:string = "SceneEvent.quitApp";
	static KILL_GAME:string = "SceneEvent.killGame";

	nextSceneIndex:number;

	type:string;

	constructor(type:string, nextSceneIndex:number, bubbles:boolean=false, data:Object=null){
		// (type, bubbles, data);
		super();
		this.type = type;
		this.nextSceneIndex = nextSceneIndex;
	}
}
