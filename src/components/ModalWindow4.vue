<template>
    <div class="modal" v-if="isOpenWindow">
        <div class="modal-dialog">
            <div class="modal-content">

             
                <div class="modal-header">
                    <h4 class="modal-title">Изменить коментарий</h4>
                    <button type="button" class="close" @click="closeModalWindow">&times;</button>
                </div>

               
                <div class="modal-body">
                    <form @submit.prevent="changeCommen()">
                        <div class="form-group">
                            <textarea rows="4" type="text" class="form-control no-resize" v-model="text" placeholder="Введите комментарий"
                                required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary mt-2">Сохранить</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from '../storeMain.js'
import { ref, defineExpose } from 'vue';
import { storeToRefs } from 'pinia';

const { changeComment } = useStore()
const {postData } = storeToRefs(useStore())
 
const isOpenWindow = ref(false);
const text = ref('');
const indexModal = ref(null);
const idModal = ref(null);
const commentIDModal = ref(null);
const currentDate = ref('');

const openModal = (id, commentID, index) => {
    document.body.classList.add('modal-open');
    isOpenWindow.value = true;
    indexModal.value = index;
    idModal.value = id;
    commentIDModal.value = commentID;
    text.value = postData.value[index].comments[commentID].text
};
defineExpose({ openModal })
const closeModalWindow = () => {
    isOpenWindow.value = false;
    document.body.classList.remove('modal-open');
    text.value = '';
};

const changeCommen = () => {
    displayCurrentDate();
    changeComment(idModal.value, commentIDModal.value, indexModal.value, { text: text.value, Date: currentDate.value });
    isOpenWindow.value = false;
    text.value = '';
    document.body.classList.remove('modal-open');
};

const displayCurrentDate = () => {
    const currentDateTime = new Date();
    const date = currentDateTime.toLocaleDateString();
    const time = currentDateTime.toLocaleTimeString();
    currentDate.value = `${date}, ${time}`;
};







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