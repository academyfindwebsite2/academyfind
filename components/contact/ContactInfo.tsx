import {
  Mail,
  MapPin,
  Clock,
  Phone,
  MessageCircle // WhatsApp ke liye icon
} from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactInfo() {
  // Apna number yahan bina '+' ya '-' ke daalein (Country code ke sath)

  // Ye link WhatsApp App (Mobile) ya WhatsApp Web (PC) directly open karega
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Hi Team AcademyFind, I have a query regarding...")}`;

  return (
    <div
      className="
        rounded-3xl
        border
        border-amber-100
        bg-white
        p-8
        shadow-sm
      "
    >
      <h2 className="text-2xl font-bold">
        Contact Information
      </h2>

      <div className="mt-8 space-y-8">
        {/* Email */}
        <div className="flex gap-4">
          <Mail className="mt-1 h-5 w-5 text-amber-500" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground">connect@academyfind.com</p>
          </div>
        </div>

        {/* Phone & WhatsApp */}
        <div className="flex gap-4">
          <Phone className="mt-1 h-5 w-5 text-amber-500" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-muted-foreground">+91 90456 99938</p>
            
            {/* 👇 Naya WhatsApp Button */}
          </div>
        </div>

        <div className="flex">
          
          <div className="flex">
            {/* <Phone className="mt-1 h-5 w-5 text-amber-500" /> */}
            {/* <h3 className="font-semibold">WhatsApp</h3> */}
            <Link 
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className=" inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-100"
            >
              <FaWhatsapp className="h-4 w-4" />
              Chat on WhatsApp
            </Link>
            
            {/* 👇 Naya WhatsApp Button */}
          </div>
        </div>

        {/* Location */}
        <div className="flex gap-4">
          <MapPin className="mt-1 h-5 w-5 text-amber-500" />
          <div>
            <h3 className="font-semibold">Location</h3>
            <p className="text-muted-foreground">India</p>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex gap-4">
          <Clock className="mt-1 h-5 w-5 text-amber-500" />
          <div>
            <h3 className="font-semibold">Response Time</h3>
            <p className="text-muted-foreground">Usually within 12 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}