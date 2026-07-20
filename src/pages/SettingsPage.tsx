import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/config";
import {
  getSettings,
  updateSettings,
} from "../api/api";
import { useToast } from "../lib/toast";
import { Loader2, Save,  Instagram, Facebook, Youtube, Linkedin, Twitter, MessageCircle,} from "lucide-react";

export default function SettingsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const [socialMedia, setSocialMedia] = useState([
  {
    platform: "",
    url: "",
  },
]);
const [contacts, setContacts] = useState([
  {
    name: "",
    category: "General",
    phone: "",
    email: "",
  },
]);
  const [form, setForm] = useState({
    companyName: "",
    // shortName: "",
    tagline: "",
    // about: "",
    logo: "",

    address: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getSettings();

      setForm({
        companyName: data.companyName || "",
        // shortName: data.shortName || "",
        tagline: data.tagline || "",
        // about: data.about || "",
        logo: data.logo || "",

        address: data.address || "",
      });
      setContacts(data.contacts || []);
      setSocialMedia(data.socialMedia || []);
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
await updateSettings({
  ...form,
    contacts,
  socialMedia,
});
      toast({
        message: "Settings Updated",
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
const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "Instagram":
      return <Instagram className="w-5 h-5 text-pink-600" />;

    case "Facebook":
      return <Facebook className="w-5 h-5 text-blue-600" />;

    case "YouTube":
      return <Youtube className="w-5 h-5 text-red-600" />;

    case "LinkedIn":
      return <Linkedin className="w-5 h-5 text-sky-700" />;

    case "Twitter":
      return <Twitter className="w-5 h-5 text-black" />;

    case "WhatsApp":
      return <MessageCircle className="w-5 h-5 text-green-600" />;

    default:
      return (
        <div className="w-5 h-5 rounded-full bg-stone-200" />
      );
  }
};
  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }
  const uploadLogo = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("image", file);
formData.append("folder", "settings");
  try {

    const { data } = await axios.post(
      `${API_URL}/api/upload`,
      formData
    );

    setForm({
      ...form,
      logo: data.imageUrl,
    });

    toast({
      message: "Logo uploaded",
      type: "success",
    });

  } catch {

    toast({
      message: "Upload failed",
      type: "error",
    });

  }

};
  return (
  <div className="space-y-6 animate-fade-up">

    <div>
      <h1 className="font-display text-3xl font-semibold">
        Settings
      </h1>

      <p className="text-stone-500">
        Manage your website information.
      </p>
    </div>

    <form
      onSubmit={save}
      className="space-y-6"
    >

      {/* Company Information */}

      <div className="card p-6">

        <h2 className="text-lg font-semibold mb-5">
          Company Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="label">
              Company Name
            </label>

            <input
              className="input"
              value={form.companyName}
              onChange={(e) =>
                setForm({
                  ...form,
                  companyName: e.target.value,
                })
              }
            />
          </div>

          {/* <div>
            <label className="label">
              Short Name
            </label>

            <input
              className="input"
              value={form.shortName}
              onChange={(e) =>
                setForm({
                  ...form,
                  shortName: e.target.value,
                })
              }
            />
          </div> */}

          <div className="md:col-span-2">
            <label className="label">
              Tagline
            </label>

            <input
              className="input"
              value={form.tagline}
              onChange={(e) =>
                setForm({
                  ...form,
                  tagline: e.target.value,
                })
              }
            />
          </div>

          {/* <div className="md:col-span-2">
            <label className="label">
              About
            </label>

            <textarea
              rows={4}
              className="input"
              value={form.about}
              onChange={(e) =>
                setForm({
                  ...form,
                  about: e.target.value,
                })
              }
            />
          </div> */}

        </div>

      </div>
            <div className="card p-6">

        <h2 className="text-lg font-semibold mb-5">
          Contact Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="md:col-span-2">
            <label className="label">
              Address
            </label>

            <textarea
              rows={3}
              className="input"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />
          </div>

<div className="card p-6">

  <div className="flex justify-between items-center mb-5">
    <h2 className="text-lg font-semibold">Contacts</h2>

    <button
      type="button"
      className="btn-primary"
      onClick={() =>
        setContacts([
          ...contacts,
          {
            name: "",
            category: "General",
            phone: "",
            email: "",
          },
        ])
      }
    >
      + Add Contact
    </button>
  </div>

  {contacts.map((contact, index) => (
    <div
      key={index}
      className="border rounded-xl p-4 mb-4 grid md:grid-cols-2 gap-4"
    >
      <input
        className="input"
        placeholder="Name"
        value={contact.name}
        onChange={(e) => {
          const arr = [...contacts];
          arr[index].name = e.target.value;
          setContacts(arr);
        }}
      />

      <select
        className="input"
        value={contact.category}
        onChange={(e) => {
          const arr = [...contacts];
          arr[index].category = e.target.value;
          setContacts(arr);
        }}
      >
        <option>General</option>
        <option>Bulk Orders</option>
        <option>Corporate Orders</option>
        <option>Complaints</option>
      </select>

      <input
        className="input"
        placeholder="Phone"
        value={contact.phone}
        onChange={(e) => {
          const arr = [...contacts];
          arr[index].phone = e.target.value;
          setContacts(arr);
        }}
      />

      <input
        className="input"
        placeholder="Email"
        value={contact.email}
        onChange={(e) => {
          const arr = [...contacts];
          arr[index].email = e.target.value;
          setContacts(arr);
        }}
      />

      <div className="md:col-span-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            setContacts(
              contacts.filter((_, i) => i !== index)
            )
          }
        >
          Remove Contact
        </button>
      </div>
    </div>
  ))}
