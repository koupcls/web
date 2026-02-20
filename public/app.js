import { renderRegister } from './Register.js';

const root = document.getElementById('root');


function router() {
    const hash = window.location.hash; // Получаем часть адреса после #


    switch (hash) {
 
        case "#register": {
        renderRegister(root, () => {
            window.location.hash = ''; // При нажатии "Назад" меняем хеш на пустой
        });
        break;
        }

        default: {
            showMain();
            break;
        }
    }
}


// Функция для отрисовки главной страницы
function showMain() {
    root.innerHTML = `
        <h1>Добро пожаловать</h1>
        <button id="toRegister">Войти / Зарегистрироваться</button>
    `;

    document.getElementById('toRegister').onclick = () => {
        window.location.hash = 'register';
    };
}

window.addEventListener('hashchange', router);
// При первом запуске показываем главную
router();