//package dk.nozebra.rosa.typeddb.interfaces
//{

import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";

export interface IDragable extends IArmatureProxy {
	gotoDrag():void;
	gotoDefault():void;
	gotoDrop():void;

}
