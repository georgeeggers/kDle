<script>
    import Router from 'svelte-spa-router';
    import { routes } from './routes.svelte';
</script>


<div class="globalArea">
    <div class="mainArea">
        <Router {routes} />
    </div>
</div>

<style>
  .globalArea {
    width: 100vw;
    height: 100dvh;
  }

  .mainArea {
    width: 100%;
    height: 100%;
  }
</style>

