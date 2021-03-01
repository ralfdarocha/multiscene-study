import { DragControls } from "three/examples/jsm/controls/DragControls";
import { Mesh } from "three/src/objects/Mesh";

interface ControlEvent {
    object:Mesh,
    target:DragControls,
    type:string
}