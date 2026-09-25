import { useEffect, useState } from "react";
import axios from "axios";

import {
  Save,
  Plus,
  Trash2,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { API_URL } from "../lib/config";

import {
  getPortfolioPage,
  updatePortfolioPage,
} from "../api/api";

type NavigationItem = {
  _id?: string;
  number: string;
  label: string;
  link: string;
  target: string;
  order: number;
  active: boolean;
};

type ParallaxImage = {
  _id?: string;
  image: string;
  x: number;
  y: number;
};

type Demo = {
  _id?: string;
  number: string;
  name: string;
  slug: string;

  celebrityProfileId?: string | null;

  title: string;
  description: string;
  image: string;
  link: string;
  alignment: "left" | "right";
  backgroundClass: string;
  backgroundColor: string;
  parallaxImages: ParallaxImage[];
  order: number;
  active: boolean;
};

type Feature = {
  _id?: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
};

type ResponsiveLayer = {
  _id?: string;
  image: string;
  x: number;
  y: number;
  order: number;
};

type PortfolioData = {
  _id?: string;

  navigation: NavigationItem[];

  hero: {
    logo: string;
    title: string;
    highlightedTitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
    modelImage: string;
    architectImage: string;
    singerImage: string;
    photographerImage: string;
    macImage: string;
  };

  demos: Demo[];

  responsive: {
    title: string;
    highlightedText: string;
    description: string;
    layers: ResponsiveLayer[];
    active: boolean;
  };

  features: Feature[];

  footer: {
    title: string;
    buttonText: string;
    buttonLink: string;
    buyText: string;
    price: string;
    logo: string;
    active: boolean;
  };

  active: boolean;
};

const emptyNavigation: NavigationItem = {
  number: "",
  label: "",
  link: "",
  target: "_self",
  order: 0,
  active: true,
};

const emptyDemo: Demo = {
  number: "",
  name: "",
  slug: "",
   celebrityProfileId: null,
  title: "",
  description: "",
  image: "",
  link: "",
  alignment: "right",
  backgroundClass: "",
  backgroundColor: "#FFF200",
  parallaxImages: [],
  order: 0,
  active: true,
};

const emptyFeature: Feature = {
  icon: "",
  title: "",
  description: "",
  order: 0,
  active: true,
};

const emptyLayer: ResponsiveLayer = {
  image: "",
  x: 0,
  y: 0,
  order: 0,
};

export default function PortfolioCmsPage() {
  const [data, setData] = useState<PortfolioData | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [openDemo, setOpenDemo] = useState<number | null>(0);
const uploadImage = async (
  file: File,
  folder: string
): Promise<string> => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", folder);

  const { data } = await axios.post(
    `${API_URL}/api/upload`,
    formData
  );

  if (!data?.success || !data?.imageUrl) {
    throw new Error(
      data?.message || "Image upload failed"
    );
  }

  return data.imageUrl;
};
const ImageUploader = ({
  label,
  value,
  folder,
  onChange,
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) => {
  const [uploading, setUploading] =
    useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const imageUrl = await uploadImage(
        file,
        folder
      );

      onChange(imageUrl);
    } catch (error) {
      console.error(
        "Image upload failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm transition hover:bg-gray-50">
        <Upload size={16} />

        {uploading
          ? "Uploading..."
          : "Choose Image"}

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {value && (
        <div className="mt-3 overflow-hidden rounded-lg border bg-gray-50">
          <img
            src={value}
            alt={label}
            className="h-40 w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};
  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPortfolioPage();

      setData(response.data);
    } catch (error) {
      console.error(
        "Failed to load portfolio:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load portfolio"
      );
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await updatePortfolioPage(data);

      setMessage(
        "Portfolio page saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save portfolio:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save portfolio"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Generic helpers
  |--------------------------------------------------------------------------
  */

  const updateHero = (
    field: keyof PortfolioData["hero"],
    value: string
  ) => {
    if (!data) return;

    setData({
      ...data,

      hero: {
        ...data.hero,
        [field]: value,
      },
    });
  };

  const updateResponsive = (
    field: keyof PortfolioData["responsive"],
    value: any
  ) => {
    if (!data) return;

    setData({
      ...data,

      responsive: {
        ...data.responsive,
        [field]: value,
      },
    });
  };

  const updateFooter = (
    field: keyof PortfolioData["footer"],
    value: string | boolean
  ) => {
    if (!data) return;

    setData({
      ...data,

      footer: {
        ...data.footer,
        [field]: value,
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const updateNavigation = (
    index: number,
    field: keyof NavigationItem,
    value: string | number | boolean
  ) => {
    if (!data) return;

    const navigation = [...data.navigation];

    navigation[index] = {
      ...navigation[index],
      [field]: value,
    };

    setData({
      ...data,
      navigation,
    });
  };

  const addNavigation = () => {
    if (!data) return;

    setData({
      ...data,

      navigation: [
        ...data.navigation,
        {
          ...emptyNavigation,
          number: String(
            data.navigation.length + 1
          ).padStart(2, "0"),
          order: data.navigation.length + 1,
        },
      ],
    });
  };

  const deleteNavigation = (index: number) => {
    if (!data) return;

    setData({
      ...data,

      navigation: data.navigation.filter(
        (_, i) => i !== index
      ),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Demos
  |--------------------------------------------------------------------------
  */

const updateDemo = (
  index: number,
  field: keyof Demo,
  value: any
) => {
  setData((prev) => {
    if (!prev) return prev;

    const demos = [...prev.demos];

    demos[index] = {
      ...demos[index],
      [field]: value,
    };

    return {
      ...prev,
      demos,
    };
  });
};

  const addDemo = () => {
    if (!data) return;

    const nextNumber =
      data.demos.length + 1;

    setData({
      ...data,

      demos: [
        ...data.demos,
        {
          ...emptyDemo,
          number: String(nextNumber).padStart(
            2,
            "0"
          ),
          order: nextNumber,
        },
      ],
    });

    setOpenDemo(data.demos.length);
  };

  const deleteDemo = (index: number) => {
    if (!data) return;

    setData({
      ...data,

      demos: data.demos.filter(
        (_, i) => i !== index
      ),
    });

    setOpenDemo(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Demo Parallax Images
  |--------------------------------------------------------------------------
  */

  const addDemoParallaxImage = (
    demoIndex: number
  ) => {
    if (!data) return;

    const demos = [...data.demos];

    demos[demoIndex].parallaxImages = [
      ...demos[demoIndex].parallaxImages,
      {
        image: "",
        x: 0,
        y: 0,
      },
    ];

    setData({
      ...data,
      demos,
    });
  };

  const updateDemoParallaxImage = (
    demoIndex: number,
    imageIndex: number,
    field: keyof ParallaxImage,
    value: any
  ) => {
    if (!data) return;

    const demos = [...data.demos];

    const images = [
      ...demos[demoIndex].parallaxImages,
    ];

    images[imageIndex] = {
      ...images[imageIndex],
      [field]: value,
    };

    demos[demoIndex] = {
      ...demos[demoIndex],
      parallaxImages: images,
    };

    setData({
      ...data,
      demos,
    });
  };

  const deleteDemoParallaxImage = (
    demoIndex: number,
    imageIndex: number
  ) => {
    if (!data) return;

    const demos = [...data.demos];

    demos[demoIndex].parallaxImages =
      demos[demoIndex].parallaxImages.filter(
        (_, i) => i !== imageIndex
      );

    setData({
      ...data,
      demos,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Features
  |--------------------------------------------------------------------------
  */

  const updateFeature = (
    index: number,
    field: keyof Feature,
    value: any
  ) => {
    if (!data) return;

    const features = [...data.features];

    features[index] = {
      ...features[index],
      [field]: value,
    };

    setData({
      ...data,
      features,
    });
  };

  const addFeature = () => {
    if (!data) return;

    const nextOrder =
      data.features.length + 1;

    setData({
      ...data,

      features: [
        ...data.features,
        {
          ...emptyFeature,
          order: nextOrder,
        },
      ],
    });
  };

  const deleteFeature = (index: number) => {
    if (!data) return;

    setData({
      ...data,

      features: data.features.filter(
        (_, i) => i !== index
      ),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Responsive Layers
  |--------------------------------------------------------------------------
  */

  const addResponsiveLayer = () => {
    if (!data) return;

    const nextOrder =
      data.responsive.layers.length + 1;

    setData({
      ...data,

      responsive: {
        ...data.responsive,

        layers: [
          ...data.responsive.layers,
          {
            ...emptyLayer,
            order: nextOrder,
          },
        ],
      },
    });
  };

  const updateResponsiveLayer = (
    index: number,
    field: keyof ResponsiveLayer,
    value: any
  ) => {
    if (!data) return;

    const layers = [
      ...data.responsive.layers,
    ];

    layers[index] = {
      ...layers[index],
      [field]: value,
    };

    setData({
      ...data,

      responsive: {
        ...data.responsive,
        layers,
      },
    });
  };

  const deleteResponsiveLayer = (
    index: number
  ) => {
    if (!data) return;

    setData({
      ...data,

      responsive: {
        ...data.responsive,

        layers:
          data.responsive.layers.filter(
            (_, i) => i !== index
          ),
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading Portfolio CMS...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error ||
            "Portfolio data could not be loaded."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <div className="mb-6 flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Portfolio CMS
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the portfolio page content,
            sections and images.
          </p>
        </div>

        <button
          type="button"
          onClick={savePortfolio}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={17} />

          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>

      {/* ================================================================ */}
      {/* MESSAGES */}
      {/* ================================================================ */}

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ================================================================ */}
      {/* PAGE STATUS */}
      {/* ================================================================ */}

      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Portfolio Page
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enable or disable the complete page.
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.active}
              onChange={(e) =>
                setData({
                  ...data,
                  active: e.target.checked,
                })
              }
            />

            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-black peer-checked:after:translate-x-full" />
          </label>
        </div>
      </section>

      {/* ================================================================ */}
      {/* NAVIGATION */}
      {/* ================================================================ */}

      {/* <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Navigation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the navigation menu.
            </p>
          </div>

          <button
            type="button"
            onClick={addNavigation}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {data.navigation.map(
            (item, index) => (
              <div
                key={item._id || index}
                className="rounded-lg border p-4"
              >
                <div className="grid gap-4 md:grid-cols-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Number
                    </label>

                    <input
                      value={item.number}
                      onChange={(e) =>
                        updateNavigation(
                          index,
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Label
                    </label>

                    <input
                      value={item.label}
                      onChange={(e) =>
                        updateNavigation(
                          index,
                          "label",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">
                      Link
                    </label>

                    <input
                      value={item.link}
                      onChange={(e) =>
                        updateNavigation(
                          index,
                          "link",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Order
                    </label>

                    <input
                      type="number"
                      value={item.order}
                      onChange={(e) =>
                        updateNavigation(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div className="flex items-end gap-3">
                    <label className="flex flex-1 items-center gap-2 pb-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) =>
                          updateNavigation(
                            index,
                            "active",
                            e.target.checked
                          )
                        }
                      />

                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        deleteNavigation(
                          index
                        )
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section> */}

      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}

      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Hero Section
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the main introduction section.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              value={data.hero.title}
              onChange={(e) =>
                updateHero(
                  "title",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Highlighted Title
            </label>

            <input
              value={
                data.hero.highlightedTitle
              }
              onChange={(e) =>
                updateHero(
                  "highlightedTitle",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={3}
              value={data.hero.description}
              onChange={(e) =>
                updateHero(
                  "description",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Button Text
            </label>

            <input
              value={data.hero.buttonText}
              onChange={(e) =>
                updateHero(
                  "buttonText",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Button Link
            </label>

            <input
              value={data.hero.buttonLink}
              onChange={(e) =>
                updateHero(
                  "buttonLink",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

<ImageUploader
  label="Logo"
  value={data.hero.logo}
  folder="portfolio"
  onChange={(url) =>
    updateHero("logo", url)
  }
/>

  <ImageUploader
  label="Background Image"
  value={data.hero.backgroundImage}
  folder="portfolio"
  onChange={(url) =>
    updateHero(
      "backgroundImage",
      url
    )
  }
/>
        </div>

        <div className="mt-6 border-t pt-5">
          <h3 className="mb-4 font-medium">
            Hero Parallax Images
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
{(
  [
    [
      "modelImage",
      "Model Image",
    ],
    [
      "architectImage",
      "Architect Image",
    ],
    [
      "singerImage",
      "Singer Image",
    ],
    [
      "photographerImage",
      "Photographer Image",
    ],
    [
      "macImage",
      "Mac Image",
    ],
  ] as const
).map(([field, label]) => (
  <ImageUploader
    key={field}
    label={label}
    value={data.hero[field]}
    folder="portfolio"
    onChange={(url) =>
      updateHero(field, url)
    }
  />
))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* DEMOS */}
      {/* ================================================================ */}

      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Demo Sections
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add, edit or remove portfolio demos.
            </p>
          </div>

          <button
            type="button"
            onClick={addDemo}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <Plus size={16} />
            Add Demo
          </button>
        </div>

        <div className="space-y-4">
          {data.demos.map(
            (demo, index) => {
              const isOpen =
                openDemo === index;

              return (
                <div
                  key={demo._id || index}
                  className="overflow-hidden rounded-xl border"
                >
                  {/* Demo Header */}

                  <div className="flex items-center justify-between bg-gray-50 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDemo(
                          isOpen
                            ? null
                            : index
                        )
                      }
                      className="flex flex-1 items-center gap-4 text-left"
                    >
                      <span className="font-semibold">
                        {demo.number ||
                          String(
                            index + 1
                          ).padStart(2, "0")}
                      </span>

                      <div>
                        <p className="font-medium">
                          {demo.name ||
                            "New Demo"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {demo.title}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          deleteDemo(
                            index
                          )
                        }
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDemo(
                            isOpen
                              ? null
                              : index
                          )
                        }
                        className="rounded-lg p-2 hover:bg-gray-200"
                      >
                        {isOpen ? (
                          <ChevronUp
                            size={18}
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Demo Content */}

                  {isOpen && (
                    <div className="p-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Number
                          </label>

                          <input
                            value={
                              demo.number
                            }
                            onChange={(e) =>
                              updateDemo(
                                index,
                                "number",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>

<div>
  <label className="mb-1 block text-sm font-medium">
    Name
  </label>

  <input
    value={demo.name}
    onChange={(e) => {
      const name = e.target.value;

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setData((prev) => {
        if (!prev) return prev;

        const demos = [...prev.demos];

        demos[index] = {
          ...demos[index],
          name,
          slug,
          link: slug
            ? `/celebrity/${slug}`
            : "",
        };

        return {
          ...prev,
          demos,
        };
      });
    }}
    className="w-full rounded-lg border px-3 py-2"
  />
</div>
<div>
  <label className="mb-1 block text-sm font-medium">
    Celebrity Slug
  </label>

  <input
    value={demo.slug}
    readOnly
    placeholder="naresh-iyer"
    className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-gray-600"
  />
</div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium">
                            Title
                          </label>

                          <input
                            value={
                              demo.title
                            }
                            onChange={(e) =>
                              updateDemo(
                                index,
                                "title",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium">
                            Description
                          </label>

                          <textarea
                            rows={3}
                            value={
                              demo.description
                            }
                            onChange={(e) =>
                              updateDemo(
                                index,
                                "description",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>

       <ImageUploader
  label="Main Image"
  value={demo.image}
  folder={`portfolio/${demo.name
    .toLowerCase()
    .replace(/\s+/g, "-")}`}
  onChange={(url) =>
    updateDemo(
      index,
      "image",
      url
    )
  }
/>

                        <div>
                 

   <div>
  <label className="mb-1 block text-sm font-medium">
    Celebrity URL
  </label>

  <input
    value={
      demo.slug
        ? `/celebrity/${demo.slug}`
        : ""
    }
    readOnly
    className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-gray-600"
  />
</div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Alignment
                          </label>

                          <select
                            value={
                              demo.alignment
                            }
                            onChange={(e) =>
                              updateDemo(
                                index,
                                "alignment",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          >
                            <option value="left">
                              Left
                            </option>

                            <option value="right">
                              Right
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Background Class
                          </label>

                          <input
                            value={
                              demo.backgroundClass
                            }
                            onChange={(e) =>
                              updateDemo(
                                index,
                                "backgroundClass",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>
<div className="space-y-2">
  <label className="mb-1 block text-sm font-medium">
    Background Color
  </label>

  <div className="flex items-center gap-3">

    {/* Color Picker */}

    <input
      type="color"
      value={
        demo.backgroundColor ||
        "#FFF200"
      }
      onChange={(e) =>
        updateDemo(
          index,
          "backgroundColor",
          e.target.value
        )
      }
      className="h-10 w-16 cursor-pointer rounded-lg border p-1"
      title="Choose background color"
    />

    {/* HEX value */}

    <input
      type="text"
      value={
        demo.backgroundColor ||
        "#FFF200"
      }
      onChange={(e) =>
        updateDemo(
          index,
          "backgroundColor",
          e.target.value
        )
      }
      placeholder="#FFF200"
      className="w-32 rounded-lg border px-3 py-2 font-mono text-sm"
    />

    {/* Preview */}

    <div
      className="h-10 w-10 rounded-lg border shadow-sm"
      style={{
        backgroundColor:
          demo.backgroundColor ||
          "#FFF200",
      }}
      title="Color preview"
    />

  </div>

  <p className="text-xs text-gray-500">
    This color belongs only to this demo section.
  </p>
</div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Order
                          </label>

                          <input
                            type="number"
                            value={
                              demo.order
                            }
                            onChange={(e) =>
                              updateDemo(
                                index,
                                "order",
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>

                        <div className="flex items-end">
                          <label className="flex items-center gap-2 pb-2 text-sm">
                            <input
                              type="checkbox"
                              checked={
                                demo.active
                              }
                              onChange={(e) =>
                                updateDemo(
                                  index,
                                  "active",
                                  e.target
                                    .checked
                                )
                              }
                            />

                            Active
                          </label>
                        </div>
                      </div>

                      {/* Parallax */}

                      <div className="mt-6 border-t pt-5">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">
                              Parallax Images
                            </h3>

                            <p className="text-sm text-gray-500">
                              Images used for
                              decorative
                              parallax effects.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              addDemoParallaxImage(
                                index
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                          >
                            <Plus
                              size={15}
                            />
                            Add Image
                          </button>
                        </div>

                        <div className="space-y-4">
                          {demo.parallaxImages.map(
                            (
                              parallax,
                              imageIndex
                            ) => (
                              <div
                                key={
                                  parallax._id ||
                                  imageIndex
                                }
                                className="rounded-lg border p-4"
                              >
                                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
  <ImageUploader
    label="Parallax Image"
    value={parallax.image}
    folder={`portfolio/${demo.name
      .toLowerCase()
      .replace(/\s+/g, "-")}/parallax`}
    onChange={(url) =>
      updateDemoParallaxImage(
        index,
        imageIndex,
        "image",
        url
      )
    }
  />
</div>

                                  <div>
                                    <label className="mb-1 block text-sm font-medium">
                                      X
                                    </label>

                                    <input
                                      type="number"
                                      value={
                                        parallax.x
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDemoParallaxImage(
                                          index,
                                          imageIndex,
                                          "x",
                                          Number(
                                            e
                                              .target
                                              .value
                                          )
                                        )
                                      }
                                      className="w-full rounded-lg border px-3 py-2"
                                    />
                                  </div>

                                  <div>
                                    <label className="mb-1 block text-sm font-medium">
                                      Y
                                    </label>

                                    <input
                                      type="number"
                                      value={
                                        parallax.y
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDemoParallaxImage(
                                          index,
                                          imageIndex,
                                          "y",
                                          Number(
                                            e
                                              .target
                                              .value
                                          )
                                        )
                                      }
                                      className="w-full rounded-lg border px-3 py-2"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteDemoParallaxImage(
                                      index,
                                      imageIndex
                                    )
                                  }
                                  className="mt-3 inline-flex items-center gap-2 text-sm text-red-600"
                                >
                                  <Trash2
                                    size={
                                      15
                                    }
                                  />
                                  Remove
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* RESPONSIVE SECTION */}
      {/* ================================================================ */}

      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Responsive Section
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the responsive/parallax
              section.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={
                data.responsive.active
              }
              onChange={(e) =>
                updateResponsive(
                  "active",
                  e.target.checked
                )
              }
            />

            Active
          </label>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Section Title
            </label>

            <input
              value={
                data.responsive.title
              }
              onChange={(e) =>
                updateResponsive(
                  "title",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Highlighted Text
            </label>

            <input
              value={
                data.responsive
                  .highlightedText
              }
              onChange={(e) =>
                updateResponsive(
                  "highlightedText",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={
                data.responsive.description
              }
              onChange={(e) =>
                updateResponsive(
                  "description",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Layers */}

        <div className="mt-6 border-t pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                Parallax Layers
              </h3>

              <p className="text-sm text-gray-500">
                Add the background layers for the
                responsive section.
              </p>
            </div>

            <button
              type="button"
              onClick={addResponsiveLayer}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <Plus size={15} />
              Add Layer
            </button>
          </div>

          <div className="space-y-4">
            {data.responsive.layers.map(
              (layer, index) => (
                <div
                  key={
                    layer._id || index
                  }
                  className="rounded-lg border p-4"
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-2">
<ImageUploader
  label={`Layer ${index + 1}`}
  value={layer.image}
  folder="portfolio/responsive"
  onChange={(url) =>
    updateResponsiveLayer(
      index,
      "image",
      url
    )
  }
/>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        X
                      </label>

                      <input
                        type="number"
                        value={layer.x}
                        onChange={(e) =>
                          updateResponsiveLayer(
                            index,
                            "x",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Y
                      </label>

                      <input
                        type="number"
                        value={layer.y}
                        onChange={(e) =>
                          updateResponsiveLayer(
                            index,
                            "y",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteResponsiveLayer(
                        index
                      )
                    }
                    className="mt-3 inline-flex items-center gap-2 text-sm text-red-600"
                  >
                    <Trash2 size={15} />
                    Remove Layer
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURES */}
      {/* ================================================================ */}

      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Features
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the feature cards.
            </p>
          </div>

          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          >
            <Plus size={16} />
            Add Feature
          </button>
        </div>

        <div className="space-y-4">
          {data.features.map(
            (feature, index) => (
              <div
                key={
                  feature._id || index
                }
                className="rounded-lg border p-5"
              >
                <div className="grid gap-4 md:grid-cols-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Icon
                    </label>

                    <input
                      value={feature.icon}
                      onChange={(e) =>
                        updateFeature(
                          index,
                          "icon",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Title
                    </label>

                    <input
                      value={feature.title}
                      onChange={(e) =>
                        updateFeature(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">
                      Description
                    </label>

                    <input
                      value={
                        feature.description
                      }
                      onChange={(e) =>
                        updateFeature(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div className="flex items-end gap-3">
                    <label className="flex flex-1 items-center gap-2 pb-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          feature.active
                        }
                        onChange={(e) =>
                          updateFeature(
                            index,
                            "active",
                            e.target
                              .checked
                          )
                        }
                      />

                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        deleteFeature(
                          index
                        )
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Order
                  </label>

                  <input
                    type="number"
                    value={feature.order}
                    onChange={(e) =>
                      updateFeature(
                        index,
                        "order",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full max-w-xs rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}

      <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Footer
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage footer content.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.footer.active}
              onChange={(e) =>
                updateFooter(
                  "active",
                  e.target.checked
                )
              }
            />

            Active
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Footer Title
            </label>

            <input
              value={data.footer.title}
              onChange={(e) =>
                updateFooter(
                  "title",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Button Text
            </label>

            <input
              value={
                data.footer.buttonText
              }
              onChange={(e) =>
                updateFooter(
                  "buttonText",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Button Link
            </label>

            <input
              value={
                data.footer.buttonLink
              }
              onChange={(e) =>
                updateFooter(
                  "buttonLink",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Buy Text
            </label>

            <input
              value={data.footer.buyText}
              onChange={(e) =>
                updateFooter(
                  "buyText",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Price
            </label>

            <input
              value={data.footer.price}
              onChange={(e) =>
                updateFooter(
                  "price",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Logo URL
            </label>

            <input
              value={data.footer.logo}
              onChange={(e) =>
                updateFooter(
                  "logo",
                  e.target.value
                )
              }
              placeholder="Image URL"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* BOTTOM SAVE */}
      {/* ================================================================ */}

      <div className="flex justify-end pb-8">
        <button
          type="button"
          onClick={savePortfolio}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          <Save size={17} />

          {saving
            ? "Saving..."
            : "Save Portfolio"}
        </button>
      </div>
    </div>
  );
}