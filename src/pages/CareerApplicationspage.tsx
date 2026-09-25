import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/config";
import CareerApplicationModal from "./CareerApplicationModal";
import { useToast } from "../lib/toast";
import { Eye, EyeIcon, Trash2 } from "lucide-react";
type Application = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  career: {
    title: string;
  };
};

export default function CareerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
const toast = useToast();
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/career-applications`
      );

      setApplications(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const filteredApplications = applications.filter((item) => {

  const keyword = search.toLowerCase();

  return (
    item.fullName.toLowerCase().includes(keyword) ||
    item.email.toLowerCase().includes(keyword) ||
    item.career?.title.toLowerCase().includes(keyword)
  );

});
  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

 <div className="flex items-center justify-between">

  <h1 className="text-3xl font-bold">
    Career Applications
  </h1>

  <input
    type="text"
    placeholder="Search candidate..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-72 rounded-lg border border-stone-300 px-4 py-2"
  />

</div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-stone-100">

            <tr>

              <th className="p-4 text-left">
                Candidate
              </th>

              <th className="p-4 text-left">
                Position
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Applied On
              </th>
<th className="p-4 text-center">
  Actions
</th>
            </tr>

          </thead>

          <tbody>

            {filteredApplications.map((item) => (

              <tr
                key={item._id}
                className="border-t"
              >

                <td className="p-4">
                  {item.fullName}
                </td>

                <td className="p-4">
                  {item.career?.title}
                </td>

                <td className="p-4">
                  {item.email}
                </td>

                <td className="p-4">
                  {item.phone}
                </td>

       <td className="p-4">

  <select
    value={item.status}
    onChange={async (e) => {
      try {
        const { data } = await axios.put(
          `${API_URL}/api/career-applications/${item._id}`,
          {
            status: e.target.value,
          }
        );

        setApplications((prev) =>
          prev.map((app) =>
            app._id === item._id ? data : app
          )
        );
      } catch (err) {
        console.log(err);
      }
    }}
    className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
  >
    <option value="Pending">Pending</option>
    <option value="Interview">Interview</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Selected">Selected</option>
    <option value="Rejected">Rejected</option>
  </select>

</td>

                <td className="p-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
<td className="p-4 text-center">

<div className="flex items-center justify-center gap-2">

<button
  onClick={() => {
    setSelectedApplication(item);
    setOpenModal(true);
  }}
  className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700"
>
  <EyeIcon className="h-5 w-5 text-white" />
</button>

<button
  onClick={async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/career-applications/${item._id}`
      );

      setApplications((prev) =>
        prev.filter(
          (app) => app._id !== item._id
        )
      );

    toast({
  type: "success",
  message: "Application deleted successfully!",
});
    } catch (err) {
      console.log(err);

      toast({
  type: "error",
  message: "Failed to delete application.",
});
    }
  }}
    className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
>
  <Trash2 size={18} />
</button>

</div>

</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>
<CareerApplicationModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  application={selectedApplication}
/>
    </div>
  );
}