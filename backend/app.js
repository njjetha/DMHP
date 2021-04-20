const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jsonGroupBy = require("json-groupby");

const app = express();

// JWT Authentication

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { split } = require("ts-node");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
});

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});*/


/**********************************************************************************************************************************
*  Connecting to DB 
* 
**********************************************************************************************************************************/

app.get("/", function (req, res, next) {
  res.json({
    message: "Working I am fine"
  });
})

/* var con = mysql.createConnection({
  //host: "dmhp.chq9wobmmpgo.us-east-2.rds.amazonaws.com",
  host : "http://15.207.104.52:3306",
  // host:"localhost",
  user: "root",
  // password:"root"
  password: "dmhp@2020"
}); */



var con=mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"Gourav@sachdev1",
  database:"dhmp",
  port:3306

}); 
con.connect(function (err) {
  // if (err) console.log(err);
  console.log("connected to db");
});

sql = "use dhmp";


/* 


var con = mysql.createConnection({
  host: "localhost",
  user: "sameer",
  password: "qwerty78900"
});

sql = "use clinical_db";
*/

/* con.query(sql, function (err, res) {
   if (err) console.log(err);
  console.log(res);
}); */

/*********************************************************************************************************************************
 *  Authentication services
 * 
 * *******************************************************************************************************************************/

var USERS = [
  {'id':1,'username':'dmhp'},
  {'id':2,'username': 'testuser'}
];

app.use(expressJwt({secret: 'dmhp-app-super-shared-secret'}).unless({path: ['/api/auth']}));

app.post("/api/auth",(req,res)=>{
  const body = req.body;
  const user  = USERS.find(user=>user.username== body.username);
  if(!user || body.password!='dmhp@2020') 
  {
    return res.sendStatus(401);
  }
  var token = jwt.sign({userId:user.id},'dmhp-app-super-shared-secret',{expiresIn:'2h'});
  res.send({token});
})

/****************************************************************************************************************** 
 *
 * API to query data about all districts (Monthly, Annually, Quarterly)
 *  
 ******************************************************************************************************************/


app.post("/getAlcoholDataAllDistMonthly", (req, res) => {

  var year = req.body.year;
   
  // Sql query written by seniors 

  sql = "select m.Month,m.DistrictId, d.District,d.Population,\
      (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Total Cases`\
      from (SELECT CASE \
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
      END as Month,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female \
      from tbl_reportdata \
      where year(ReportingMonthyear)=?) m, Districts d \
      where m.DistrictId = d.DistrictId \
      group by m.Month,m.DistrictId,d.Population, d.District\
      order by Month,`Total Cases`";


  con.query(sql, [year], function (err, response) {
   
    // if (err) console.log(err);

    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
    
      res.json(responseGrouped);
     
    
    }
    else
      res.json(response);
  });
})




function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  return newDate;   
}


app.post("/getAlcoholDataAllDistMonthlyGrv2", (req, res) => {

  var year = req.body.year;
   
  // Sql query written by seniors 

  /* sql = "select m.Month,m.DistrictId, d.District,d.Population,\
      (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Total Cases`\
      from (SELECT CASE \
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
      END as Month,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female \
      from tbl_reportdata \
      where year(ReportingMonthyear)=?) m, Districts d \
      where m.DistrictId = d.DistrictId \
      group by m.Month,m.DistrictId,d.Population, d.District\
      order by Month,`Total Cases`";
 */
sql=`call dhmp.timeperiodtype('ReportingMonthyear,DistrictId', 'AlcoholSubstanceAbuse', 
          '2018-01-01', '2018-12-01', "", "",'','','ReportingMonthyear,DistrictId','monthly','c');`;

 // con.query(sql, [year], function (err, response) {
    con.query(sql, function (err, response) {   // added by gourav
    // if (err) console.log(err);

    if (response != null) {
     // var responseGrouped = jsonGroupBy(response, ['Month']);
    
         
     
       // calling fn to convert to suitable format fot the month
          var product = response[0];
          for(var j = 0; j < product.length; j++)
          {
              var version = product[j];
              var date=convertUTCDateToLocalDate(new Date(version.ReportingMonthyear));
              version.ReportingMonthyear=date.getMonth()+1;
              //console.log(version[ReportingMonthyear]);
          }
      
       
     
         var responseGrouped = jsonGroupBy(response, ['ReportingMonthyear']);
      
      
     
     
      
      res.json(responseGrouped);
      //console.log(response[0][0].ReportingMonthyear);
    
    }
    else
      res.json(response);
  });
})

