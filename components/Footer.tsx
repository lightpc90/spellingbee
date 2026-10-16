import { MapPin, Clock3, GraduationCap, Mail, Phone, Send, Users } from 'lucide-react'
import Image from 'next/image'
import { FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { SiFacebook } from "react-icons/si";

const Footer = () => {
  return (
    <footer
      className="border-t border-white/10 bg-[#04102b] 
      px-5 py-14 sm:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden bg-white/5">
              <Image
                src={`RCCGLogo.png`}
                alt="RCCG Logo"
                width={50}
                height={50}
              />
            </div>
            <span className="font-display text-xl text-white">
              Beautiful Gate
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
            RCCG Beautiful Gate Parish, Lakowe. Raising confident, excellent
            young people through faith, learning, and purpose.
          </p>
          <div className="mt-6 flex gap-3 text-slate-400">
            <a
              className="transition hover:text-amber-300"
              aria-label="Facebook"
              href="https://www.facebook.com/rccgbglagos/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiFacebook size={25} />
            </a>
            <a
              className="transition hover:text-amber-300"
              aria-label="Instagram"
              href="https://www.instagram.com/rccgbgplagos/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={25} />
            </a>
            <a
              className="transition hover:text-amber-300"
              aria-label="Youtube"
              href="https://www.youtube.com/@rccgbgplagos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiYoutube size={25} />
            </a>
            <a
              className="transition hover:text-amber-300"
              aria-label="Email"
              href="mailto:ctlbeautifulgate@gmail.com"
            >
              <Mail />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Competition
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <a className="transition hover:text-amber-300" href="#why">
              Why join
            </a>
            <a className="transition hover:text-amber-300" href="#prizes">
              Prizes
            </a>
            <a className="transition hover:text-amber-300" href="#register">
              Register a school
            </a>
            <a className="transition hover:text-amber-300" href="#portal">
              School portal
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Quick details
          </h3>
          <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400">
            <span className="flex gap-3">
              <MapPin className="shrink-0 text-amber-300" />
              1-8 Redeemed Close, Slot B/Stop, Adeba-Lakowe, Lagos
            </span>
            <span className="flex gap-3">
              <Clock3 className="shrink-0 text-amber-300" />
              31 October 2026
            </span>
            <span className="flex gap-3">
              <Users className="shrink-0 text-amber-300" />4 students + 1 coach
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Need help?
          </h3>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Questions about registration or school access? Our parish team is
            happy to help.
          </p>
          <a
            className="mt-4 flex items-center gap-3 text-sm text-white transition hover:text-amber-300"
            href="tel:+234 803 525 5667"
          >
            <Phone className="text-amber-300" />
            +234 803 525 5667
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 RCCG Beautiful Gate Parish. All rights reserved.</span>
        <span>
          Theme: <span className="text-amber-300">WORDS IN WORD</span>
        </span>
      </div>
    </footer>
  );
}

export default Footer