</div>

        </div>

      </div>
            {/* Logo */}

      <div className="card p-6">

        <h2 className="text-lg font-semibold mb-5">
          Logo
        </h2>

<label className="label">
Logo
</label>

<input
    type="file"
    accept="image/*"
    onChange={uploadLogo}
/>

{form.logo && (

<img
    src={form.logo}
    className="w-28 h-28
    rounded-xl
    object-cover
    mt-4"
/>

)}

      </div>

      {/* Social Media */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-5">
    Social Media
  </h2>

  {socialMedia.map((item, index) => (

    <div
      key={index}
 className="grid md:grid-cols-[50px_220px_1fr_auto] gap-4 mb-4 items-center"    >
<div className="flex justify-center">
  {getSocialIcon(item.platform)}
</div>
      <select
        className="input"
        value={item.platform}
        onChange={(e) => {

          const arr = [...socialMedia];

          arr[index].platform = e.target.value;

          setSocialMedia(arr);

        }}
      >

        <option value="">
          Select Platform
        </option>

        <option value="Instagram">
          Instagram
        </option>

        <option value="Facebook">
          Facebook
        </option>

        <option value="YouTube">
          YouTube
        </option>

        <option value="LinkedIn">
          LinkedIn
        </option>

        <option value="Twitter">
          Twitter (X)
        </option>

        <option value="WhatsApp">
          WhatsApp
        </option>

      </select>

      <input
        className="input"
        placeholder="https://..."
        value={item.url}
        onChange={(e) => {

          const arr = [...socialMedia];

          arr[index].url = e.target.value;

          setSocialMedia(arr);

        }}
      />

      <button
        type="button"
        className="btn-secondary"
        onClick={() => {

          const arr = socialMedia.filter(
            (_, i) => i !== index
          );

          setSocialMedia(arr);

        }}
      >

        Remove

      </button>

    </div>

  ))}

  <button
    type="button"
    className="btn-primary mt-3"
    onClick={() =>

      setSocialMedia([
        ...socialMedia,
        {
          platform: "",
          url: "",
        },
      ])

    }
  >

    + Add Social Media

  </button>

</div>
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
              Save Settings
            </>
          )}
        </button>

      </div>
          </form>

  </div>
);
}