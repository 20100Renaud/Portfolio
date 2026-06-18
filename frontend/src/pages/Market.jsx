import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { apiFetch } from "../api";
import { getDefaultLifetime } from "../utils/date";

export default function Market() {
  const [depos, setDepos] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");

  // Load all the Depos
  const loadDepos = async () => {
    const response = await apiFetch("/depos");
    const data = await response.json();

    console.log("API RESPONSE:", data);

    setDepos(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadDepos();
  }, []);

  // Create a new Depo
  const handleCreateDepo = async () => {
    await apiFetch("/depos", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        lifetime,
      }),
    });

    setIsCreateOpen(false);
    setTitle("");
    setDescription("");
    setLifetime("");

    await loadDepos();
  };


  return (
    <div className="relative text-center text-green-900 overflow-hidden justify-center my-10 mx-auto px-4">
      <h1 className="text-3xl sm:text-5xl font-bold">Welcome to the market</h1>
      <p className="text-sm sm:text-lg text-green-800">
        Here we can share what we have or need.
      </p>

      <button
        onClick={() => setIsCreateOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Create Depo
      </button>

      {depos.map((depo) => {
        return (
          <Link key={depo.ID_Depo} to={`/depo/${depo.ID_Depo}`}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 m-4 border border-green-100">
              <h3 className="text-xl font-semibold text-green-900">
                {depo.Title_Depo}
              </h3>

              <p className="text-green-700">{depo.User_Depos?.Login_User}</p>
            </div>
          </Link>
        );
      })}

      <button
        onClick={() => {
          setIsCreateOpen(true);
          setTitle("");
          setDescription("");
          setLifetime(getDefaultLifetime());
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Create Depo
      </button>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create Depo</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 w-full mb-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full mb-2"
        />

        <input
          value={lifetime}
          onChange={(e) => setLifetime(e.target.value)}
          placeholder="Lifetime (optional)"
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={handleCreateDepo}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </Modal>
    </div>
  );
}