app.post("/getSuicideDataAllDistMonthly", (req, res) => {    // made by gourav
  var year = req.body.year;
   sql = "select m.Month,d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Total Cases`\
          from (SELECT CASE WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
          WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
          WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
          WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
          END as Month,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases \
          from tbl_reportdata \
          where year(ReportingMonthyear)=? ) m, Districts d \
          where m.DistrictId = d.DistrictId \
          group by m.Month,d.DistrictId,d.Population, d.District \
          order by m.Month,`Total Cases`"; 


          

  con.query(sql, [year], function (err, response) {
    
     if (err) console.log(err);

    var responseGrouped = jsonGroupBy(response, ['Month']);
   
    res.json(responseGrouped);
  });
})


app.post("/getSuicideDataAllDistMonthlyGrv2", (req, res) => {     // made by gourav
  var year = req.body.year;
  /* sql = "select m.Month,d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Total Cases`\
          from (SELECT CASE WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
          WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
          WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
          WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
          END as Month,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases \
          from tbl_reportdata \
          where year(ReportingMonthyear)=? ) m, Districts d \
          where m.DistrictId = d.DistrictId \
          group by m.Month,d.DistrictId,d.Population, d.District \
          order by m.Month,`Total Cases`"; */


          sql=`call dhmp.timeperiodtype('ReportingMonthyear,DistrictId', 'SuicideAttempts', 
          '2018-01-01', '2018-12-01', "", "",'','','ReportingMonthyear,DistrictId','monthly','c');`;

  //con.query(sql, [year], function (err, response) {
    con.query(sql, function (err, response) {
    // if (err) console.log(err);

    //var responseGrouped = jsonGroupBy(response, ['Month']);
    var responseGrouped = jsonGroupBy(response, ['ReportingMonthyear']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  console.log(year);
  sql = "select q.Quarter,q.DistrictId,d.District,d.Population,\
          (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Total Cases` \
           from (SELECT CASE \
                WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 \
                WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 \
                WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 \
                WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 \
                END as Quarter,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,\
                old_alcohal_female \
                from dhmp.tbl_reportdata \
                where year(ReportingMonthyear)=?) q , dhmp.Districts d\
                where q.DistrictId = d.DistrictId \
                group by q.Quarter,q.DistrictId,d.Population, d.District\
                order by q.Quarter,`Total Cases`";

                //sql="select * from dhmp.Districts";


  con.query(sql,year, function (err, response) {
     if (err) console.log(err);
    //console.log(response);
    //res.json(response);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getSuicideDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  sql = "select q.Quarter,d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Total Cases`\
          from (SELECT CASE WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1  \
          WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 \
          WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 \
          WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 \
          END as Quarter,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases\
          from tbl_reportdata where year(ReportingMonthyear)=?) q,Districts d \
          where q.DistrictId = d.DistrictId  \
          group by q.Quarter,d.DistrictId,d.Population, d.District \
          order by q.Quarter,`Total Cases`";

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);

    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  sql = "select m.DistrictId, d.District,d.Population,\
          (sum(old_alcohal_male)+sum(new_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)) as `Total Cases` \
          from tbl_reportdata m,Districts d\
          where year(ReportingMonthyear)=? and m.DistrictId = d.DistrictId\
          group by m.DistrictId,d.Population, d.District \
          order by `Total Cases`  "

          

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);

    console.log(response);
    res.json(response);
  });
})

   // created by gourav for testing purpose

   

  app.post("/getDataAllDistrictAnnuallyGrv1",(req,res)=>{
    
     var display_type=req.body.group_by;   //'SMD,CMD,SuicideAttempts,Referred'
    var diseases=req.body.diseases;       // 'SMD,CMD,SuicideAttempts,Referred'
    var start_date=req.body.start_date;    // '2020-01-01'
    var end_date=req.body.end_date;        // '2020-01-01'  
    var visit_type=req.body.visit_type;     //   "''"   "'new','old'"
    var gender=req.body.gender;              //   "'M'"
    var district_id=req.body.district_id;    // 'SMD,CMD,SuicideAttempts,Referred'
    var taluka_id=req.body.taluka_id;        // 'SMD,CMD,SuicideAttempts,Referred'
    var group_by=req.body.group_by;           //  'SMD,CMD,SuicideAttempts,Referred'
    var time_period=req.body.time_period;      //  'anually'
    var calender_type=req.body.calender_type;  //  'c' 

   
/* 
    {
      "display_type" : ["DistrictId"],
     "diseases" :      ["SMD,CMD,SuicideAttempts,Referred"],
    "start_date" : "2020-01-01" ,
    "end_date" :    "2020-12-01",
    "visit_type" :  ["'new','old'"],   
    "gender" :      ["'M','F'"],
    "district_id" : [""],
    "taluka_id" :     [""],
    "group_by" :   ["DistrictId"],
    "time_period" :   "anually",
    "calender_type" :   "c"
   
  } */
    


   /*  sql=`call dhmp.timeperiodtype('DistrictId', 'SMD,CMD,SuicideAttempts,Referred', 
    '2020-01-01', '2020-12-01', "", "",'','','DistrictId','anually','c');`; */

    sql=`call dhmp.timeperiodtype(?, ?, 
    ?, ?, ?, ?,?,?,?,?,?);`;



    con.query(sql,[display_type,diseases,start_date,end_date,visit_type,gender,district_id,taluka_id,group_by,time_period,calender_type],function (err, response) {
     // if (err) console.log(err);
    // console.log(response[0]);
   // con.query(sql,function (err, response) {

     if (response != null) {
       
       res.json(response[0]);
       console.log(response);
     }
     else
       res.json(response);
   });
 })
 
  
 app.post("/getDataAllDistrictMonthlyGrv",(req,res)=>{
  var start_date=req.body.start_date;
  var end_date=req.body.end_date;

  sql=`call dhmp.timeperiodtype('DistrictId', 'SMD,CMD,SuicideAttempts,Referred', 
  '2020-01-01', '2020-12-01', "", "",'','','DistrictId','monthly','c');`;



  con.query(sql,function (err, response) {
   // if (err) console.log(err);
  // console.log(response[0]);

   if (response != null) {
     
     res.json(response[0]);
   }
   else
     res.json(response);
 });
})

app.post("/getDataAllDistrictQuarterlyGrv",(req,res)=>{
  var start_date=req.body.start_date;
  var end_date=req.body.end_date;

  sql=`call dhmp.timeperiodtype('DistrictId', 'SMD,CMD,SuicideAttempts,Referred', 
  '2020-01-01', '2020-12-01', "", "",'','','DistrictId','quarterly','c');`;



  con.query(sql,function (err, response) {
   // if (err) console.log(err);
  // console.log(response[0]);

   if (response != null) {
     
     res.json(response[0]);
   }
   else
     res.json(response);
 });
})









app.post("/getSuicideDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  sql = "select d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as `Total Cases` \
          from tbl_reportdata m, Districts d \
          where year(ReportingMonthyear)=? and m.DistrictId=d.DistrictId\
          group by m.DistrictId,d.Population, d.District \
          order by `Total Cases`";
  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    res.json(response);
  });
})

