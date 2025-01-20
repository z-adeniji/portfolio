<script lang="ts">
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';
    import { T, useTask} from '@threlte/core'
	import { Grid, MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras';
    import { CatmullRomCurve3, Vector3 } from 'three';

    let autoRotate: boolean = true;

    const curve = new CatmullRomCurve3([
        new Vector3(-5, 2, 0),  // Start point
        new Vector3(0, 10, 2),   // Midpoint with slight elevation
        new Vector3(5, 2, 0)    // End point, looping back to start
    ], true); // Enable closed loop

    //convert curve to an array of 100 points
    const points = curve.getPoints(100);
    let currentPosi: [number, number, number] = $state([0, 0, 0]);
    let lookAtPosi: [number, number, number] = $state([0, 0, 0]);
    let progress = 0;

    useTask(() => {
        const speed = 0.01
        progress += speed;
        if (progress >= 1) progress = 0;
        
        //get posi and lookat smoothly from the curve
        const currentPoint = curve.getPointAt(progress);
        const nextPoint = curve.getPointAt((progress + speed) %1);

        currentPosi = [currentPoint.x, currentPoint.y, currentPoint.z];
        lookAtPosi = [nextPoint.x, nextPoint.y, nextPoint.z];
    })
    injectLookAtPlugin();
</script>

<T.PerspectiveCamera makeDefault position={currentPosi} lookAt={lookAtPosi} />

<T.DirectionalLight position={[0, 10, 10]} castShadow />

<T.Mesh position.y = {3} scale={2} >
    <MeshLineGeometry {points} />
    <MeshLineMaterial color="hotpink" />
</T.Mesh>

<Grid infiniteGrid={true} />