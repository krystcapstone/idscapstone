const http = require('http');
const hostname = '127.0.0.1';
const port = 3306;



const express = require('express');
const app = express();
const path = require('path')
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql'); 
const session = require('express-session'); 
var ReverseMd5 = require('reverse-md5');
const crypto = require("crypto");
var rev = ReverseMd5({
  lettersUpper: false,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 12
})



app.set('view engine','ejs');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.json());
/* Joins css files in the folder 'public'*/
app.use(express.static(__dirname + '/public'));

/* Joins js files in the folder 'jsdesign'*/
app.use(express.static(__dirname + '/jsdesign'));


/* Set up the server with IP and port number */
app.use('/', router);
app.listen(port, hostname, function() {
  console.log('Server running at http://'+ hostname + ':' + port + '/');
});

/* DATABASE SETUP */
var con = mysql.createConnection({
  host: hostname,
  user: "root",
  password: "",
  port: "8889"
  database: "capitdb",
  multipleStatements:true
});


/*
/* ACCESS DATABASE */
con.connect(function(err) {
  if (err) throw err;
  console.log('MySQL Database is connected Successfully');
 
  
  
/*sessions */
app.use(session({
  secret : 'secretpassword',
  resave : true,
  saveUninitialized : true,

}));

var checker = 0;
var user = 0;
var role = "NULL";
/* Renders different web pages of the web application'*/
router.get('/', function(req, res, next){
  res.render('login.ejs');
//res.sendFile(path.join(__dirname+'/login.ejs'), );
});
/*Login*/
router.post('/login', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  console.log(password);
 if (username && password){
    query =  `SELECT * FROM login WHERE username = "${username}"`;
    con.query(query, function(err, data){
      if (data.length > 0)
      {
        for (var count = 0; count < data.length; count++){
          console.log(data[count].password)
          var md5pass = rev(data[count].password)
          console.log(md5pass.str)
          if (md5pass.str == password){
            console.log(data[count].password)
            checker = req.sessionID
            user = data[count].idlogin
            role = data[count].role
            console.log(user);
            
            res.redirect("home");
          }
          else {
           res.send('Incorrect password');
          }
        }
      }
      else {
        res.send( 'Username does not exist');
      }
      res.end();
    })

  }else {
      res.send('Enter Username and Password');
      res.end();
  }

});


//Latest
router.get('/home', function(req, res,next){
    if(req.sessionID == checker){
        let userid= user;
    //    var passedVariable = req.session.valid;
        console.log(user);
        //HINDI KO PA ALAM KUNG ANO ANO MGA NEED DITOOO
        con.query("SELECT COUNT(status) as ctnotrev FROM clip_view WHERE status = 'Not Reviewed'; SELECT COUNT(date) as num FROM logs_view WHERE date = date(now()); SELECT * FROM clips ORDER BY date DESC; SELECT * FROM report ORDER BY datetime DESC; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"'; ", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log(result[1]);
        res.render('home', {pendingrev:result[0], logs:result[1], clips:result[2], report:result[3], users:result[4]});
      });
      
     }else {
       res.send('You are not authorized. Please login first');
     }
  });
  
  router.get('/camera', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      con.query("SELECT * FROM camera; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"'; ", function (err, result, fields) {
        console.log(result);
        res.render('camera', {data : result[0], users : result[1]});
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });
  
  // Opens clips.ejs when user click on Clips
  router.get('/clips', function(req, res){
    let userid= user;
    // SELECT cv.date, COUNT(cv.status) as ctnotrev FROM clip_view cv JOIN clips c ON cv.date= c.date WHERE cv.status = 'Not Reviewed' GROUP BY cv.date, cv.status
   // if(req.sessionID == checker){
      con.query("SELECT * FROM clips; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('clips', {data : result[0], users:result[1]});
      });
   //  }else {
   //    res.send('You are not authorized. Please login first');
   //  }
    
  });
  // Check chosen date and opens clipsview.ejs with the data that is retrieved from the database using the chosen date
  router.post('/clipsview', function(req, res){
 if(req.sessionID == checker){
      let userid= user;
      console.log(req.body.clipdate);
      let clipdate= req.body.clipdate;
      let checkupdate=req.body.update;
      let statusupdate=req.body.status;
      let time= req.body.time;
      let remarks= req.body.remarks;
      const getData ="SELECT cv.date, cv.time, cv.status, cv.remarks, cv.cameraid, cv.videofilename, ca.name FROM clip_view cv JOIN (SELECT cameraid, name FROM 	camera) ca ON cv.cameraid = ca.cameraid JOIN clips c ON cv.date= '"+clipdate+"' GROUP BY cv.date, cv.time, cv.status, cv.remarks, cv.cameraid, cv.videofilename, ca.name ORDER BY cv.date, cv.time, cv.status, cv.remarks, cv.cameraid, cv.videofilename, ca.name;"
      const getUser = "SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';"
      console.log(checkupdate + " 1");
      console.log(statusupdate + " 2");
      
      if(checkupdate == "1"){
       // con.query("UPDATE `clip_view` SET `status` = 'not reviewed' WHERE `clip_view`.`clipid` = 1;")
        //UPDATE clip_view SET `status` = 'reviewed' WHERE time = "16:46:38";
        
        if(statusupdate == "Not Reviewed"){
          con.query("UPDATE clip_view SET `status` = 'Reviewed' WHERE time = '"+time+"' and date ='"+clipdate+"';"+ getData +" INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)"
          + "VALUES (CURDATE(), CURRENT_TIMESTAMP(), 'clip_view', 'status', 'UPDATE', 'Not Reviewed', 'Reviewed', '"+userid+"');", function (err, result, fields) {
          console.log(getData);
            res.render('clipsview', {data : result[1]});
          })
        }
        else if (statusupdate == "Reviewed"){
          con.query("UPDATE clip_view SET `status` = 'Not Reviewed' WHERE time = '"+time+"' and date ='"+clipdate+"';"+ getData +"INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)"
          + "VALUES (CURDATE(), CURRENT_TIMESTAMP(), 'clip_view', 'status', 'UPDATE', 'Reviewed', 'Not Reviewed', '"+userid+"'); " , function (err, result, fields) {
            console.log(getData);
            res.render('clipsview', {data : result[1]});
          })
        }
  
      }
      else if(checkupdate =="2"){
        con.query("UPDATE clip_view SET `remarks` = '"+remarks+"' WHERE time = '"+time+"' and date ='"+clipdate+"';"+ getData +"  INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)"
        + "VALUES (CURDATE(), CURRENT_TIMESTAMP(), 'clip_view', 'remarks', 'UPDATE', '', '"+remarks+"', '"+userid+"');", function (err, result, fields) {
          console.log(getData);
          res.render('clipsview', {data : result[1]});
        })
      }
      else if(checkupdate == "1" || checkupdate =="2"){
        let statuscheck = "0";
        for(var i=0; i < result[1].length; i++){
          console.log(result[1][i].status);
          if (result[1][i].status != "Not Reviewed"){
            statuscheck = "1";
            console.log(i +"TEST");
          }
        }
          if (statuscheck=="1"){
            con.query();
          }else{
            con.query("UPDATE `clips` SET `status` = 'Not Reviewed' WHERE `clips`.`date` = '"+clipdate+"'; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';")
          }
        
      }
      else{
        con.query(getData + getUser, function (err, result, fields) {
          console.log(result + "12132");
            res.render('clipsview', {data : result[0], users:result[1]});
        })
      };
      
      
      
      
   }else {
       res.send('You are not authorized. Please login first');
    }
   
  });
  // Opens snaps.ejs when user click on Snapshots
  router.get('/snaps', function(req, res){
     if(req.sessionID == checker){
      let userid= user;
      con.query("SELECT * FROM snapshots; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('snaps', {data : result[0], users:result[1]});
      });
     }else {
       res.send('You are not authorized. Please login first');
   }
  });
  router.post('/snapsupdate', function(req, res){
    let snapdate= req.body.snapdate;
    let statusupdate=req.body.status;
    console.log(statusupdate);
   if(req.sessionID == checker){
      let userid= user;
      //con.query("UPDATE `clip_view` SET `status` = 'not reviewed' WHERE `clip_view`.`clipid` = 1;")
      //UPDATE clip_view SET `status` = 'reviewed' WHERE time = "16:46:38";
      
      if(statusupdate == "Not Reviewed"){
        con.query("UPDATE `snapshots` SET `status` = 'Reviewed' WHERE date = '"+snapdate+"'; SELECT * FROM snapshots; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';"
        + "INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)"
        + "VALUES (CURDATE(), CURRENT_TIMESTAMP(), 'snapshots_view', 'status', 'UPDATE', 'Not Reviewed', 'Reviewed', '"+username+"')", function (err, result, fields) {
        console.log(result[1]);
          res.render('snaps', {data : result[1], users:result[2]});
        })
      }
      else if (statusupdate == "Reviewed"){
        con.query("UPDATE `snapshots` SET `status` = 'Not Reviewed' WHERE date = '"+snapdate+"'; SELECT * FROM snapshots; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';" 
        + "INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)"
        + "VALUES (CURDATE(), CURRENT_TIMESTAMP(), 'snapshots_view', 'status', 'UPDATE', 'Not Reviewed', 'Reviewed', '"+username+"')", function (err, result, fields) {
          console.log(result[1]);
          res.render('snaps', {data : result[1], users:result[2]});
        })
      }
   }else {
     res.send('You are not authorized. Please login first');
   }
  });
  // Check chosen date and opens snapsview.ejs with the data that is retrieved from the database using the chosen date
  router.post('/snapsview', function(req, res){
     if(req.sessionID == checker){
      let userid= user;
      console.log(req.body.snapdate);
      let snapdate= req.body.snapdate;
      con.query("SELECT sv.date, sv.snap, sv.time, sv.remarks, c.name FROM snapshots_view sv JOIN ( SELECT cameraid, name FROM camera)" 
      + "c ON sv.cameraid = c.cameraid JOIN snapshots s ON sv.date= '"+snapdate+"'" 
      + "GROUP BY sv.date, sv.snap, sv.time, sv.remarks, c.name ORDER BY sv.date, sv.time, sv.snap, sv.remarks, c.name;"
      + "SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('snapsview', {data : result[0], users:result[1]});
      });
     }else {
       res.send('You are not authorized. Please login first');
     }
  });
  // Opens reports.ejs when user click on report
  router.get('/reports', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      con.query("SELECT * FROM report; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('reports', {data : result[0], users:result[1]});
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });
  // Check chosen date and opens reportview.ejs with the data that is retrieved from the database using the chosen date
  router.post('/reportview', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      console.log(req.body.reportdate);
      let reportdate= req.body.reportdate;
      con.query("SELECT 	rv.datetime, rv.time, rv.report, rv.snap, c.name FROM  report_view rv JOIN ( 	SELECT 	cameraid, name FROM 	camera) "
      +  "c ON rv.cameraid = c.cameraid JOIN report r ON rv.datetime= '"+reportdate+"' GROUP BY rv.datetime, rv.report, rv.snap, c.name ORDER BY rv.time;"
      +" SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('reportview', {data : result[0], users:result[1]});
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });
  // Opens logs.ejs when user click on Logs
  router.get('/logs', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      con.query("SELECT * FROM logs; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
      console.log(result);
      res.render('logs', {data : result[0], users:result[1]});
     });
    }else {
      res.send('You are not authorized. Please login first');
    }
    
  });
  
  // Check chosen date and opens logview.ejs with the data that is retrieved from the database using the chosen date
  router.post('/logview', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      console.log(req.body.logdate);
      let logdate= req.body.logdate;
      con.query("SELECT lv.date, lv.text FROM logs_view lv JOIN logs l ON lv.date= '"+logdate+"' GROUP BY lv.date, lv.text; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
      console.log(result);
      res.render('logview', {data : result[0], users:result[1]});
    });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });
  // Displays the video using the parameter in the URL
  router.get('/video/:video', function(req, res) {
   var vidname = req.params.video;
   console.log(vidname);
    //Testing address pth
    var vidpath = String.raw`C:\\Users\\Kryst\\Desktop\\` + vidname;
    //Shared Folder path
    //var vidpath = String.raw`\\192.168.1.102\\Main\\home\\bosskryst\\Desktop\\Intruder Detection System\\` + vidname;
    const stat = fs.statSync(vidpath)
    const fileSize = stat.size
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/H264',
    }
    res.writeHead(200, head)
    fs.createReadStream(vidpath).pipe(res)
  })

  router.get('/snapshot/:snapshot', function(req, res) {
    var snapshot = req.params.snapshot;
    console.log(snapshot);
    //Testing address pth
     var snappath = String.raw`C:\\Users\\Kryst\\Desktop\\` + snapshot;
     //Shared Folder path
     //var snappath = String.raw`\\192.168.1.102\\Main\\home\\bosskryst\\Desktop\\IDS\\` + snapshot;
     const stat = fs.statSync(snappath)
     const fileSize = stat.size
     const head = {
       'Content-Length': fileSize,
       'Content-Type': 'video/H264',
     }
     res.writeHead(200, head)
     fs.createReadStream(snappath).pipe(res)
   })

  router.get('/viewprofile', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      con.query("SELECT username, name, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('viewprofile', {users : result});
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });
  router.get('/editprofile', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      con.query("SELECT username, name, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('editprofile', {users : result});
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });
  router.post('/updateprofile', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      var puser = req.body.username;
      var pname = req.body.name;
      var pposition = req.body.position;
      console.log(puser);
      con.query("UPDATE login SET username = '"+puser+"', name = '"+pname+"', position = '"+pposition+"' WHERE idlogin = '"+userid+"';INSERT INTO audittable", function (err, result, fields) {
        if(err){
          throw err;
        }
        else{
          console.log(result);
          res.redirect('/viewprofile');
        }
        
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });


  router.get('/changepass', function(req, res){
    if(req.sessionID == checker){
      let username= user;
      con.query("SELECT username, name, password, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        console.log(result);
        res.render('changepass', {users : result});
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });

   // manage users
  router.get('/manageusers', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      let userrole= role;
      var querystring = "NULL";
      if (userrole == "Administrator"){
        querystring = "role = 'Regular'";
      }else if(userrole == "Main Administrator"){
        querystring = "role = 'Regular' OR role = 'Administrator'";
      }
      console.log(userrole);
      console.log(querystring);
      con.query("SELECT * FROM login WHERE "+querystring+"; SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {

        if(userrole == "Administrator" || userrole == "Main Administrator"){
          console.log(querystring);
          console.log(result);
          res.render('manageusers', {data : result[0], users : result[1]});
        }else{
          res.send('You are not authorized.');
        }
        
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });

  router.post('/manageusersview', function(req, res){
    if(req.sessionID == checker){
      let userid= user;
      let muser= req.body.muser;
      let userrole= role;
      con.query("SELECT username, role, position FROM login WHERE idlogin = '"+userid+"'; SELECT username, name, role, status, position FROM login WHERE username = '"+muser+"'", function (err, result, fields) {
        if(userrole == "Administrator" || userrole == "Main Administrator"){
          console.log(result);
          res.render('manageusersview', {users : result[0], data : result[1]});
        }else{
          res.send('You are not authorized.');
        }
      });
    }else {
      res.send('You are not authorized. Please login first');
    }
  });

  router.get('/adduser', function(req, res){
    if(req.sessionID == checker){
      let username= user;
      let userrole= role;
      con.query("SELECT username, role, position FROM login WHERE idlogin = '"+userid+"';", function (err, result, fields) {
        if(userrole == "Administrator" || userrole == "Main Administrator"){
          console.log(result);
          res.render('adduser', {users : result});
        }else{
          res.send('You are not authorized.');
        }
      });   
    }else {
      res.send('You are not authorized. Please login first');
    }
  });

  router.post('/addusertosql', function(req, res){
    if(req.sessionID == checker){
      var nuser = req.body.username;
      var nrole = req.body.role;
      var nname = req.body.name;
      var nposition = req.body.position;
      var npass = req.body.password;
      var ncpass = req.body.cpassword;
      
      if(npass == ncpass){
        var npass = crypto.createHash('md5').update(npass).digest('hex');
        console.log(npass);
        con.query("INSERT INTO login VALUES (NULL, '"+nuser+"', '"+npass+"', '"+nname+"', '"+nrole+"', 'Deactivated', '"+nposition+"');INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)"
        + "VALUES (CURDATE(), CURRENT_TIMESTAMP(), 'snapshots_view', 'status', 'Insert', '', '"+nname+"', '"+userid+"')", function (err, result, fields){
          console.log(result);
          res.redirect('/manageusers');
          //res redirect manageuser (pop up user has been added)
        }) 
      
      
      }else{
        res.send('Password Does not match');
      }
    }else {
      res.send('You are not authorized. Please login first');
    }
  });



  // AUDIT /////////////////////////////////////////
  router.get('/audittrail', function(req, res){
    let userid= user;
    //if(req.sessionID == checker){
      con.query("SELECT * FROM audit;", function (err, result, fields) {
        console.log(result + "111111");
        res.render('audittrail.ejs', {data : result});
      });
   // }else {
   //   res.send('You are not authorized. Please login first');
  //  }
  });
   
  router.post('/auditrailviews', function(req, res){
    var auditdate = req.body.auditdate;
    //if(req.sessionID == checker){
      con.query("SELECT * FROM audittable", function (err, result, fields) {
        console.log(result);
        res.render('audittrailviews.ejs', {data : result});
     });
   // }else {
    //  res.send('You are not authorized. Please login first');
   // }
  });

  router.get('/logout', function(req, res){
   
      checker = 0
      user = "NULL"
      res.sendFile(path.join(__dirname+'/login.ejs')
  
      )});
  
  });

