import { EffectComposer, Vignette, DepthOfField, Outline } from "@react-three/postprocessing";

function PostFX() {
  return (
    <EffectComposer autoClear={false}>
        <DepthOfField focusDistance={0.5} focalLength={10} bokehScale={1.5} />
        <Vignette eskil={false} offset={0.5} darkness={0.43}/>
        <Outline
          visibleEdgeColor="cyan"
          hiddenEdgeColor="hotpink"
          edgeStrength={3}
          blur
        />
    </EffectComposer>
  );
}

export default PostFX;
