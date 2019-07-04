var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var DButilsAzure = require('../DButils');
var Countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia",
            "Monaco", "August", "Norway", "Panama", "Switzerland", "USA"];
var secret = "YossiandRoeeSecret";

//secure entring
router.post("/private", (req, res, next) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        res.status(200).send({ result: "Login verified"});
        next();
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});

//login
router.post('/login', (req, res) => {
    var username = req.body.username;
    var Password = req.body.password;
    DButilsAzure.execQuery(`SELECT * FROM dbo.users WHERE username = '`+ username + `'`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            if(response.length > 0) {
                if(response[0].password == Password) {

                    payload = { username: username};
                    options = { expiresIn: "1d" };
                    const token = jwt.sign(payload, secret, options);
                    //res.status(200).json(token);
                    res.send(token);
                }
                else {
                    res.status(400).json({message: 'Password is incorrect'});
                }
            }
            else {
                res.status(404).json({message: 'Username is not exist'});
            }
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//register
router.post('/register', (req, res, next) => {
    var username = req.body.username;
    DButilsAzure.execQuery(`SELECT * FROM dbo.users WHERE username = '`+ username + `'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                if(response.length == 0) {
                    next();
                }
                else {
                    res.status(400).json({message: 'username is already exist'});
                }
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message });
        });
});

//add user
router.post('/register', (req, res, next) => {
    DButilsAzure.execQuery("INSERT INTO users (username, password, firstname, lastname, city, country, email) VALUES ('"+req.body.username+"', '"+req.body.password+"', '"+req.body.firstname+"', '"+req.body.lastname+
        "', '"+req.body.city+"', '"+req.body.country+"', '"+req.body.email+"')")
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            next();
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });
});

//add questions
router.post('/register', (req, res, next) => {

    DButilsAzure.execQuery("INSERT INTO dbo.usersQ (username, quesID, ans) VALUES ('"+req.body.username+"', '"+req.body.quesID1+"', '"+req.body.ans1+"')")
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                console.log("3");
                res.status(200).json({message: "Question 1 successfully added"});
                next();
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

//add second question
router.post('/register', (req, res) => {

    DButilsAzure.execQuery("INSERT INTO dbo.usersQ (username, quesID, ans) VALUES ('"+req.body.username+"', '"+req.body.quesID2+"', '"+req.body.ans2+"')")
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                console.log("4");
                console.log("got here");
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

//add category to user
router.post('/addUsersCategory', (req, res) => {

    DButilsAzure.execQuery("INSERT INTO dbo.user_category (username, category) VALUES ('"+req.body.username+"', '"+req.body.categoryName+"')")
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                res.status(200).json({message: "category add successfully"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});


//return two random questions
router.get("/getTwoRandomQuestions", function(req, res){
    var promise = DButilsAzure.execQuery("SELECT * FROM ques " );
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                var n=2;
                var result = new Array(n),
                    len = response.length,
                    taken = new Array(len);
                if (n > len)
                    result = response;
                else {
                    while (n--) {
                        var x = Math.floor(Math.random() * len);
                        result[n] = response[x in taken ? taken[x] : x];
                        taken[x] = --len in taken ? taken[len] : len;
                    }
                }
                res.status(200).json(result);
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

//restore password
router.post('/restorePassword', (req, res, next) => {
    var username = req.body.username;
    var quesID1 = req.body.quesID1;
    var quesID2 = req.body.quesID2;
    var ans1 = req.body.ans1;
    var ans2 = req.body.ans2;

    console.log(req.body.username);

  DButilsAzure.execQuery(`SELECT * FROM dbo.usersQ WHERE username = '`+ username +  "' AND quesID ='" + quesID1
   + "' AND ans ='" + ans1+"' OR username ='"+username+  "' AND quesID ='" + quesID2
    + "' AND ans ='" + ans2+`'` )
  .then((response, err) => {
      if(err)
          res.status(400).json({message: err.message});
      else{
          if(response.length==2){
              next();
          }
          else
              res.status(400).json({message: "Password restore failed"});
      }
  })
  .catch(function(err) {
      res.status(400).json({message: err.message});
  });

});
router.post('/restorePassword', (req, res, next) => {
    var username = req.body.username;
    DButilsAzure.execQuery(`SELECT password FROM dbo.users WHERE username = '`+ username+`'` )
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                res.status(200).json(response);
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });

});

//get users questions
router.post("/getMyQuestions", function(req, res, next){
    var promise = DButilsAzure.execQuery("SELECT quesID FROM usersQ WHERE username ='" + req.body.username + "'" );
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                req.ques1 = response[0].quesID;
                req.ques2 = response[1].quesID;
                next();
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });

});

router.post("/getMyQuestions", function(req, res, next){
    var promise = DButilsAzure.execQuery("SELECT ques FROM dbo.ques WHERE quesID ='" + req.ques1 + "' OR quesID ='" + req.ques2 +"'" );
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                var x = [];
                x[0] = {quesID: req.ques1, ques: response[0].ques};
                x[1] = {quesID: req.ques2, ques: response[1].ques};
                res.status(200).json(x);
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});
module.exports = router;