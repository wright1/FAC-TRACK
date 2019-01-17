const express = require("express");
const dbhelpers = require("../model/db_queries/index.js");
// const hbhelpers = require("../views/helpers/index.js");

// create a new router
const router = express.Router();

// home route
router.get("/", (req, res) => {
  res.render("home");
});


// dashboard
router.get("/dashboard", (req, res) => {
  // enter user id to get:
  // - average confidence
  // - tasks completed
  dbhelpers
    .getAllWeeks()
    .then(data => {
      // console.log("response from database", data);
      res.render("dashboard", { weeks: data });
    })
    .catch(err => {
      // console.log("/dashboard error: ", err);
      reject(err);
    });
});


// week route(s)
router.get(
  "/week-:name(1_toolkit|2_testing|3_api|4_node-core|5_node-2|6_postgresql|7_authentication|8_express-handlebars)?",
  (req, res) => {
    const weekName = req.params.name.split("_")[1];
    // use the weekNumber to access the database list for that weeks task

    const weekNum = req.params.name.split("_")[0];
    // const trafficLight = hbhelpers.confidence;
    // get data for dave
    dbhelpers
      .getTaskForUser("dave", weekNum)
      .then(data => {
        // console.log("response from getTasksByWeek/router index: ", data);
        res.render("week", { name: weekName, tasks: data, number: weekNum });
      })
      .catch(err => {
        // console.log("/weeks error: ", err);
        res.status(err, 500);
      });
  }
);



// task routes
// NOTE: this can be:  http://localhost:5002/dashbsxoard/sd   and still be a valid url
// - in the console, this is a 404 page not found 
router.get("/:week/:tasks/", (req, res) => {

    const weekName = req.params.week;
    const taskName = req.params.tasks;
    // console.log(weekName, taskName);

     dbhelpers
       .getRepoLink(taskName)
       .then(data => {
         console.log("get repo link where taskName equals dataname: ", data);
         res.render("log", { name: weekName, tasks: taskName, repo_link: data });
       })
       .catch(err => {
        //  console.log("/weeks error: ", err);
        res.status(err, 500);
       });

});




// task routes
// 1 - 8

// error pages
router.use((req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.render("404");
    return;
  }

  if (req.accepts("json")) {
    res.render("500");
    return;
  }

  res.type("txt").send("Not found");
});

module.exports = router;
