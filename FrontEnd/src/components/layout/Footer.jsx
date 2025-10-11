import { FiBookOpen, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-dark text-white py-4 ">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left text-sm">

                {/* Brand */}
                <div>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                        <FiBookOpen className="text-primary" size={22} />
                        <span className="text-lg font-bold">
                            BOOK<span className="text-primary">TRACKER</span>
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                        Track and organize your reading journey.
                    </p>
                    <div className="flex mt-4 space-x-4 mb-1">
                        <a href="https://www.facebook.com/" className="hover:text-primary transition"><FiFacebook size={14} /></a>
                        <a href="https://twitter.com/login?lang=en" className="hover:text-primary transition"><FiTwitter size={14} /></a>
                        <a href="https://www.linkedin.com/" className="hover:text-primary transition"><FiLinkedin size={14} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-primary font-semibold mb-2 text-sm">Quick Links</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li><a href="/about" className="hover:text-primary transition">About</a></li>
                        <li><a href="/contact-us" className="hover:text-primary transition">Contact</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-primary font-semibold mb-2 text-sm">Contact</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li className="flex justify-center md:justify-start items-center space-x-2">
                            <FiMail className="text-primary" size={14} />
                            <a href="mailto:support@booktracker.com" className="hover:text-primary transition">support@booktracker.com</a>
                        </li>
                        <li className="flex justify-center md:justify-start items-center space-x-2">
                            <FiPhone className="text-primary" size={14} />
                            <span>+20 155 458 0561</span>
                        </li>
                        <li className="flex justify-center md:justify-start items-center space-x-2">
                            <FiMapPin className="text-primary" size={14} />
                            <span>Smouha, Alexandria, Egypt</span>
                        </li>
                    </ul>
                </div>
            </div>


        </footer>
    );
}
