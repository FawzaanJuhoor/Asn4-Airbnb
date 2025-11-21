/******************************************************************************
*** ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* Name: Fawzaan Juhoor           Student ID: N01707140           Date: November 20, 2025
******************************************************************************/

const Airbnb = require("../models/airbnb_view");

exports.getAllView = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { NAME: regex },
        { neighbourhood: regex },
        { host_name: regex },
        { room_type: regex }
      ];
    }

    const listings = await Airbnb.find(filter)
      .sort({ price: 1 })
      .lean();

    res.render("index", {
      title: "Airbnb • Fawzaan Juhoor",
      listings,
      search: search || ""
    });
  } catch (err) {
    console.error("Error in getAllView:", err);
    res.status(500).render("error", { message: "Failed to load listings" });
  }
};

exports.getOneView = async (req, res) => {
  try {
    const listing = await Airbnb.findById(req.params.id).lean();
    if (!listing) {
      return res.status(404).render("error", { message: "Listing not found" });
    }

    const similar = await Airbnb.find({
      neighbourhood: listing.neighbourhood,
      room_type: listing.room_type,
      _id: { $ne: listing._id }
    }).limit(4).lean();

    res.render("details", { 
      title: listing.NAME, 
      listing, 
      similar 
    });
  } catch (err) {
    console.error("Error in getOneView:", err);
    res.status(500).render("error", { message: "Failed to load listing details" });
  }
};

exports.createView = (req, res) => {
  res.render("create", { title: "Add New Listing" });
};


exports.createProcess = async (req, res) => {
  try {
    const newListing = {
      NAME: (req.body.NAME || "New Listing by Fawzaan").trim(),
      price: Number(req.body.price) || 99,
      neighbourhood: (req.body.neighbourhood || "Downtown Toronto").trim(),
      room_type: req.body.room_type || "Entire home/apt",
      host_name: (req.body.host_name || "Fawzaan Juhoor").trim(),
      thumbnail: req.body.thumbnail?.trim() || "https://via.placeholder.com/600x400/0066ff/ffffff?text=Airbnb+by+Fawzaan",
      minimum_nights: 1
    };

    await Airbnb.create(newListing);
    console.log("New listing added:", newListing.NAME);

    // Success flash message (optional but nice)
    req.flash?.('success', 'Listing added successfully!'); 

    // This is the key: redirect after success
    return res.redirect('/create');  // or '/listings', or '/' depending on your route

  } catch (err) {
    console.error("Create error:", err);

    // Pass error back to the form so user knows what went wrong
    return res.status(400).render('create', {
      title: "Add New Listing",
      error: err.message || "Failed to add listing. Please check your input.",
      body: req.body  // repopulate form with entered values
    });
  }
};


exports.update = async (req, res) => {
  try {
    const updates = {
      NAME: req.body.NAME?.trim(),
      price: Number(req.body.price)
    };

    const updated = await Airbnb.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).render("error", { message: "Listing not found" });
    }
    res.redirect(`/listing/${req.params.id}`);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).render("error", { message: "Update failed" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Airbnb.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).render("error", { message: "Listing not found" });
    }
    res.redirect("/");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(400).render("error", { message: "Delete failed" });
  }
};