import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Send, // Telegram ke liye
} from "lucide-react";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedinIn, FaYoutube, FaTelegram } from 'react-icons/fa';

export default function ContactInfo() {
  const whatsappUrl = `https://wa.me/919045699938?text=${encodeURIComponent("Hi Team AcademyFind, I have a query regarding...")}`;

  return (
    <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">Contact Information</h2>

      <div className="mt-8 space-y-8">
        {/* Email & Phone */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <Mail className="mt-1 h-5 w-5 text-amber-500" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">connect@academyfind.com</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="mt-1 h-5 w-5 text-amber-500" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+91 90456 99938</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <Link 
          href={whatsappUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-100"
        >
          <FaWhatsapp className="h-4 w-4" />
          Chat on WhatsApp
        </Link>

        {/* Social Media Links - Grid */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <div className="flex flex-wrap gap-3">
            <SocialIcon href="https://t.me/academyfind" icon={<FaTelegram  className="h-7 w-7 text-[#24A1DE]" />} label="Telegram" />
            <SocialIcon href="https://www.linkedin.com/company/academyfind" icon={<FaLinkedinIn className="h-7 w-7 text-[#0A66C2]" />} label="LinkedIn" />
            <SocialIcon href="https://www.facebook.com/profile.php?id=61561180379260" icon={<FaFacebook className="h-7 w-7 text-[#1877F2]" />} label="Facebook" />
            <SocialIcon href="https://www.instagram.com/academyfind" icon={<FaInstagram className="h-7 w-7 text-pink-400" />} label="Instagram" />
            <SocialIcon href="https://www.youtube.com/channel/UCYiRb6vo_Rr_w3PO746hsKg" icon={<FaYoutube className="h-7 w-7 text-[#FF0000]" />} label="YouTube" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Chota component taaki code clean rahe
function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
    >
      {icon}
    </Link>
  );
}