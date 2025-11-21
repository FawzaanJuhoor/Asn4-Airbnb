/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Fawzaan Juhoor Student ID: N01707140 Date: Nov 20,2025
*
*
******************************************************************************
**/


// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/airbnb");  


// //GET — Home Page (All Listings)
// router.get("/", async (req, res) => {
//   try {
//     const search = req.query.search || "";

//     const filter = search
//       ? {
//           $or: [
//             { name: new RegExp(search, "i") },
//             { neighbourhood: new RegExp(search, "i") },
//             { hostName: new RegExp(search, "i") }
//           ]
//         }
//       : {};

//     const listings = await Listing.find(filter).lean();

//     res.render("index", { listings, search });
//   } catch (err) {
//     res.render("error", {
//       title: "Failed to load listings",
//       message: err.message
//     });
//   }
// });


// //GET — Show Create Form

// router.get("/create", (req, res) => {
//   res.render("create");
// });


// //POST — Create New Listing
// router.post("/create", async (req, res) => {
//   try {
//     await Listing.create(req.body);
//     res.redirect("/");
//   } catch (err) {
//     res.render("error", {
//       title: "Create Failed",
//       message: err.message
//     });
//   }
// });


// //GET — Listing Details Page

// router.get("/listing/:id", async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id).lean();

//     if (!listing) {
//       return res.render("error", {
//         title: "Not Found",
//         message: "Listing does not exist."
//       });
//     }

//     res.render("details", { listing });
//   } catch (err) {
//     res.render("error", {
//       title: "Error loading listing",
//       message: err.message
//     });
//   }
// });


// // POST — Update Title & Price
// router.post("/listing/:id/update", async (req, res) => {
//   try {
//     await Listing.findByIdAndUpdate(req.params.id, {
//       name: req.body.NAME,
//       price: req.body.price
//     });

//     res.redirect(`/listing/${req.params.id}`);
//   } catch (err) {
//     res.render("error", {
//       title: "Update Failed",
//       message: err.message
//     });
//   }
// });


// // POST — Delete Listing
// router.post("/listing/:id/delete", async (req, res) => {
//   try {
//     await Listing.findByIdAndDelete(req.params.id);
//     res.redirect("/");
//   } catch (err) {
//     res.render("error", {
//       title: "Delete Failed",
//       message: err.message
//     });
//   }
// });

// module.exports = router;

/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Fawzaan Juhoor Student ID: N01707140 Date: Nov 20,2025
*
******************************************************************************
**/

const express = require("express");
const router = express.Router();

// Import Controller
const airbnbViewController = require("../controllers/airbnbViewController");

// VIEW ROUTES USING CONTROLLER FUNCTIONS

// Home page – list all listings
router.get("/", airbnbViewController.getAllView);

// Show create form
router.get("/create", airbnbViewController.createView);

// Handle create form submission
router.post("/create", airbnbViewController.createProcess);

// Show details page
router.get("/listing/:id", airbnbViewController.getOneView);

// Update (title + price modal)
router.post("/listing/:id/update", airbnbViewController.update);

// Delete listing
router.post("/listing/:id/delete", airbnbViewController.remove);

module.exports = router;
