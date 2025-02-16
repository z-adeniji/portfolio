<script lang="ts">
    import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte'
    import type CameraControls from './CameraControls.svelte';

    let { startPage, homeScreenPage = $bindable(), homeScreenPageText = $bindable(), currentIsland = $bindable() } = $props();
    let controls: CameraControls;

</script>

<div class="w-full h-full bg-gradient-to-b from-[#ffd9e5] to-[#e98097]">
    <Canvas>
        <Scene startPage={startPage} bind:controls bind:homeScreenPage={homeScreenPage} bind:homeScreenPageText={homeScreenPageText} bind:currentIsland={currentIsland}/>
    </Canvas>
</div>