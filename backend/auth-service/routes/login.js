var express = require('express');
const jose = require('jose');
const axios = require('axios');
const bcrypt = require('bcrypt');

var router = express.Router();

const alg = 'RS256'
// esto deberia estar en un archivo de configuracion
const pkcs8 = `-----BEGIN PRIVATE KEY-----
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
W53wftn7JxtRQL1zdVOlsPbmIfHY
-----END PRIVATE KEY-----
`


/*
POST users login listing.
*/
router.post('/', async function (req, res, next) {
    // data = {email: 'email', password: 'password'}
    const data = {email, password} = req.body;
    // check if data is valid
    if (!data || !data.email || !data.password || data.email === '' || data.password === '') {
        res.status(403).send({message: 'Login failed'});
        return;
    }
    const userApiUrl = process.env.USER_API_URL
    // console.log(userApiUrl)
    if (!userApiUrl) {
        res.status(403).send({message: 'Login failed'})
        return;
    }

    var user = null
    try {
        // call user api to get user, returns a list of users
        const response = await axios.get(userApiUrl, {
            params: {
                email: data.email
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const userData = response.data;
        // console.log(userData);
        if (!userData || !userData[0]) {
            res.status(403).send({message: 'Login failed'});
            return;
        }
        // user is first element of list
        user = userData[0];
        // check password 
        const status = await bcrypt.compare(data.password, user.password);
        // check if user exists and password is correct
        if (!user || !user.password || !status) {
            res.status(403).send({message: 'Login failed'});
            return;
        }
    } catch (error) {
        // console.log(error)
        res.status(403).send({message: 'Login failed'});
        return;
    }

    // console.log(data)
    const privateKey = await jose.importPKCS8(pkcs8, alg)

    // expirate in 6 hours
    const expirate = new Date()
    expirate.setHours(expirate.getHours() + 6)

    const jwt = await new jose.SignJWT({data: "hi from charlie", name: user.name})
        .setProtectedHeader({alg})
        .setSubject(data.email)
        .setIssuedAt()
        .setIssuer('org:uva:dbcs:charlie')
        .setAudience('org:uva:dbcs:charlie:' + data.email)
        .setExpirationTime(expirate)
        .sign(privateKey)

    console.log(jwt)
    const body = {token: jwt, expires_at: expirate.getTime()}
    res.send(body)
});

module.exports = router;
