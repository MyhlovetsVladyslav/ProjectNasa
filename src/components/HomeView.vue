<template>
    <div v-theme="isDarkTheme">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <router-link to="/" class="navbar-brand">
                    <img src="../assets/img/logo.png" alt="Логотип" width="60" height="50" class="d-inline-block ">
                    Главная</router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <router-link to="/about" class="nav-link">О нас</router-link>
                        </li>
                        <li class="nav-item ml-2" v-if="isLoggedIn === false">
                            <router-link to="/registration" class="nav-link">Зарегистрироваться</router-link>
                        </li>
                        <li class="nav-item ml-5" v-else>
                            <div class="no-theme-change">Добро пожаловать, {{ loginProfile }}!</div>
                            <button @click="handleSignOut" class="btn btn-primary">Выйти</button>
                        </li>
                        <li class="nav-item ml-5 mt-3">
                            <button @click="toggleTheme" class="theme-toggle-button">
                                <i class="fas fa-adjust"></i>
                            </button>

                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <router-view></router-view>
        <div class="container mt-5">
            <h1 class="mb-4">Добро пожаловать на Форум Nasa</h1>
            <div>
                <button @click="openModal" class="btn btn-primary">Создать новый топик</button>
                <span class="alert alert-danger ml-4" role="alert" v-if="error">
                    Создание новых топиков доступно только зарегистрированным пользователям
                </span>
                <modal-window ref="modal1" v-draggable></modal-window>
                <modal-window-change ref="modal2"></modal-window-change>
                <modal-window3 ref="modal3"></modal-window3>
                <modal-window4 ref="modal4"></modal-window4>
                <modal-window5 ref="modal5"></modal-window5>
                <modal-window6 ref="modal6"></modal-window6>
                <modal-window7 ref="modal7"></modal-window7>
            </div>
            <br>
            <h2>Список топиков</h2>
            <div class="form-group">
                <label for="topicFilter">Поиск:</label>
                <input type="text" id="topicFilter" class="form-control" v-model="topicFilter">
            </div>
            <br>
            <ul class="list-group no-theme-change" v-if="topicFilter !== ''">
                <li class="list-group-item mb-5" v-for="(item, index) in filteredData" :key="item.id">
                    <h3> {{ item.title }}</h3>
                    <br>
                    Topic: {{ item.topic }}
                    <br>
                    Copyright: {{ item.сopyright }}
                    <br>
                    Date: {{ item.date }}
                    <div class="img-fluid" v-for="(photo, index) in item.photo" :key="index">
                        <img style="max-height: 300px; max-width: 600px;" :src="photo" alt="Post Photo" />
                    </div>
                    Explanation: {{ item.content }}
                    <br>
                    <div class="list-group mt-3" v-for="(comment, commentID) in item.comments" :key="commentID">
                        <div class="list-group-item">
                            <p class="mb-1"><strong>Name: {{ comment.Name }}</strong></p>
                            <p class="mb-1"><strong>Date: {{ comment.Date }}</strong></p>
                            <p class="mb-1">Comment: {{ comment.text }}</p>
                            <div class="list-group mt-3" v-for="(nextComment, nextCommentID) in comment.nextComments"
                                :key="nextCommentID">
                                <div class="list-group-item">
                                    <p class="mb-1"><strong>Name: {{ nextComment.Name }}</strong></p>
                                    <p class="mb-1"><strong>Date: {{ nextComment.Date }}</strong></p>
                                    <p class="mb-1">Comment: {{ nextComment.text }}</p>
                                    <div v-if="getUid() == nextComment.uid" class="d-flex align-items-center">
                                        <button class="btn btn-danger "
                                            @click="removeNextComment(item.id, commentID, nextCommentID, index)">
                                            <i class="fas fa-trash"></i> Удалить
                                        </button>
                                        <button class="btn btn-primary ml-2"
                                            @click="openModal6(item.id, commentID, nextCommentID, index)">

                                            <i class="fas fa-edit"></i> Редактировать
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-secondary mr-2 mt-2"
                                @click="openModal5(item.id, commentID)">Ответить</button>
                            <div v-if="getUid() == comment.uid" class="d-flex align-items-center">
                                <button class="btn btn-danger mt-2" @click="removeComment(item.id, commentID, index)">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                                <button class="btn btn-primary ml-2 mt-2" @click="openModal4(item.id, commentID, index)">
                                    <i class="fas fa-edit"></i> Редактировать
                                </button>

                            </div>
                        </div>
                    </div>

                    <div class="d-flex">
                        <button class="btn btn-secondary mr-2 mt-2" @click="openModal3(item.id)">Ответить</button>
                        <div v-if="getUid() == item.uid">
                            <button class="btn btn-primary mr-2 mt-2" @click="openModal1(item.id)">
                                <i class="fas fa-edit"></i> Редактировать
                            </button>
                            <button class="btn btn-danger mt-2" @click="removeItem(item.id, index)">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                        </div>
                    </div>
                </li>
            </ul>

            <ul class="list-group no-theme-change" v-else>
                <li class="list-group-item mb-5" v-for="(item, index) in postData" :key="item.id">
                    <h3> {{ item.title }}</h3>
                    <br>
                    Topic: {{ item.topic }}
                    <br>
                    Copyright: {{ item.сopyright }}
                    <br>
                    Date: {{ item.date }}
                    <div v-for="(photo, index) in item.photo" :key="index">
                        <img style="max-height: 300px; max-width: 600px;" :src="photo" alt="Post Photo" />
                    </div>
                    Explanation: {{ item.content }}
                    <br>
                    <div class="list-group mt-3" v-for="(comment, commentID) in item.comments" :key="commentID">
                        <div class="list-group-item">
                            <p class="mb-1"><strong>Name: {{ comment.Name }}</strong></p>
                            <p class="mb-1"><strong>Date: {{ comment.Date }}</strong></p>
                            <p class="mb-1">Comment: {{ comment.text }}</p>
                            <div class="list-group mt-3" v-for="(nextComment, nextCommentID) in comment.nextComments"
                                :key="nextCommentID">
                                <div class="list-group-item">
                                    <p v-if="nextComment.address" class="mb-1">Address to: {{ nextComment.address }}</p>
                                    <p class="mb-1"><strong>Name: {{ nextComment.Name }}</strong></p>
                                    <p class="mb-1"><strong>Date: {{ nextComment.Date }}</strong></p>
                                    <p class="mb-1">Comment: {{ nextComment.text }}</p>
                                    <div class="d-flex">
                                        <div><button @click="openModal7(item.id, commentID, nextCommentID, index)"
                                                class="btn btn-secondary mr-2 mt-2 mb-2">Ответить</button></div>
                                        <div v-if="getUid() == nextComment.uid" class="d-flex align-items-center">
                                            <button class="btn btn-primary ml-2 mr-2"
                                                @click="openModal6(item.id, commentID, nextCommentID, index)">

                                                <i class="fas fa-edit"></i> Редактировать
                                            </button>
                                            <button class="btn btn-danger "
                                                @click="confirmDeleteNextComment(item.id, commentID, nextCommentID, index)">
                                                <i class="fas fa-trash"></i> Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex">
                                <button class="btn btn-secondary mr-2 mt-2"
                                    @click="openModal5(item.id, commentID)">Ответить</button>
                                <div v-if="getUid() == comment.uid" class="d-flex align-items-center">
                                    <button class="btn btn-primary ml-2 mt-2 mr-2"
                                        @click="openModal4(item.id, commentID, index)">
                                        <i class="fas fa-edit"></i> Редактировать
                                    </button>
                                    <button class="btn btn-danger mt-2"
                                        @click="confirmDeleteComment(item.id, commentID, index)">
                                        <i class="fas fa-trash"></i> Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex">
                        <button class="btn btn-secondary mr-2 mt-2" @click="openModal3(item.id)">Ответить</button>
                        <div v-if="getUid() == item.uid">
                            <button class="btn btn-primary mr-2 mt-2" @click="openModal1(item.id, index)">
                                <i class="fas fa-edit"></i> Редактировать
                            </button>
                            <button class="btn btn-danger mt-2" @click="confirmDeleteItem(item.id, index)">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                        </div>
                        <button class="btn btn-secondary ml-2 mt-2" @click="openModal8(item.id)">Details</button>
                    </div>
                </li>
                <li class="list-group-item mb-5" v-for="(item, index) in nasaData" :key="index">
                    <h3>{{ item.title }}</h3>
                    <div>
                        Copyright: {{ item.copyright }}
                        <br>
                        Date: {{ item.date }}
                        <br>
                        <img loading="lazy" :src="item.hdurl" :alt="item.title" style="max-width: 40%; height: auto;">
                        <br>
                        Explanation: {{ item.explanation }}
                    </div>
                    <button class="btn btn-danger mt-2" @click="deleteItem(index)">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from '../storeMain.js'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import ModalWindow from "./ModalWindow.vue";
