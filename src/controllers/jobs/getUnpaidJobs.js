const { Op } = require("sequelize");
const getUnpaidJobs = async (req, res) => {
    // GET the models
    const {
        Job,
        Contract
    } = req.app.get("models");
    const {
        dataValues: profileData
    } = req.profile;

    //Dynamic where to set whether is a client or contractor when searching
    const whereFilter = {
        where: {
            paid: {
                [Op.not]: true
            },
        },
        include: {
            model: Contract,
            where: {
                status: 'in_progress'
            }
        }
    };
    profileData.type === "client" ?
        (whereFilter.include.where.ClientId = profileData.id) :
        (whereFilter.include.where.ContractorId = profileData.id);
    const unpaidJobs = await Job.findAll(whereFilter);

    if (!unpaidJobs) return res.status(404).end();
    res.json(unpaidJobs);
};

module.exports = getUnpaidJobs;