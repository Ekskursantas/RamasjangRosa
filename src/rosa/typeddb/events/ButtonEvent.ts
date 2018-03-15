//package dk.nozebra.rosa.typeddb.events
//{
//	import dk.nozebra.rosa.typeddb.interfaces.IButtonProxy;
//
//	import starling.events.Event;

import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
	
export class ButtonEvent extends Event {
	// Event types.
	public static CLICKED:string = "pointerdown";
	public static TOUCH:string = "touch";
	public button:IButtonProxy;

	public ButtonEvent(type:string, button:IButtonProxy, bubbles:boolean=false, data:Object=null) {
		//super(type, bubbles, data);
		//super(type, bubbles, data);
		this.button = button;
	}
}