/*********************************************************************************************************************************
 *  Map APIs
 * 
 *********************************************************************************************************************************/

app.post("/getAlcoholDataMonthlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,
  MONTH(c.ReportingMonthyear) as month ,
  sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) as 'Total Cases' 
  from tbl_reportdata c , Districts d  
  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=?
  group by c.ReportingMonthyear, District`;
  con.query(sql, [district, year], function (err, response) {
    // if (err) console.log(err);
    res.json(response);
  });
})

app.post("/getAlcoholDataQuarterlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select Quarter,District,
  (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as 'Total Cases' 
   from (SELECT CASE 
        WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
        WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
        WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
        WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
        END as Quarter,c.DistrictId,c.new_alcohal_male,c.old_alcohal_male,c.new_alcohal_female,
        c.old_alcohal_female , d.District 
        from tbl_reportdata c , Districts d 
        where d.DistrictId = c.DistrictId and d.District=? and year(c.ReportingMonthyear)=? ) q 
        group by Quarter, District`;
  con.query(sql, [district, year], function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  });
})

app.post("/getAlcoholDataYearlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,YEAR(c.ReportingMonthyear) as Year ,
        sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) as 'Total Cases' 
        from tbl_reportdata c , Districts d  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=? 
        group by YEAR(c.ReportingMonthyear), District`;
  con.query(sql, [district, year], function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  });
})

app.post("/getSuicideDataMonthlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,
  MONTH(c.ReportingMonthyear) as month ,
  sum(c.old_male_suicidecases)+sum(c.old_female_suicidecases)+sum(c.new_male_suicidecases)+sum(c.new_female_suicidecases) as 'Total Cases' 
  from tbl_reportdata c , Districts d  
  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=?
  group by c.ReportingMonthyear, District`;
  con.query(sql, [district, year], function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  });
})

app.post("/getSuicideDataQuarterlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select Quarter,District,
  (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_female_suicidecases)) as 'Total Cases' 
   from (SELECT CASE 
        WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
        WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
        WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
        WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
        END as Quarter,c.DistrictId,c.old_male_suicidecases,c.old_female_suicidecases,c.new_male_suicidecases,
        c.new_female_suicidecases , d.District 
        from tbl_reportdata c , Districts d 
        where d.DistrictId = c.DistrictId and d.District=? and year(c.ReportingMonthyear)=? ) q 
        group by Quarter, District`;
  con.query(sql, [district, year], function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  });
})

app.post("/getSuicideDataYearlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,YEAR(c.ReportingMonthyear) as Year ,
        sum(c.old_male_suicidecases)+sum(c.old_female_suicidecases)+sum(c.new_male_suicidecases)+sum(c.new_female_suicidecases) as 'Total Cases' 
        from tbl_reportdata c , Districts d  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=? 
        group by YEAR(c.ReportingMonthyear), District`;
  con.query(sql, [district, year], function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  });
})

