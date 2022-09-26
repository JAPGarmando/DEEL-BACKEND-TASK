const {
    Op
} = require("sequelize");
const depositBalanceByUserId = async (req, res) => {
    // GET the models
    // NOTE: You can send in body a JSON with money: number to set how much
    const {
        Profile,
        Job,
        Contract
    } = req.app.get("models");

    const {
        userId
    } = req.params;
    const {
        money
    } = req.body;

    console.info("userId =>", userId);
    console.info("MONEY =>", money);
    const {
        dataValues: profileData
    } = req.profile;

    // Where object to separate the filter method
    const whereFilter = {
        where: {
            paid: {
                [Op.not]: true
            },
        },
        include: {
            model: Contract,
            where: {
                status: 'in_progress',
                ClientId: profileData.id
            }
        }
    };

    const sumUnpaidJobs = await Job.sum('price', whereFilter);
    console.info("TOTAL SUM OF PAYMENTS AMOUNT =>", sumUnpaidJobs);

    let moneyToDeposit = 0;
    const maxMoneyToDeposit = +sumUnpaidJobs * (0.25);

    if (!money) {
        //Default will be 25% of maximum allowed
        moneyToDeposit = maxMoneyToDeposit;
    } else if (+money > +maxMoneyToDeposit){
        return res.status(401).send("MORE THAN MAX MONEY ALLOWED").end();
    } else {
        //Deposit to user validated
        const userToDeposit = await Profile.findOne({id: userId});
        if (userToDeposit.type !== 'client' || !userToDeposit) return res.status(401).send("USER IS NOT A CLIENT").end();
        userToDeposit.balance = +userToDeposit.balance + money;
        await userToDeposit.save()
        return res.status(200).json(userToDeposit);
    }
    return res.status(401).end();

};

module.exports = {
    depositBalanceByUserId,
};