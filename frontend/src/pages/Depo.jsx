import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import Modal from "../components/Modal";
import { getDefaultLifetime } from "../utils/date";

export default function Depo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [depo, setDepo] = useState(null);
  const [user, setUser] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [type, setType] = useState("");
  const [cat, setCat] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");
  const [isDepoModalOpen, setDepoModalOpen] = useState(false);
  const [isAnswerModalOpen, setAnswerModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  // Load the current user
  useEffect(() => {
    apiFetch("/auth/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  // Load the current depo
  const loadDepo = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(`/depos/${id}`);
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Depo not found");
        setDepo(null);
        console.error(err.error);
        return;
      }
      const data = await response.json();

      setDepo(data);
    } catch {
      setError("Failed to load depo");
      setDepo(null);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      loadDepo();
    }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-green-900">Loading...</div>
    );
  }



  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <h2 className="text-2xl text-red-600 font-bold">{error}</h2>

        <button
          onClick={() => navigate("/market")}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Back to Market
        </button>
      </div>
    );
  }

  if (!depo) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">Depo not found</div>
    );
  }

  // Delete the depo
  const handleDeleteDepo = async () => {
    await apiFetch(`/depos/${id}`, {
      method: "DELETE",
    });

    navigate("/market");
  };

  // Update the depo
  const handleUpdateDepo = async () => {
    try {
      const response = await apiFetch(`/depos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          type,
          cat,
          title,
          description,
          lifetime: lifetime || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      await loadDepo();

      setDepoModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  //send a FormData instead of JSON
  //   const formData = new FormData();

  // formData.append("title", title);
  // formData.append("description", description);

  // files.forEach((file) => {
  //   formData.append("images", file);
  // });

  // await fetch("http://localhost:5000/api/depos", {
  //   method: "POST",
  //   credentials: "include",
  //   body: formData,
  // });

  // Create an answer
  const handleCreateAnswer = async () => {
    await apiFetch(`/depos/${id}/answers`, {
      method: "POST",
      body: JSON.stringify({
        description: answerText,
      }),
    });

    setAnswerText("");
    await loadDepo();
  };

  // Delete the answer
  const handleDeleteAnswer = async (answerId) => {
    await apiFetch(`/depos/answers/${answerId}`, {
      method: "DELETE",
    });

    await loadDepo();
  };

  // Update the answer
  const handleUpdateAnswer = async (answerId, newText) => {
    await apiFetch(`/depos/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify({
        description: newText,
      }),
    });

    await loadDepo();
  };

  return (
    <div className="relative text-center text-green-900 overflow-hidden my-10 mx-auto px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          {depo.Title_Depo}
        </h1>
        <h2>{depo.Cat_Depo}</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4 text-green-700 mb-8">
          <p>👤 {depo.User_Depos?.Login_User}</p>

          <p>📅 {new Date(depo.Date_Depo).toLocaleDateString()}</p>
        </div>

        <div className="border-t border-green-100 pt-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>

          <p className="text-lg text-green-800 leading-relaxed">
            {depo.Text_Depo}
          </p>
        </div>
        {(user?.userId === depo.ID_User || user?.role === "ADMIN") && (
          <>
            <button
              onClick={() => {
                setType(depo.Type_Depo);
                setCat(depo.Cat_Depo);
                setTitle(depo.Title_Depo);
                setDescription(depo.Text_Depo);
                setLifetime(
                  depo.Lifetime_Depo
                    ? new Date(depo.Lifetime_Depo).toISOString().split("T")[0]
                    : "",
                );

                setDepoModalOpen(true);
              }}
            >
              Edit Depo
            </button>
            <button
              onClick={handleDeleteDepo}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

      <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-green-100 p-2 mt-4">
        {depo.Answers_Depos?.map((a) => (
          <div
            key={a.ID_Answer}
            className="flex justify-between items-start max-w-3xl mx-auto bg-white border-b border-green-100 p-2 mt-2 w-full"
          >
            <p>{a.Text_Answer}</p>

            <div className="flex flex-col items-end ml-4">
              <p className="flex-1">{a.ID_User}</p>
              {(user?.userId === a.ID_User || user?.role === "ADMIN") && (
                <>
                  <button
                    onClick={() => {
                      setSelectedAnswer(a);
                      setAnswerText(a.Text_Answer);
                      setAnswerModalOpen(true);
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDeleteAnswer(a.ID_Answer)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-green-100 p-2 mt-6 gap-4">
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="flex-1 w-full resize-none rounded-2xl bg-white border border-green-100 p-2"
          placeholder="Write an answer..."
        />

        <div>
          <button
            onClick={handleCreateAnswer}
            className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap"
          >
            Send answer
          </button>
        </div>
      </div>

      <Modal open={isDepoModalOpen} onClose={() => setDepoModalOpen(false)}>
        <h2>Edit Depo</h2>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="OFFER">Offer</option>
          <option value="REQUEST">Request</option>
        </select>

        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="Undefined">Choose a category</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Plants">Plants</option>
          <option value="Organic matter">Organic matter</option>
          <option value="Tools">Tools</option>
          <option value="Services">Services</option>
        </select>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />

        <textarea
          value={description}
          className="flex-1 w-full resize-none rounded-2xl bg-white border border-green-100 p-2"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <input
          type="date"
          value={lifetime}
          onChange={(e) => setLifetime(e.target.value)}
        />

        <button
          onClick={handleUpdateDepo}
          className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Save
        </button>
      </Modal>

      <Modal open={isAnswerModalOpen} onClose={() => setAnswerModalOpen(false)}>
        <h2>Edit Answer</h2>

        <textarea
          value={answerText}
          className="flex-1 w-full resize-none rounded-2xl bg-white border border-green-100 p-2"
          onChange={(e) => setAnswerText(e.target.value)}
        />

        <button
          onClick={() => {
            handleUpdateAnswer(selectedAnswer.ID_Answer, answerText);
            setAnswerModalOpen(false);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Save
        </button>

        {error && <div className="text-red-500">{error}</div>}
      </Modal>
    </div>
  );
}
