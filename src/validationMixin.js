export const validationMixin = {

    methods: {
        validateLogin(login) {
            if (!login) {
                return 'Введите корректный логин';
            }

            if (login.length > 30) {
                return 'Логин не может быть длиннее 30 символов';
            }


            return '';
        },
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@gmail\.com$/;

            if (!email) {
                return 'Введите email';
            }

            if (email.length > 40) {
                return 'Email не может быть длиннее 40 символов';
            }

            if (!emailRegex.test(email)) {
                return 'Введите корректный email';
            }

            return '';
        }
    },
};