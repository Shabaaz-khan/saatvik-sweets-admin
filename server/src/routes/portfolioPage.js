import express from "express";
import PortfolioPage from "../models/PortfolioPage.js";
import CelebrityProfile from "../models/CelebrityProfile.js";
const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET PORTFOLIO PAGE
|--------------------------------------------------------------------------
| Used by the customer website to load the complete page.
*/

router.get("/", async (req, res) => {
  try {
    let page = await PortfolioPage.findOne();

    /*
    |--------------------------------------------------------------------------
    | Create initial data if the page does not exist
    |--------------------------------------------------------------------------
    */

    if (!page) {
      page = await PortfolioPage.create({
        navigation: [
          {
            number: "01",
            label: "Designer",
            link: "#designer",
            target: "_self",
            order: 1,
            active: true,
          },
          {
            number: "02",
            label: "Photographer",
            link: "#photographer",
            target: "_self",
            order: 2,
            active: true,
          },
          {
            number: "03",
            label: "Model",
            link: "#model",
            target: "_self",
            order: 3,
            active: true,
          },
          {
            number: "04",
            label: "Architect",
            link: "#architect",
            target: "_self",
            order: 4,
            active: true,
          },
          {
            number: "05",
            label: "Singer",
            link: "#singer",
            target: "_self",
            order: 5,
            active: true,
          },
        ],

        hero: {
          logo: "",
          title: "Onepage Parallax Templates",
          highlightedTitle: "For Individuals",
          description:
            "See the DEMOS. You will not be disappointed",
          buttonText: "See Demos",
          buttonLink: "#demos",
          backgroundImage: "",
          modelImage: "",
          architectImage: "",
          singerImage: "",
          photographerImage: "",
          macImage: "",
        },

        demos: [
          {
            number: "01",
            name: "Designer",
            title: "Designer Portfolio",
            description:
              "Perfect for Designers & Developers",
            image: "",
            link: "",
            alignment: "right",
            backgroundClass: "designer",
            parallaxImages: [],
            order: 1,
            active: true,
          },

          {
            number: "02",
            name: "Photographer",
            title: "Photographer Portfolio",
            description:
              "Specially Designed For Photographers",
            image: "",
            link: "",
            alignment: "left",
            backgroundClass: "photographer",
            parallaxImages: [],
            order: 2,
            active: true,
          },

          {
            number: "03",
            name: "Model",
            title: "Model/Actress Portfolio",
            description:
              "Designed for artists, actors & Models",
            image: "",
            link: "",
            alignment: "right",
            backgroundClass: "model",
            parallaxImages: [],
            order: 3,
            active: true,
          },

          {
            number: "04",
            name: "Architect",
            title: "Architect Portfolio",
            description:
              "Clean parallax for Architect",
            image: "",
            link: "",
            alignment: "left",
            backgroundClass: "architect",
            parallaxImages: [],
            order: 4,
            active: true,
          },

          {
            number: "05",
            name: "Singer",
            title: "Singer Portfolio",
            description:
              "Elegant design for singer/musicians",
            image: "",
            link: "",
            alignment: "right",
            backgroundClass: "singer",
            parallaxImages: [],
            order: 5,
            active: true,
          },
        ],

        responsive: {
          title: "Fully Responsive Design",
          highlightedText: "VOID",
          description:
            "is an ultra-responsive html5 template. It works perfectly on all devices, including desktop, laptop, tablet and mobile.",
          layers: [],
          active: true,
        },

        features: [
          {
            icon: "ion-ios-albums-outline",
            title: "Parallax Animation",
            description:
              "Parallax animation is the heart of Void. We really played with it.",
            order: 1,
            active: true,
          },

          {
            icon: "ion-social-javascript-outline",
            title: "JS Animations",
            description:
              "Void comes with some cool, outstanding javascript animations.",
            order: 2,
            active: true,
          },

          {
            icon: "ion-ios-star-outline",
            title: "Creative and Unique",
            description:
              "By this, we really mean it. Each template is completely different than others.",
            order: 3,
            active: true,
          },

          {
            icon: "ion-ipad",
            title: "Ultra Responsive",
            description:
              "Void is an ultra responsive template, works perfectly on all devices.",
            order: 4,
            active: true,
          },

          {
            icon: "ion-ios-ionic-outline",
            title: "Font Icons",
            description:
              "Unlimited icons. Choose between Ion Icons and Font Awesome.",
            order: 5,
            active: true,
          },

          {
            icon: "ion-ios-email-outline",
            title: "24/7 Support",
            description:
              "We value our customers so we provide outstanding support.",
            order: 6,
            active: true,
          },
        ],

        footer: {
          title: "Like Void? Well, It is Only $20!!",
          buttonText: "Buy with Envato",
          buttonLink: "",
          buyText: "Buy with:",
          price: "Only $19!",
          logo: "",
          active: true,
        },

        active: true,
      });
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error(
      "Get Portfolio Page Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load portfolio page",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE PORTFOLIO PAGE
|--------------------------------------------------------------------------
| Used by the admin CMS to save changes.
*/

router.put("/", async (req, res) => {
  try {
    const portfolioData = req.body;

    /*
    ==========================================================
    GET EXISTING PORTFOLIO
    ==========================================================
    */

    const existingPage = await PortfolioPage.findOne();

    /*
    ==========================================================
    SYNC CELEBRITY PROFILES
    ==========================================================
    */

    if (Array.isArray(portfolioData.demos)) {
      for (const demo of portfolioData.demos) {
        const name = demo.name?.trim();

        if (!name) {
          continue;
        }

        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        /*
        ------------------------------------------------------
        EXISTING CELEBRITY
        ------------------------------------------------------
        */

        if (demo.celebrityProfileId) {
          const existingCelebrity =
            await CelebrityProfile.findById(
              demo.celebrityProfileId
            );

          if (existingCelebrity) {
            await CelebrityProfile.findByIdAndUpdate(
              demo.celebrityProfileId,
              {
                $set: {
                  name,
                  slug,
                },
              },
              {
                new: true,
                runValidators: true,
              }
            );
          }
        }

        /*
        ------------------------------------------------------
        NO CELEBRITY YET
        CREATE ONE AUTOMATICALLY
        ------------------------------------------------------
        */

        else {
          const celebrity =
            await CelebrityProfile.create({
              name,
              slug,
            });

          demo.celebrityProfileId =
            celebrity._id;
        }

        /*
        ------------------------------------------------------
        KEEP PORTFOLIO URL IN SYNC
        ------------------------------------------------------
        */

        demo.slug = slug;
        demo.link = `/celebrity/${slug}`;
      }
    }

    /*
    ==========================================================
    DELETE CELEBRITY PROFILES FOR REMOVED PORTFOLIO DEMOS
    ==========================================================
    */

    if (
      existingPage &&
      Array.isArray(existingPage.demos)
    ) {
      const newDemoIds = new Set(
        (portfolioData.demos || [])
          .map((demo) =>
            demo._id?.toString()
          )
          .filter(Boolean)
      );

      for (const oldDemo of existingPage.demos) {
        /*
        Only process demos that had a celebrity
        */

        if (!oldDemo.celebrityProfileId) {
          continue;
        }

        /*
        If old demo no longer exists,
        delete its CelebrityProfile.
        */

        if (
          !newDemoIds.has(
            oldDemo._id.toString()
          )
        ) {
          await CelebrityProfile.findByIdAndDelete(
            oldDemo.celebrityProfileId
          );
        }
      }
    }

    /*
    ==========================================================
    SAVE PORTFOLIO
    ==========================================================
    */

    const updatedPage =
      await PortfolioPage.findOneAndUpdate(
        {},
        portfolioData,
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Portfolio and celebrity profiles synchronized successfully",
      data: updatedPage,
    });
  } catch (error) {
    console.error(
      "Update Portfolio Page Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update portfolio page",
      error: error.message,
    });
  }
});

export default router;