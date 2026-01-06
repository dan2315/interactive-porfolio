import { useSceneStore } from "../../stores/SceneStore";
import GLTFModel from "./GLTFModel";
import models from "../../data/models.json"

function ResetButton() {
    const resetScene = useSceneStore(s => s.triggerReset);
   return <GLTFModel
        id={"resetbutton"}
        url={models.resetbutton.path}
        contentLength={models.resetbutton.contentLength}
        position={[-32.6, 4.75, 6.8]}
        rotation={[0, -1, 0]}
        onPointerDown={(e) => {
            e.stopPropagation();
            resetScene();
        }}
        colliderSize = {[0.2, 0.2, 0.2]}
    />
}

export default ResetButton;