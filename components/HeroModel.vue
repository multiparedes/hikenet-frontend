<template>
  <div class="w-max-2xl h-full flex justify-center items-center z-0 relative">
    <transition-fade>
      <div
        v-if="!hasFinishLoading"
        class="absolute bg-grey-600 t-0 l-0 w-full h-full z-20 flex justify-center items-center text-black font-mono"
      >
        <div class="w-200px">Loading... {{ progress }} %</div>
      </div>
    </transition-fade>
    <transition-fade :duration="2000">
      <TresCanvas v-show="hasFinishLoading" v-bind="gl" preset="realistic">
        <TresPerspectiveCamera
          :position="[0, 0, 2]"
          :args="[45, 1, 0.1, 1000]"
        />
        <Suspense>
          <GLTFModel
            path="/aiguille_dibona.glb"
            scale="0.075"
            :rotation-y="Math.PI * 1.05"
          />
        </Suspense>

        <TresDirectionalLight
          :position="[3, 2, 0]"
          :intensity="1"
          cast-shadow
        />
        <TresAmbientLight :position="[2, 5, -2]" :intensity="0.75" />
      </TresCanvas>
    </transition-fade>
  </div>
</template>

<script setup lang="ts">
import { BasicShadowMap, SRGBColorSpace } from "three";
import { useProgress } from "@tresjs/cientos";
import { TransitionFade } from "@morev/vue-transitions";

const { hasFinishLoading, progress, items } = await useProgress();

const gl = {
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
};
</script>
