import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  UserRound,
  Briefcase,
  Images,
  Trophy,
  CalendarDays,
  X,
} from "lucide-react";

import { api } from "../lib/api";

import {
  getCelebrityProfiles,
  createCelebrityProfile,
  updateCelebrityProfile,
  deleteCelebrityProfile,
  getPortfolioPage,
} from "../api/api";

/* =========================================================
   TYPES
========================================================= */

type Work = {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  link: string;
  year: string;
  sortOrder: number;
  isActive: boolean;
};

type Gallery = {
  _id?: string;
  title: string;
  slug: string;
  image: string;
  images: string[];
  category: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

type Award = {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  year: string;
  organization: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

type EventItem = {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  month: string;
  day: string;
  year: string;
  location: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
};

type CelebrityProfile = {
  _id?: string;

  name: string;
  slug: string;

  intro: {
    label: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
    isActive: boolean;
  };

  about: {
    label: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    secondaryImage: string;
    buttonText: string;
    buttonLink: string;
    isActive: boolean;
  };

  works: Work[];
  gallery: Gallery[];
  awards: Award[];
  events: EventItem[];

  sections: {
    intro: boolean;
    about: boolean;
    work: boolean;
    gallery: boolean;
    awards: boolean;
    events: boolean;
  };
};

type PortfolioDemo = {
  _id?: string;
  number: string;
  name: string;

  celebrityProfileId?: string | null;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const emptyWork = (): Work => ({
  title: "",
  slug: "",
  category: "",
  description: "",
  image: "",
  images: [],
  link: "",
  year: "",
  sortOrder: 0,
  isActive: true,
});

const emptyGallery = (): Gallery => ({
  title: "",
  slug: "",
  image: "",
  images: [],
  category: "",
  description: "",
  sortOrder: 0,
  isActive: true,
});

const emptyAward = (): Award => ({
  title: "",
  slug: "",
  description: "",
  year: "",
  organization: "",
  image: "",
  sortOrder: 0,
  isActive: true,
});

const emptyEvent = (): EventItem => ({
  title: "",
  slug: "",
  description: "",
  date: "",
  month: "",
  day: "",
  year: "",
  location: "",
  image: "",
  link: "",
  sortOrder: 0,
  isActive: true,
});

const createEmptyProfile = (): CelebrityProfile => ({
  name: "",
  slug: "",

  intro: {
    label: "",
    title: "",
    subtitle: "",
    description: "",
    image: "",
    backgroundImage: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
  },

  about: {
    label: "",
    title: "",
    subtitle: "",
    description: "",
    image: "",
    secondaryImage: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
  },

  works: [],
  gallery: [],
  awards: [],
  events: [],

  sections: {
    intro: true,
    about: true,
    work: true,
    gallery: true,
    awards: true,
    events: true,
  },
});

/* =========================================================
   UPLOAD
========================================================= */

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  /*
   Your backend should return something similar to:

   {
     success: true,
     data: {
       url: "https://...."
     }
   }

   If your backend returns:
   data.imageUrl
   instead of
   data.url

   change only this line.
  */

  const url =
    response.data?.data?.url ||
    response.data?.url ||
    response.data?.data?.imageUrl ||
    response.data?.imageUrl;

  if (!url) {
    throw new Error("Upload succeeded but image URL was not returned");
  }

  return url;
}

/* =========================================================
   IMAGE UPLOADER
========================================================= */

function ImageUploader({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const url = await uploadImage(file);

      onChange(url);
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border bg-gray-50">
          <img
            src={value}
            alt=""
            className="h-48 w-full object-cover"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-500 hover:bg-gray-100">
          <ImagePlus size={30} className="text-gray-400" />

          <span className="mt-3 text-sm font-medium text-gray-600">
            {uploading ? "Uploading..." : "Upload Image"}
          </span>

          <span className="mt-1 text-xs text-gray-400">
            JPG, PNG, WEBP
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  if (textarea) {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500"
      />
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function CmsSection({
  title,
  icon,
  children,
  open,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-5 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          </div>
        </div>

        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {open && (
        <div className="p-6">
          {children}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function CelebrityProfilePage() {
  const [profiles, setProfiles] = useState<CelebrityProfile[]>([]);
  const [portfolioDemos, setPortfolioDemos] = useState<PortfolioDemo[]>([]);
const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [profile, setProfile] =
    useState<CelebrityProfile>(createEmptyProfile());

  const [isNew, setIsNew] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openSections, setOpenSections] = useState({
    intro: true,
    about: true,
    work: true,
    gallery: true,
    awards: true,
    events: true,
  });

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [celebrityResponse, portfolioResponse] =
        await Promise.all([
          getCelebrityProfiles(),
          getPortfolioPage(),
        ]);

      const celebrityData =
        celebrityResponse?.data ||
        celebrityResponse ||
        [];

      const portfolioData =
        portfolioResponse?.data ||
        portfolioResponse ||
        {};

      setProfiles(
        Array.isArray(celebrityData)
          ? celebrityData
          : []
      );

      setPortfolioDemos(
        Array.isArray(portfolioData?.demos)
          ? portfolioData.demos
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load Celebrity CMS:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     AVAILABLE NAMES
  ======================================================= */

  const availableNames = useMemo(() => {
    return portfolioDemos.filter(
      (demo) => demo.active !== false && demo.name
    );
  }, [portfolioDemos]);

  /* =======================================================
     SELECT EXISTING CELEBRITY
  ======================================================= */

const handleSelectPortfolio = (portfolioId: string) => {
  setSelectedPortfolio(portfolioId);

  if (!portfolioId) {
    setSelectedId("");
    setProfile(createEmptyProfile());
    setIsNew(false);
    return;
  }

  const portfolio = portfolioDemos.find(
    (item) => item._id === portfolioId
  );

  if (!portfolio) {
    console.log(
      "Portfolio not found:",
      portfolioId
    );
    return;
  }

  /*
   * IMPORTANT:
   * Find CelebrityProfile using the stored
   * celebrityProfileId.
   *
   * DO NOT use name or slug for the relationship.
   */
  if (portfolio.celebrityProfileId) {
    const existingProfile = profiles.find(
      (item) =>
        item._id ===
        portfolio.celebrityProfileId
    );

    if (existingProfile) {
      setSelectedId(
        existingProfile._id || ""
      );

      setProfile(
        JSON.parse(
          JSON.stringify(existingProfile)
        )
      );

      setIsNew(false);

      return;
    }
  }

  /*
   * No linked CelebrityProfile yet.
   * Create a new profile using the current
   * Portfolio name.
   */

setSelectedId("");

setProfile({
  ...createEmptyProfile(),
  name: portfolio.name,
  slug: slugify(portfolio.name),
});

setIsNew(true);
};
  /* =======================================================
     ADD NEW CELEBRITY
  ======================================================= */


  /* =======================================================
     SELECT PORTFOLIO NAME FOR NEW PROFILE
  ======================================================= */



  /* =======================================================
     SAVE
  ======================================================= */

const handleSave = async () => {
  if (!profile.name.trim()) {
    alert("Please select a portfolio name");
    return;
  }

  if (!profile._id) {
    alert(
      "Celebrity profile does not exist yet. Please save the Portfolio first."
    );
    return;
  }

  try {
    setSaving(true);

    const payload = {
      ...profile,
      slug: slugify(profile.name),
    };

    const response =
      await updateCelebrityProfile(
        profile._id,
        payload
      );

    const updated =
      response?.data || response;

    setProfiles((prev) =>
      prev.map((item) =>
        item._id === profile._id
          ? updated
          : item
      )
    );

    setProfile(
      JSON.parse(
        JSON.stringify(updated)
      )
    );

    alert(
      "Celebrity profile saved successfully"
    );
  } catch (error) {
    console.error(
      "Save celebrity error:",
      error
    );

    alert(
      "Failed to save celebrity profile"
    );
  } finally {
    setSaving(false);
  }
};
  /* =======================================================
     DELETE
  ======================================================= */

  // const handleDelete = async () => {
  //   if (!profile._id) return;

  //   const confirmed =
  //     window.confirm(
  //       `Delete ${profile.name}?`
  //     );

  //   if (!confirmed) return;

  //   try {
  //     await deleteCelebrityProfile(
  //       profile._id
  //     );

  //     setProfiles((prev) =>
  //       prev.filter(
  //         (item) =>
  //           item._id !==
  //           profile._id
  //       )
  //     );

  //     setSelectedId("");

  //     setProfile(
  //       createEmptyProfile()
  //     );

  //     setIsNew(false);
  //   } catch (error) {
  //     console.error(
  //       "Delete error:",
  //       error
  //     );

  //     alert(
  //       "Failed to delete celebrity"
  //     );
  //   }
  // };

  /* =======================================================
     UPDATE INTRO
  ======================================================= */

  const updateIntro = (
    field: keyof CelebrityProfile["intro"],
    value: string | boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      intro: {
        ...prev.intro,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     UPDATE ABOUT
  ======================================================= */

  const updateAbout = (
    field: keyof CelebrityProfile["about"],
    value: string | boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     WORK
  ======================================================= */

  const addWork = () => {
    setProfile((prev) => ({
      ...prev,
      works: [
        ...prev.works,
        {
          ...emptyWork(),
          sortOrder: prev.works.length + 1,
        },
      ],
    }));
  };

  const updateWork = (
    index: number,
    field: keyof Work,
    value: any
  ) => {
    setProfile((prev) => {
      const works = [...prev.works];

      works[index] = {
        ...works[index],
        [field]: value,
      };

      if (field === "title") {
        works[index].slug =
          slugify(value);
      }

      return {
        ...prev,
        works,
      };
    });
  };

  const removeWork = (
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      works: prev.works.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* =======================================================
     GALLERY
  ======================================================= */

  const addGallery = () => {
    setProfile((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          ...emptyGallery(),
          sortOrder:
            prev.gallery.length + 1,
        },
      ],
    }));
  };

  const updateGallery = (
    index: number,
    field: keyof Gallery,
    value: any
  ) => {
    setProfile((prev) => {
      const gallery = [
        ...prev.gallery,
      ];

      gallery[index] = {
        ...gallery[index],
        [field]: value,
      };

      if (field === "title") {
        gallery[index].slug =
          slugify(value);
      }

      return {
        ...prev,
        gallery,
      };
    });
  };

  const removeGallery = (
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      gallery:
        prev.gallery.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  /* =======================================================
     AWARDS
  ======================================================= */

  const addAward = () => {
    setProfile((prev) => ({
      ...prev,
      awards: [
        ...prev.awards,
        {
          ...emptyAward(),
          sortOrder:
            prev.awards.length + 1,
        },
      ],
    }));
  };

  const updateAward = (
    index: number,
    field: keyof Award,
    value: any
  ) => {
    setProfile((prev) => {
      const awards = [
        ...prev.awards,
      ];

      awards[index] = {
        ...awards[index],
        [field]: value,
      };

      if (field === "title") {
        awards[index].slug =
          slugify(value);
      }

      return {
        ...prev,
        awards,
      };
    });
  };

  const removeAward = (
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      awards:
        prev.awards.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  /* =======================================================
     EVENTS
  ======================================================= */

  const addEvent = () => {
    setProfile((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          ...emptyEvent(),
          sortOrder:
            prev.events.length + 1,
        },
      ],
    }));
  };

  const updateEvent = (
    index: number,
    field: keyof EventItem,
    value: any
  ) => {
    setProfile((prev) => {
      const events = [
        ...prev.events,
      ];

      events[index] = {
        ...events[index],
        [field]: value,
      };

      if (field === "title") {
        events[index].slug =
          slugify(value);
      }

      return {
        ...prev,
        events,
      };
    });
  };

  const removeEvent = (
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      events:
        prev.events.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading Celebrity CMS...
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Celebrity Profiles
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage celebrity portfolio content
            </p>
          </div>

          {/* <button
            type="button"
            onClick={handleAddCelebrity}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Celebrity
          </button> */}
        </div>

        {/* =================================================
            CELEBRITY SELECT
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="grid gap-5 md:grid-cols-2">

{/* <div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Celebrity
  </label>

  <select
    value={selectedId}
    onChange={(e) => handleSelectCelebrity(e.target.value)}
    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
  >
    <option value="">
      {isNew ? "New Celebrity" : "Select Celebrity"}
    </option>

{profiles.map((item) => {
  const portfolio = portfolioDemos.find(
    (demo) => demo.slug === item.slug
  );

  return (
    <option
      key={item._id}
      value={item._id}
    >
      {portfolio?.name || item.name}
    </option>
  );
})}
  </select>
</div> */}

            
<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Select Portfolio Name
  </label>

  <select
    value={selectedPortfolio}
    onChange={(e) =>
      handleSelectPortfolio(e.target.value)
    }
    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
  >
    <option value="">
      Select portfolio name
    </option>

    {availableNames.map((demo) => (
      <option
        key={demo._id || demo.name}
        value={demo._id}
      >
        {demo.name}
      </option>
    ))}
  </select>
</div>
          

          </div>

          {profile.name && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wider text-gray-400">
                Selected Celebrity
              </div>

              <div className="mt-1 font-semibold text-gray-900">
                {profile.name}
              </div>

              <div className="mt-1 text-xs text-gray-500">
                Slug: {profile.slug}
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!profile.name && !isNew ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <UserRound
              size={42}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Select a celebrity
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select an existing celebrity or click
              Add Celebrity to create a new profile.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* =============================================
                INTRO
            ============================================= */}

            <CmsSection
              title="01. Intro"
              icon={<UserRound size={19} />}
              open={openSections.intro}
              onToggle={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  intro: !prev.intro,
                }))
              }
            >
              <div className="grid gap-6 lg:grid-cols-2">

                <Input
                  label="Label"
                  value={
                    profile.intro.label
                  }
                  onChange={(value) =>
                    updateIntro(
                      "label",
                      value
                    )
                  }
                />

                <Input
                  label="Title"
                  value={
                    profile.intro.title
                  }
                  onChange={(value) =>
                    updateIntro(
                      "title",
                      value
                    )
                  }
                />

                <div className="lg:col-span-2">
                  <Input
                    label="Description"
                    textarea
                    value={
                      profile.intro
                        .description
                    }
                    onChange={(value) =>
                      updateIntro(
                        "description",
                        value
                      )
                    }
                  />
                </div>

                <ImageUploader
                  label="Main Image"
                  value={
                    profile.intro.image
                  }
                  onChange={(url) =>
                    updateIntro(
                      "image",
                      url
                    )
                  }
                />

                <ImageUploader
                  label="Background Image"
                  value={
                    profile.intro
                      .backgroundImage
                  }
                  onChange={(url) =>
                    updateIntro(
                      "backgroundImage",
                      url
                    )
                  }
                />

              </div>
            </CmsSection>

            {/* =============================================
                ABOUT
            ============================================= */}

            <CmsSection
              title="02. About"
              icon={<UserRound size={19} />}
              open={openSections.about}
              onToggle={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  about: !prev.about,
                }))
              }
            >
              <div className="grid gap-6 lg:grid-cols-2">

                <Input
                  label="Label"
                  value={
                    profile.about.label
                  }
                  onChange={(value) =>
                    updateAbout(
                      "label",
                      value
                    )
                  }
                />

                <Input
                  label="Title"
                  value={
                    profile.about.title
                  }
                  onChange={(value) =>
                    updateAbout(
                      "title",
                      value
                    )
                  }
                />

                <div className="lg:col-span-2">
                  <Input
                    label="Description"
                    textarea
                    value={
                      profile.about
                        .description
                    }
                    onChange={(value) =>
                      updateAbout(
                        "description",
                        value
                      )
                    }
                  />
                </div>

                <ImageUploader
                  label="About Image"
                  value={
                    profile.about.image
                  }
                  onChange={(url) =>
                    updateAbout(
                      "image",
                      url
                    )
                  }
                />

              </div>
            </CmsSection>

            {/* =============================================
                WORK
            ============================================= */}

            <CmsSection
              title="03. Work"
              icon={<Briefcase size={19} />}
              open={openSections.work}
              onToggle={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  work: !prev.work,
                }))
              }
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={addWork}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus size={17} />
                  Add Work
                </button>
              </div>

              <div className="space-y-6">

                {profile.works.map(
                  (work, index) => (
                    <div
                      key={
                        work._id ||
                        `work-${index}`
                      }
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Work {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeWork(
                              index
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">

                        <Input
                          label="Title"
                          value={
                            work.title
                          }
                          onChange={(value) =>
                            updateWork(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <Input
                          label="Category"
                          value={
                            work.category
                          }
                          onChange={(value) =>
                            updateWork(
                              index,
                              "category",
                              value
                            )
                          }
                        />

                        <Input
                          label="Year"
                          value={
                            work.year
                          }
                          onChange={(value) =>
                            updateWork(
                              index,
                              "year",
                              value
                            )
                          }
                        />

                        <Input
                          label="Description"
                          value={
                            work.description
                          }
                          onChange={(value) =>
                            updateWork(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        <div className="lg:col-span-2">
                          <ImageUploader
                            label="Work Image"
                            value={
                              work.image
                            }
                            onChange={(url) =>
                              updateWork(
                                index,
                                "image",
                                url
                              )
                            }
                          />
                        </div>

                      </div>
                    </div>
                  )
                )}

                {profile.works.length ===
                  0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
                    No work added yet.
                  </div>
                )}

              </div>
            </CmsSection>

            {/* =============================================
                GALLERY
            ============================================= */}

            <CmsSection
              title="04. Gallery"
              icon={<Images size={19} />}
              open={openSections.gallery}
              onToggle={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  gallery:
                    !prev.gallery,
                }))
              }
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={addGallery}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus size={17} />
                  Add Gallery Image
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {profile.gallery.map(
                  (item, index) => (
                    <div
                      key={
                        item._id ||
                        `gallery-${index}`
                      }
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-semibold">
                          Gallery {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeGallery(
                              index
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="space-y-5">

                        <Input
                          label="Title"
                          value={
                            item.title
                          }
                          onChange={(value) =>
                            updateGallery(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <ImageUploader
                          label="Gallery Image"
                          value={
                            item.image
                          }
                          onChange={(url) =>
                            updateGallery(
                              index,
                              "image",
                              url
                            )
                          }
                        />

                      </div>
                    </div>
                  )
                )}

              </div>

              {profile.gallery.length ===
                0 && (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
                  No gallery images added yet.
                </div>
              )}
            </CmsSection>

            {/* =============================================
                AWARDS
            ============================================= */}

            <CmsSection
              title="05. Awards"
              icon={<Trophy size={19} />}
              open={openSections.awards}
              onToggle={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  awards:
                    !prev.awards,
                }))
              }
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={addAward}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus size={17} />
                  Add Award
                </button>
              </div>

              <div className="space-y-6">

                {profile.awards.map(
                  (award, index) => (
                    <div
                      key={
                        award._id ||
                        `award-${index}`
                      }
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-semibold">
                          Award {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeAward(
                              index
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">

                        <Input
                          label="Title"
                          value={
                            award.title
                          }
                          onChange={(value) =>
                            updateAward(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <Input
                          label="Year"
                          value={
                            award.year
                          }
                          onChange={(value) =>
                            updateAward(
                              index,
                              "year",
                              value
                            )
                          }
                        />

                        <Input
                          label="Organization"
                          value={
                            award.organization
                          }
                          onChange={(value) =>
                            updateAward(
                              index,
                              "organization",
                              value
                            )
                          }
                        />

                        <Input
                          label="Description"
                          value={
                            award.description
                          }
                          onChange={(value) =>
                            updateAward(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        <div className="lg:col-span-2">
                          <ImageUploader
                            label="Award Image"
                            value={
                              award.image
                            }
                            onChange={(url) =>
                              updateAward(
                                index,
                                "image",
                                url
                              )
                            }
                          />
                        </div>

                      </div>
                    </div>
                  )
                )}

              </div>

              {profile.awards.length ===
                0 && (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
                  No awards added yet.
                </div>
              )}
            </CmsSection>

            {/* =============================================
                EVENTS
            ============================================= */}

            <CmsSection
              title="06. Events"
              icon={<CalendarDays size={19} />}
              open={openSections.events}
              onToggle={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  events:
                    !prev.events,
                }))
              }
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={addEvent}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus size={17} />
                  Add Event
                </button>
              </div>

              <div className="space-y-6">

                {profile.events.map(
                  (event, index) => (
                    <div
                      key={
                        event._id ||
                        `event-${index}`
                      }
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-semibold">
                          Event {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeEvent(
                              index
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">

                        <Input
                          label="Title"
                          value={
                            event.title
                          }
                          onChange={(value) =>
                            updateEvent(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <Input
                          label="Date"
                          value={
                            event.date
                          }
                          onChange={(value) =>
                            updateEvent(
                              index,
                              "date",
                              value
                            )
                          }
                        />

                        <Input
                          label="Location"
                          value={
                            event.location
                          }
                          onChange={(value) =>
                            updateEvent(
                              index,
                              "location",
                              value
                            )
                          }
                        />

                        <Input
                          label="Description"
                          value={
                            event.description
                          }
                          onChange={(value) =>
                            updateEvent(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        <div className="lg:col-span-2">
                          <ImageUploader
                            label="Event Image"
                            value={
                              event.image
                            }
                            onChange={(url) =>
                              updateEvent(
                                index,
                                "image",
                                url
                              )
                            }
                          />
                        </div>

                      </div>
                    </div>
                  )
                )}

              </div>

              {profile.events.length ===
                0 && (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
                  No events added yet.
                </div>
              )}
            </CmsSection>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <div className="sticky bottom-5 z-50 flex flex-col justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center">

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {profile.name ||
                    "New Celebrity"}
                </p>

                <p className="text-xs text-gray-500">
                  /celebrity/
                  {profile.slug ||
                    "slug"}
                </p>
              </div>

              <div className="flex gap-3">

                {/* {!isNew &&
                  profile._id && (
                    <button
                      type="button"
                      onClick={
                        handleDelete
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2
                        size={17}
                      />
                      Delete
                    </button>
                  )} */}

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : isNew
                      ? "Create Celebrity"
                      : "Save Changes"}
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}