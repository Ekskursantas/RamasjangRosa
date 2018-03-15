//package dk.nozebra.rosa.interfaces
//{
//	import dk.nozebra.rosa.typeddb.interfaces.IArmatureProxy";


import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";

export interface IDisguise extends IArmatureProxy {
	gotoWalk():void;
	gotoSit():void;
	gotoIdle():void;
}
