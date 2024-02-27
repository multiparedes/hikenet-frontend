<template>
  <div class="w-max-2xl h-full flex justify-center items-center z-0 relative">
    <TresCanvas v-bind="gl" preset="realistic">
      <TresPerspectiveCamera :position="[0, 0, 2]" :args="[45, 1, 0.1, 1000]" />

      <Suspense>
        <GLTFModel
          path="/aiguille_dibona.glb"
          scale="0.075"
          :rotation-y="Math.PI * 1.05"
        />
      </Suspense>

      <TresDirectionalLight :position="[3, 2, 0]" :intensity="1" cast-shadow />
      <TresAmbientLight :position="[2, 5, -2]" :intensity="0.75" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { BasicShadowMap, SRGBColorSpace } from "three";

const gl = {
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
};
</script>
