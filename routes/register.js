const router = require("express").Router();

router.post('/', (req, res) => {
    const { username, email, password } = req.body;

    // Минимальная проверка на сервере
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Данные не полные" });
    }

    // Имитируем успех
    console.log(`Регистрация: ${username}, ${email}`);
    
    // ОБЯЗАТЕЛЬНО отправляем ответ
    res.status(200).json({ message: "Регистрация прошла успешно!" });
});

module.exports = router;