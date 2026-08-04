import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/config";

export default function CareersPage() {
    const [open, setOpen] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
const [career, setCareer] = useState({
  title: "",
  department: "",
  location: "",
  employmentType: "Full Time",
  experience: "",
  salary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  isActive: true,
  sortOrder: 0,
});
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/careers`
      );

      setCareers(data);
    } catch (err) {
      console.log(err);
    }
  };
const saveCareer = async () => {
  try {
if (editingId) {

  await axios.put(
    `${API_URL}/api/careers/${editingId}`,
    {
      ...career,

      responsibilities:
        career.responsibilities
          .split("\n")
          .filter(Boolean),

      requirements:
        career.requirements
          .split("\n")
          .filter(Boolean),

      benefits:
        career.benefits
          .split("\n")
          .filter(Boolean),
    }
  );

} else {

  await axios.post(
    `${API_URL}/api/careers`,
    {
      ...career,

      responsibilities:
        career.responsibilities
          .split("\n")
          .filter(Boolean),

      requirements:
        career.requirements
          .split("\n")
          .filter(Boolean),

      benefits:
        career.benefits
          .split("\n")
          .filter(Boolean),
    }
  );

}

    await loadCareers();

    setOpen(false);
setEditingId(null);
    setCareer({
      title: "",
      department: "",
      location: "",
      employmentType: "Full Time",
      experience: "",
      salary: "",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      isActive: true,
      sortOrder: 0,
    });

  } catch (err) {
    console.log(err);
  }
};
const deleteCareer = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this career?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `${API_URL}/api/careers/${id}`
    );

    loadCareers();
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          Careers
        </h1>

      <button
  className="btn-primary"
  onClick={() => setOpen(true)}
>
  + Add Career
</button>

      </div>

      <div className="rounded-xl bg-white p-6 shadow">

        {careers.length === 0 ? (

          <div className="py-12 text-center text-stone-500">

            No Careers Found

          </div>

        ) : (

          <div className="space-y-4">

            {careers.map((career: any) => (

              <div
                key={career._id}
                className="flex items-center justify-between rounded-xl border p-5"
              >

                <div>

                  <h2 className="text-lg font-semibold">
                    {career.title}
                  </h2>

                  <p className="text-sm text-stone-500">

                    {career.department}

                    •

                    {career.location}

                  </p>

                </div>

                <div className="flex gap-3">

            <button
  className="btn-secondary"
  onClick={() => {
    setEditingId(career._id);

    setCareer({
      title: career.title,
      department: career.department,
      location: career.location,
      employmentType: career.employmentType,
      experience: career.experience,
      salary: career.salary,
      description: career.description,

      responsibilities:
        career.responsibilities.join("\n"),

      requirements:
        career.requirements.join("\n"),

      benefits:
        career.benefits.join("\n"),

      isActive: career.isActive,

      sortOrder: career.sortOrder,
    });

    setOpen(true);
  }}
>
  Edit
</button>

             <button
  onClick={() => deleteCareer(career._id)}
  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
  Delete
</button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
{open && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

  <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Add Career
        </h2>

        <button
          onClick={() => setOpen(false)}
          className="text-2xl"
        >
          ×
        </button>

      </div>

    <div className="grid gap-5">

  <div className="grid md:grid-cols-2 gap-5">

    <div>

      <label className="label">
        Job Title
      </label>

      <input
        className="input"
        value={career.title}
        onChange={(e) =>
          setCareer({
            ...career,
            title: e.target.value,
          })
        }
      />

    </div>

    <div>

      <label className="label">
        Department
      </label>

      <input
        className="input"
        value={career.department}
        onChange={(e) =>
          setCareer({
            ...career,
            department: e.target.value,
          })
        }
      />

    </div>

  </div>

  <div className="grid md:grid-cols-2 gap-5">

    <div>

      <label className="label">
        Location
      </label>

      <input
        className="input"
        value={career.location}
        onChange={(e) =>
          setCareer({
            ...career,
            location: e.target.value,
          })
        }
      />

    </div>

    <div>

      <label className="label">
        Employment Type
      </label>

      <select
        className="input"
        value={career.employmentType}
        onChange={(e) =>
          setCareer({
            ...career,
            employmentType: e.target.value,
          })
        }
      >

        <option>
          Full Time
        </option>

        <option>
          Part Time
        </option>

        <option>
          Internship
        </option>

        <option>
          Contract
        </option>

      </select>

    </div>

  </div>

  <div className="grid md:grid-cols-2 gap-5">

    <div>

      <label className="label">
        Experience
      </label>

      <input
        className="input"
        placeholder="2+ Years"
        value={career.experience}
        onChange={(e) =>
          setCareer({
            ...career,
            experience: e.target.value,
          })
        }
      />

    </div>

    <div>

      <label className="label">
        Salary
      </label>

      <input
        className="input"
        placeholder="₹6 LPA"
        value={career.salary}
        onChange={(e) =>
          setCareer({
            ...career,
            salary: e.target.value,
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
    value={career.description}
    onChange={(e) =>
      setCareer({
        ...career,
        description: e.target.value,
      })
    }
  />

</div>

<div>

  <label className="label">
    Responsibilities
  </label>

  <textarea
    rows={4}
    className="input"
    placeholder="One responsibility per line"
    value={career.responsibilities}
    onChange={(e) =>
      setCareer({
        ...career,
        responsibilities: e.target.value,
      })
    }
  />

</div>

<div>

  <label className="label">
    Requirements
  </label>

  <textarea
    rows={4}
    className="input"
    placeholder="One requirement per line"
    value={career.requirements}
    onChange={(e) =>
      setCareer({
        ...career,
        requirements: e.target.value,
      })
    }
  />

</div>

<div>

  <label className="label">
    Benefits
  </label>

  <textarea
    rows={4}
    className="input"
    placeholder="One benefit per line"
    value={career.benefits}
    onChange={(e) =>
      setCareer({
        ...career,
        benefits: e.target.value,
      })
    }
  />

</div>

<div className="grid md:grid-cols-2 gap-5">

  <div>

    <label className="label">
      Sort Order
    </label>

    <input
      type="number"
      className="input"
      value={career.sortOrder}
      onChange={(e) =>
        setCareer({
          ...career,
          sortOrder: Number(e.target.value),
        })
      }
    />

  </div>

  <div className="flex items-center gap-3 pt-8">

    <input
      type="checkbox"
      checked={career.isActive}
      onChange={(e) =>
        setCareer({
          ...career,
          isActive: e.target.checked,
        })
      }
    />

    <span>
      Active Job
    </span>

  </div>

</div>

<div className="flex justify-end gap-4 pt-6">

  <button
    type="button"
    onClick={() => {
  setOpen(false);
  setEditingId(null);
}}
    className="rounded-lg border px-6 py-3"
  >
    Cancel
  </button>

<button
  type="button"
  onClick={saveCareer}
  className="rounded-lg border bg-danger px-6 py-3"
>
  Save Career
</button>

</div>
  </div>

</div>

    </div>

  </div>
  
)}
    </div>
  );
}