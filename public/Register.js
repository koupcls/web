import zxcvbn from 'https://cdn.skypack.dev/zxcvbn';

export function renderRegister(container, onBack) {
    const style = document.createElement('style');
    style.innerHTML = `
        .reg-card {
            background: #ffffff;
            padding: 40px 30px;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
            max-width: 350px;
            margin: 60px auto;
            border: 1px solid #f0f0f0;
        }
        .reg-card h2 { 
            margin: 0 0 24px; 
            color: #1a1a1a; 
            text-align: center; 
            font-weight: 800; 
            letter-spacing: -0.5px;
        }
        
        .input-wrapper { margin-bottom: 16px; }
        
        .input-group { position: relative; }
        .input-group input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #f1f1f1;
            border-radius: 12px;
            box-sizing: border-box;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            outline: none;
            font-size: 15px;
            background: #fafafa;
        }
        .input-group input:focus { 
            border-color: #4A90E2; 
            background: #fff;
            box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
        }

        .status-msg {
            font-size: 11px;
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transition: all 0.3s ease;
            font-weight: 500;
            margin-left: 4px;
        }
        .status-msg.show {
            max-height: 20px;
            opacity: 1;
            margin-top: 6px;
        }
        
        .error { color: #ff4757; }
        .success { color: #2ed573; }

        .strength-meter {
            height: 4px;
            background: #eee;
            margin-top: 12px;
            border-radius: 10px;
            overflow: hidden;
        }
        .strength-bar { height: 100%; width: 0; transition: width 0.4s ease, background 0.3s; }
        
        .btn-primary {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            font-size: 15px;
            margin-top: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
        }
        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { 
            background: #e0e0e0; 
            color: #a0a0a0;
            cursor: not-allowed; 
            box-shadow: none;
        }
        
        .btn-secondary {
            width: 100%;
            margin-top: 12px;
            background: none;
            border: none;
            padding: 10px;
            cursor: pointer;
            color: #999;
            font-size: 13px;
            font-weight: 500;
            transition: color 0.2s;
        }
        .btn-secondary:hover { color: #666; }

        #msg {
            margin-top: 15px;
            min-height: 18px;
            font-weight: 500;
        }

        /* Иконка глаза */
        #togglePass {
            position: absolute; 
            right: 14px; 
            top: 14px; 
            cursor: pointer; 
            font-size: 18px;
            user-select: none;
            transition: 0.2s;
        }
        #togglePass:hover { filter: grayscale(0); transform: scale(1.1); }
    `;
    document.head.appendChild(style);

    container.innerHTML = `
        <div class="reg-card">
            <h2>Регистрация</h2>
            
            <div class="input-wrapper">
                <div class="input-group">
                    <input type="text" id="username" placeholder="Имя пользователя">
                </div>
                <div id="userStatus" class="status-msg"></div>
            </div>

            <div class="input-wrapper">
                <div class="input-group">
                    <input type="email" id="email" placeholder="Электронная почта">
                </div>
                <div id="emailStatus" class="status-msg"></div>
            </div>

            <div class="input-wrapper">
                <div class="input-group">
                    <input type="password" id="password" placeholder="Пароль">
                    <span id="togglePass" style="position: absolute; right: 12px; top: 12px; cursor: pointer;">🙊</span>
                </div>
                <div id="passStatus" class="status-msg"></div>
                <div class="strength-meter"><div id="strengthBar" class="strength-bar"></div></div>
            </div>

            <button id="submitBtn" class="btn-primary" disabled>Зарегистрироваться</button>
            <button id="backBtn" class="btn-secondary">Назад</button>
            <p id="msg" style="text-align:center; font-size: 13px;"></p>
        </div>
    `;

    const uInput = document.getElementById('username');
    const eInput = document.getElementById('email');
    const pInput = document.getElementById('password');
    const strengthBar = document.getElementById('strengthBar');
    const submitButton = document.getElementById('submitBtn');

    // Хелпер для управления анимацией сообщений
    const showStatus = (elementId, text, type) => {
        const el = document.getElementById(elementId);
        if (!text) {
            el.classList.remove('show');
            return;
        }
        
        el.innerText = text;
        el.className = `status-msg show ${type}`;

        if (type === 'success') {
            setTimeout(() => {
                el.classList.remove('show');
            }, 1500);
        }
    };

    const validateForm = (e) => {
        const field = e ? e.target.id : null; // Проверка на случай вызова без события
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Валидация Username
        if (!field || field === 'username') {
            const uVal = uInput.value;
            if (uVal.length > 0 && uVal.length < 5) {
                showStatus('userStatus', 'Минимум 5 символов', 'error');
            } else if (uVal.length >= 5) {
                showStatus('userStatus', 'Всё в порядке!', 'success');
            } else {
                showStatus('userStatus', '', '');
            }
        }

        // Валидация Email
        if (!field || field === 'email') {
            const eVal = eInput.value;
            if (eVal.length > 0 && !emailRegex.test(eVal)) {
                showStatus('emailStatus', 'Неверный формат почты', 'error');
            } else if (emailRegex.test(eVal)) {
                showStatus('emailStatus', 'Всё в порядке!', 'success');
            } else {
                showStatus('emailStatus', '', '');
            }
        }

        // Валидация Пароля
        const result = zxcvbn(pInput.value);
        const rating = result.score;
        updateStrengthUI(rating, pInput.value.length);
        
        console.log(result);

        if (!field || field === 'password') {
            const pVal = pInput.value;
            if (pVal.length > 0 && pVal.length < 8) {
                showStatus('passStatus', 'Слишком короткий (мин. 8)', 'error');
            } else if (pVal.length >= 8 && rating < 3) {
                // Берем конкретный совет от zxcvbn
                const warning = result.feedback.warning;
                const suggestion = result.feedback.suggestions[0] || 'Пароль слишком слабый';
                showStatus('passStatus', warning || suggestion, 'error');
            } else if (pVal.length >= 8 && rating >= 3) {
                showStatus('passStatus', 'Отличный пароль!', 'success');
            } else {
                showStatus('passStatus', '', '');
            }
        }

        // Финальная проверка кнопки
        const isUserValid = uInput.value.length >= 5;
        const isEmailValid = emailRegex.test(eInput.value);
        const isPassValid = pInput.value.length >= 8 && rating >= 3;

        submitButton.disabled = !(isUserValid && isEmailValid && isPassValid);
    };

    function updateStrengthUI(rating, len) {
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#4bd685', '#2ecc71'];
        const width = len === 0 ? 0 : (rating + 1) * 20; // 0-4 превращаем в 20-100%
        strengthBar.style.width = `${width}%`;
        strengthBar.style.background = colors[rating];
    }

    // События
    uInput.oninput = validateForm;
    eInput.oninput = validateForm;
    pInput.oninput = validateForm;

    document.getElementById('togglePass').onclick = function() {
        pInput.type = pInput.type === 'password' ? 'text' : 'password';
        this.innerText = pInput.type === 'password' ? '🙊' : '🙈';
    };

    document.getElementById('backBtn').onclick = onBack;
    
        submitButton.onclick = async () => {
        msg.innerText = "Загрузка...";
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: uInput.value,
                    email: eInput.value,
                    password: pInput.value
                })
            });

            const data = await response.json();
            msg.style.color = response.ok ? '#27ae60' : '#e74c3c';
            msg.innerText = response.ok ? data.message : data.error;
        } catch (error) {
            msg.style.color = '#e74c3c';
            msg.innerText = "Ошибка соединения с сервером";
        }
    };
}