// import { useAuth } from "../context/useAuth";
// import { useNavigate } from "react-router-dom";
// import UserMenu from "../components/UserMenu";

// export default function Dashboard() {
//   const { username } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div>
//       <h1>Welcome {username}</h1>
//       <p className="text-sm sm:text-lg text-green-800">
//         Here we can find our field.
//       </p>
//       <UserMenu username={username} onLogout={() => navigate("/login")} />
//     </div>
//   );
// }
import DeposPage from "./DeposPage";

export default function Dashboard() {
  return <DeposPage mode="dashboard" />;
}
