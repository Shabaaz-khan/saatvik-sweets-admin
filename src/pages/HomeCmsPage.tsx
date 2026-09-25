import { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../lib/config";

import {
  getHomePage,
  updateHomePage,
  getCategories,
  getProducts,
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
  const [products, setProducts] = useState<any[]>([]);
  const [floatingVideo, setFloatingVideo] = useState({
    enabled: true,
    videoUrl: "",
    poster: "",
    position: "right",
  });
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);
  const [specialGuests, setSpecialGuests] = useState<
    {
      name: string;
      designation: string;
      slug: string;
      image: string;
      description: string;
      backgroundColor: string;
      media: {
        type: "image" | "video";
        url: string;
        title: string;
      }[];
      sortOrder: number;
      isActive: boolean;
    }[]
  >([]);
  const loadCategories = async () => {
    try {
      const data = await getCategories();

      console.log("Categories:", data);

      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };
  const loadProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
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
const [valuesSection, setValuesSection] = useState([
  {
    title: "Pure ghee, no palm oil",
    description: "",
  },
  {
    title: "Slow-cooked, hand shaped",
    description: "",
  },
  {
    title: "FSSAI certified kitchen",
    description: "",
  },
  {
    title: "Pan-India cold-chain delivery",
    description: "",
  },
]);
  const [story, setStory] = useState({
    label: "",
    title: "",
    description: "",
    image: "",
    images: [] as string[],
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

    primaryButtonText: "",
    primaryButtonLink: "",

    secondaryButtonText: "",
    secondaryButtonLink: "",

    featuredProducts: [] as string[],
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
      company: string;
      title: string;
      review: string;
      image: string;
      companyLogo: string;
      linkedin: string;
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
setValuesSection(
  data.valuesSection?.length === 4
    ? data.valuesSection
    : [
        {
          title: "Pure ghee, no palm oil",
          description: "",
        },
        {
          title: "Slow-cooked, hand shaped",
          description: "",
        },
        {
          title: "FSSAI certified kitchen",
          description: "",
        },
        {
          title: "Pan-India cold-chain delivery",
          description: "",
        },
      ]
);
      setStory({
        label: data.story?.label || "",
        title: data.story?.title || "",
        description: data.story?.description || "",
        image: data.story?.image || "",
        images: data.story?.images || [],
        buttonText: data.story?.buttonText || "",
        buttonLink: data.story?.buttonLink || "",
      });
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

      setCorporate({
        ...(data.corporate || {}),
        featuredProducts:
          data.corporate?.featuredProducts?.map((item: any) =>
            typeof item === "string"
              ? item
              : item._id
          ) || [],
      });
      setVideoTestimonials(
        data.videoTestimonials || []
      );
      setTestimonials(data.testimonials || []);
      setSpecialGuests(data.specialGuests || []);
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
 valuesSection,
        story,
        floatingVideo,
        signature,

        corporate,
        videoTestimonials,
        testimonials,
        specialGuests,
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
  const uploadSpecialGuestImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) =>
    uploadImage(
      e,
      (url) => {
        const arr = [...specialGuests];
        arr[index].image = url;
        setSpecialGuests(arr);
      },
      "Special guest image uploaded"
    );
  const uploadSpecialGuestMedia = async (
    e: React.ChangeEvent<HTMLInputElement>,
    guestIndex: number,
    mediaIndex: number
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);
    formData.append("folder", "special-guests");

    try {
      const { data } = await axios.post(
        `${API_URL}/api/upload`,
        formData
      );

      const guests = [...specialGuests];

      guests[guestIndex].media[mediaIndex].url =
        data.imageUrl;

      setSpecialGuests(guests);

      toast({
        message: "Media uploaded",
        type: "success",
      });
    } catch {
      toast({
        message: "Media upload failed",
        type: "error",
      });
    }
  };
  const uploadCompanyLogo = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) =>
    uploadImage(
      e,
      (url) => {
        const arr = [...testimonials];
        arr[index].companyLogo = url;
        setTestimonials(arr);
      },
      "Company logo uploaded"
    );
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
  const uploadStoryImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();

        formData.append("image", file);
        formData.append("folder", "home");

        const { data } = await axios.post(
          `${API_URL}/api/upload`,
          formData
        );

        uploadedUrls.push(data.imageUrl);
      }

      setStory((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...uploadedUrls,
        ],
      }));

      toast({
        message: "Story images uploaded",
        type: "success",
      });

    } catch (err) {
      console.error(err);

      toast({
        message: "Story image upload failed",
        type: "error",
      });
    }

    e.target.value = "";
  };
  const selectedIds = [
    ...new Set(
      corporate.featuredProducts.map((item: any) =>
        typeof item === "string" ? item : item._id
      )
    ),
  ];

  const sortedProducts = [
    ...products.filter((p) => selectedIds.includes(p._id)),
    ...products.filter((p) => !selectedIds.includes(p._id)),
  ];
  const [showProductDropdown, setShowProductDropdown] =
    useState(false);

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
        {/* Values / Features Section */}

