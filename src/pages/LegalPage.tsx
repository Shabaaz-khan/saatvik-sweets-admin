import { useEffect, useState } from "react";

import {
  Loader2,
  Save,
} from "lucide-react";

import {
  getLegalPage,
  updateLegalPage,
} from "../api/api";

import { useToast } from "../lib/toast";

export default function LegalPage() {

  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [privacy, setPrivacy] = useState({
    title: "",
    content: "",
  });

  const [terms, setTerms] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {

      const data = await getLegalPage();

      setPrivacy(
        data.privacy || {
          title: "",
          content: "",
        }
      );

      setTerms(
        data.terms || {
          title: "",
          content: "",
        }
      );

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

      await updateLegalPage({

        privacy,

        terms,

      });

      toast({
        message: "Legal Pages Updated",
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
          Legal CMS
        </h1>

        <p className="text-stone-500">
          Manage Privacy Policy & Terms & Conditions
        </p>

      </div>

      <form onSubmit={save} className="space-y-6">

{/* Privacy Policy */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-6">
    Privacy Policy
  </h2>

  <div className="space-y-5">

    <div>

      <label className="label">
        Title
      </label>

      <input
        className="input"
        value={privacy.title}
        onChange={(e) =>
          setPrivacy({
            ...privacy,
            title: e.target.value,
          })
        }
      />

    </div>

    <div>

      <label className="label">
        Content
      </label>

      <textarea
        rows={15}
        className="input"
        value={privacy.content}
        onChange={(e) =>
          setPrivacy({
            ...privacy,
            content: e.target.value,
          })
        }
      />

    </div>

  </div>

</div>

{/* Terms & Conditions */}

<div className="card p-6">

  <h2 className="text-lg font-semibold mb-6">
    Terms & Conditions
  </h2>

  <div className="space-y-5">

    <div>

      <label className="label">
        Title
      </label>

      <input
        className="input"
        value={terms.title}
        onChange={(e) =>
          setTerms({
            ...terms,
            title: e.target.value,
          })
        }
      />

    </div>

    <div>

      <label className="label">
        Content
      </label>

      <textarea
        rows={15}
        className="input"
        value={terms.content}
        onChange={(e) =>
          setTerms({
            ...terms,
            content: e.target.value,
          })
        }
      />

    </div>

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