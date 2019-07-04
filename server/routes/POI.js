var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
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

//return the number of views, description and rating of this POI
router.get("/getPOI/:POIID", function(req, res){
    var id = req.params.POIID;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE POIID ='" + id + "'");
    promise
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

//return all POI
router.get("/getAllPOI", function(req, res){
    var promise = DButilsAzure.execQuery("SELECT * FROM POI");
    promise
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

//add 1 to "number of views" in POI table
router.post("/addViewToPOI/:POIID", function(req, res, next){
    var id = req.params.POIID;
    var promise = DButilsAzure.execQuery("SELECT number_of_views FROM POI WHERE POIID ='" + id + "'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                req.view = response[0].number_of_views;
                next();
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });

});
router.post("/addViewToPOI/:POIID", function(req, res, next){
    var id = req.params.POIID;
    var views = req.view + 1;
    var promise = DButilsAzure.execQuery("UPDATE POI SET number_of_views ='" + views + "' WHERE POIID ='" + id +"'");
    promise
        .then((response, err) => {

            if(err)
                res.status(400).json({message: err.message});
            else{
                res.status(200).send({message: "add view"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });

});

//return lats two reviews of this POI
router.get("/getLastPOIReviews/:POIID", function(req, res, next){
    var id = req.params.POIID;
    var promise = DButilsAzure.execQuery("SELECT TOP 2 * FROM review WHERE POIID ='" + id + "'");
    promise
        .then((response, err) => {

            //console.log(response);

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


//Return 3 random points of interest
router.get("/getRandomPOI", function(req, res){
    var rat = 0.35;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE rating >'" + rat + "'" );

    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                var n=3;
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


//return most popular POI by category
router.post("/private/RecommendedPOI", function(req, res, next){
    DButilsAzure.execQuery("SELECT category FROM dbo.user_category WHERE username ='" + req.body.username + "'")
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
                req.category = result;
                next();
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/RecommendedPOI", function(req, res, next){
    var category = req.category[0].category;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE category ='" + category + "'" );
    promise
        .then((response, err) => {

            if(err)
                res.status(400).json({message: err.message});
            else{
                var max = 0;
                var result = null;
                for (var i = 0;i<response.length;i++){
                    if (max<response[i].rating) {
                        max = response[i].rating;
                        result = response[i];
                    }
                }
                req.POI1 = result;
                next();
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/RecommendedPOI", function(req, res, next){
    var category = req.category[1].category;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE category ='" + category + "'" );
    promise
        .then((response, err) => {

            if(err)
                res.status(400).json({message: err.message});
            else{
                var max = 0;
                var result = null;
                for (var i = 0;i<response.length;i++){
                    if (max<response[i].rating) {
                        max = response[i].rating;
                        result = response[i];
                    }
                }
                var ans = [req.POI1, result]
                res.status(200).json(ans);
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

//returm last two POI of the user
router.post("/private/getLastTwoPOI", function(req, res, next){
    var username = req.body.username;
    var promise = DButilsAzure.execQuery("SELECT TOP 2 POIID FROM user_poi WHERE username ='" + username + "'"  + "ORDER BY Date DESC");
    promise
        .then((response, err) => {

            if(err)
                res.status(400).json({message: err.message});
            else{
                req.poi1 = 0;
                req.poi2 = 0;
                if (response.length > 0){
                    req.poi1 = response[0].POIID;

                }
                if (response.length > 1){
                    req.poi2 = response[1].POIID;

                }
                next();
                //res.status(200).json(response);
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/getLastTwoPOI", function(req, res, next){
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE POIID ='" + req.poi1 + "' or POIID ='"+req.poi2  + "'");
    promise
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

//return all the POI of category
router.get("/getListOfPOIByCategory/:category", function(req, res){
    var category = req.params.category;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE category ='" + category + "'" );
    promise
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

//return list of POI by name
router.get("/getPOIByName/:POI_name", function(req, res){
    var name = req.params.POI_name;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE POI_name ='" + name + "'" );
    promise
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

//return list of categories
router.get("/getListOfCategory", function(req, res){
    var promise = DButilsAzure.execQuery("SELECT DISTINCT category_name FROM category");
    promise
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

//add new POI to user
router.post("/private/addPOI", function(req, res, next){
    var username = req.body.username;
    var promise = DButilsAzure.execQuery("SELECT * FROM users WHERE username ='" + username + "'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                if (response.length>0)
                    next();
                else
                    res.status(400).json({message: "user not exist"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/addPOI", function(req, res, next){
    var POIID = req.body.POIID;
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE POIID ='" + POIID + "'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                if(response.length>0)
                    next();
                else
                    res.status(400).json({message: "POI id not exist"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/addPOI", function(req, res, next){
    var username = req.body.username;
    var POIID = req.body.POIID;
    var d = (Date(Date.now())).toString();
    d = d.split(" ");
    var date = d[1]+" "+d[2]+" "+d[3]+" "+d[4];
    var promise = DButilsAzure.execQuery("INSERT INTO user_poi (username, POIID, Date) " +
        "VALUES ('" + username + "', '" + POIID+"', '" + date + "')");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                res.status(200).json({message: "POI add to user save list"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});


//Delete POI to user
router.post("/private/deletePOI", function(req, res, next){
    var username = req.body.username;
    var POIID = req.body.POIID;
    var promise = DButilsAzure.execQuery("SELECT * FROM user_poi WHERE username ='" + username + "' AND POIID ='"+ POIID +"'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                if (response.length>0)
                    next();
                else
                    res.status(400).json({message: "user not exist"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/deletePOI", function(req, res, next){
    var username = req.body.username;
    var POIID = req.body.POIID;
    var promise = DButilsAzure.execQuery("DELETE FROM user_poi WHERE username ='" + username + "' AND POIID ='"+ POIID +"'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                res.status(200).json({message: "POI delete from user save list"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

//return list of user's POI
router.post("/private/getMyPOI", function(req, res, next){
    var username = req.body.username;
    var promise = DButilsAzure.execQuery("SELECT * FROM user_poi WHERE username ='" + username + "'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                if (response.length>=0){
                    req.pois = response;
                    next();
                }
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/getMyPOI", function(req, res, next){
    var qus = '';
    for (x in req.pois){
        qus = qus + "POIID ='" + req.pois[x].POIID + "' or ";
    }
    qus = qus.substring(0, qus.length-4);
    var promise = DButilsAzure.execQuery("SELECT * FROM POI WHERE " + qus);
    promise
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

//add to POI new review
router.post("/private/addRank", function(req, res, next){
    var username = req.body.username;
    var POIID = req.body.POIID;
    var promise = DButilsAzure.execQuery("DELETE FROM review WHERE username ='" + username + "' AND POIID ='"+ POIID +"'");
    promise
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

router.post("/private/addRank", function(req, res, next){
    var username = req.body.username;
    var POIID = req.body.POIID;
    var rank = req.body.rank;
    var description = req.body.description;
    var d = (Date(Date.now())).toString();
    d = d.split(" ");
    var date = d[1]+" "+d[2]+" "+d[3]+" "+d[4];
    var promise = DButilsAzure.execQuery("INSERT INTO review (username, POIID, rank, description, Date) " +
        "VALUES ('" + username + "', '" + POIID+"', '" + rank + "', '" + description + "', '" + date +"' )");
    promise
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

router.post("/private/addRank", function(req, res, next){
    var POIID = req.body.POIID;
    var promise = DButilsAzure.execQuery("SELECT rank FROM review WHERE POIID ='" + POIID + "'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                var totalRank = 0;
                for (var i = 0; i<response.length;i++){
                    var x = response[i].rank;
                    totalRank += parseInt(x);
                }
                var rate = (totalRank/response.length)/5;
                req.rate = rate;
                next();
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

router.post("/private/addRank", function(req, res, next){
    var POIID = req.body.POIID;
    var rate = req.rate;
    var promise = DButilsAzure.execQuery("UPDATE POI SET rating ='" + rate + "' WHERE POIID ='" + POIID +"'");
    promise
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                res.status(200).json({message: "add rank for POI"});
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
});

//retern POI Picture url
router.get("/getPOIPicture/:POIID", function(req, res){
    var id = req.params.POIID;
    console.log(id);
    var promise = DButilsAzure.execQuery("SELECT * FROM POIPicture WHERE POIID ='" + id + "'");
    promise
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

module.exports = router
