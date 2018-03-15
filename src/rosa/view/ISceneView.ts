//package dk.nozebra.rosa.view
//{
//	import dk.nozebra.rosa.generated.common.armatures.TypedDBFactory;

import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export interface ISceneView {
	setup(typeddb:TypedDBFactory):void;
	teardown():void;
}
