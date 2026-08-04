import { useEffect, useState } from "react";
import {
  getAboutPage,
  updateAboutPage,
} from "../api/api";
import { useToast } from "../lib/toast";
import {
  Loader2,
  Save,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../lib/config";
export default function AboutCmsPage() {

  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    videoUrl: "",
 videoFile: "",
    quote: "",
    story1: "",
    story2: "",
    team: [
  {
    name: "",
    designation: "",
    image: "",
    description: "",
  },
],
  });

  const [timeline, setTimeline] = useState([
    {
      year: "",
      title: "",
      body: "",
    },
  ]);
const uploadVideo = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("image", file); 
  formData.append("folder", "about");

  try {
    const { data } = await axios.post(
      `${API_URL}/api/upload`,
      formData
    );
console.log(data);
setForm((prev) => {
  const updated = {
    ...prev,
    videoFile: data.imageUrl,
  };

  console.log(updated);

  return updated;
});

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
const removeVideo = async () => {
  try {
    await axios.delete(`${API_URL}/api/upload`, {
      data: {
        imageUrl: form.videoFile,
      },
    });

    setForm((prev) => ({
      ...prev,
      videoFile: "",
    }));

    toast({
      message: "Video removed",
      type: "success",
    });
  } catch (err: any) {
    toast({
      message: err.response?.data?.message || "Failed to remove video",
      type: "error",
    });
  }
};
  useEffect(() => {
    load();
  }, []);

  async function load() {

    try {

      const data = await getAboutPage();

      setForm({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        videoUrl: data.videoUrl || "",
 videoFile: data.videoFile || "",
        quote: data.quote || "",
        story1: data.story1 || "",
        story2: data.story2 || "",
team: data.team || [],
      });

      setTimeline(data.timeline || []);

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

      await updateAboutPage({
        ...form,
        timeline,
      });

      toast({
        message: "About Page Updated",
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
const uploadTeamImage = async (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", "about");

  try {
    const { data } = await axios.post(
      `${API_URL}/api/upload`,
      formData
    );

    const team = [...form.team];

    team[index].image = data.imageUrl;

    setForm({
      ...form,
      team,
    });

    toast({
      message: "Image uploaded",
      type: "success",
    });

  } catch {
    toast({
      message: "Upload failed",
      type: "error",
    });
  }
};
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
          About CMS
        </h1>

        <p className="text-stone-500">
          Manage About Page
        </p>

      </div>

      <form
        onSubmit={save}
        className="space-y-6"
      >

        <div className="card p-6">

          <h2 className="text-lg font-semibold mb-5">
            Hero Section
          </h2>

          <div className="space-y-5">

            <div>

              <label className="label">
                Eyebrow
              </label>

              <input
                className="input"
                value={form.eyebrow}
                onChange={(e) =>
                  setForm({
                    ...form,
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
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="label">
                Subtitle
              </label>

              <textarea
                rows={4}
                className="input"
                value={form.subtitle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subtitle: e.target.value,
                  })
                }
              />

            </div>

          </div>

        </div>

        <div className="card p-6">

          <h2 className="text-lg font-semibold mb-5">
            About Video
          </h2>

          <label className="label">
           YouTube Video URL
          </label>

          <input
            className="input"
            value={form.videoUrl}
            onChange={(e) =>
              setForm({
                ...form,
                videoUrl: e.target.value,
              })
            }
            
          />
<label className="label">
  Upload MP4 Video
</label>

<input
  type="file"
  accept="video/mp4"
  onChange={uploadVideo}
/>

       {form.videoFile && (
  <>
    <video
      src={form.videoFile}
      controls
      className="mt-4 rounded-xl w-full max-w-xl"
    />

    <button
      type="button"
      className="btn-secondary mt-3"
      onClick={removeVideo}
    >
      Remove Video
    </button>
  </>
)}
        </div>

        <div className="card p-6">

          <h2 className="text-lg font-semibold mb-5">
            Story Content
          </h2>

          <div className="space-y-5">

            <div>

              <label className="label">
                Quote
              </label>

              <textarea
                rows={2}
                className="input"
                value={form.quote}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quote: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="label">
                Story Paragraph 1
              </label>

              <textarea
                rows={5}
                className="input"
                value={form.story1}
                onChange={(e) =>
                  setForm({
                    ...form,
                    story1: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="label">
                Story Paragraph 2
              </label>

              <textarea
                rows={5}
                className="input"
                value={form.story2}
                onChange={(e) =>
                  setForm({
                    ...form,
                    story2: e.target.value,
                  })
                }
              />

            </div>

          </div>

        </div>
                <div className="card p-6">

          <h2 className="text-lg font-semibold mb-5">
            Timeline
          </h2>

          {timeline.map((item, index) => (

            <div
              key={index}
              className="border rounded-xl p-5 mb-5 space-y-4"
            >

              <input
                className="input"
                placeholder="Year"
                value={item.year}
                onChange={(e) => {
                  const arr = [...timeline];
                  arr[index].year = e.target.value;
                  setTimeline(arr);
                }}
              />

              <input
                className="input"
                placeholder="Title"
                value={item.title}
                onChange={(e) => {
                  const arr = [...timeline];
                  arr[index].title = e.target.value;
                  setTimeline(arr);
                }}
              />

              <textarea
                rows={3}
                className="input"
                placeholder="Description"
                value={item.body}
                onChange={(e) => {
                  const arr = [...timeline];
                  arr[index].body = e.target.value;
                  setTimeline(arr);
                }}
              />

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setTimeline(
                    timeline.filter((_, i) => i !== index)
                  );
                }}
              >
                Remove
              </button>

            </div>

          ))}

          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              setTimeline([
                ...timeline,
                {
                  year: "",
                  title: "",
                  body: "",
                },
              ])
            }
          >
            + Add Timeline
          </button>

        </div>
{/* Team Members */}
{/* Team Members */}
<div className="card p-6">
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-lg font-semibold">
      Founders & Team Members
    </h2>

    <button
      type="button"
      className="btn-primary"
      onClick={() =>
        setForm({
          ...form,
          team: [
            ...(form.team || []),
            {
              name: "",
              designation: "",
              image: "",
              description: "",
            },
          ],
        })
      }
    >
      + Add Member
    </button>
  </div>

  {(form.team || []).length === 0 && (
    <div className="text-center py-8 text-stone-500 border rounded-xl">
      No team members added.
    </div>
  )}

  <div className="space-y-6">
    {(form.team || []).map((member: any, index: number) => (
      <div
        key={index}
        className="border rounded-xl p-5 bg-stone-50"
      >
        <div className="grid md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <label className="label">
              Name
            </label>

            <input
              className="input"
              value={member.name}
              onChange={(e) => {
                const team = [...form.team];
                team[index].name = e.target.value;
                setForm({
                  ...form,
                  team,
                });
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
              value={member.designation}
              onChange={(e) => {
                const team = [...form.team];
                team[index].designation = e.target.value;
                setForm({
                  ...form,
                  team,
                });
              }}
            />
          </div>

        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="label">
            Description
          </label>

          <textarea
            rows={4}
            className="input"
            value={member.description}
            onChange={(e) => {
              const team = [...form.team];
              team[index].description = e.target.value;
              setForm({
                ...form,
                team,
              });
            }}
          />
        </div>

        {/* Image */}
        <div className="mt-5">
          <label className="label">
            Profile Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              uploadTeamImage(e, index)
            }
          />

          {member.image && (
            <img
              src={member.image}
              alt={member.name}
              className="mt-4 h-32 w-32 rounded-full object-cover border"
            />
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="btn-secondary bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              const team = [...form.team];
              team.splice(index, 1);

              setForm({
                ...form,
                team,
              });
            }}
          >
            Remove Member
          </button>
        </div>
      </div>
    ))}
  </div>
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
                Save About Page
              </>
            )}

          </button>

        </div>

      </form>

    </div>

  );

}