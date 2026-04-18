<template>
  <div class="app-container">
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input type="radio" :value="temp" v-model="beverageStore.currentTemp" /> {{ temp }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input type="radio" :value="b" v-model="beverageStore.currentBase" /> {{ b.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input type="radio" :value="s" v-model="beverageStore.currentSyrup" /> {{ s.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input type="radio" :value="c" v-model="beverageStore.currentCreamer" /> {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <div v-if="!beverageStore.user">
      <button @click="beverageStore.withGoogle()">Sign in with Google</button>
    </div>
    <div v-else>
      <p>Welcome, {{ beverageStore.user.displayName }}!</p>
      <button @click="beverageStore.logout()">Sign Out</button>
    </div>

    <div class="actions">
      <input 
        type="text" 
        placeholder="Beverage Name" 
        v-model="beverageStore.currentName" 
      />
      
      <button 
        :disabled="!beverageStore.user || !beverageStore.currentName" 
        @click="handleMake"
      >
        🍺 Make Beverage
      </button>
    </div>

    <p v-if="!beverageStore.user">Please sign in to save your beverage.</p>

    <ul v-if="beverageStore.user">
  <li v-for="bev in beverageStore.beverages" :key="bev.id">
    <label>
      <input 
        type="radio" 
        name="savedBeverages" 
        @change="beverageStore.showBeverage(bev)"
      />
      {{ bev.name }}
    </label>
  </li>
</ul>
  </div>
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
const beverageStore = useBeverageStore();

const handleMake = async () => {
  const message = await beverageStore.makeBeverage();
  alert(message);
};

</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
</style>
