import { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../lib/config";

import {
  getHomePage,
  updateHomePage,
    getCategories,
} from "../api/api";

import { useToast } from "../lib/toast";

import {
  Loader2,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
export default function HomeCmsPage() {
    const toast = useToast();

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [categories, setCategories] = useState<any[]>([]);
const [floatingVideo, setFloatingVideo] = useState({
  enabled: true,
  videoUrl: "",
  poster: "",
  position: "right",
});
useEffect(() => {
  loadCategories();
}, []);

const loadCategories = async () => {
  try {
    const data = await getCategories();

    console.log("Categories:", data);

    setCategories(data);
  } catch (err) {
    console.log(err);
  }
};
const [form, setForm] = useState({
  label: "",

  titleLine1: "",
  titleLine2: "",

  description: "",

  primaryButtonText: "",
  primaryButtonLink: "",

  secondaryButtonText: "",
  secondaryButtonLink: "",

  heroPlateImage: "",

  ladooImage: "",
  katliImage: "",

  badgeYear: "",
  badgeCity: "",
});

const [card1, setCard1] = useState({
  image: "",
  label: "",
  title: "",
});

const [card2, setCard2] = useState({
  image: "",
  label: "",
  title: "",
});

const [stats, setStats] = useState<
  {
    number: string;
    label: string;
  }[]
>([]);

const [marqueeItems, setMarqueeItems] = useState<string[]>([]);

const [story, setStory] = useState({
  label: "",
  title: "",
  description: "",
  image: "",
  buttonText: "",
  buttonLink: "",
});

const [signature, setSignature] = useState({
  eyebrow: "",
  title: "",
  subtitle: "",
  category: "",
  limit: 4,
});
const [corporate, setCorporate] = useState({
  label: "",
  title: "",
  description: "",
  image: "",
  primaryButtonText: "",
  primaryButtonLink: "",
  secondaryButtonText: "",
  secondaryButtonLink: "",
});
const [videoTestimonials, setVideoTestimonials] = useState<
  {
    name: string;
    designation: string;
    videoUrl: string;
  }[]
>([]);
const [testimonials, setTestimonials] = useState<
{
  name: string;
  designation: string;
  review: string;
  image: string;
}[]
>([]);
useEffect(() => {
  load();
}, []);

async function load() {
  try {
    const data = await getHomePage();

    setForm({
      ...form,
      ...(data.hero || {}),
    });

    setCard1(
      data.hero?.card1 || {
        image: "",
        label: "",
        title: "",
      }
    );

    setCard2(
      data.hero?.card2 || {
        image: "",
        label: "",
        title: "",
      }
    );

    setStats(data.hero?.stats || []);

    setMarqueeItems(data.marquee?.items || []);

    setStory(
      data.story || {
        label: "",
        title: "",
        description: "",
        image: "",
        buttonText: "",
        buttonLink: "",
      }
    );
setFloatingVideo(
  data.floatingVideo || {
    enabled: true,
    videoUrl: "",
    poster: "",
    position: "right",
  }
);
setSignature(
  data.signature || {
    eyebrow: "",
    title: "",
    subtitle: "",
    category: "",
    limit: 4,
  }
);

    setCorporate(
      data.corporate || {
        label: "",
        title: "",
        description: "",
        image: "",
        primaryButtonText: "",
        primaryButtonLink: "",
        secondaryButtonText: "",
        secondaryButtonLink: "",
      }
    );
setVideoTestimonials(
  data.videoTestimonials || []
);
    setTestimonials(data.testimonials || []);
  } catch (err: any) {
    toast({
      message: err.message,
      type: "error",
    });
  }

  setLoading(false);
}
async function save(e: React.FormEvent) {
  e.preventDefault();

  setSaving(true);

  try {
    await updateHomePage({
      hero: {
        ...form,
        card1,
        card2,
        stats,
      },

      marquee: {
        items: marqueeItems,
      },

      story,
  floatingVideo,
      signature,

      corporate,
videoTestimonials,
      testimonials,
    });

    toast({
      message: "Home Page Updated",
      type: "success",
    });
  } catch (err: any) {
    toast({
      message: err.message,
      type: "error",
    });
  }

  setSaving(false);
}
const uploadTestimonialVideo = async (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", "home");

  try {
    const { data } = await axios.post(
      `${API_URL}/api/upload`,
      formData
    );

    const arr = [...videoTestimonials];

    arr[index].videoUrl = data.imageUrl;

    setVideoTestimonials(arr);

    toast({
      message: "Video uploaded",
      type: "success",
    });
  } catch {
    toast({
      message: "Upload failed",
      type: "error",
    });
  }
};
const uploadFloatingVideo = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("image", file);

  formData.append("folder", "home");


  try {
    const { data } = await axios.post(
      `${API_URL}/api/upload`,
      formData
    );

    setFloatingVideo((prev) => ({
      ...prev,
        videoUrl: data.imageUrl,
    }));

    toast({
      message: "Video uploaded",
      type: "success",
    });

  } catch {

    toast({
      message: "Upload failed",
      type: "error",
    });

  }
};
const uploadImage = async (
  e: React.ChangeEvent<HTMLInputElement>,
  onSuccess: (url: string) => void,
  successMessage: string
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", "home");

  try {
    const { data } = await axios.post(
      `${API_URL}/api/upload`,
      formData
    );

    onSuccess(data.imageUrl);

    toast({
      message: successMessage,
      type: "success",
    });
  } catch {
    toast({
      message: "Upload failed",
      type: "error",
    });
  }
};
const uploadHeroImage = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setForm((prev) => ({
        ...prev,
        heroPlateImage: url,
      })),
    "Hero image uploaded"
  );

const uploadLadooImage = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setForm((prev) => ({
        ...prev,
        ladooImage: url,
      })),
    "Ladoo image uploaded"
  );

