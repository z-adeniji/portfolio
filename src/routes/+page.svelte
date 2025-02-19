<script lang='ts'>
    import App from '$lib/components/App.svelte'
	import { onMount, tick } from 'svelte';
    import { fade } from 'svelte/transition';
    import { longText } from '$lib';

    //vercel
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import { injectAnalytics } from '@vercel/analytics/sveltekit'
    
    let startPage = $state(true);
    let homeScreenPage: boolean = $state(false);
    let homeScreenPageText: boolean = $state(true);
    let input = $state(``);
    let lineIndex = $state(0);

    let displayText: string[][] = $state([['time', 'statement','this site will not work on mobile'], ['time', 'statement', 'type \'zainab run dev --open\' to enter']]);
    let cursorVisible = $state(true);

    let editableP: HTMLParagraphElement | undefined = $state();
    let currentIsland: string = $state('home');

    onMount(() => {
        window.addEventListener('focus', keepFocus);
        (async () => {
            await tick()
            if (editableP) {
                editableP.focus();
                setEndOfContenteditable(editableP);
            }
        })
        
        return () => {
            window.removeEventListener('focus', keepFocus);
        }
    })

    function setEndOfContenteditable(element: HTMLElement) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    function handleKeyDown(e: KeyboardEvent) {
        const now: Date = new Date();
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input === 'zainab run dev --open') {
                startPage = false
            } else {
                //dissect the input
                const command = input.split(' ');
                let errorMessage = '';
                let message = '';

                switch (command[0]) {
                    case 'zainab':
                        switch (command[1]) {
                            case undefined:
                                errorMessage = ``;
                                message = longText.packageManagerDesc;
                                break;
                            case 'run':

                                switch (command[2]) {
                                    case undefined:
                                        errorMessage = `type more stuff`
                                        break;
                                    case '--help':
                                        errorMessage = `just type 'zainab run dev --open' what's wrong with you?`
                                        break;
                                    case 'dev':
                                        if (command[3] === undefined) errorMessage = `nearly there... use the '--open' tag to open 'portfolio' in your browser`;
                                        break;
                                    default:
                                        errorMessage = `type more stuff`
                                        break;
                                }
                                break;

                            default:
                                errorMessage = `unknown script: ${command[1]}`
                                break;
                        }
                        break;
                    
                    case undefined:
                        errorMessage = `you didn't type anything :(`
                        break;
                    
                    default:
                        errorMessage = `unknown command: ${command[0]}`
                        break;
                }

                displayText.push(['', 'command',input]);
                lineIndex++;
                input = '';
                displayText.push([`${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}:${now.getSeconds()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`, errorMessage === '' ? 'statement' : 'error', errorMessage === '' ? message : errorMessage]);
                lineIndex++;
            }
        } else if (e.key === 'ArrowUp') {
            let found = false;
            if (lineIndex > 0) lineIndex--;

            while (lineIndex >= 0 && displayText.length > 2 && !found) {
                if (displayText[lineIndex + 2][1] === 'command') {
                    input = displayText[lineIndex + 2][2];
                    found = true;
                } else if (lineIndex + 2 > 2) {
                    lineIndex--;
                } else {
                    found = true;
                }
            }

        } else if (e.key === 'ArrowDown') {
            let found = false;
            if (lineIndex < displayText.length-2) lineIndex++;

            while (lineIndex <= displayText.length-3 && !found) {
                if (displayText[lineIndex + 2][1] === 'command') {
                    input = displayText[lineIndex + 2][2];
                    found = true;
                } else if (lineIndex === displayText.length-1) {
                    found = true;
                } else if (lineIndex + 2 < displayText.length-1) {
                    lineIndex++;
                } else {
                    console.log('this');
                    found = true;
                    input = ''
                }
            }
        }
    }

    setInterval(() => {
        cursorVisible = !cursorVisible
    }, 500);

    onMount(async () => {
        await tick()
        if (editableP) editableP.focus();
    })

    function keepFocus() {
        if (editableP) {
            editableP.focus();
            setEndOfContenteditable(editableP);
        }
    }

    injectSpeedInsights();
    injectAnalytics();
</script>

<style>
    .blinking-cursor {
        display: inline-block;
        width: 10px;
        height: 20px;
        background-color: white;
        animation: blink 1s step-end infinite;
        margin-left: 2px;
        vertical-align: bottom;
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }
</style>

<div class='relative w-screen h-screen flex'>
    <App startPage={startPage} bind:homeScreenPage={homeScreenPage} bind:homeScreenPageText={homeScreenPageText} bind:currentIsland={currentIsland}/>
    {#if startPage}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div transition:fade onclick={keepFocus} class='absolute z-10 inset-0 w-full min-h-screen overflow-y-auto flex flex-col bg-black p-4'>
            {#each displayText as line}
                <div class='flex flex-row'>
                    {#if line[1] === 'command'}
                        <p contenteditable='false' class='text-[#fd869c]'>zainab@portfolio ✨ %&nbsp;</p>
                        <p>{line[2]}</p>
                    {:else if line[1] === 'error'}
                        <p class="text-[#676767]">{line[0]}&nbsp;</p>
                        <p contenteditable='false' class='text-[#fe355d]'>[error] ❌ %&nbsp;</p>
                        <p class="text-[#fe355d]">{line[2]}</p>
                    {:else}
                        <p class="whitespace-pre">{line[2]}</p>
                    {/if}
                </div>
            {/each}
            <div class='flex flex-row'>
                <p contenteditable='false' class='text-[#fd869c]'>zainab@portfolio ✨ %&nbsp;</p>
                <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                <p class='bg-transparent caret-transparent w-auto whitespace-nowrap outline-none'
                    bind:innerText={input}
                    bind:this={editableP}
                    contenteditable='true'
                    onfocus={keepFocus}
                    onblur={keepFocus}
                    onkeydown={handleKeyDown}
                    spellcheck='false'
                    >
                </p>
                {#if cursorVisible}
                    <span contenteditable='false' class='blinking-cursor text-[#fef3f5]'></span>
                {/if}
            </div>
        </div>
    {:else if homeScreenPage}
        {#if homeScreenPageText}
            <div transition:fade class='absolute z-10 inset-0 top-0 w-full h-full flex flex-col items-center justify-end pointer-events-none'>
                <h1 class='text-lg'>Click on one of the islands ✨</h1>
            </div>
        {/if}
        {#if currentIsland !== 'home'}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div transition:fade class='absolute z-10 inset-0 top-0 w-full h-full flex flex-col items-center justify-end pointer-events-none'>
                <h1 class='text-lg'>Press esc to go back</h1>
            </div>
        {/if}
    {:else}
        <p>error</p>
    {/if}
</div>