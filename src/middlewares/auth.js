const axios = require('axios');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(400).send({ "sRpta": "Se requiere ingresar token." });
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization
        }
    }
    await axios.get("https://sami-ms-auth-qa.herokuapp.com/users/token/validar", headers).then(response => {
        req.user = response.data;
        return next();
    }).catch(error => {
        return res.status(400).send({ "sRpta": error.response.data });
    });

}