app.post("/getAlcoholYearlyDistrictforMap", (req, res) => {
  var year = req.body.year;
  sql = "select d.District as Districtid ,year(c.ReportingMonthyear) ,sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) \
  as total_alcohol_cases\
  from tbl_reportdata c , Districts d  where d.DistrictId = c.Districtid and year(c.ReportingMonthyear)=?\
  group by year(c.ReportingMonthyear) ,d.District order by total_alcohol_cases";
  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  });
})

/******************************************************************************************************************************
 * 
 * Card api
 * 
 * 
 ******************************************************************************************************************************/

app.post("/getAlcoholCasesPerYear", (req, res) => {
  var year = req.body.year;
  /*sql = `select d.district ,sum(new_alcohal_male)+sum(new_alcohal_female)+sum(old_alcohal_male)+sum(old_alcohal_female) as 'Total Cases'
  from tbl_reportdata c , Districts d where d.Districtid = c.Districtid
  group by d.district order by d.district ;`;*/

  sql = `select m.Month,
      (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as 'Total Cases'
      from (SELECT CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female 
      from tbl_reportdata 
      where year(ReportingMonthyear)=?) m 
      group by m.Month
      order by Month,'Total Cases'`;

  con.query(sql, year, function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  })
});

app.post("/getSuicideCasesPerYear", (req, res) => {
  var year = req.body.year;
  /*sql = `select d.district ,sum(new_male_suicidecases)+sum(old_male_suicidecases)+sum(new_female_suicidecases)+sum(old_female_suicidecases) as 'Total Cases'
  from tbl_reportdata c , Districts d where d.Districtid = c.Districtid and Year(ReportingMonthYear) = ?
  group by d.district order by d.district ;`;*/

  sql = `select m.Month,
  (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as 'Total Cases'
  from (SELECT CASE 
  WHEN MONTH(ReportingMonthyear)=1 THEN 1 
  WHEN MONTH(ReportingMonthyear)=2 THEN 2 
  WHEN MONTH(ReportingMonthyear)=3  THEN 3 
  WHEN MONTH(ReportingMonthyear)=4 THEN 4 
  WHEN MONTH(ReportingMonthyear)=5 THEN 5 
  WHEN MONTH(ReportingMonthyear)=6  THEN 6 
  WHEN MONTH(ReportingMonthyear)=7 THEN 7 
  WHEN MONTH(ReportingMonthyear)=8 THEN 8 
  WHEN MONTH(ReportingMonthyear)=9  THEN 9 
  WHEN MONTH(ReportingMonthyear)=10 THEN 10 
  WHEN MONTH(ReportingMonthyear)=11 THEN 11 
  WHEN MONTH(ReportingMonthyear)=12  THEN 12 
  END as Month,new_male_suicidecases,old_male_suicidecases,new_female_suicidecases,old_female_suicidecases 
  from tbl_reportdata 
  where year(ReportingMonthyear)=?) m 
  group by m.Month
  order by Month,'Total Cases'`;

  con.query(sql, year, function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  })
});

app.post("/getSMDCasesPerYear", (req, res) => {
  var year = req.body.year;
  /*sql = `select d.district ,sum(new_smd_male)+sum(new_smd_female)+sum(old_smd_male)+sum(old_smd_female)  as 'Total Cases'
    from tbl_reportdata c , Districts d where d.Districtid = c.Districtid and Year(ReportingMonthYear) = ?
    group by d.district order by d.district ;`;*/
  sql = `select m.Month,
      (sum(old_smd_male)+sum(old_smd_female)+sum(new_smd_female)+sum(new_smd_male)) as 'Total Cases'
      from (SELECT CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,old_smd_male,old_smd_female,new_smd_female,new_smd_male 
      from tbl_reportdata 
      where year(ReportingMonthyear)=?) m 
      group by m.Month
      order by Month,'Total Cases'`;
  con.query(sql, year, function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  })
});

app.post("/getCMDCasesPerYear", (req, res) => {
  var year = req.body.year;
  /*sql = `select d.district ,sum(new_cmd_male)+sum(new_cmd_female)+sum(old_cmd_male)+sum(old_cmd_female) as 'Total Cases'
  from tbl_reportdata c , Districts d where d.Districtid = c.Districtid and Year(ReportingMonthYear) = ?
  group by d.district order by d.district ;`;*/
  sql = `select m.Month,
      (sum(old_cmd_male)+sum(old_cmd_female)+sum(new_cmd_male)+sum(new_cmd_female)) as 'Total Cases'
      from (SELECT CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,new_cmd_male,old_cmd_male,new_cmd_female,old_cmd_female
      from tbl_reportdata 
      where year(ReportingMonthyear)=?) m 
      group by m.Month
      order by Month,'Total Cases'`;
  con.query(sql, year, function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  })
});

