<template>
    <div class="modal no-theme-change" v-if="isOpenWindow">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- Заголовок модального окна -->
                <div class="modal-header">
                    <h4 class="modal-title">Изменить топик</h4>
                    <button type="button" class="close" @click="closeModalWindow">&times;</button>
                </div>

                <!-- Основное содержимое модального окна -->
                <div class="modal-body">
                    <form @submit.prevent="changeTopic">
                        <div class="form-group">
                            <label for="topicTitle">Заголовок топика</label>
                            <input type="text" class="form-control " v-model="topicTitle" placeholder="Введите заголовок"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="topicContent">Содержание топика</label>
                            <textarea rows="4" type="text" class="form-control no-resize" v-model="topicContent"
                                placeholder="Введите текст" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="photoData">Фото</label>
                            <br>
                            <img style="max-height: 400px; max-width: 400px;" :src='photoData' alt="">
                        </div>
                        <div class="alert alert-danger mt-2" role="alert" v-if="errorMessage">
                            {{ errorMessage }}
                        </div>
                        <div class="form-group">
                            <label for="topicPhoto">Обновить фото</label>
                            <input type="file" class="form-control" multiple @change="handleFileUpload">
                        </div>
                        <button type="submit" class="btn btn-primary mt-2">Изменить топик</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useStore } from '../storeMain.js'
import { ref, defineExpose } from 'vue';
import { getStorage, ref as refStore, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storeToRefs } from 'pinia';
const { postData } = storeToRefs(useStore())
const isOpenWindow = ref(false);
const topicTitle = ref('');
const topicContent = ref('');
const currentDate = ref(null);
const photoData = ref([]);
const indexModal = ref(null);
const errorMessage = ref('')
const allowedFileTypes = ['image/jpeg', 'image/png'];
const openModal = (item, index) => {
    document.body.classList.add('modal-open');
    isOpenWindow.value = true;
    console.log(postData.value[index]);
    topicTitle.value = postData.value[index].title
    topicContent.value = postData.value[index].content
    photoData.value = postData.value[index].photo
    indexModal.value = item;
};
defineExpose({ openModal })

const closeModalWindow = () => {
    isOpenWindow.value = false;
    document.body.classList.remove('modal-open');
};
const { changePost } = useStore()

const changeTopic = () => {
    displayCurrentDate();
    changePost(indexModal.value, {
        title: topicTitle.value,
        content: topicContent.value,
        photo: photoData.value,
        date: currentDate.value,
    });
    isOpenWindow.value = false;

    topicTitle.value = '';
    topicContent.value = '';
    photoData.value = [];
    document.body.classList.remove('modal-open')
};

const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files;
    const storage = getStorage()
    photoData.value = [];

    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (allowedFileTypes.includes(file.type)) {
            if (file.size < 1000000) {
                const storageRef = refStore(storage, file.name);
                await uploadBytes(storageRef, file);

                const downloadURL = await getDownloadURL(storageRef);
                photoData.value.push(downloadURL);
            }
            else {
                errorMessage.value = `Файл ${file.name} имеет большой размер`
                setTimeout(() => {
                    errorMessage.value = null
                }, 4000);
            }
        } else {
            errorMessage.value = `Файл ${file.name} имеет неподдерживаемый формат. Допустимы только файлы типов JPEG и PNG.`
            setTimeout(() => {
                errorMessage.value = null
            }, 4000);
        }
    }
};

const displayCurrentDate = () => {
    const currentDateObj = new Date();
    currentDate.value = currentDateObj.toLocaleDateString();
};
</script>

<style>
.modal {
    display: block;
}

.no-resize {
    resize: none;
}

.modal-open {
    overflow: hidden;
}
.no-theme-change {
    background-color: transparent;
    color: black;
}
</style>