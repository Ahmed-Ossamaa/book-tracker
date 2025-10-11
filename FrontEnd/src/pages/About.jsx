import { FiBookOpen } from "react-icons/fi";
import Footer from "../components/layout/Footer";


export default function About() {

    return (
        <>
            <div className="flex flex-col min-h-screen pt-12">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center mb-4">
                        <FiBookOpen className="text-primary" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">About BookTracker</h1>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        <span className="font-semibold text-primary">BookTracker</span> is your personal library management tool.
                        It helps you organize, track, and review all your favorite books in one place.
                        Whether you’re an avid reader or just starting your reading journey,
                        BookTracker provides an easy and enjoyable way to keep your library in order.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        BookTracker aims to combine a clean interface with powerful features
                        for managing your reading habits efficiently.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );

}