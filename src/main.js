import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import 'firebase/database'
import { createPinia } from 'pinia';
const pinia = createPinia()
const firebaseConfig = {
    apiKey: "AIzaSyA2kT_JotYqKl7e4lbnzdaZ8rYD1Z1fn6M",
    authDomain: "nasa-project-9640c.firebaseapp.com",
    databaseURL: "https://nasa-project-9640c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nasa-project-9640c",
    storageBucket: "nasa-project-9640c.appspot.com",
    messagingSenderId: "534618882708",
    appId: "1:534618882708:web:1753444e24fded17026a81",
    measurementId: "G-67MFDBC3S1"
};
initializeApp(firebaseConfig);
const app = createApp(App)
app.use(router).use(pinia)
app.directive('theme', {

    mounted(el, binding) {
      const darkTheme = binding.value;
      if (darkTheme) {
        el.classList.add('dark-theme');
      } else {
        el.classList.remove('dark-theme');
      }
    },

    updated(el, binding) {
      const darkTheme = binding.value;
      if (darkTheme) {
        el.classList.add('dark-theme');
      } else {
        el.classList.remove('dark-theme');
      }
    }
  });
  app.mount('#app')