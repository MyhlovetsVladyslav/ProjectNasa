import { defineStore } from 'pinia';
import axiosInstance from './axios.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import router from '@/router';
import { getDatabase, update } from 'firebase/database';
import { ref, set, get, push, remove } from 'firebase/database'
export const useStore = defineStore({
    id: 'store',

    state: () => ({
        nasaData: null,
        isLoggedIn: false,
        errorMessage: '',
        errorMessageHome: '',
        loginProfile: '',
        postData: null
    }),
    actions: {
        async fetchNasaData(startDate, endDate) {
            try {
                const response = await axiosInstance.get('', {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                });

                this.nasaData = response.data;
            } catch (error) {
                console.error('Ошибка при получении данных от API NASA:', error);
                throw error;
            }
        },
        async getPostsFromDatabase() {
            const database = getDatabase();
            const usersRef = ref(database, "posts")

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

                    this.postData = postsArray;
                } else {
                    console.log("Посты не найдены в базе данных.");
                }
            } catch (error) {
                console.error("Ошибка при получении данных из базы данных:", error);
            }
        },
        RemoveItem(postId, index) {
            const uid = this.getUid();
            const databaseRef = ref(getDatabase(), `posts/${postId}`);
            try {
                if (this.postData[index].uid == uid) {
                    remove(databaseRef);
                }
                else {
                    console.log("Нет доступа");
                }
            } catch (error) {
                console.error('Ошибка при удалении данных из базы данных:', error);
            }
        },
        changeComment(postId, commentId, index, info) {
            const uid = this.getUid();
            const databaseRef = ref(getDatabase(), `posts/${postId}/comments/${commentId}`);
            try {
                if (this.postData[index].comments[commentId].uid == uid) {
                    update(databaseRef, info);
                    
                }

            } catch (error) {
                console.error('Ошибка при удалении данных из базы данных:', error);
            }
        },
        changeNextComment(postId, commentId,nextCommentID, index, info) {
            const uid = this.getUid();
            const databaseRef = ref(getDatabase(), `posts/${postId}/comments/${commentId}/nextComments/${nextCommentID}`);
            try {
                if (this.postData[index].comments[commentId].nextComments[nextCommentID].uid == uid) {
                    update(databaseRef, info);
                }

            } catch (error) {
                console.error('Ошибка при удалении данных из базы данных:', error);
            }
        },
        RemoveComment(postId, commentId, index) {
            const uid = this.getUid();
            const databaseRef = ref(getDatabase(), `posts/${postId}/comments/${commentId}`);
            try {
                if (this.postData[index].comments[commentId].uid == uid) {
                    remove(databaseRef);

                }

            } catch (error) {
                console.error('Ошибка при удалении данных из базы данных:', error);
            }
        },
        RemoveNextComment(postId, commentId, nextCommentID, index) {
            const uid = this.getUid();
            const databaseRef = ref(getDatabase(), `posts/${postId}/comments/${commentId}/nextComments/${nextCommentID}`);
            try {
                if (this.postData[index].comments[commentId].nextComments[nextCommentID].uid == uid) {
                    remove(databaseRef);
               
                }

            } catch (error) {
                console.error('Ошибка при удалении данных из базы данных:', error);
            }
        },
        setUserName(name) {
            this.loginProfile = name
        },
        getLog(bool) {
            this.isLoggedIn = bool
        },
        async addPost(post) {
            const uid = this.getUid()
            const databaseRef = ref(getDatabase(), `posts`);
            await set(push(databaseRef), { uid, ...post });
        },
        async changePost(index, post) {
            console.log(index);
            const uid = this.getUid()
            const databaseRef = ref(getDatabase(), `posts/${index}`);
            await update(databaseRef, { uid, ...post });
        },
        getUid() {
            const user = getAuth().currentUser
            return user ? user.uid : null
        },
        async addComment(postID, comment) {
            const uid = this.getUid()
            const databaseRef = ref(getDatabase(), `posts/${postID}/comments`);
            await set(push(databaseRef), { uid, ...comment });
        },
        async addNextComment(postID, commentID, comment) {
            const uid = this.getUid()
            const databaseRef = ref(getDatabase(), `posts/${postID}/comments/${commentID}/nextComments`);
            await set(push(databaseRef), { uid, ...comment });
        },
        async register(login, email, password) {
            const auth = getAuth()
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            catch (error) {
                switch (error.code) {
                    case "auth/weak-password":
                        this.errorMessage = "Weak password"
                        setTimeout(() => {
                            this.errorMessage = '';
                        }, 5000);
                        break;
                    case "auth/email-already-in-use":
                        this.errorMessage = "Email already use"
                        setTimeout(() => {
                            this.errorMessage = '';
                        }, 5000);
                        break;
                }
                return;
            }
            console.log('Successful', auth.currentUser);
            const user = auth.currentUser
            await updateProfile(user, {
                displayName: login
            })
            this.loginProfile = user.displayName
            router.push('/')
            this.getLog(true)


        },
        async signInWithGoogle() {
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(getAuth(), provider);
                router.push('/')
                this.getLog(true)
            } catch (error) {
                return error.code;
            }
        },
        loginIn(email, password) {
            signInWithEmailAndPassword(getAuth(), email, password)
                .then((data) => {
                    console.log('Successful signed in!', data);
                    router.push('/')
                    const user = getAuth().currentUser
                    this.loginProfile = user.displayName
                    this.getLog(true)
                })
                .catch((error) => {
                    switch (error.code) {
                        case "auth/invalid-email":
                            this.errorMessage = "Invalid email"
                            setTimeout(() => {
                                this.errorMessage = '';
                            }, 5000);
                            break;
                        case "auth/user-not-found":
                            this.errorMessage = "Not found account with that email"
                            setTimeout(() => {
                                this.errorMessage = '';
                            }, 5000);
                            break;
                        case "auth/wrong-password":
                            this.errorMessage = "Incorect password"
                            setTimeout(() => {
                                this.errorMessage = '';
                            }, 5000);
                            break;
                        default:
                            this.errorMessage = "Email or Password was incorect"
                            setTimeout(() => {
                                this.errorMessage = '';
                            }, 5000);
                    }
                })
        }
    },
});