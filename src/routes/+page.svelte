<script lang="ts">
    import App from '$lib/components/App.svelte'
</script>

<div class="relative w-screen h-screen flex flex-col">
    <App/>
    <div class="absolute z-10 inset-0 top-0 w-full h-full flex flex-col items-center justify-center">
        <h1 class="font-terminal">Hi! My Name is Zainab 👋</h1>
        <h1 class="font-terminal text-center">I'm a Creative Developer/Software Engineer that specialises in making unique user experiences</h1>
        <button class="font-terminal bg-slate-500">Enter My Portfolio</button>
    </div>
</div>