import ModalWindowChange from './ModalWindowChange.vue';
import ModalWindow3 from './ModalWindow3.vue';
import ModalWindow4 from './ModalWindow4.vue';
import ModalWindow5 from './ModalWindow5.vue';
import ModalWindow6 from './ModalWindow6.vue';
import ModalWindow7 from './ModalWindow7.vue';
import router from '@/router';
import { storeToRefs } from 'pinia';
import { onValue, getDatabase, ref as dbRef } from 'firebase/database';
import { vDraggable } from './draggableDirective.js'
const { getLog, fetchNasaData, setUserName, removeItem, removeComment, removeNextComment, getPostsFromDatabase, getUid } = useStore()
const { isLoggedIn, loginProfile, nasaData, postData } = storeToRefs(useStore())
const isDarkTheme = ref(false);
const error = ref(false);
const topicFilter = ref('');
const modal1 = ref('');
const modal2 = ref('');
const modal3 = ref('');
const modal4 = ref('');
const modal5 = ref('');
const modal6 = ref('');
const modal7 = ref('')
onMounted(() => {
    getPostsFromDatabase();
    const databaseRef = dbRef(getDatabase(), 'posts');
    onValue(databaseRef, (snapshot) => {
        console.log('Получены новые данные:', snapshot.val());
        getPostsFromDatabase();
    });

    fetchNasaData('2023-10-01', '2023-10-09')
        .then(() => {
            console.log(nasaData);
        })
        .catch((error) => {
            console.error('Ошибка при получении данных:', error);
        });

    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            setUserName(user.displayName);
            console.log(isLoggedIn);
            getLog(true);
        } else {
            getLog(false);
        }
    });
});

