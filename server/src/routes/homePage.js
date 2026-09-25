import { Router } from "express";
import HomePage from "../models/HomePage.js";
import Product from "../models/Product.js";
const router = Router();

/*
GET
*/

router.get("/", async (req, res) => {
  try {
let page = await HomePage.findOne().populate({
  path: "corporate.featuredProducts",
 select: "name slug images",
});

    if (!page) {
      page = await HomePage.create({
        hero: {
          label: "Est. 1962 · Handcrafted daily",
          titleLine1: "The taste of a celebration,",
          titleLine2: "crafted by hand.",
          description:
            "Slow-cooked mithai. Freshly roasted namkeen. Presented for the tables of today — wrapped in the recipes of our grandmothers.",

          primaryButtonText: "Explore the menu",
          primaryButtonLink: "/menu",

          secondaryButtonText: "Corporate gifting",
          secondaryButtonLink: "/corporate",

          heroPlateImage: "",
          ladooImage: "",
          katliImage: "",

          card1: {
            image: "",
            label: "Signature",
            title: "Gulab Jamun",
          },

          card2: {
            image: "",
            label: "Freshly roasted",
            title: "Namkeen",
          },

          stats: [
            {
              number: "60+",
              label: "Years of craft",
            },
            {
              number: "120+",
              label: "Corporate clients",
            },
            {
              number: "4.9★",
              label: "Google rating",
            },
          ],

          badgeYear: "1962",
          badgeCity: "Mumbai",
        },

        marquee: {
          items: [
            "Made with pure ghee",
            "Slow-cooked",
            "Hand shaped",
            "Est. 1962",
          ],
        },

        story: {
          label: "Our Story",
          title: "Crafted with tradition",
          description: "",
          image: "",
          buttonText: "",
          buttonLink: "",
        },
floatingVideo: {
  enabled: true,
  videoUrl: "",
  poster: "",
  position: "right",
},
        signature: {
          eyebrow: "Signature Selection",
          title: "The house favourites",
          subtitle: "",
        },

corporate: {
  label: "Corporate & Bulk Orders",

  title: "Celebrate Every Occasion",

  description:
    "Luxury handcrafted sweets for weddings, festivals, employee appreciation and corporate gifting.",

  primaryButtonText: "Explore",

  primaryButtonLink: "/corporate",

  secondaryButtonText: "Contact Us",

  secondaryButtonLink: "/contact",

featuredProducts: [],
},

        testimonials: [],
      });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
UPDATE
*/

router.put("/", async (req, res) => {
  try {
    let page = await HomePage.findOne();

    if (!page) {
      page = await HomePage.create(req.body);
    } else {
      page.set(req.body);
await page.save();

page = await HomePage.findById(page._id).populate({
  path: "corporate.featuredProducts",
  select: "name slug images",
});
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;