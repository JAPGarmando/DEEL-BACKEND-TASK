const {
    Op
} = require("sequelize");
const getBestProfession = async (req, res) => {
    const {
        Contract,
        Job,
        Profile
    } = req.app.get("models");
    const sequelize = req.app.get("sequelize");
    const {
        start,
        end
    } = req.query;
    console.info("DATES =>", start, end);
    const jobSumGrouped = await Profile.findAll({
        // attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'price']],
        order: ['earned'],
        where: {
            type: 'contractor',
        },
        attributes: [
            [sequelize.fn('SUM', sequelize.col('Contractor.Jobs.price')), 'earned'], 'profession'
        ],
        include: {
            model: Contract,
            as: 'Contractor',
            include: {
                model: Job,
                where: {
                    paid: true,
                    paymentDate: {
                        [Op.between]: [start, end]
                    },

                },
            },
        },
        group: 'profession'

    });
    if (jobSumGrouped && jobSumGrouped[jobSumGrouped.length - 1]) {
        const greatest = jobSumGrouped[jobSumGrouped.length - 1];
        const {
            profession,
            earned
        } = greatest.dataValues;
        return res.status(201).json({
            profession,
            earned,
        })
    }
    return res.status(404).end();
};



const getBestClients = async (req, res) => {
    const {
        Contract,
        Job,
        Profile
    } = req.app.get("models");
    const sequelize = req.app.get("sequelize");
    const {
        start,
        end,
        limit
    } = req.query;

    
    console.info("DATES AND LIMIT =>", start, end, +limit);
    console.info(typeof Number(limit));
    console.info(Number.isNaN(+limit));
    const jobSumGrouped = await Profile.findAll({
        order: ['paid'],
        raw: true,
        where: {
            type: 'client',
        },
        attributes: [
            'id', 
            [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
            [sequelize.fn('SUM', sequelize.col('Client.Jobs.price')), 'paid'], 
            
        ],
        // limit: Number.isNaN(+limit) ? 2 : Math.round(+limit),
        include: {
            model: Contract,
            as: 'Client',
            required: false,
            attributes: [],
            include: {
                raw: true,
                model: Job,
                attributes: [],
                required: false,
                where: {
                    paid: true,
                    paymentDate: {
                        [Op.between]: [start, end]
                    },

                },
            },
        },
        
        group: 'Client.ClientId',

    });
    if (!jobSumGrouped) {
        return res.status(404).end();
    }
    res.json(jobSumGrouped.slice(0, Number.isNaN(+limit) ? 2 : +limit));
};

module.exports = {
    getBestProfession,
    getBestClients,
};