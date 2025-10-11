import { useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

import { msgService } from "../services/msgService";
import Footer from "../components/layout/Footer";

export default function ContactUs() {
    const [form, setForm] = useState({ name: "", email: "",subject: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        try {
            await msgService.sendMsg(form);
            setStatus("Message sent successfully");
            setForm({ name: "", email: "",subject: "" ,message: "" });
        } catch (err) {
            setStatus(err.message || "Failed to send message");
        }
    };

    return (
        <>
            <div className="container mx-auto px-4 py-12 text-gray-800">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>
                    <p className="text-gray-600 mb-8">
                        We'd love to hear from you! Fill out the form and we’ll respond as soon as possible.
                    </p>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-center justify-center space-x-3">
                            <FiMail className="text-primary" size={20} />
                            <span>support@booktracker.com</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <FiPhone className="text-primary" size={20} />
                            <span>+20 155 458 0561</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <FiMapPin className="text-primary" size={20} />
                            <span>Smouha, Alexandria, Egypt</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto text-left">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                        <textarea
                            name="message"
                            rows="4"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition"
                        >
                            Send Message
                        </button>
                    </form>

                    {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
                </div>
            </div>

            <Footer />
        </>
    );
}
