import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref as dbRef, set, get, push, remove, update } from 'firebase/database';
import axiosInstance from './axios.js';
import router from '@/router';

export const useStore = defineStore('useStore', () => {

    const nasaData = ref(null)
    const isLoggedIn = ref(false)
    const errorMessage = ref('')
    const errorMessageHome = ref('')
    const loginProfile = ref('')
    const postData = ref(null)

    const getUid = () => {
        const user = getAuth().currentUser;
        return user ? user.uid : null;
    };
    const fetchNasaData = async (startDate, endDate) => {
        try {
            const response = await axiosInstance.get('', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
            });

            nasaData.value = response.data;
        } catch (error) {
            console.error('Ошибка при получении данных от API NASA:', error);
            throw error;
        }
    };

    const getPostsFromDatabase = async () => {
        const database = getDatabase();
        const usersRef = dbRef(database, "posts");
         console.log("2");
        try {
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const postsArray = [];
                const userData = snapshot.val();
                if (userData) {
                    for (const [key, value] of Object.entries(userData)) {
                        postsArray.push({ id: key, ...value });
                    }
                }

                postData.value = postsArray;
            } else {
                console.log("Посты не найдены в базе данных.");
            }
        } catch (error) {
            console.error("Ошибка при получении данных из базы данных:", error);
        }
    };
    const removeItem = async (postId, index) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}`);
        try {
            if (postData.value[index].uid === uid) {
                await remove(databaseRef);
            } else {
                console.log("Нет доступа");
            }
        } catch (error) {
            console.error('Ошибка при удалении данных из базы данных:', error);
        }
    };

    const changeComment = async (postId, commentId, index, info) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}/comments/${commentId}`);
        try {
            if (postData.value[index].comments[commentId].uid === uid) {
                await update(databaseRef, info);
            }
        } catch (error) {
            console.error('Ошибка при изменении данных в базе данных:', error);
        }
    };

    const changeNextComment = async (postId, commentId, nextCommentId, index, info) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}/comments/${commentId}/nextComments/${nextCommentId}`);
        try {
            if (postData.value[index].comments[commentId].nextComments[nextCommentId].uid === uid) {
                await update(databaseRef, info);
            }
        } catch (error) {
            console.error('Ошибка при изменении данных в базе данных:', error);
        }
    };
    const removeComment = async (postId, commentId, index) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}/comments/${commentId}`);
        try {
            if (postData.value[index].comments[commentId].uid === uid) {
                await remove(databaseRef);
            }
        } catch (error) {
            console.error('Ошибка при удалении данных из базы данных:', error);
        }
    };

    const removeNextComment = async (postId, commentId, nextCommentId, index) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}/comments/${commentId}/nextComments/${nextCommentId}`);
        try {
            if (postData.value[index].comments[commentId].nextComments[nextCommentId].uid === uid) {
                await remove(databaseRef);
            }
        } catch (error) {
            console.error('Ошибка при удалении данных из базы данных:', error);
        }
    };

    const setUserName = (name) => {
        loginProfile.value = name;
    };

    const getLog = (bool) => {
        isLoggedIn.value = bool;
    };

    const addPost = async (post) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts`);
        await set(push(databaseRef), { uid, ...post });
    };

    const changePost = async (index, post) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${index}`);
        await update(databaseRef, { uid, ...post });
    };

    const addComment = async (postId, comment) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}/comments`);
        await set(push(databaseRef), { uid, ...comment });
    };

    const addNextComment = async (postId, commentId, comment) => {
        const uid = getUid();
        const databaseRef = dbRef(getDatabase(), `posts/${postId}/comments/${commentId}/nextComments`);
        await set(push(databaseRef), { uid, ...comment });
    };

    const register = async (login, email, password) => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: login });
            loginProfile.value = user.displayName;
            router.push('/');
            getLog(true);
        } catch (error) {
            handleAuthError(error);
        }
    };

    const signInWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            loginProfile.value = user.displayName;
            router.push('/');
            getLog(true);
        } catch (error) {
            handleAuthError(error);
        }
    };

    const loginIn = async (email, password) => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            loginProfile.value = user.displayName;
            router.push('/');
            getLog(true);
        } catch (error) {
            handleAuthError(error);
        }
    };

    const handleAuthError = (error) => {
        switch (error.code) {
            case 'auth/weak-password':
                errorMessage.value = 'Weak password';
                break;
            case 'auth/email-already-in-use':
                errorMessage.value = 'Email already in use';
                break;
            case 'auth/invalid-email':
                errorMessage.value = 'Invalid email';
                break;
            case 'auth/user-not-found':
                errorMessage.value = 'User not found';
                break;
            case 'auth/wrong-password':
                errorMessage.value = 'Incorrect password';
                break;
            default:
                errorMessage.value = 'Authentication error';
        }
        setTimeout(() => {
            errorMessage.value = '';
        }, 5000);
    };

    return {
        nasaData,
        errorMessage,
        isLoggedIn,
        errorMessageHome,
        loginProfile,
        postData,
        getUid,
        fetchNasaData,
        getPostsFromDatabase,
        removeItem,
        changeComment,
        changeNextComment,
        removeComment,
        removeNextComment,
        setUserName,
        getLog,
        addPost,
        changePost,
        addComment,
        addNextComment,
        register,
        signInWithGoogle,
        loginIn
    };
});