const uploadKatliImage = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setForm((prev) => ({
        ...prev,
        katliImage: url,
      })),
    "Katli image uploaded"
  );

const uploadCard1Image = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setCard1((prev) => ({
        ...prev,
        image: url,
      })),
    "Card 1 image uploaded"
  );

const uploadCard2Image = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setCard2((prev) => ({
        ...prev,
        image: url,
      })),
    "Card 2 image uploaded"
  );
const uploadTestimonialImage = (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) =>
  uploadImage(
    e,
    (url) => {
      const arr = [...testimonials];
      arr[index].image = url;
      setTestimonials(arr);
    },
    "Testimonial image uploaded"
  );
const uploadStoryImage = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setStory((prev) => ({
        ...prev,
        image: url,
      })),
    "Story image uploaded"
  );

const uploadCorporateImage = (
  e: React.ChangeEvent<HTMLInputElement>
) =>
  uploadImage(
    e,
    (url) =>
      setCorporate((prev) => ({
        ...prev,
        image: url,
      })),
    "Corporate image uploaded"
  );

if (loading) {
  return (
    <div className="p-10 text-center">
      <Loader2 className="animate-spin mx-auto" />
    </div>
  );
  
}
return (

  <div className="space-y-6 animate-fade-up">

    <div>

      <h1 className="font-display text-3xl font-semibold">

        Home CMS

      </h1>



      <p className="text-stone-500">

        Manage Home Page Content

      </p>

    </div>



    <form onSubmit={save} className="space-y-6">



      {/* Hero Section */}



      <div className="card p-6">

        <h2 className="text-lg font-semibold mb-5">

          Hero Section

        </h2>



        <div className="space-y-5">



{/* Hero Images */}

<div className="grid md:grid-cols-2 gap-6">

  {/* Hero Plate */}

  <div>
    <label className="label">
      Hero Plate Image
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={uploadHeroImage}
    />

    {form.heroPlateImage && (
      <img
        src={form.heroPlateImage}
        className="w-48 h-48 object-cover rounded-xl mt-3 border"
      />
    )}
  </div>

  {/* Ladoo */}

  <div>
    <label className="label">
      Ladoo Image
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={uploadLadooImage}
    />

    {form.ladooImage && (
      <img
        src={form.ladooImage}
        className="w-48 h-48 object-cover rounded-xl mt-3 border"
      />
    )}
  </div>

  {/* Katli */}

  <div>
    <label className="label">
      Katli Image
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={uploadKatliImage}
    />

    {form.katliImage && (
      <img
        src={form.katliImage}
        className="w-48 h-48 object-cover rounded-xl mt-3 border"
      />
    )}
  </div>

</div>



          {/* Label */}



          <div>

            <label className="label">

              Label

            </label>



            <input

              className="input"

              value={form.label}

              onChange={(e) =>

                setForm({

                  ...form,

                  label: e.target.value,

                })

              }

            />

          </div>



          {/* Title Line 1 */}



          <div>

            <label className="label">

              Title Line 1

            </label>



            <input

              className="input"

              value={form.titleLine1}

              onChange={(e) =>

                setForm({

                  ...form,

                  titleLine1: e.target.value,

                })

              }

            />

          </div>



          {/* Title Line 2 */}



          <div>

            <label className="label">

              Title Line 2

            </label>



            <input

              className="input"

              value={form.titleLine2}

              onChange={(e) =>

                setForm({

                  ...form,

                  titleLine2: e.target.value,

                })

              }

            />

          </div>



          {/* Description */}



          <div>

            <label className="label">

              Description

            </label>



            <textarea

              rows={4}

              className="input"

              value={form.description}

              onChange={(e) =>

                setForm({

                  ...form,

                  description: e.target.value,

                })

              }

            />

          </div>



          {/* Primary Button */}



          <div className="grid md:grid-cols-2 gap-4">



            <div>

              <label className="label">

                Primary Button Text

              </label>



              <input

                className="input"

                value={form.primaryButtonText}

                onChange={(e) =>

                  setForm({

                    ...form,

                    primaryButtonText: e.target.value,

                  })

                }

              />

            </div>



            <div>

              <label className="label">

                Primary Button Link

              </label>



              <input

                className="input"

                value={form.primaryButtonLink}

                onChange={(e) =>

                  setForm({

                    ...form,

                    primaryButtonLink: e.target.value,

                  })

                }

              />

            </div>



          </div>



          {/* Secondary Button */}



          <div className="grid md:grid-cols-2 gap-4">



            <div>

              <label className="label">

                Secondary Button Text

              </label>



              <input

                className="input"

                value={form.secondaryButtonText}

                onChange={(e) =>

                  setForm({

                    ...form,

                    secondaryButtonText: e.target.value,

                  })

                }

              />

            </div>



            <div>

              <label className="label">

                Secondary Button Link

              </label>



              <input

                className="input"

                value={form.secondaryButtonLink}

                onChange={(e) =>

                  setForm({

                    ...form,

                    secondaryButtonLink: e.target.value,

                  })

                }

              />

            </div>



          </div>



          {/* Badge */}



          <div className="grid md:grid-cols-2 gap-4">



            <div>

              <label className="label">

                Badge Year

              </label>



              <input

                className="input"

                value={form.badgeYear}

                onChange={(e) =>

                  setForm({

                    ...form,

                    badgeYear: e.target.value,

                  })

                }

              />

            </div>



            <div>

              <label className="label">

                Badge City

              </label>



              <input

                className="input"

                value={form.badgeCity}

                onChange={(e) =>

                  setForm({

                    ...form,

                    badgeCity: e.target.value,

                  })

                }

              />

            </div>



          </div>

<div className="border rounded-xl p-5 mt-6">

  <h3 className="font-semibold text-lg mb-4">
    Card 1
  </h3>

  <input
    type="file"
    accept="image/*"
    onChange={uploadCard1Image}
  />

  {card1.image && (
    <img
      src={card1.image}
      className="w-40 h-40 object-cover rounded-xl mt-3 border"
    />
  )}

  <div className="mt-4">
    <label className="label">
      Label
    </label>

    <input
      className="input"
      value={card1.label}
      onChange={(e) =>
        setCard1({
          ...card1,
          label: e.target.value,
        })
      }
    />
  </div>

  <div className="mt-4">
    <label className="label">
      Title
    </label>

    <input
      className="input"
      value={card1.title}
      onChange={(e) =>
        setCard1({
          ...card1,
          title: e.target.value,
        })
      }
    />
  </div>

</div>
<div className="border rounded-xl p-5 mt-6">

  <h3 className="font-semibold text-lg mb-4">
    Card 2
  </h3>

  <input
    type="file"
    accept="image/*"
    onChange={uploadCard2Image}
  />

  {card2.image && (
    <img
      src={card2.image}
      className="w-40 h-40 object-cover rounded-xl mt-3 border"
    />
  )}

  <div className="mt-4">
    <label className="label">
      Label
    </label>

    <input
      className="input"
      value={card2.label}
      onChange={(e) =>
        setCard2({
          ...card2,
          label: e.target.value,
        })
      }
    />
  </div>

  <div className="mt-4">
    <label className="label">
      Title
    </label>

    <input
      className="input"
      value={card2.title}
      onChange={(e) =>
        setCard2({
          ...card2,
          title: e.target.value,
        })
      }
    />
  </div>

</div>
{/* Stats */}

<div className="card p-6">

  <div className="flex justify-between items-center mb-5">

    <h2 className="text-lg font-semibold">
      Hero Stats
    </h2>

    <button
      type="button"
      className="btn-secondary flex items-center gap-2"
      onClick={() =>
        setStats([
          ...stats,
          {
            number: "",
            label: "",
          },
        ])
      }
    >
      <Plus className="w-4 h-4" />
      Add Stat
    </button>

  </div>

  <div className="space-y-5">

    {stats.map((item, index) => (

      <div
        key={index}
        className="border rounded-xl p-4"
      >

        <div className="grid md:grid-cols-12 gap-4 items-end">

          <div className="md:col-span-4">

            <label className="label">
              Number
            </label>

            <input
              className="input"
              value={item.number}
              onChange={(e) => {
                const arr = [...stats];
                arr[index].number = e.target.value;
                setStats(arr);
              }}
            />

          </div>

          <div className="md:col-span-6">

            <label className="label">
              Label
            </label>

            <input
              className="input"
              value={item.label}
              onChange={(e) => {
                const arr = [...stats];
                arr[index].label = e.target.value;
                setStats(arr);
              }}
            />

          </div>

          <div className="md:col-span-2">

            <button
              type="button"
              className="btn-danger w-full flex items-center justify-center gap-2"
              onClick={() =>
                setStats(
                  stats.filter((_, i) => i !== index)
                )
              }
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>

        </div>

      </div>
{/* Marquee */}

<div className="card p-6">

  <div className="flex justify-between items-center mb-6">

    <h2 className="text-lg font-semibold">
      Marquee Section
    </h2>

    <button
      type="button"
      className="btn-secondary flex items-center gap-2"
      onClick={() =>
        setMarqueeItems([
          ...marqueeItems,
          "",
        ])
      }
    >
      <Plus className="w-4 h-4" />
      Add Item
    </button>

  </div>

  <div className="space-y-4">

    {marqueeItems.map((item, index) => (

      <div
        key={index}
        className="flex gap-3"
      >

        <input
          className="input flex-1"
          placeholder="Enter marquee text"
          value={item}
          onChange={(e) => {
            const arr = [...marqueeItems];
            arr[index] = e.target.value;
            setMarqueeItems(arr);
          }}
        />

        <button
          type="button"
          className="btn-danger"
          onClick={() =>
            setMarqueeItems(
              marqueeItems.filter((_, i) => i !== index)
            )
          }
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>

    ))}

  </div>

</div>
{/* Story */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-6">
    Story Section
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    {/* Story Image */}

    <div>

      <label className="label">
        Story Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={uploadStoryImage}
      />

      {story.image && (
        <img
          src={story.image}
          className="w-48 h-48 object-cover rounded-xl mt-3 border"
        />
      )}

    </div>

    <div className="space-y-4">

      <div>

        <label className="label">
          Label
        </label>

        <input
          className="input"
          value={story.label}
          onChange={(e) =>
            setStory({
              ...story,
              label: e.target.value,
            })
          }
        />

      </div>

      <div>

        <label className="label">
          Title
        </label>

        <input
          className="input"
          value={story.title}
          onChange={(e) =>
            setStory({
              ...story,
              title: e.target.value,
            })
          }
        />

      </div>

      <div>

        <label className="label">
          Description
        </label>

        <textarea
          rows={5}
          className="input"
          value={story.description}
          onChange={(e) =>
            setStory({
              ...story,
              description: e.target.value,
            })
          }
        />

      </div>

      <div>

        <label className="label">
          Button Text
        </label>

        <input
          className="input"
          value={story.buttonText}
          onChange={(e) =>
            setStory({
              ...story,
              buttonText: e.target.value,
            })
          }
        />

      </div>

      <div>

        <label className="label">
          Button Link
        </label>

        <input
          className="input"
          value={story.buttonLink}
          onChange={(e) =>
            setStory({
              ...story,
              buttonLink: e.target.value,
            })
          }
        />

      </div>

    </div>

  </div>

</div>
<div className="card p-6">

  <h2 className="text-lg font-semibold mb-6">
    Floating Video
  </h2>

  <div className="space-y-5">

    <label className="flex items-center gap-3">

      <input
        type="checkbox"
        checked={floatingVideo.enabled}
        onChange={(e) =>
          setFloatingVideo({
            ...floatingVideo,
            enabled: e.target.checked,
          })
        }
      />

      Enable Floating Video

    </label>

    <div>

      <label className="label">
        Upload Video
      </label>

      <input
        type="file"
        accept="video/*"
        onChange={uploadFloatingVideo}
      />

    </div>

    {floatingVideo.videoUrl && (

      <video
        src={floatingVideo.videoUrl}
        controls
        className="w-56 rounded-xl mt-4"
      />

    )}

    <div>

      <label className="label">
        Position
      </label>

      <select
        className="input"
        value={floatingVideo.position}
        onChange={(e) =>
          setFloatingVideo({
            ...floatingVideo,
            position: e.target.value,
          })
        }
      >

        <option value="right">
          Right
        </option>

        <option value="left">
          Left
        </option>

      </select>

    </div>

  </div>

</div>
{/* Signature */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-6">
    Signature Section
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    <div>

      <label className="label">
        Eyebrow
      </label>

      <input
        className="input"
        value={signature.eyebrow}
        onChange={(e) =>
          setSignature({
            ...signature,
            eyebrow: e.target.value,
          })
        }
      />

    </div>

    <div>

      <label className="label">
        Title
      </label>

      <input
        className="input"
        value={signature.title}
        onChange={(e) =>
          setSignature({
            ...signature,
            title: e.target.value,
          })
        }
      />

    </div>

    <div className="md:col-span-2">

      <label className="label">
        Subtitle
      </label>

      <textarea
        rows={4}
        className="input"
        value={signature.subtitle}
        onChange={(e) =>
          setSignature({
            ...signature,
            subtitle: e.target.value,
          })
        }
      />

    </div>
<div>
  <label className="label">
    Category
  </label>

  <select
    className="input"
    value={signature.category}
    onChange={(e) =>
      setSignature({
        ...signature,
        category: e.target.value,
      })
    }
  >
    <option value="">
      Select Category
    </option>

    {categories.map((cat) => (
      <option
        key={cat._id}
        value={cat._id}
      >
        {cat.name}
      </option>
    ))}
  </select>
</div>
<div>
  <label className="label">
    Number of Products
  </label>

  <input
    type="number"
    min={1}
    className="input"
    value={signature.limit}
    onChange={(e) =>
      setSignature({
        ...signature,
        limit: Number(e.target.value),
      })
    }
  />
</div>
  </div>

</div>
{/* Corporate */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-6">
    Corporate Gifting Section
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    {/* Image */}

    <div>

      <label className="label">
        Corporate Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={uploadCorporateImage}
      />

      {corporate.image && (
        <img
          src={corporate.image}
          className="w-48 h-48 object-cover rounded-xl mt-3 border"
        />
      )}

    </div>

    <div className="space-y-4">

      <div>

        <label className="label">
          Label
        </label>

        <input
          className="input"
          value={corporate.label}
          onChange={(e) =>
            setCorporate({
              ...corporate,
              label: e.target.value,
            })
          }
        />

      </div>

      <div>

        <label className="label">
          Title
        </label>

        <input
          className="input"
          value={corporate.title}
          onChange={(e) =>
            setCorporate({
              ...corporate,
              title: e.target.value,
            })
          }
        />

      </div>

      <div>

        <label className="label">
          Description
        </label>

        <textarea
          rows={5}
          className="input"
          value={corporate.description}
          onChange={(e) =>
            setCorporate({
              ...corporate,
              description: e.target.value,
            })
          }
        />

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <label className="label">
            Primary Button Text
          </label>

          <input
            className="input"
            value={corporate.primaryButtonText}
            onChange={(e) =>
              setCorporate({
                ...corporate,
                primaryButtonText: e.target.value,
              })
            }
          />

        </div>

        <div>

          <label className="label">
            Primary Button Link
          </label>

          <input
            className="input"
            value={corporate.primaryButtonLink}
            onChange={(e) =>
              setCorporate({
                ...corporate,
                primaryButtonLink: e.target.value,
              })
            }
          />

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <label className="label">
            Secondary Button Text
          </label>

          <input
            className="input"
            value={corporate.secondaryButtonText}
            onChange={(e) =>
              setCorporate({
                ...corporate,
                secondaryButtonText: e.target.value,
              })
            }
          />

        </div>

        <div>

          <label className="label">
            Secondary Button Link
          </label>

          <input
            className="input"
            value={corporate.secondaryButtonLink}
            onChange={(e) =>
              setCorporate({
                ...corporate,
                secondaryButtonLink: e.target.value,
              })
            }
          />

        </div>

      </div>

    </div>

  </div>

</div>
<div className="card p-6">

  <div className="flex justify-between items-center mb-6">

    <h2 className="text-lg font-semibold">
      Video Testimonials
    </h2>

    <button
      type="button"
      className="btn-secondary"
      onClick={() =>
        setVideoTestimonials([
          ...videoTestimonials,
          {
            name: "",
            designation: "",
            videoUrl: "",
          },
        ])
      }
    >
      <Plus className="w-4 h-4" />
      Add Video
    </button>

  </div>

  {videoTestimonials.map((item, index) => (
    <div
      key={index}
      className="border rounded-xl p-5 mb-6"
    >
      <input
        className="input mb-4"
        placeholder="Customer Name"
        value={item.name}
        onChange={(e) => {
          const arr = [...videoTestimonials];
          arr[index].name = e.target.value;
          setVideoTestimonials(arr);
        }}
      />

      <input
        className="input mb-4"
        placeholder="Designation"
        value={item.designation}
        onChange={(e) => {
          const arr = [...videoTestimonials];
          arr[index].designation = e.target.value;
          setVideoTestimonials(arr);
        }}
      />

      <input
        type="file"
        accept="video/*"
        onChange={(e) =>
          uploadTestimonialVideo(e, index)
        }
      />

      {item.videoUrl && (
        <video
          src={item.videoUrl}
          controls
          className="w-56 rounded-xl mt-4"
        />
      )}

      <button
        type="button"
        className="btn-danger mt-5"
        onClick={() =>
          setVideoTestimonials(
            videoTestimonials.filter(
              (_, i) => i !== index
            )
          )
        }
      >
        Remove
      </button>
    </div>
  ))}

</div>
{/* Testimonials */}

<div className="card p-6">

  <div className="flex justify-between items-center mb-6">

    <h2 className="text-lg font-semibold">
      Testimonials
    </h2>

    <button
      type="button"
      className="btn-secondary flex items-center gap-2"
      onClick={() =>
        setTestimonials([
          ...testimonials,
          {
            name: "",
            designation: "",
            review: "",
            image: "",
          },
        ])
      }
    >
      <Plus className="w-4 h-4" />
      Add Testimonial
    </button>

  </div>

  <div className="space-y-6">

    {testimonials.map((item, index) => (

      <div
        key={index}
        className="border rounded-xl p-5"
      >

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="label">
              Name
            </label>

            <input
              className="input"
              value={item.name}
              onChange={(e) => {
                const arr = [...testimonials];
                arr[index].name = e.target.value;
                setTestimonials(arr);
              }}
            />

          </div>

          <div>

            <label className="label">
              Designation
            </label>

            <input
              className="input"
              value={item.designation}
              onChange={(e) => {
                const arr = [...testimonials];
                arr[index].designation = e.target.value;
                setTestimonials(arr);
              }}
            />

          </div>

          <div className="md:col-span-2">

            <label className="label">
              Review
            </label>

            <textarea
              rows={4}
              className="input"
              value={item.review}
              onChange={(e) => {
                const arr = [...testimonials];
                arr[index].review = e.target.value;
                setTestimonials(arr);
              }}
            />

          </div>

          <div>

            <label className="label">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadTestimonialImage(e, index)}
            />

            {item.image && (
              <img
                src={item.image}
                className="w-32 h-32 object-cover rounded-lg mt-3 border"
              />
            )}

          </div>

        </div>

        <div className="mt-5">

          <button
            type="button"
            className="btn-danger flex items-center gap-2"
            onClick={() =>
              setTestimonials(
                testimonials.filter((_, i) => i !== index)
              )
            }
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>

        </div>

      </div>

    ))}

  </div>

</div>
      {/* Save */}



      <div className="flex justify-end">



        <button

          type="submit"

          disabled={saving}

          className="btn-primary"

        >

          {saving ? (

            <>

              <Loader2 className="w-4 h-4 animate-spin" />

              Saving...

            </>

          ) : (

            <>

              <Save className="w-4 h-4" />

              Save

            </>

          )}

        </button>



      </div>



    </form>



  </div>

);
}

