<template>
    <div v-draggable class="modal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">


                <div class="modal-header">
                    <button type="button" class="close" @click="closeModal">&times;</button>
                </div>


                <div class="modal-body">

                    <div v-if="!postData">
                        Loading...
                    </div>
                    <div v-else class="list-group-item">
                        <h3> {{ filteredData.title }}</h3>
                        <br>
                        Topic: {{ filteredData.topic }}
                        <br>
                        Copyright: {{ filteredData.сopyright }}
                        <br>
                        Date: {{ filteredData.date }}
                        <div v-for="(photo, index) in filteredData.photo" :key="index">
                            <img style="max-height: 200px; max-width: 200px;" :src="photo" alt="Post Photo" />
                        </div>
                       <!--  Explanation: {{ filteredData.content }} -->
                       <br>
                        <textarea type="text" class="form-control no-resize" v-model="filteredData.content"  rows="8"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useStore } from '@/storeMain';
const router = useRouter()
const { getPostsFromDatabase } = useStore()
const { postData } = storeToRefs(useStore())
const slot = defineProps(['id'])
console.log(postData.value);
const filteredData = computed(() => {
    console.log(postData.value.find((post) => post.id == slot.id));
    return postData.value.find((post) => post.id == slot.id)
});

const closeModal = () => {
    router.push('/')
};

onBeforeMount(() => {
    if (postData.value == null) {
        getPostsFromDatabase()
    }
})
</script>
<style>
.modal {
    display: block;
}

.modal-open {
    overflow: hidden;
}
.no-resize {
  resize: none;
}
</style>