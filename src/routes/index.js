const  { Router } = require('express');
const  ContractsRouter = require('./contracts');
const  JobsRouter = require('./jobs');
const  BalancesRouter = require('./balances');
const  AdminRouter = require('./admin');

const router = Router();
router.use('/contracts', ContractsRouter);
router.use('/jobs', JobsRouter);
router.use('/balances', BalancesRouter);
router.use('/admin', AdminRouter);

module.exports = router;