/*********************************************************************************************************************************
 *  Get Districts and Id
 * 
 *********************************************************************************************************************************/

app.get("/getDistrictData", (req, res) => {
  sql = `select d.DistrictId,d.District 
        from Districts d where  DistrictId != 46`;
  con.query(sql, function (err, response) {
    // if (err) console.log(err);

    res.json(response);
  })
});

/* **************************************************************************************************************** 
 *
 * API to query data about all districts (Monthly, Annually, Quarterly)
 *
 * 
 *  
 * ****************************************************************************************************************/
var cases = ` (sum(old_alcohal_male + old_alcohal_female + new_alcohal_female + new_alcohal_male)) as 'Alcohol Cases', 
(sum(old_male_suicidecases + new_male_suicidecases + old_female_suicidecases + new_female_suicidecases)) as 'Suicide Attempt Cases',
(sum(old_smd_male + old_smd_female + new_smd_male + new_smd_female)) as 'SMD Cases',
(sum(old_cmd_male + old_cmd_female + new_cmd_male + new_cmd_female)) as 'CMD Cases',
(sum(old_psychiatricdisorders_male + old_psychiatricdisorders_female + new_psychiatricdisorders_male + new_psychiatricdisorders_female)) as 'Psychiatric Disorder Cases',
(sum(old_o1_male + old_o1_female + new_o1_male + new_o1_female)) as 'Epilepsy Cases',
(sum(old_o2_male + old_o2_female + new_o2_male + new_o2_female)) as 'Developmental Disorder Cases',
(sum(old_o3_male + old_o3_female + new_o3_male + new_o3_female)) as 'Behavioural DIsorder Cases',
(sum(old_o4_male + old_o4_female + new_o4_male + new_o4_female)) as 'Emotional Disorder Cases',
(sum(old_o5_male + old_o5_female + new_o5_male + new_o5_female)) as 'Dementia Cases',
(sum(old_o6_male + old_o6_female + new_o6_male + new_o6_female)) as 'Other Cases' `;


