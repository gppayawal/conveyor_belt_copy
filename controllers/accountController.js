var pg = require('pg');
var md5 = require('md5');
var socket = require('socket.io-client')('https://conveyor-belt-controller.herokuapp.com');

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

module.exports= {
  login: function(req, res) {
    var query = {
      text: "SELECT * FROM accounts WHERE username = $1",
      values: [req.body.username],
    };  
    client.query(query, function(err, result){
      if(err){
        console.log(err);
        res.status(500).send({status: 'Server Error'});
      } 
      else{
        console.log(result);
        if(result.rowCount == 0){
          res.status(404).send({status: 'Username not found'})
        } else{
          var user = result.rows[0];
          if(user.password != md5(req.body.password)){
            res.status(403).send({status: 'Incorrect password'});
          } 
          else{
            delete user.passwod;
            req.session.user = user;
            res.status(200).send({status: 'logged in'});
          }
        }
      }
    });
  },

  logout: function(req, res){
    if(req.session.user.controller){
      var body = {};
      body.i = req.session.user.controller;
      body.username = req.session.user.username;

      socket.emit('deselect', body, function(result){});
    }
    req.session.reset();
    res.redirect('/');
  },

  whoami: function(req,res){
    res.json(req.session.user);
  },

  signup: function(req, res){
      var query = {
        text: 'INSERT into accounts (fname, lname, username, password) values ($1, $2, $3, md5($4)) RETURNING *;',
        values: [req.body.first_name, req.body.last_name, req.body.new_username, req.body.new_password],
      };
      client.query(query, function(err, result){
        if(err){
          console.log(err);
          if(err.code==23505)
            res.status(403).send({status: 'Username already taken'});
          else
            res.status(500).send({status: 'Server Error'});
        } else{
          var user = result.rows[0]
          delete user.password; // delete the password from the session
          req.session.user = user;  //refresh the session value
          res.status(200).send({status:"logged in"});
        }
      });
  },

  changePassword: function(req, res){
    var query = {
      text: 'SELECT * FROM accounts where id=$1;',
      values: [req.session.user.id],
    };
    client.query(query, function(err, result){
      if(err){
          res.status(500).send({status: 'Server Error'});
      } else{
        var user = result.rows[0]
        if(user.password != md5(req.body.old_pw))
          res.status(403).send({status: 'Old password does not match'});
        else{
          var q2 = {
            text: 'UPDATE accounts SET password = md5($1) WHERE id=$2;',
            values: [req.body.new_pw, req.session.user.id] 
          }
          client.query(q2, function(err, newRes){
            if(err){
              res.status(500).send({status: 'Server Error'});
            } else {
              res.status(200).send({status: 'password changed'});
            }
          });
        }
      }
    });
  }
}