{/* Homepage Features */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-2">
    Homepage Features
  </h2>

  <p className="text-sm text-stone-500 mb-6">
    Manage the title and description for each homepage feature.
  </p>

  <div className="space-y-6">

    {valuesSection.map((item, index) => (

      <div
        key={index}
        className="border rounded-xl p-5"
      >

        <h3 className="font-semibold text-base mb-4">
          Feature {index + 1}
        </h3>

        {/* Title */}

        <div className="mb-4">

          <label className="label">
            Title
          </label>

          <input
            className="input"
            value={item.title}
            onChange={(e) => {

              const arr = [...valuesSection];

              arr[index] = {
                ...arr[index],
                title: e.target.value,
              };

              setValuesSection(arr);

            }}
          />

        </div>

        {/* Description */}

        <div>

          <label className="label">
            Description
          </label>

          <textarea
            rows={3}
            className="input"
            placeholder="Enter feature description"
            value={item.description}
            onChange={(e) => {

              const arr = [...valuesSection];

              arr[index] = {
                ...arr[index],
                description: e.target.value,
              };

              setValuesSection(arr);

            }}
          />

        </div>

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
                Story Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                className="input"
                onChange={uploadStoryImages}
              />

              {story.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">

                  {story.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl"
                    >

                      <img
                        src={image}
                        alt={`Story ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setStory((prev) => ({
                            ...prev,
                            images: prev.images.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                        className="
              absolute
              right-2
              top-2
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-red-600
              text-white
              hover:bg-red-700
            "
                      >
                        ×
                      </button>

                    </div>
                  ))}

                </div>
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

            <div className="md:col-span-2">

              <div className="mb-5">

                <h3 className="font-semibold text-lg">
                  Featured Products
                </h3>

                <p className="text-sm text-stone-500 mt-1">
                  Select the products you want to show in the Corporate Slider.
                </p>

              </div>

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowProductDropdown(!showProductDropdown)
                  }
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3"
                >

                  <span>

                    {selectedIds.length
                      ? `${selectedIds.length} Products Selected`
                      : "Select Products"}

                  </span>

                  <span>
                    ▼
                  </span>

                </button>

                {showProductDropdown && (

                  <div className="absolute z-50 mt-2 max-h-[350px] w-full overflow-y-auto rounded-xl border bg-white shadow-xl">

                    {sortedProducts.map((product) => {

                      const checked = selectedIds.includes(product._id);

                      return (

                        <label
                          key={product._id}
                          className="flex cursor-pointer items-center gap-4 border-b p-3 hover:bg-stone-50"
                        >

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCorporate({
                                  ...corporate,
                                  featuredProducts: Array.from(
                                    new Set([
                                      ...corporate.featuredProducts,
                                      product._id,
                                    ])
                                  ),
                                });
                              } else {
                                setCorporate({
                                  ...corporate,
                                  featuredProducts: corporate.featuredProducts.filter(
                                    (id) => id !== product._id
                                  ),
                                });
                              }
                            }}
                          />

                          <img
                            src={product.images?.[0] || product.imageUrl}

                            className="h-14 w-14 rounded-lg object-cover"
                          />

                          <div>

                            <p className="font-medium">
                              {product.name}
                            </p>

                          </div>

                        </label>

                      );

                    })}

                  </div>

                )}

              </div>

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
                    company: "",
                    title: "",
                    review: "",
                    image: "",
                    companyLogo: "",
                    linkedin: "",
                  }
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
                  <div>
                    <label className="label">
                      Company
                    </label>

                    <input
                      className="input"
                      value={item.company}
                      onChange={(e) => {
                        const arr = [...testimonials];
                        arr[index].company = e.target.value;
                        setTestimonials(arr);
                      }}
                      placeholder="Merck Life Science"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">
                      Headline
                    </label>

                    <textarea
                      rows={2}
                      className="input"
                      value={item.title}
                      onChange={(e) => {
                        const arr = [...testimonials];
                        arr[index].title = e.target.value;
                        setTestimonials(arr);
                      }}
                      placeholder="Projects and case studies reinforced..."
                    />
                  </div>
                  <div>
                    <label className="label">
                      Company Logo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadCompanyLogo(e, index)
                      }
                    />

                    {item.companyLogo && (
                      <img
                        src={item.companyLogo}
                        className="mt-3 h-12 object-contain"
                      />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">
                      LinkedIn URL
                    </label>

                    <input
                      className="input"
                      value={item.linkedin}
                      onChange={(e) => {
                        const arr = [...testimonials];
                        arr[index].linkedin = e.target.value;
                        setTestimonials(arr);
                      }}
                      placeholder="https://linkedin.com/in/..."
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
        {/* Special Guests */}

        <div className="card p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-semibold">
                Special Guests
              </h2>

              <p className="text-sm text-stone-500 mt-1">
                Manage special guest cards displayed on the Home Page.
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary flex items-center gap-2"
              onClick={() =>
                setSpecialGuests([
                  ...specialGuests,
                  {
                    name: "",
                    designation: "",
                    slug: "",
                    image: "",
                    description: "",
                    backgroundColor: "#3A1420",
                    media: [],
                    sortOrder: specialGuests.length,
                    isActive: true,
                  },
                ])
              }
            >
              <Plus className="w-4 h-4" />
              Add Guest
            </button>

          </div>

          <div className="space-y-6">

            {specialGuests.map((guest, guestIndex) => (

              <div
                key={guestIndex}
                className="border rounded-xl p-5"
              >

                {/* Guest Header */}

                <div className="flex items-center justify-between mb-5">

                  <h3 className="font-semibold text-lg">
                    Guest {guestIndex + 1}
                  </h3>

                  <button
                    type="button"
                    className="btn-danger flex items-center gap-2"
                    onClick={() =>
                      setSpecialGuests(
                        specialGuests.filter(
                          (_, i) => i !== guestIndex
                        )
                      )
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* Name */}

                  <div>

                    <label className="label">
                      Name
                    </label>

                    <input
                      className="input"
                      placeholder="Guest Name"
                      value={guest.name}
                      onChange={(e) => {

                        const arr = [...specialGuests];

                        const name = e.target.value;

                        arr[guestIndex].name = name;

                        // Automatically create slug
                        arr[guestIndex].slug = name
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, "");

                        setSpecialGuests(arr);

                      }}
                    />

                  </div>


                  {/* Designation */}

                  <div>

                    <label className="label">
                      Designation
                    </label>

                    <input
                      className="input"
                      placeholder="Special Guest"
                      value={guest.designation}
                      onChange={(e) => {

                        const arr = [...specialGuests];

                        arr[guestIndex].designation =
                          e.target.value;

                        setSpecialGuests(arr);

                      }}
                    />

                  </div>


                  {/* Slug */}

                  <div>

                    <label className="label">
                      Slug
                    </label>

                    <input
                      className="input"
                      value={guest.slug}
                      onChange={(e) => {

                        const arr = [...specialGuests];

                        arr[guestIndex].slug =
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");

                        setSpecialGuests(arr);

                      }}
                    />

                    <p className="text-xs text-stone-500 mt-1">
                      Used in the page URL.
                    </p>

                  </div>


                  {/* Background Color */}

                  <div>

                    <label className="label">
                      Background Color
                    </label>

                    <div className="flex items-center gap-3">

                      <input
                        type="color"
                        value={guest.backgroundColor}
                        onChange={(e) => {

                          const arr = [...specialGuests];

                          arr[guestIndex].backgroundColor =
                            e.target.value;

                          setSpecialGuests(arr);

                        }}
                        className="h-10 w-16 cursor-pointer rounded border p-1"
                      />

                      <input
                        className="input flex-1"
                        value={guest.backgroundColor}
                        onChange={(e) => {

                          const arr = [...specialGuests];

                          arr[guestIndex].backgroundColor =
                            e.target.value;

                          setSpecialGuests(arr);

                        }}
                      />

                    </div>

                  </div>


                  {/* Description */}

                  <div className="md:col-span-2">

                    <label className="label">
                      Description
                    </label>

                    <textarea
                      rows={4}
                      className="input"
                      placeholder="Write something about this special guest..."
                      value={guest.description}
                      onChange={(e) => {

                        const arr = [...specialGuests];

                        arr[guestIndex].description =
                          e.target.value;

                        setSpecialGuests(arr);

                      }}
                    />

                  </div>


                  {/* Main Guest Image */}

                  <div>

                    <label className="label">
                      Guest Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadSpecialGuestImage(
                          e,
                          guestIndex
                        )
                      }
                    />

                    {guest.image && (

                      <img
                        src={guest.image}
                        alt={guest.name}
                        className="mt-3 h-40 w-40 rounded-xl object-cover border"
                      />

                    )}

                  </div>


                  {/* Active */}

                  <div>

                    <label className="label">
                      Status
                    </label>

                    <label className="flex items-center gap-3 mt-2">

                      <input
                        type="checkbox"
                        checked={guest.isActive}
                        onChange={(e) => {

                          const arr = [...specialGuests];

                          arr[guestIndex].isActive =
                            e.target.checked;

                          setSpecialGuests(arr);

                        }}
                      />

                      <span className="text-sm">
                        Show this guest on Home Page
                      </span>

                    </label>

                  </div>


                  {/* Sort Order */}

                  <div>

                    <label className="label">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      min={0}
                      className="input"
                      value={guest.sortOrder}
                      onChange={(e) => {

                        const arr = [...specialGuests];

                        arr[guestIndex].sortOrder =
                          Number(e.target.value);

                        setSpecialGuests(arr);

                      }}
                    />

                  </div>

                </div>


                {/* Guest Media */}

                <div className="mt-6 border-t pt-5">

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <h4 className="font-semibold">
                        Guest Media
                      </h4>

                      <p className="text-sm text-stone-500">
                        Photos or videos shown on the guest details page.
                      </p>

                    </div>

                    <button
                      type="button"
                      className="btn-secondary flex items-center gap-2"
                      onClick={() => {

                        const arr = [...specialGuests];

                        arr[guestIndex].media.push({
                          type: "image",
                          url: "",
                          title: "",
                        });

                        setSpecialGuests(arr);

                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Media
                    </button>

                  </div>


                  <div className="space-y-4">

                    {guest.media.map((media, mediaIndex) => (

                      <div
                        key={mediaIndex}
                        className="border rounded-lg p-4"
                      >

                        <div className="grid md:grid-cols-3 gap-4 items-end">

                          {/* Media Type */}

                          <div>

                            <label className="label">
                              Media Type
                            </label>

                            <select
                              className="input"
                              value={media.type}
                              onChange={(e) => {

                                const arr =
                                  [...specialGuests];

                                arr[guestIndex]
                                  .media[mediaIndex]
                                  .type =
                                  e.target.value as
                                  "image" | "video";

                                setSpecialGuests(arr);

                              }}
                            >

                              <option value="image">
                                Image
                              </option>

                              <option value="video">
                                Video
                              </option>

                            </select>

                          </div>


                          {/* Title */}

                          <div>

                            <label className="label">
                              Title
                            </label>

                            <input
                              className="input"
                              placeholder="Media title"
                              value={media.title}
                              onChange={(e) => {

                                const arr =
                                  [...specialGuests];

                                arr[guestIndex]
                                  .media[mediaIndex]
                                  .title =
                                  e.target.value;

                                setSpecialGuests(arr);

                              }}
                            />

                          </div>


                          {/* Remove */}

                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => {

                              const arr =
                                [...specialGuests];

                              arr[guestIndex].media =
                                arr[guestIndex].media.filter(
                                  (_, i) =>
                                    i !== mediaIndex
                                );

                              setSpecialGuests(arr);

                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Media
                          </button>

                        </div>


                        {/* Upload */}

                        <div className="mt-4">

                          <label className="label">
                            Upload {media.type === "image"
                              ? "Image"
                              : "Video"}
                          </label>

                          <input
                            type="file"
                            accept={
                              media.type === "image"
                                ? "image/*"
                                : "video/*"
                            }
                            onChange={(e) =>
                              uploadSpecialGuestMedia(
                                e,
                                guestIndex,
                                mediaIndex
                              )
                            }
                          />

                        </div>


                        {/* Preview */}

                        {media.url && (

                          <div className="mt-4">

                            {media.type === "image" ? (

                              <img
                                src={media.url}
                                alt={media.title}
                                className="h-40 w-40 rounded-lg object-cover border"
                              />

                            ) : (

                              <video
                                src={media.url}
                                controls
                                className="w-64 rounded-lg border"
                              />

                            )}

                          </div>

                        )}

                      </div>

                    ))}

                  </div>

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

