var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisagoodb$oy';
const fetchuser = (req, res, next) => {
    const token = req.header('authtoken');
    if (!token) {

       return res.status(401).send({ error: 'please authenticate using valid token' })
    }
    try {

        const data = jwt.verify(token, JWT_SECRET)

        req.user = data.data.user;
        next();
    } catch (error) {
       return res.status(401).send({ error: 'some error occured' })

    }
}
module.exports = fetchuser;