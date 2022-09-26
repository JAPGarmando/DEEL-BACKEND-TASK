const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const routes = require("./routes");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(`/`, routes);

/**
 * FIX ME!
 * @returns contract by id
 */
// app.get('/contracts/:id',getProfile ,async (req, res) =>{
//     const {Contract} = req.app.get('models')
//     const {id} = req.params
//     console.info("ID =>", id);
//     console.info("PROFILE =>", req.profile);
//     const {dataValues: profileData } = req.profile;
//     const contract = await Contract.findOne({where: {
//         id: 1,
//         ContractorId: profileData.id
//     }})
//     if(!contract) return res.status(404).end()
//     res.json(contract)
// });

module.exports = app;