app.post("/getDataAllDistrictMonthly", (req, res) => {
  var year = req.body.year;

  sql = `select m.Month, m.DistrictId, d.District, d.Population,` + cases +
    `from (SELECT *,CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7
      WHEN MONTH(ReportingMonthyear)=8 THEN 8
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
    END as Month         
    from tbl_reportdata 
    where year(ReportingMonthyear)=?) m, Districts d 
    where m.DistrictId = d.DistrictId 
    group by m.Month, m.DistrictId, d.Population, d.District
    order by m.Month`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getDataAllDistrictMonthlyGrv2", (req, res) => {
  var year = req.body.year;

  
  var start_date="'"+year+'-01-01'+"',";       
  var end_date="'"+year+'-12-01'+"',";

  
  sql=`call dhmp.timeperiodtype('ReportingMonthyear,DistrictId', 'SMD,CMD,SuicideAttempts,Referred,Epilepsy,AlcoholSubstanceAbuse,Dementia,BehaviouralDisorders,DevelopmentalDisorders,EmotionalDisorders,PsychiatricDisorders,Others',` 
    +start_date+end_date+
    `"'new','old'", "'M','F'",'','','ReportingMonthyear,DistrictId','monthly','c');`;

  con.query(sql, function (err, response) {
    // if (err) console.log(err);
    if (response != null) {

      var product = response[0];
          for(var j = 0; j < product.length; j++)
          {
              var version = product[j];
              var date=convertUTCDateToLocalDate(new Date(version.ReportingMonthyear));
              version.ReportingMonthyear=date.getMonth()+1;
              //console.log(version[ReportingMonthyear]);
          }
      var responseGrouped = jsonGroupBy(response[0], ['ReportingMonthyear']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getDataAllDistrictQuarterly", (req, res) => {
  var year = req.body.year;
  sql = `select q.Quarter, q.DistrictId, d.District, d.Population,` + cases +
    `from (SELECT *, CASE 
      WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
      WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
      WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
      WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
      END as Quarter
      from tbl_reportdata 
      where year(ReportingMonthyear)=?) q, Districts d
    where q.DistrictId = d.DistrictId 
    group by q.Quarter, q.DistrictId, d.Population, d.District
    order by q.Quarter`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getDataAllDistrictQuarterlyGrv2", (req, res) => {
  var year = req.body.year;

  var start_date="'"+year+'-01-01'+"',";       
  var end_date="'"+year+'-12-01'+"',";

  /*  sql = `select q.Quarter, q.DistrictId, d.District, d.Population,` + cases +
    `from (SELECT *, CASE 
      WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
      WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
      WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
      WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
      END as Quarter
      from tbl_reportdata 
      where year(ReportingMonthyear)=?) q, Districts d
    where q.DistrictId = d.DistrictId 
    group by q.Quarter, q.DistrictId, d.Population, d.District
    order by q.Quarter`;
  */
    sql=`call dhmp.timeperiodtype('ReportingMonthyear,DistrictId', 'SMD,CMD,SuicideAttempts,Referred,Epilepsy,AlcoholSubstanceAbuse,Dementia,BehaviouralDisorders,DevelopmentalDisorders,EmotionalDisorders,PsychiatricDisorders,Others',`
    +start_date+end_date+
    `"'new','old'", "'M','F'",'','','ReportingMonthyear,DistrictId','quaterlly','c');`; 


  con.query(sql,  function (err, response) {
    // if (err) console.log(err);
    var responseGrouped = jsonGroupBy(response[0], ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getDataAllDistrictAnnually", (req, res) => {
  var year = req.body.year;

  sql = `select m.DistrictId, d.District, d.Population,` + cases +
    `from tbl_reportdata m, Districts d
    where year(ReportingMonthyear)=? and m.DistrictId = d.DistrictId
    group by m.DistrictId,d.Population, d.District
    order by d.District`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    res.json(response);
  });
})
app.post("/getDataAllDistrictAnnuallyGrv2", (req, res) => {
  var year = req.body.year;

  var start_date="'"+year+'-01-01'+"',";       
  var end_date="'"+year+'-12-01'+"',";

    // start date and end date format is given below

    /* sql=`call dhmp.timeperiodtype('ReportingMonthyear,DistrictId', 'SMD,CMD,SuicideAttempts,Referred,Epilepsy,AlcoholSubstanceAbuse,Dementia,BehaviouralDisorders,DevelopmentalDisorders,EmotionalDisorders,PsychiatricDisorders,Others', 
    '2020-01-01', '2020-12-01', "'new','old'", "'M','F'",'','','ReportingMonthyear,DistrictId','quaterlly','c');`;  */

    sql=`call dhmp.timeperiodtype('DistrictId', 'SMD,CMD,SuicideAttempts,Referred,Epilepsy,AlcoholSubstanceAbuse,Dementia,BehaviouralDisorders,DevelopmentalDisorders,EmotionalDisorders,PsychiatricDisorders,Others',` 
    +start_date+end_date+
    `"'new','old'", "'M','F'",'','','DistrictId','annually','c');`;


  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    res.json(response[0]);
  });
})
/* **************************************************************************************************************** 
 *
 * API to query data about TALUKAS under particular DISTRICT (Monthly, Annually, Quarterly)
 *
 * 
 *  
 * ****************************************************************************************************************/

app.post("/getAllDataTalukaMonthly", (req, res) => {
  var year = req.body.year;
  //var DistrictId = req.body.DistrictId;
  var DistrictId = req.body.districtId;

  sql = `SELECT m.Month, t.Taluka, t.TalukaId,` + cases +
    `from (SELECT *,CASE 
              WHEN MONTH(ReportingMonthyear)=1 THEN 1 
              WHEN MONTH(ReportingMonthyear)=2 THEN 2 
              WHEN MONTH(ReportingMonthyear)=3  THEN 3
              WHEN MONTH(ReportingMonthyear)=4 THEN 4 
              WHEN MONTH(ReportingMonthyear)=5 THEN 5 
              WHEN MONTH(ReportingMonthyear)=6  THEN 6 
              WHEN MONTH(ReportingMonthyear)=7 THEN 7
              WHEN MONTH(ReportingMonthyear)=8 THEN 8
              WHEN MONTH(ReportingMonthyear)=9  THEN 9 
              WHEN MONTH(ReportingMonthyear)=10 THEN 10 
              WHEN MONTH(ReportingMonthyear)=11 THEN 11 
              WHEN MONTH(ReportingMonthyear)=12  THEN 12 
            END as Month         
            from tbl_reportdata 
            WHERE year(ReportingMonthyear) = ?) m, Taluka t 
          WHERE m.TalukaId = t.TalukaId and t.DistrictId = ?
          GROUP  BY m.Month, t.Taluka, t.TalukaId
          order by m.Month`;

  con.query(sql, [year, DistrictId], function (err, response) {
    // if (err) console.log(err);

    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getAllDataTalukaQuarterly", (req, res) => {
  var year = req.body.year;
  var DistrictId = req.body.districtId;

  sql = `SELECT q.Quarter, t.Taluka, t.TalukaId,` + cases +
    `from (SELECT *, CASE 
          WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
          WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
          WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
          WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
          END as Quarter
          from tbl_reportdata 
            WHERE year(ReportingMonthyear) = ?) q, Taluka t 
          WHERE q.TalukaId = t.TalukaId and t.DistrictId = ?
          GROUP  BY q.Quarter, t.Taluka, t.TalukaId
          ORDER BY q.Quarter`;


  con.query(sql, [year, DistrictId], function (err, response) {
    // if (err) console.log(err);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getAllDataTalukaAnnually", (req, res) => {
  var year = req.body.year;
  var DistrictId = req.body.districtId;

  sql = `SELECT t.Taluka, t.TalukaId,` + cases +
         `from tbl_reportdata m, Taluka t 
          WHERE year(ReportingMonthyear) = ? and m.TalukaId = t.TalukaId and t.DistrictId = ? 
          GROUP BY t.Taluka, t.TalukaId
          ORDER BY t.Taluka `;

  con.query(sql, [year, DistrictId], function (err, response) {
    // if (err) console.log(err);
    res.json(response);
  });

})



/* **************************************************************************************************************** 
 *
 * API to query EXPENSE data about all districts (Monthly, Annually, Quarterly)
 *
 * 
 *  
 * ****************************************************************************************************************/




expenseFields = `
(sum(B3032_Psychiatrists)) as 'B3032_Psychiatrists',
(sum(B30112_Psyst_Counsellor)) as 'B30112_Psyst_Counsellor',
(sum(B30114_SocialWorker))  as 'B30114_SocialWorker',
(sum(B3012_StaffNurse)) as 'B3012_StaffNurse',
(sum(B3012_PsyNurse)) as 'B3012_PsyNurse',
(sum(B30137_MedialRedAsst)) as 'B30137_MedialRedAsst',
(sum(B30137_WardAsst))  as 'B30137_WardAsst',
(sum(Infrastucture))  as 'Infrastucture',
(sum(Training)) as 'Training',
(sum(IEC)) as 'IEC',
(sum(TargetIntervention)) as 'TargetIntervention',
(sum(Drugs)) as 'Drugs',
(sum(Equipments)) as 'Equipments',
(sum(OperationExpense)) as 'OperationExpense',
sum(AmbulatoryService) as 'AmbulatoryService', 
sum(Miscellanious) as 'Miscellanious', 
sum(B3032_PsychiatristsTA) as 'B3032_PsychiatristsTA', 
sum(B30114_SocialWorkerTA) as 'B30114_SocialWorkerTA', 
sum(B10162_Awarness) as 'B10162_Awarness', 
sum(J17_Contingency) as 'J17_Contingency', 
sum(B2030_AnnualIncrement) as 'B2030_AnnualIncrement'`

app.post("/getExpenseDataAllDistrictMonthly", (req, res) => {
  var year = req.body.year;

  sql = `select m.Month, m.DistrictId, d.District, d.Population,` + expenseFields +
    `from (SELECT *,CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7
      WHEN MONTH(ReportingMonthyear)=8 THEN 8
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
    END as Month         
    from District_Expense 
    where year(ReportingMonthyear)=?) m, Districts d 
    where m.DistrictId = d.DistrictId and d.DistrictId!=46
    group by m.Month, m.DistrictId, d.Population, d.District
    order by m.Month`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getExpenseDataAllDistrictQuarterly", (req, res) => {
  var year = req.body.year;
  sql = `select q.Quarter, q.DistrictId, d.District, d.Population,` + expenseFields +
    `from (SELECT *, CASE 
      WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
      WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
      WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
      WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
      END as Quarter
      from District_Expense 
      where year(ReportingMonthyear)=?) q, Districts d
    where q.DistrictId = d.DistrictId and d.DistrictId!=46
    group by q.Quarter, q.DistrictId, d.Population, d.District
    order by q.Quarter`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getExpenseDataAllDistrictAnnually", (req, res) => {
  var year = req.body.year;

  sql = `select m.DistrictId, d.District, d.Population,` + expenseFields +
    `from District_Expense m, Districts d
    where year(ReportingMonthyear)=? and m.DistrictId = d.DistrictId and d.DistrictId!=46
    group by m.DistrictId,d.Population, d.District
    order by d.District`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    res.json(response);
  });
})

/* **************************************************************************************************************** 
 *
 * API to query TRAINING data about all districts (Monthly, Annually, Quarterly)
 *
 * 
 *  
 * ****************************************************************************************************************/
var TrainingFields = ` (sum(old_alcohal_male + old_alcohal_female + new_alcohal_female + new_alcohal_male)) as 'ANM/Health Workers', 
(sum(old_male_suicidecases + new_male_suicidecases + old_female_suicidecases + new_female_suicidecases)) as 'ASHA',
(sum(old_smd_male + old_smd_female + new_smd_male + new_smd_female)) as 'Ayush Doctors',
(sum(old_cmd_male + old_cmd_female + new_cmd_male + new_cmd_female)) as 'Counselor',
(sum(old_psychiatricdisorders_male + old_psychiatricdisorders_female + new_psychiatricdisorders_male + new_psychiatricdisorders_female)) as 'Medical Officers',
(sum(old_o1_male + old_o1_female + new_o1_male + new_o1_female)) as 'Nursing Staff',
(sum(old_o2_male + old_o2_female + new_o2_male + new_o2_female)) as 'Pharmacist',
(sum(old_o3_male + old_o3_female + new_o3_male + new_o3_female)) as 'RBSK/RKSK',
(sum(old_o4_male + old_o4_female + new_o4_male + new_o4_female)) as 'Teachers(College)',
(sum(old_o5_male + old_o5_female + new_o5_male + new_o5_female)) as 'Others' `;

app.post("/getTrainingDataAllDistrictMonthly", (req, res) => {
  var year = req.body.year;

  sql = `select m.Month, m.DistrictId, d.District, d.Population,` + TrainingFields +
    `from (SELECT *,CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7
      WHEN MONTH(ReportingMonthyear)=8 THEN 8
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
    END as Month         
    from District_Training 
    where year(ReportingMonthyear)=?) m, Districts d 
    where m.DistrictId = d.DistrictId 
    group by m.Month, m.DistrictId, d.Population, d.District
    order by m.Month`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getTrainingDataAllDistrictQuarterly", (req, res) => {
  var year = req.body.year;
  sql = `select q.Quarter, q.DistrictId, d.District, d.Population,` + TrainingFields +
    `from (SELECT *, CASE 
      WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
      WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
      WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
      WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
      END as Quarter
      from District_Training 
      where year(ReportingMonthyear)=?) q, Districts d
    where q.DistrictId = d.DistrictId 
    group by q.Quarter, q.DistrictId, d.Population, d.District
    order by q.Quarter`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getTrainingDataAllDistrictAnnually", (req, res) => {
  var year = req.body.year;

  sql = `select m.DistrictId, d.District, d.Population,` + TrainingFields +
    `from District_Training m, Districts d
    where year(ReportingMonthyear)=? and m.DistrictId = d.DistrictId
    group by m.DistrictId,d.Population, d.District
    order by d.District`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);
    res.json(response);
  });
})

/* **************************************************************************************************************** 
 *
 * API to query monthly total of all cases in state for a year
 *
 * 
 *  
 * ****************************************************************************************************************/

app.post("/getMonthlyTotalCases", (req, res) => {
  var year = req.body.year;

  sql = `SELECT  
    CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7
      WHEN MONTH(ReportingMonthyear)=8 THEN 8
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,`+ cases + `        
    FROM tbl_reportdata 
    WHERE year(ReportingMonthyear) = ?
    GROUP BY Month
    order by Month`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);

    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(response);
    }
    else
      res.json(response);
  });
})


