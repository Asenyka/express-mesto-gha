const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const errorRouter = require('./error');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/', errorRouter)
module.exports = router;
