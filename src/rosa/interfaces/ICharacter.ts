//package dk.nozebra.rosa.interfaces
//{
//	import dk.nozebra.rosa.typeddb.interfaces.IArmatureProxy";



import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";

export interface ICharacter extends IArmatureProxy {
	gotoIdle1():void;
	gotoIdle2():void;
	gotoIdle3():void;
	gotoSpottet():void;
}
