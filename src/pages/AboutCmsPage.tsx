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

export default function AboutCmsPage() {

  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    videoUrl: "",

    quote: "",
    story1: "",
    story2: "",
  });

  const [timeline, setTimeline] = useState([
    {
      year: "",
      title: "",
      body: "",
    },
  ]);

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

        quote: data.quote || "",
        story1: data.story1 || "",
        story2: data.story2 || "",
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