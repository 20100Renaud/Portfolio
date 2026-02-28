import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oops! This page does not exist.</p>

            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
                Go back Home
            </Link>
        </div>
    );
}