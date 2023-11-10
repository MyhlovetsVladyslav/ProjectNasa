<template>
    <div class="modal" v-if="isOpenWindow">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h4 class="modal-title">Добавить коментарий</h4>
                    <button type="button" class="close" @click="closeModalWindow">&times;</button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="setComment()">
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="text" placeholder="Введите комментарий"
                                required>
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

const isOpenWindow = ref(false);
const text = ref('');
const idModal = ref(null);
const commentIDModal = ref(null);
const currentDate = ref('');
const name = ref('')
const { addNextComment } = useStore()
const { loginProfile, postData } = storeToRefs(useStore())
const openModal = (id, commentID , nextCommentID , index) => {
    document.body.classList.add('modal-open');
    isOpenWindow.value = true;
    idModal.value = id;
    commentIDModal.value = commentID;
    name.value = postData.value[index].comments[commentID].nextComments[nextCommentID].Name
};
defineExpose({ openModal })
const closeModalWindow = () => {
    isOpenWindow.value = false;
    document.body.classList.remove('modal-open');
};

const setComment = () => {
    displayCurrentDate();
    addNextComment(idModal.value, commentIDModal.value, {address: name.value , text: text.value, Name: loginProfile.value, Date: currentDate.value });
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

</style>