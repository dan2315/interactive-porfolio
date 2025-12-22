import InteractiveGLTFModel from "./InteractiveGLTFModel";

function Cartridge({id, ...props}) {
    return (
        <InteractiveGLTFModel
            url="/models/cartridge.glb"
            {...props}
        />
    )
}

export default Cartridge;