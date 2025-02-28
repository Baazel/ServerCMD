const express = require('express')
const { exec } = require("child_process");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 8080;
const secret = process.env.SECRET_KEY;
const secretusr = process.env.SECRET_USER;
const secretpass = process.env.SECRET_PASS;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/login',(req, res) => {
    var requsr = req.body.user;
    var reqpass = req.body.pass;
    if (requsr==secretusr && reqpass == secretpass){
        var payload = { user: { username: requsr } };
        var token = jwt.sign(payload, secret, { expiresIn: '5m' });
        res.send(token)
    }
    else{
        res.status(400).send('Usuario invalido')
    }
})

app.post('/', (req, res) => {
    var authHeader = req.headers['authorization'];
    var secretKey = req.headers['secret'];
    var token = authHeader && authHeader.split(' ')[1];

    // Sin token
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, decoded) => {
        //Token invalido
        if (err) return res.sendStatus(403);
        var cmdCommand = req.body.command;
        exec(cmdCommand, (error, stdout, stderr) => {
            var response = {
                error: error?error.message:"",
                stderr: stderr?stderr:"",
                stdout: stdout?stdout:""
            }

            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
            res.send(response) 
        });
    });
})

app.listen(port, () => {
  console.log(`ServerCMD utilizando puerto: ${port}`)
})