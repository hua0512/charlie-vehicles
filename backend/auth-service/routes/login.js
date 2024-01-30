var express = require('express');
const jose = require('jose');
const axios = require('axios');
const bcrypt = require('bcrypt');

var router = express.Router();

const alg = 'HS256'

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

    // current date
    const currentDate = new Date()
    // expirate in 6 hours
    const expirate = new Date()
    expirate.setHours(currentDate.getHours() + 6)

    const keyId = process.env.KEY_ID
    if (!keyId) {
        res.status(403).send({message: 'Login failed'})
        return;
    }

    let secret = process.env.SECRET
    if (!secret) {
        res.status(403).send({message: 'Login failed'})
        return;
    }
    const secretEncoded = new TextEncoder().encode(secret)

    const jwt = await new jose.SignJWT({name: user.name})
        .setProtectedHeader({alg, kid: keyId})
        .setSubject(data.email)
        .setIssuedAt()
        .setExpirationTime(expirate)
        .sign(secretEncoded)

    console.log(jwt)
    const body = {token: jwt, expires_at: expirate.getTime()}
    res.send(body)
});

module.exports = router;
