const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const RechargeStatus = require('../model/recharge').RechargeStatus;
const PaymentStatus = require('../model/recharge').PaymentStatus;
const axios = require('axios');

// apis
const userApiUrl = process.env.USER_API_URL
const vehicleApiUrl = process.env.VEHICLES_API_URL
const chargerpointApiUrl = process.env.CHARGERPOINTS_API_URL

// precios
const LENTA_PRICE = process.env.LENTA_PRICE
const MEDIA_PRICE = process.env.MEDIA_PRICE
const RAPIDA_PRICE = process.env.RAPIDA_PRICE
const ULTRARAPIDA_PRICE = process.env.ULTRARAPIDA_PRICE
// precios por kwh
const PRICE_PER_KW = {
    'lenta': LENTA_PRICE,
    'media': MEDIA_PRICE,
    'rapida': RAPIDA_PRICE,
    'ultra_rapida': ULTRARAPIDA_PRICE
}
const CHARGERPOINT_AVAILABLE = 'DISPONIBLE'
const CHARGERPOINT_IN_SERVICE = 'EN_SERVICIO'

if (!userApiUrl || !vehicleApiUrl || !chargerpointApiUrl) {
    throw new Error('userApiUrl, vehicleApiUrl and chargerpointApiUrl are required');
}

// mysql connection
const connection = mysql.createConnection({
    host: process.env.db || 'localhost',
    user: process.env.db_user || 'test',
    password: process.env.db_password || 'test',
});


function initDb() {
    console.log('init db');
}

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to the MySQL server.');

    // create database if not exists
    connection.query('CREATE DATABASE IF NOT EXISTS charlie_recharges', function (error, results, fields) {
        if (error) throw error;
        console.log('Database checked/created.');
        // switch to the database
        connection.changeUser({database: process.env.db_schema || 'charlie_recharges'}, function (err) {
            if (err) throw err;

            // create table if not exists
            connection.query('CREATE TABLE IF NOT EXISTS recharges (' +
                'id INT NOT NULL AUTO_INCREMENT,' +
                'userId INT NOT NULL,' +
                'vehicleId INT NOT NULL,' +
                'chargerpointId INT NOT NULL,' +
                'price DECIMAL(10, 3),' +
                'dateStart DATETIME,' +
                'status VARCHAR(255),' +
                'payment VARCHAR(255),' +
                'kw DECIMAL(10, 2),' +
                'dateEnd DATETIME,' +
                'PRIMARY KEY (id))', function (error, results, fields) {
                if (error) throw error;
            });

            // init db with some data
            connection.query('SELECT COUNT(*) AS count FROM recharges', function (error, results, fields) {
                if (error) throw error;
                if (results[0].count < 0) {
                    initDb();
                }
            });
        });
    });
});


