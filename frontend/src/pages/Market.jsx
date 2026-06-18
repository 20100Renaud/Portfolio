import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Market() {
  const [depos, setDepos] = useState([]);

  useEffect(() => {
    const loadDepos = async () => {
      const response = await fetch("http://localhost:5000/api/depos");
      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (Array.isArray(data)) {
        setDepos(data);
      } else if (Array.isArray(data.depos)) {
        setDepos(data.depos);
      } else {
        setDepos([]);
      }
    };

    loadDepos();
  }, []);

  return (
    <div className="relative text-center text-green-900 overflow-hidden justify-center my-10 mx-auto px-4">
      <h1 className="text-3xl sm:text-5xl font-bold">Welcome to the market</h1>
      <p className="text-sm sm:text-lg text-green-800">
        Here we can share what we have or need.
      </p>
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
    </div>
  );
}
