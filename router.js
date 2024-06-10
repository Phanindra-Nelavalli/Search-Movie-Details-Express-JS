const express = require('express');
var router = express.Router();
const axios = require('axios');
const { db } = require('./firebase.js');

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'Good Morning';
    } else if (hour < 18) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
}


router.post('/sign-up', async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        const userRef = db.collection('Users').doc(Email);
        const resp1 = await userRef.get();

        if (resp1.exists) {
            return res.status(401).send('Account Already Exists');
        } else {
            await userRef.set({
                name: Name,
                email: Email,
                password: Password
            });
            res.render('base',{title:"Login System"});
        }
    } catch (error) {
        console.error("Error in sign-up route:", error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const userRef = db.collection('Users').doc(Email);
        const resp = await userRef.get();

        if (!resp.exists) {
            return res.status(401).send('Invalid email id');
        } else {
            const userData = resp.data();
            if (Password === userData.password) {
                const userName = userData.name;
                res.render('dashboard', { movie: null, userName, greeting: userName ? getGreeting() : null});
            } else {
                return res.status(401).send('Invalid password');
            }
        }
    } catch (error) {
        console.error("Error in login route:", error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports=router;