const express = require('express')
const { exec } = require("child_process");
const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', (req, res) => {
    console.log(req.body)
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
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})