import { Router } from "express";
import CelebrityProfile from "../models/CelebrityProfile.js";

const router = Router();

/*
==================================================
GET CELEBRITY PROFILE
==================================================
*/

router.get("/", async (req, res) => {
  try {
    const profiles = await CelebrityProfile.find().sort({
      createdAt: -1,
    });

    res.json(profiles);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findOne({
      slug: req.params.slug,
    });

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
==================================================
CREATE CELEBRITY PROFILE
==================================================
*/

router.post("/", async (req, res) => {
  try {
    const profile = await CelebrityProfile.create(req.body);

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
UPDATE CELEBRITY PROFILE
==================================================
*/

router.put("/:id", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
DELETE CELEBRITY PROFILE
==================================================
*/

router.delete("/:id", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndDelete(
      req.params.id
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json({
      success: true,
      message: "Celebrity profile deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
UPDATE INTRO
==================================================
*/

router.put("/:id/intro", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          intro: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
UPDATE ABOUT
==================================================
*/

router.put("/:id/about", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          about: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
ADD WORK
==================================================
*/

router.post("/:id/works", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          works: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
ADD GALLERY
==================================================
*/

router.post("/:id/gallery", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          gallery: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
ADD AWARD
==================================================
*/

router.post("/:id/awards", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          awards: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
ADD EVENT
==================================================
*/

router.post("/:id/events", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          events: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
DELETE WORK
==================================================
*/

router.delete("/:id/works/:workId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          works: {
            _id: req.params.workId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
DELETE GALLERY ITEM
==================================================
*/

router.delete("/:id/gallery/:galleryId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          gallery: {
            _id: req.params.galleryId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
DELETE AWARD
==================================================
*/

router.delete("/:id/awards/:awardId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          awards: {
            _id: req.params.awardId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


/*
==================================================
DELETE EVENT
==================================================
*/

router.delete("/:id/events/:eventId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          events: {
            _id: req.params.eventId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
/*
==================================================
UPDATE WORK
==================================================
*/

router.put("/:id/works/:workId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findOneAndUpdate(
      {
        _id: req.params.id,
        "works._id": req.params.workId,
      },
      {
        $set: {
          "works.$": req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile or work not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
/*
==================================================
UPDATE GALLERY
==================================================
*/

router.put("/:id/gallery/:galleryId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findOneAndUpdate(
      {
        _id: req.params.id,
        "gallery._id": req.params.galleryId,
      },
      {
        $set: {
          "gallery.$": req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile or gallery item not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
/*
==================================================
UPDATE AWARD
==================================================
*/

router.put("/:id/awards/:awardId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findOneAndUpdate(
      {
        _id: req.params.id,
        "awards._id": req.params.awardId,
      },
      {
        $set: {
          "awards.$": req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile or award not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
/*
==================================================
UPDATE EVENT
==================================================
*/

router.put("/:id/events/:eventId", async (req, res) => {
  try {
    const profile = await CelebrityProfile.findOneAndUpdate(
      {
        _id: req.params.id,
        "events._id": req.params.eventId,
      },
      {
        $set: {
          "events.$": req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        error: "Celebrity profile or event not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
export default router;