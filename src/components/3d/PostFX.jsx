import { EffectComposer, SSAO, Vignette, DepthOfField } from "@react-three/postprocessing";

function PostFX() {
  return (
    <EffectComposer enableNormalPass>
        <DepthOfField focusDistance={0.5} focalLength={10} bokehScale={2} />
        <Vignette eskil={false} offset={0.5} darkness={0.43}/>
        <SSAO
          samples={8}
          rings={4}
          distanceFalloff={0.5}
          intensity={0.5}
          radius={1.0}
          luminanceInfluence={0.5} 
        />
    </EffectComposer>
  );
}

export default PostFX;
