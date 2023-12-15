const router = require('express').Router();
const chatgptController = require('../controllers/chatgptController');
const { isAuth } = require('../middlewares/authentication');
const rateLimit = require('express-rate-limit');
const customKeyGenerator = (_req, _res) => {
    return 'global';
};

const apiLimiterMin = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Please wait for a minute!',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
});

const apiLimiterHr = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 60,
    message: 'Please wait for a hour!',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
});

const apiLimiterDay = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 200,
    message: 'Please wait for a day!',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
});

router
    .route('/')
    .post(
        isAuth,
        apiLimiterMin,
        apiLimiterHr,
        apiLimiterDay,
        chatgptController.chatgpt
    );

module.exports = router;
