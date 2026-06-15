import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {

  const [depos, setDepos] = useState([]);

  useEffect(() => {
    const loadDepos = async () => {
      const response = await fetch("http://localhost:5000/api/depos");
      const data = await response.json();
      setDepos(data);
    }
    loadDepos();
  }, []);

  return (
    <div className="relative text-center text-green-900 overflow-hidden justify-center my-10 mx-auto"
    >
      <h1 className="text-3xl sm:text-5xl font-bold">Welcome to the market</h1>
      <p className="text-sm sm:text-lg text-green-800">
        Here we can share what we have or need.
      </p>
        {depos.map((depo) => {
          return (
            <Link key={depo.ID_Depo} to={`/depo/${depo.ID_Depo}`}>
              <div>
                <h3>{depo.Title_Depo}</h3>
                <p>{depo.User_Depos.Login_User}</p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}