app.post("/getMonthlyTotalCasesGrv2", (req, res) => {
  var year = req.body.year;


  var start_date="'"+year+'-01-01'+"',";       
  var end_date="'"+year+'-12-01'+"',";

 
    /* sql=`call DMHP.timeperiodtype('ReportingMonthyear', 'SMD,CMD,SuicideAttempts,Referred', 
    '2017-08-01', '2018-12-01', "'new','old'", "",'','','ReportingMonthyear', 'monthly','c');`; */

    sql=`call dhmp.timeperiodtype('ReportingMonthyear', 'SMD,CMD,SuicideAttempts,Referred,Epilepsy,AlcoholSubstanceAbuse,Dementia,BehaviouralDisorders,DevelopmentalDisorders,EmotionalDisorders,PsychiatricDisorders,Others',` 
    +start_date+end_date+
    `"'new','old'", "",'','','ReportingMonthyear', 'monthly','c');`;


  con.query(sql, [year],function (err, response) {
    // if (err) console.log(err);

    if (response != null) {

      var product = response[0];
      for(var j = 0; j < product.length; j++)
      {
          var version = product[j];
          var date=convertUTCDateToLocalDate(new Date(version.ReportingMonthyear));
          version.ReportingMonthyear=date.getMonth()+1;
          //console.log(version[ReportingMonthyear]);
      }

      //var responseGrouped = jsonGroupBy(response[0], ['ReportingMonthyear']);
     // resMonthlyData = JSON.parse(JSON.stringify(response[0]));
      res.json(response[0]);
    // res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})


app.post("/getMonthlyTotalTaining", (req, res) => {
  var year = req.body.year;

  sql = `SELECT  
    CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7
      WHEN MONTH(ReportingMonthyear)=8 THEN 8
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,`+ TrainingFields +  `        
    FROM District_Training 
    WHERE year(ReportingMonthyear) = ?
    GROUP BY Month
    order by Month`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);

    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(response);
    }
    else
      res.json(response);
  });
})

app.post("/getMonthlyTotalExpense", (req, res) => {
  var year = req.body.year;

  sql = `SELECT  
    CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7
      WHEN MONTH(ReportingMonthyear)=8 THEN 8
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,`+ expenseFields +  `        
    FROM District_Expense 
    WHERE year(ReportingMonthyear) = ?
    GROUP BY Month
    order by Month`;

  con.query(sql, [year], function (err, response) {
    // if (err) console.log(err);

    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(response);
    }
    else
      res.json(response);
  });
})

module.exports = app;

