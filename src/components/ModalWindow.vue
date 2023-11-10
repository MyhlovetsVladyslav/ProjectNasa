<template>
    <div class="modal" v-if="isOpen">
        <div class="modal-dialog">
            <div class="modal-content">

        
                <div class="modal-header">
                    <h4 class="modal-title">Создать новый топик</h4>
                    <button type="button" class="close" @click="closeModal">&times;</button>
                </div>

        
                <div class="modal-body">
                    <form @submit.prevent="createTopic">
                        <div class="form-group">
                            <label for="topicTitle">Заголовок топика</label>
                            <input type="text" class="form-control" v-model="topicTitle" placeholder="Введите заголовок"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="topicTitle">Тема топика</label>
                            <input type="text" class="form-control" v-model="topic" placeholder="Введите тему" required>
                        </div>
                        <div class="form-group">
                            <label for="topicContent">Содержание топика</label>
                            <input type="text" class="form-control" v-model="topicContent" rows="3"
                                placeholder="Введите текст" required>
                        </div>
                        <div class="form-group">
                            <label for="topicPhoto">Прикрепить фото</label>
                            <input type="file" class="form-control" multiple @change="handleFileUpload">
                            <div class="alert alert-danger mt-2" role="alert" v-if="errorMessage">
                                {{ errorMessage }}
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary mt-2">Создать топик</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from '../storeMain.js'
import { storeToRefs } from 'pinia';
import { ref, defineExpose } from 'vue';
import { getStorage, ref as refStore, uploadBytes, getDownloadURL } from 'firebase/storage';
const { loginProfile } = storeToRefs(useStore())
const errorMessage = ref('')
const { addPost } = useStore()
const topic = ref('')
const isOpen = ref(false)
const topicTitle = ref('')
const topicContent = ref('')
const currentDate = ref(null)
const photoData = ref([])
const allowedFileTypes = ['image/jpeg', 'image/png'];

const showOpenModal = () => {
    isOpen.value = true;
    document.body.classList.add('modal-open');
};
defineExpose({ showOpenModal })
const closeModal = () => {
    isOpen.value = false;
    errorMessage.value = null
    document.body.classList.remove('modal-open');
};

const createTopic = () => {
    displayCurrentDate();
    addPost({
        topic: topic.value,
        сopyright: loginProfile.value,
        title: topicTitle.value,
        content: topicContent.value,
        photo: photoData.value,
        date: currentDate.value
    });
    isOpen.value = false;
    topicTitle.value = '';
    topicContent.value = '';
    photoData.value = null;
    errorMessage.value = null
    document.body.classList.remove('modal-open');
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
            else{
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