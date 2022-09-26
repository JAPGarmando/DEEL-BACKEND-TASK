const {
    Op
} = require("sequelize");
const depositBalanceByUserId = async (req, res) => {
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
    console.info("PROFILE DATA =>", req.profile);
    console.info("MONEY =>", money);
    const {
        dataValues: profileData
    } = req.profile;
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
        moneyToDeposit = maxMoneyToDeposit;
    } else if (+money > +maxMoneyToDeposit){
        return res.status(401).send("MORE THAN MAX MONEY ALLOWED").end();
    } else {
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