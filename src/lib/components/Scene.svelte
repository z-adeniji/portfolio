<script lang="ts">
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';
    import { T, useTask, useThrelte} from '@threlte/core'
	import { Grid, interactivity, useCursor, Float, Text, useInteractivity, transitions } from '@threlte/extras';
    import { CatmullRomCurve3, Vector3, PerspectiveCamera, Object3D } from 'three';
    import CC from 'camera-controls'
    import CameraControls from './CameraControls.svelte';
	import { Spring } from 'svelte/motion';
    import { longText } from '$lib';
    import { fade } from './transitions';

    const { dom } = useThrelte();

    const { hovering, onPointerEnter: cursorEnter, onPointerLeave: cursorLeave } = useCursor();

    const curve = new CatmullRomCurve3([
        new Vector3(0, 10, 0),
        new Vector3(0, 10, 80),
        new Vector3(0, 15, 160),
        new Vector3(5, 10, 240),
        new Vector3(0, 10, 320),
        new Vector3(0, 10, 400),
    ], false);

    type Props = {
        startPage: boolean
        homeScreenPage: boolean
        homeScreenPageText: boolean
        controls: CC
        currentIsland: string
    }

    let { startPage, homeScreenPage = $bindable(), homeScreenPageText = $bindable(), controls = $bindable(), currentIsland = $bindable() }: Props = $props();
    let currentPosi: [number, number, number] = $state([0, 10, 0]);
    let lookAtPosi: [number, number, number] = $state([curve.getPointAt(0.01).x, curve.getPointAt(0.01).y, curve.getPointAt(0.01).z]);

    let pageActive = $derived(startPage || homeScreenPage ? true : false);
    let pan = $derived(!pageActive ? true : false);

    let colour: string = $state('');
    let progress = 0;

    //island coordinates
    type Coordinate = [number, number, number]
    const islandCoordinates = {
        home: [0,10,420] as Coordinate,
        about: [0,2,450] as Coordinate,
        contact: [-25,8,435] as Coordinate,
        projects: [20,5,440] as Coordinate
    }

    //camera stuff
    const camera = new PerspectiveCamera()
    controls = new CameraControls(camera, dom)
    controls.setLookAt(2, 15, 400, 0, 0, 450, true);
    controls.enabled = false;

    interactivity();
    const { pointer } = useInteractivity();

    const cameraTargetPos = new Spring(
        {
            x: ($pointer.x * 2) + 0,
            y: ($pointer.y * 2) + 10,
            z: 420
        },
        {
            precision: 0.000001
        }
    )

    let cameraTarget: Object3D | undefined = $state(undefined);

    useTask(() => {
        if (!camera || !cameraTarget ) return
        camera.lookAt(cameraTarget.position);
    })

    $effect(() => {
        let currentIslandPos: Coordinate | undefined = islandCoordinates[currentIsland as keyof typeof islandCoordinates];

        if (currentIslandPos) {
            cameraTargetPos.set(
                {
                    x: -($pointer.x * 2) + currentIslandPos[0],
                    y: ($pointer.y * 2) + currentIslandPos[1],
                    z: currentIslandPos[2]
                }
            )
        } 
    })

    function moveTo(x: number, y: number, z: number,   name: string) {
        homeScreenPageText = false;

        currentIsland = name;
        let currentIslandPos: Coordinate | undefined = islandCoordinates[name as keyof typeof islandCoordinates];
        if (currentIslandPos) {
            controls.setLookAt(x, y, z, currentIslandPos[0], currentIslandPos[1], currentIslandPos[2], true);
        } 
    }

    //colour stuff
    const onPointerEnter = () => {
        if (homeScreenPage) {
            cursorEnter();
        }
    };

    const onPointerLeave = () => {
        if (homeScreenPage) {
            cursorLeave();
        }
    };

    const {task: panToHomeScreen } = useTask(
        () => {
            const speed = 0.005
            progress += speed;

            if (progress >= 0.98) {
                homeScreenPage = true;
            }

            //get posi and lookat smoothly from the curve
            const currentPoint = curve.getPointAt(progress);
            const nextPoint = curve.getPointAt((progress + speed) % 1);

            currentPosi = [currentPoint.x, currentPoint.y, currentPoint.z];
            lookAtPosi = [nextPoint.x, nextPoint.y, nextPoint.z];
        },
        { autoStart: false },
    )

    $effect(() => {
        colour = $hovering ? '#ff0000' : '#ffffff';
        if (pan) {
            panToHomeScreen.start();
        } else {
            panToHomeScreen.stop();
        }
    });

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            currentIsland = 'home';
            moveTo(2,15,400,   "home");
        }
    }
    injectLookAtPlugin();
    transitions();
</script>

<!-- Detect keyboard stuff-->
<svelte:window on:keydown={handleKeyDown} />

<!-- Camera Target -->
<T.Object3D
    bind:ref={cameraTarget}
    position.x={cameraTargetPos.current.x}
    position.y={cameraTargetPos.current.y}
    position.z={cameraTargetPos.current.z}
/>

{#if pan}
<T.PerspectiveCamera makeDefault position={currentPosi} lookAt={lookAtPosi}>
</T.PerspectiveCamera>
{:else}
<T
    is={camera}
    position={currentPosi}
    lookAt={[cameraTargetPos.current.x, cameraTargetPos.current.y, cameraTargetPos.current.z]}
    makeDefault
/>
{/if}

<T.DirectionalLight position={[0, 10, 10]} castShadow />
<T.AmbientLight intensity={0.5} color="#ffd9e5"/>

<!-- About Page -->
 {#if currentIsland === 'about'}
    <T.Mesh position = {[10,15,450]} rotation.y={Math.PI} transition={fade()}>
        <Text
            text={longText.bio}
            fontSize={0.5}
            color="blue"
            textAlign="left"
            maxWidth={20}
            transition={fade()}
        />
    </T.Mesh>
{/if}
<T.Mesh position = {[0,2,450]} onpointerenter={onPointerEnter} onpointerleave={onPointerLeave} onclick={() => {moveTo(0,12,415,   "about")}}>
    <T.BoxGeometry args={[10, 1, 10]} />
    <T.MeshStandardMaterial color={colour} />
</T.Mesh>



<!-- Projects Page -->
<T.Mesh position = {[20,5,440]} onpointerenter={onPointerEnter} onpointerleave={onPointerLeave} onclick={() => {moveTo(5,10,410,   "projects")}}>
    <T.BoxGeometry args={[10, 1, 10]} />
    <T.MeshStandardMaterial color={colour} />
</T.Mesh>



<!-- Contact Page -->
<T.Mesh position = {[-25,20,435]} rotation.y={(7* Math.PI)/8}>
<Text
    text="Let's Connect!"
    fontSize={0.8}
    color="blue"
    textAlign="left"
    maxWidth={20}
/>
</T.Mesh>
<T.Mesh position = {[-25,8,435]} onpointerenter={onPointerEnter} onpointerleave={onPointerLeave} onclick={() => {moveTo(-3,15,410,   "contact")}}>
    <T.BoxGeometry args={[10, 1, 10]} />
    <T.MeshStandardMaterial color={colour} />
</T.Mesh>

<Grid infiniteGrid={true} />