const confirmDeleteNextComment = (item, commentID, nextCommentID, index) => {
    if (confirm('Уверены что хотите удалить?')) {
        removeNextComment(item, commentID, nextCommentID, index);
    } else {
        console.log('Отменено удаление');
    }
};
const confirmDeleteItem = (item, index) => {
    if (confirm('Уверены что хотите удалить?')) {
        removeItem(item, index)
    } else {
        console.log('Отменено удаление');
    }
}
const confirmDeleteComment = (item, commentID, index) => {
    if (confirm('Уверены что хотите удалить?')) {
        removeComment(item, commentID, index)
    } else {
        console.log('Отменено удаление');
    }
}
const handleSignOut = () => {
    signOut(getAuth()).then(() => {
        router.push('/');
    });
};

const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value;
};
const openModal8 = (item) => {
    router.push(`/posts/${item}`)
}
const openModal7 = (id, commentID, nextCommentID, index) => {
    modal7.value.openModal(id, commentID, nextCommentID, index)
}
const openModal6 = (id, commentID, nextCommentID, index) => {
    modal6.value.openModal(id, commentID, nextCommentID, index);
};

const openModal5 = (id, commentID, index) => {
    modal5.value.openModal(id, commentID, index);
};

const openModal4 = (id, commentID, index) => {
    modal4.value.openModal(id, commentID, index);
};

const openModal3 = (index) => {
    modal3.value.openModal(index);
};
const openModal1 = (item, index) => {
    modal2.value.openModal(item, index);
};
const openModal = () => {
    if (isLoggedIn.value) {
        modal1.value.showOpenModal();
    } else {
        error.value = true;
        setTimeout(() => {
            error.value = false;
        }, 5000);
    }
};

const deleteItem = (index) => {
    nasaData.splice(index, 1);
};


const filteredData = computed(() => {
    return postData.value.filter(item =>
        (item.title && item.title.toLowerCase().includes(topicFilter.value.toLowerCase())) ||
        (item.topic && item.topic.toLowerCase().includes(topicFilter.value.toLowerCase()))
    );
});
</script>
  
<style>
.dark-theme {
    background-color: black;
    color: rgb(255, 255, 255);
}

.no-theme-change {
    background-color: transparent;
    color: black;
}
</style>