const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const knex = require('knex') ({
    client: 'mysql',
    version: '8.0',
    connection: {
        database: 'ToDoList',
        host: '127.0.0.1',
        user: 'root',
        // Removed password for security reasons
        password: ''
    }
});
const cors = require('cors');
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use('/static', express.static('public'));
server.use(cors());

server.post('/users', function(req, res) {

    knex('users').select("*").then(function(data) {

        res.send(data);

        for (var i = 0; i < data.length; i++) {

            if (req.body.username == data[i].username) {

                break;

            } else if (i == data.length - 1) {

                bcrypt.genSalt(10, function(err, salt) {

                    if (err) {

                        console.log(err);

                    }

                    bcrypt.hash(req.body.pass, salt, function(err, hash) {

                        if (err) {

                            console.log(err);

                        }

                        knex('users').insert([{username: req.body.username, pass: hash}]).then(function() {

                            console.log("\nNew User Account: \n" + req.body.username + "\n" + hash);
        
                        });

                    });

                });

            }

        }

    });

});

server.post('/comparePassword', function(req, res) {

    knex('users').where('username', req.body.username).then(function(data) {

        bcrypt.compare(req.body.pass, data[0].pass, function(err, resp) {

            if (resp) {

                res.send(true);

            } else {

                res.send(false);

            }

        });

    });

});

server.post('/list', function(req, res) {

    var userID = req.body.userID;

    knex('list').where('userID', userID).then(function(data) {

        res.send(data);

    });

});

server.post('/createList', function(req, res) {

    var userID = req.body.userID;
    var title = req.body.title;
    var desc = req.body.desc;

    knex('list').select("*").then(function() {

        knex('list').insert([{userID: userID, title: title, dsc: desc}]).then(function() {

            console.log("\nNew Item Created: \n" + "User ID: " + userID + "\n" + title + "\n" + desc);

        });

        res.sendStatus(200);

    })

});

server.post('/checkUserID', function(req, res) {

    var user = req.body.username;

    knex('users').where('username', user).then(function(data) {

        res.send(data);

    })

})

server.post('/editList', function(req, res) {
    
    var userID = req.body.userID;
    var inputTitle = req.body.inputTitle;
    var inputDesc = req.body.inputDesc;
    var listID = parseInt(req.body.listID, 10);

    knex('list').where('userID', userID).then(function() {

        knex('list').where('ID', listID)
        .update({
            title: inputTitle, 
            dsc: inputDesc
        }).then();

        res.sendStatus(200);

    })

})

server.post('/removeList', function(req, res) {

    var userID = req.body.userID;
    var listID = parseInt(req.body.listID, 10);

    knex('list').where('userID', userID).then(function() {

        knex('list').where('ID', listID).del().then();

        console.log("\nDeleted list item.");

        res.sendStatus(200);

    })

})

server.get('/', function(request, response) {

    response.sendFile(path.join(__dirname, '/To Do List.html'));

});

server.listen(3000);
console.log("Server is listening on port 3000.");