// GET /recharge?userId={id}
router.get('/', async function (req, res, next) {
    // param userId
    const userId = req.query.userId;
    if (!userId) {
        res.status(400).send('userId is required');
        return;
    }

    // get auth token
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send('Unauthorized token');
        return;
    }

    console.log('token: ' + token);
    try {
        // call user api to check if user exists
        const response = await axios.get(userApiUrl + '/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const userData = response.data;
        console.log(userData);
        if (!userData) {
            res.status(400).send('Unauthorized');
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('Unauthorized');
        return;
    }

    // query db DESC by date
    connection.query('SELECT * FROM recharges WHERE userId = ? ORDER BY dateStart DESC', [userId], function (error, results, fields) {
        if (error) {
            res.status(500).send('error getting recharges');
            return;
        }
        res.send(results);
    });
});

// GET /recharge/{rechargeId}
router.get('/:rechargeId', function (req, res, next) {
    // param rechargeId
    const rechargeId = req.params.rechargeId;
    if (!rechargeId) {
        res.status(400).send('rechargeId is required');
        return;
    }
    // query db
    connection.query('SELECT * FROM recharges WHERE id = ?', [rechargeId], function (error, results, fields) {
        if (error) {
            res.status(500).send('error getting recharge');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('recharge not found');
            return;
        }
        res.send(results[0]);
    });
});


// POST /recharge
router.post('/', async function (req, res, next) {
    var recharge = req.body;
    console.log(recharge);
    const userId = recharge.userId;
    const vehicleId = recharge.vehicleId;
    const chargerpointId = recharge.chargerpointId;
    // validate recharge
    if (!userId || !vehicleId || !chargerpointId) {
        res.status(400).send('invalid recharge');
        return;
    }

    // get auth token
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).send('Unauthorized token');
        return;
    }

    // check if user, vehicle and chargerpoint exists
    try {
        // call user api to check if user exists
        let response = await axios.get(userApiUrl + '/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let data = response.data;
        if (!data) {
            res.status(400).send('Unauthorized user');
            return;
        }
        response = await axios.get(vehicleApiUrl + '/' + vehicleId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        data = response.data;
        if (!data) {
            res.status(400).send('failed to get vehicle');
            return;
        }

        if (!data.plugType) {
            res.status(400).send('invalid vehicle format');
            return;
        }
        const vehiclePlugType = data.plugType;

        response = await axios.get(chargerpointApiUrl+'?plugType='+ vehiclePlugType , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        // chargerpoints list
        data = response.data;
        if (!data) {
            res.status(400).send('failed to get chargerpoints');
            return;
        }

        // filter by chargerpointId
        data = data.filter(chargerpoint => chargerpoint.id === chargerpointId);
        if (data.length === 0) {
            res.status(400).send('chargerpoint not found');
            return;
        }
        // first element is the chargerpoint we want
        data = data[0];
        if (data.status !== CHARGERPOINT_AVAILABLE) {
            res.status(400).send('chargerpoint is not available');
            return;
        }
        // check if chargerpoint plugType is compatible with vehicle plugType
        const chargerpointPlugType = data.plugType;
        if (vehiclePlugType !== chargerpointPlugType) {
            res.status(400).send('vehicle plugType is not compatible with chargerpoint plugType');
            return;
        }

        const powerlowercase = data.power.toLowerCase();
        console.log("powerlowercase: " + powerlowercase);
        if (!PRICE_PER_KW[powerlowercase]) {
            res.status(400).send('invalid chargerpoint power');
            return;
        }
        // set price
        recharge.price = +PRICE_PER_KW[powerlowercase];
        console.log("price: " + recharge.price);
    } catch (error) {
        console.log(error);
        res.status(400).send('Unauthorized');
        return;
    }

    // Creamos una nueva recarga
    recharge.status = RechargeStatus.NOT_STARTED
    recharge.payment = PaymentStatus.NOT_PROCESSED

    console.log("Trying to insert recharge: " + recharge);
    // insert recharge
    connection.query('INSERT INTO recharges SET ?', recharge, function (error, results, fields) {
        console.log(error);
        if (error) {
            res.status(500).send('error creating recharge');
        } else {
            recharge.id = results.insertId;
            res.send(recharge);
        }
    });
});


// PUT /recharge/{rechargeId} -> Actualizará el estado de la recarga a ‘Charging’ cuando el usuario
// conecte el vehículo y lo confirme, actualizando la fecha de comienzo y el payment a ‘Pending’. Cuando
// el usuario confirme que ha terminado la recarga, esta pasará al estado ‘Completed’. El pago se
// gestionará automáticamente, por lo que payment pasará a ‘Completed’. El cambio de estos estados
// también afectarán al estado del cargado (chargerpoints). Como en este punto no tenemos puntos de
// carga reales, podemos simular el número total de kilovatios cargados con un número generado de
// forma aleatoria, por ejemplo, entre 1 y la capacidad máxima del vehículo. Este campo, junto a la fecha
// de finalización, se calculará cuando se pase al estado ’Completed’ y una vez asignado este estado no
// permitirá modificarse ningún dato más del registro de la recarga. Si en algún caso no se llegara a
// conectar el vehículo o el usuario no confirma el comienzo de la recarga, esta se quedará en estado
// ‘NotStarted’ y el payment quedará en estado ‘Cancelled’.
router.put('/:rechargeId', function (req, res, next) {
    const rechargeId = req.params.rechargeId;
    if (!rechargeId) {
        res.status(400).send('rechargeId is required');
        return;
    }
    const newStatus = req.body.status;
    if (!newStatus) {
        res.status(400).send('status is required');
        return;
    }

    // auth token
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).send('Unauthorized token');
        return;
    }

    // query db to obtain recharge
    connection.query('SELECT * FROM recharges WHERE id = ?', [rechargeId], async function (error, results, fields) {
        if (error) {
            res.status(500).send('error getting recharge');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('recharge not found');
            return;
        }

        // recharge to update
        const recharge = results[0];

        // get recharge vehicle
        const vehicleId = recharge.vehicleId;
        let vehicleCapacity = 0;
        try {
            const response = await axios.get(vehicleApiUrl + '/' + vehicleId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            if (!response.data) {
                res.status(400).send('response from vehicle api is empty');
                return;
            }
            vehicleCapacity = response.data.capacity;
            console.log('vehicle capacity: ' + vehicleCapacity);
        } catch (error) {
            res.status(400).send('error getting vehicle');
            return;
        }

        // get recharge status
        const status = recharge.status;

        // si el estado es Completed no se puede modificar
        if (status === RechargeStatus.COMPLETED) {
            res.status(403).send('recharge is already completed');
            return;
        }

        // id del punto de carga
        const chargerpointId = recharge.chargerpointId;

        // si el estado es NotStarted
        if (status === RechargeStatus.NOT_STARTED) {
            // se puede pasar a Charging
            if (newStatus === RechargeStatus.CHARGING) {
                recharge.status = RechargeStatus.CHARGING;
                recharge.dateStart = new Date();
                recharge.payment = PaymentStatus.PENDING;

                // call chargerpoint api to update chargerpoint status
                try {
                    let chargerpointResponse = await axios.put(chargerpointApiUrl + '/' + chargerpointId, {
                        status: CHARGERPOINT_IN_SERVICE
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    });
                    if (chargerpointResponse.status !== 200) {
                        res.status(500).send('error updating chargerpoint');
                        return;
                    }
                } catch (error) {
                    res.status(500).send('error updating chargerpoint');
                    return;
                }


            } else if (newStatus === RechargeStatus.NOT_STARTED) {
                // se cancela el pago si no se ha iniciado la recarga
                recharge.status = RechargeStatus.NOT_STARTED;
                recharge.payment = PaymentStatus.CANCELLED;
            } else {
                res.status(400).send('invalid recharge status');
                return;
            }
        } else if (status === RechargeStatus.CHARGING) {
            // si el estado es Charging
            // se puede pasar a Completed
            if (newStatus === RechargeStatus.COMPLETED) {
                recharge.status = RechargeStatus.COMPLETED;
                recharge.dateEnd = new Date();
                recharge.payment = PaymentStatus.COMPLETED;
                // se calcula el kw cargado de forma aleatoria desde 1 hasta la capacidad del vehículo
                recharge.kw = Math.floor(Math.random() * vehicleCapacity) + 1;

                // actualizamos el estado del punto de carga
                try {
                    let chargerpointResponse = await axios.put(chargerpointApiUrl + '/' + chargerpointId, {
                        status: CHARGERPOINT_AVAILABLE
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    });
                    // comprobamos que el punto de carga se ha actualizado correctamente
                    if (!chargerpointResponse.data) {
                        res.status(400).send('response from chargerpoint api is empty');
                        return;
                    }
                } catch (error) {
                    res.status(500).send('error updating chargerpoint');
                    return;
                }
            } else {
                res.status(400).send('invalid recharge status');
                return;
            }
        }

        // update recharge
        connection.query('UPDATE recharges SET ? WHERE id = ?', [recharge, rechargeId], function (error, results, fields) {
            if (error) {
                res.status(500).send('error updating recharge');
                return;
            }
            res.send(recharge);
        });
    });


});


module.exports = router;
