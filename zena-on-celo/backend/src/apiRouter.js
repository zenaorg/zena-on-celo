import express from 'express';
import { db } from './database/db.js'
import { createWallet, getBalance, rewardBTC } from "./ethService.js";
import * as dotenv from 'dotenv'
dotenv.config()

export const apiRouter = express.Router();
apiRouter.use(function (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// Routes
apiRouter.get('/users', async (req, res) => {
    await db.read()
    res.send(db.data.users)
})

apiRouter.post('/users', async (req, res) => {
    await db.read()
    const userData = req.body.user;
    const wallet = await createWallet();
    console.log('address:', wallet.address)
    console.log('mnemonic:', wallet.mnemonic.phrase)
    console.log('privateKey:', wallet.privateKey)
    const newUser = {
        "id": db.data.users.length + 1,
        "name": userData.name,
        "pubKey": wallet.address,
        "privKey": wallet.privateKey,
        "stats": {
            "quiz1": 0,
            "quiz2": 0,
            "quiz3": 0,
            "quiz4": 0
        }
    }
    const newUsers = [...db.data.users, newUser];
    db.data.users = newUsers;
    db.write()
    res.send(newUser)

})


apiRouter.get('/users/:id', async (req, res) => {
    await db.read()
    const user = db.data.users?.find(user => user.id === parseInt(req.params.id))
    res.send(user)
})

apiRouter.get('/users/:id/balance/:token', async (req, res) => {
    await db.read();
    const user = db.data.users?.find(user => user.id === parseInt(req.params.id))
    console.log(user)
    const balance = await getBalance(user.pubKey, "BTC");
    res.send(balance)
})

apiRouter.post('/users/:id/reward', async (req, res) => {
    await db.read();
    const reward = req.body.reward;
    const user = db.data.users?.find(user => user.id === parseInt(req.params.id))
    // console.log(user)
    // const balance = await getBalance(user.pubKey, "BTC");
    const result = rewardBTC(user.pubKey, "0.01");
    // res.send(balance)
})

apiRouter.put('/users/:id', async (req, res) => {
    await db.read()
    db.data.users = db.data.users?.map(user => {
        if (user.id === parseInt(req.params.id)) {
            const userData = req.body.user;
            return userData;
        } else {
            return user
        }
    })
    db.write()
    res.sendStatus(204)
})

apiRouter.post('/transferBTC', async (req, res) => {
    await db.read()
    // TODO
})