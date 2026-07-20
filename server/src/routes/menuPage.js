import { Router } from "express";
import MenuPage from "../models/MenuPage.js";

const router = Router();

/*
GET Menu Page
*/
router.get("/", async (req, res) => {
  try {
let page = await MenuPage
  .findOne()
  .populate("firstTabProducts");
    if (!page) {
      page = await MenuPage.create({});
    }

    res.json(page);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});

/*
UPDATE Menu Page
*/
router.put("/", async (req, res) => {
  try {

    let page = await MenuPage.findOne();

    if (!page) {

      page = await MenuPage.create(req.body);

    } else {

      Object.assign(page, req.body);

      await page.save();

    }

    res.json({
      success: true,
      message: "Menu Page Updated Successfully",
      page,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});

export default router;