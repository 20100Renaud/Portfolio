import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Depo() {
  const { id } = useParams();
  const [depo, setDepo] = useState(null);

  useEffect(() => {
    const loadDepo = async () => {
      const response = await fetch(`http://localhost:5000/api/depos/${id}`);
      const data = await response.json();
      setDepo(data);
    };

    loadDepo();
  }, [id]);

  if (!depo) {
    return (
      <div className="flex justify-center p-10 text-green-900">
        Chargement...
      </div>
    );
  }

  return (
    <div className="relative text-center text-green-900 overflow-hidden my-10 mx-auto px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          {depo.Title_Depo}
        </h1>

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
      </div>
    </div>
  );
}
