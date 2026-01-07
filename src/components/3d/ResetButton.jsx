import { useSceneStore } from "../../stores/SceneStore";
import GLTFModel from "./GLTFModel";
import models from "../../data/models.json"
import { useState } from "react";
import { ModifiedSelect } from "./SelectionAPI";

function ResetButton() {
    const [hovered, setHovered] = useState(false);
    const resetScene = useSceneStore(s => s.triggerReset);
    return <ModifiedSelect enabled={hovered}>
    <GLTFModel
        id={"resetbutton"}
        url={models.resetbutton.path}
        contentLength={models.resetbutton.contentLength}
        position={[-32.6, 4.75, 6.8]}
        rotation={[0, -1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerUp={(e) => {
            e.stopPropagation();
            resetScene();
        }}
        colliderSize = {[0.2, 0.2, 0.2]}
    />
    </ModifiedSelect>
}

export default ResetButton;