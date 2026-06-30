import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import PublicDepoCard from "../components/DepoCards/PublicDepoCard";
import CustomButton from "../components/CustomButton";
import CustomSelect from "../components/CustomSelect";
import ValidationCheck from "../components/ValidationCheck";
import { TYPES_DEPOS, getCategoryOptions } from "../config/deposConfig";
import {
  VALIDATION,
  validateMin,
  validateMax,
  isValidLength,
} from "../config/deposValidation";

export default function Depo() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const editTextareaRef = useRef(null);
  const [isAnswerModalOpen, setAnswerModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [answerTouched, setAnswerTouched] = useState(false);
  const [editAnswerError, setEditAnswerError] = useState("");
  const [editAnswerTouched, setEditAnswerTouched] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [cat, setCat] = useState("");

  const [isDepoModalOpen, setDepoModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");
  const [depo, setDepo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  // Navigate back
  const handleBack = () => navigate(-1);

  // Define error on typing
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  // Define error out of focus
  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  // Navigate from dahboard card to modal
  useEffect(() => {
    if (searchParams.get("edit") !== "true" || !depo) return;

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
    const cleanParams = new URLSearchParams(searchParams);
    cleanParams.delete("edit");

    navigate(
      {
        pathname: `/depo_details/${id}`,
        search: cleanParams.toString(),
      },
      { replace: true },
    );
  }, [searchParams, depo, id, navigate]);

  // Srool to the top when changing page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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

      console.log("[DATA FRONT]", data);
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
          onClick={() => navigate(`/depo_details/${depo.ID_Depo}`)}
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

    navigate(`/depo_details/${depo.ID_Depo}?edit=true`);
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

  // Validation on update the depo
  const isDepoFormValid =
    type &&
    cat &&
    isValidLength(title, VALIDATION.depo.title) &&
    isValidLength(description, VALIDATION.depo.description);

  // send a FormData instead of JSON
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
    setAnswerError("");
    setAnswerTouched(false);
    await loadDepo();
  };

  // Auto-size answer textarea when typing
  const autoResize = (e) => {
    const maxHeight = 320;

    e.target.style.height = "auto";

    if (e.target.scrollHeight > maxHeight) {
      e.target.style.height = `${maxHeight}px`;
      e.target.style.overflowY = "auto";
    } else {
      e.target.style.height = `${e.target.scrollHeight}px`;
      e.target.style.overflowY = "hidden";
    }
  };

  // Delete the answer
  const handleDeleteAnswer = async (answerId) => {
    await apiFetch(`/depos/answers/${answerId}`, {
      method: "DELETE",
    });

    await loadDepo();
  };

  // Update Edit answer
  const handleUpdateAnswer = async (answerId, newText) => {
    if (!isValidLength(newText, VALIDATION.answer.description)) return;

    await apiFetch(`/depos/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify({
        description: newText,
      }),
    });

    await loadDepo();
  };

  // Handle Save btn (Edit answer)
  const handleSaveEditedAnswer = async () => {
    await handleUpdateAnswer(selectedAnswer.ID_Answer, editAnswerText);

    setEditAnswerText("");
    setEditAnswerError("");
    setEditAnswerTouched(false);
    setAnswerModalOpen(false);
  };

  // Date formating
  const formatDate = (date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(date));

  return (
    <div className="relative text-center text-green-900 overflow-hidden my-10 mx-auto px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        {/* Go back arrow*/}
        <div className="max-w-3xl mx-auto mb-4">
          <CustomButton variant="small_green" onClick={handleBack} className="">
            ← Back
          </CustomButton>
        </div>

        {/* HEADER (depo details) */}
        <PublicDepoCard
          depo={depo}
          formatDate={(date) =>
            new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date(date))
          }
          isDetail
        />

        {/* Btns Edit/delet if user or admin */}
        <div className="flex justify-center gap-4">
          {(user?.userId === depo.ID_User || user?.role === "ADMIN") && (
            <>
              <CustomButton
                variant="big_white"
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
              </CustomButton>

              <CustomButton
                variant="big_red"
                onClick={() => setDeleteOpen(true)}
              >
                Delete Depo
              </CustomButton>
            </>
          )}
        </div>
      </div>

      {/* Answers list */}
      {depo.Answers_Depos?.length > 0 ? (
        <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-green-100 p-2 mt-4">
          {depo.Answers_Depos?.map((a) => (
            <div
              key={a.ID_Answer}
              className="max-w-3xl mx-auto bg-white border-b border-green-100 p-2 mt-2 w-full"
            >
              <div className="flex text-right gap-2 justify-between my-4">
                {/* user + city + date */}
                <span className="text-xs text-green-900 my-auto">
                  {a.User_Answers?.Login_User} - {a.User_Answers?.City_User} -{" "}
                  {formatDate(a.Date_Answer)}
                </span>

                <div className="flex justify-end gap-2">
                  {(user?.userId === a.ID_User || user?.role === "ADMIN") && (
                    <>
                      <CustomButton
                        variant="small_white"
                        onClick={() => {
                          setSelectedAnswer(a);
                          setEditAnswerText(a.Text_Answer);
                          setEditAnswerError("");
                          setEditAnswerTouched(false);
                          setAnswerModalOpen(true);
                          setTimeout(() => {
                            if (isAnswerModalOpen && editTextareaRef.current) {
                              const el = editTextareaRef.current;
                              el.style.height = "auto";
                              el.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 320)}px`;
                            }
                          }, [isAnswerModalOpen, editAnswerText]);
                        }}
                      >
                        Edit
                      </CustomButton>

                      <CustomButton
                        variant="small_red"
                        onClick={() => handleDeleteAnswer(a.ID_Answer)}
                      >
                        Delete
                      </CustomButton>
                    </>
                  )}
                </div>
              </div>
              {/* Answer text */}
              <p className="text-left">{a.Text_Answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto text-sm text-green-700 mt-4  rounded-2xl bg-white border border-green-100 p-2 mt-6">
          No answers yet, be the first to respond.
        </div>
      )}

      {/* Write an answer */}
      <div
        className="max-w-3xl mx-auto rounded-2xl bg-white border border-green-100 p-6 m-6 gap-4 bg-gradient-to-b
          from-white from-[0%] to-[#a5d6a7] space-y-6"
      >
        <h2 className="text-2xl font-bold">Write an answer</h2>

        <div className="relative">
          <textarea
            placeholder="Answer (255 chars max)"
            value={answerText}
            onChange={(e) => {
              const value = e.target.value;
              setAnswerText(value);
              setAnswerError(validateMax(value, VALIDATION.answer.description));
              autoResize(e);
            }}
            onBlur={() => {
              setAnswerTouched(true);
              setAnswerError(
                validateMin(answerText, VALIDATION.answer.description),
              );
            }}
            className={`border p-2 w-full rounded-2xl resize-none shadow outline-none transition min-h-64 sm:min-h-28
              ${
                answerError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-green-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
              }`}
          />
          {!answerError &&
            isValidLength(answerText, VALIDATION.answer.description) && (
              <ValidationCheck />
            )}

          {answerTouched && answerError && (
            <p className="absolute text-xs text-red-600 ml-3 ">{answerError}</p>
          )}
        </div>
        <CustomButton
          variant="big_green"
          disabled={!isValidLength(answerText, VALIDATION.answer.description)}
          onClick={handleCreateAnswer}
        >
          Send answer
        </CustomButton>
      </div>

      {/* Edit depo modal */}
      <Modal open={isDepoModalOpen} onClose={() => setDepoModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Edit Deposit</h2>

          {/* Type */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <CustomSelect
                label="Type"
                value={type}
                onChange={setType}
                options={TYPES_DEPOS.filter((t) =>
                  ["OFFER", "REQUEST", "QUESTION"].includes(t.value),
                )}
              />
              {type && <ValidationCheck />}
            </div>

            {/* Cat */}
            <div className="relative flex-1">
              <CustomSelect
                label="Category"
                value={cat}
                onChange={setCat}
                options={getCategoryOptions(type)}
                disabled={!type}
              />

              {cat && <ValidationCheck />}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs">Title</label>

            <div className="relative">
              <input
                value={title}
                onChange={(e) => {
                  const value = e.target.value;

                  setTitle(value);

                  setErrors((prev) => ({
                    ...prev,
                    title: validateMax(value, VALIDATION.depo.title),
                  }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({
                    ...prev,
                    title: true,
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    title: validateMin(title, VALIDATION.depo.title),
                  }));
                }}
                className="border border-green-300 p-2 w-full rounded-2xl shadow outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
              {!errors.title && isValidLength(title, VALIDATION.depo.title) && (
                <ValidationCheck />
              )}

              {touched.title && errors.title && (
                <p className="absolute text-xs text-red-600 mt-1">
                  {errors.title}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs">Description</label>

            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => {
                  const value = e.target.value;

                  setDescription(value);

                  setErrors((prev) => ({
                    ...prev,
                    description: validateMax(
                      value,
                      VALIDATION.depo.description,
                    ),
                  }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({
                    ...prev,
                    description: true,
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    description: validateMin(
                      description,
                      VALIDATION.depo.description,
                    ),
                  }));
                }}
                className="border border-green-300 p-2 w-full rounded-2xl resize-none min-h-28 max-h-80 overflow-y-auto shadow outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />

              {!errors.description &&
                isValidLength(description, VALIDATION.depo.description) && (
                  <ValidationCheck />
                )}

              {touched.description && errors.description && (
                <p className="absolute text-xs text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs">Expiration date</label>

            <input
              type="date"
              value={lifetime}
              onChange={(e) => setLifetime(e.target.value)}
              className="border border-green-300 p-2 w-full rounded-2xl shadow outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <div className="space-y-1">
              <label className="text-xs text-green-900">Images</label>

              <label className="block w-full cursor-pointer">
                <div
                  className="border border-green-300 rounded-2xl p-3 bg-white shadow
                    hover:border-green-700 hover:ring-1 hover:ring-green-700
                    transition text-sm text-green-900 text-center"
                >
                  📎 Click to upload files
                </div>

                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles([...e.target.files])}
                  className="hidden"
                />
              </label>

              {files?.length > 0 && (
                <p className="text-xs text-green-700">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {/* Btns */}
          <div className="flex justify-between">
            <CustomButton
              variant="big_white"
              onClick={() => setDepoModalOpen(false)}
            >
              Cancel
            </CustomButton>

            <CustomButton
              variant="big_green"
              onClick={handleUpdateDepo}
              disabled={!isDepoFormValid}
            >
              Save
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Edit answer modal */}
      <Modal open={isAnswerModalOpen} onClose={() => setAnswerModalOpen(false)}>
        {/* Titre */}
        <h2>Edit Answer</h2>

        {/* Answer texte */}
        <textarea
          value={editAnswerText}
          ref={editTextareaRef}
          onChange={(e) => {
            const value = e.target.value;
            setEditAnswerText(value);
            setEditAnswerError(
              validateMax(value, VALIDATION.answer.description),
            );
            autoResize(e);
          }}
          className={`border p-2 w-full rounded-2xl resize-none shadow outline-none transition min-h-64
              ${
                editAnswerError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-green-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
              }`}
          onBlur={() => {
            setEditAnswerTouched(true);

            if (!editAnswerError) {
              setEditAnswerError(
                validateMin(editAnswerText, VALIDATION.answer.description),
              );
            }
          }}
        />

        {/* Check mark */}
        {!editAnswerError &&
          isValidLength(editAnswerText, VALIDATION.answer.description) && (
            <ValidationCheck />
          )}

        {/* Error message */}
        {editAnswerTouched && editAnswerError && (
          <p className="absolute text-xs text-red-600 mt-1">
            {editAnswerError}
          </p>
        )}

        {/* Btns */}
        <div className="flex justify-between mt-6">
          <CustomButton
            variant="big_white"
            onClick={() => setAnswerModalOpen(false)}
          >
            Cancel
          </CustomButton>

          <CustomButton
            variant="big_green"
            onClick={handleSaveEditedAnswer}
            disabled={
              !isValidLength(editAnswerText, VALIDATION.answer.description)
            }
          >
            Save
          </CustomButton>
        </div>

        {error && <div className="text-red-500">{error}</div>}
      </Modal>

      {/* Delete modal */}
      <ConfirmModal
        open={isDeleteOpen}
        title="Delete deposit"
        message="Are you sure you want to delete this deposit?"
        confirmLabel="Delete"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteDepo}
      />
    </div>
  );
}
