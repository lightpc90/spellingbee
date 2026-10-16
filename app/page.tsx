'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Download,
  Focus,
  GraduationCap,
  LockKeyhole,
  Send,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Moon,
  Sun,
  NotebookPen,
} from "lucide-react";
import { RegistrationInsert } from "@/types/supabase";
import { supabase } from "@/lib/supabaseClient";
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import Image from 'next/image';

const reasons = [
  { icon: BookOpen, title: 'Knowledge', text: 'Stretch vocabulary and build a lifelong love of language.' },
  { icon: Focus, title: 'Focus', text: 'Train the composure that sets exceptional scholars apart.' },
  { icon: Zap, title: 'Confidence', text: 'Give every participant a stage to speak clearly and stand boldly.' },
  { icon: Trophy, title: 'Excellence', text: 'Celebrate disciplined preparation with a championship worth remembering.' },
]

const secondaryClasses = ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3']
const cardHover =
  'transition duration-300 hover:-translate-y-1.5 hover:border-amber-300/45 hover:bg-white/[.07] hover:shadow-xl hover:shadow-amber-950/20'
const inputClass =
  'h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-slate-600 transition hover:border-amber-300/35 focus:border-amber-300/60'

function Countdown() {
  const [value, setValue] = useState('000 : 00 : 00 : 00')
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, new Date('2026-10-31T09:00:00+01:00').getTime() - Date.now())
      const parts = [Math.floor(d / 86400000), Math.floor(d / 3600000) % 24, Math.floor(d / 60000) % 60, Math.floor(d / 1000) % 60].map((n) => String(n).padStart(2, '0'))
      setValue(parts.join(' : '))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <div className="font-mono text-2xl font-bold tracking-widest text-white sm:text-3xl">{value}</div>
}

function Field({
  label,
  placeholder,
  type = "text",
  name,
  min,
  max,
  required = true,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  name?: string;
  min?: number;
  max?: number;
  required?: boolean;
  value?: string | number; // Type rule for input values
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs text-slate-300">
      {label}
      <input
        name={name}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

interface StudentFieldsProps {
  index: number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  values: {
    name: string;
    class: string;
    age: number | string;
  };
}

function StudentFields({ index, onChange, values }: StudentFieldsProps) {
  return (
    <div
      className={`sm:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4 ${cardHover}`}
    >
      <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-amber-200">
        Participant {index}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          name={`student${index}Name`}
          value={values.name || ""}
          onChange={onChange}
          placeholder="First and last name"
        />
        <label className="flex flex-col gap-2 text-xs text-slate-300">
          Class
          <select
            name={`student${index}Class`}
            required
            className={inputClass}
            value={values.class}
            onChange={onChange}
          >
            <option value="" disabled>
              Select class
            </option>
            {secondaryClasses.map((item) => (
              <option
                key={item}
                value={item}
                className="bg-[#061334] text-white"
              >
                {item}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Age"
          name={`student${index}Age`}
          type="number"
          min={10}
          max={19}
          placeholder="e.g. 14"
          value={values.age}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default function Page() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const [participationConsent, setParticipationConsent] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const steps = ['School info', 'Coach details', 'Students', 'Consent']

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [formState, SetFormState] = useState<RegistrationInsert>({
    schoolName: "",
    schoolAddress: "",
    coachName: "",
    coachEmail: "",
    coachPhone: "",
    student1Name: "",
    student1Class: "",
    student1Age: 0,
    student2Name: "",
    student2Class: "",
    student2Age: 0,
    student3Name: "",
    student3Class: "",
    student3Age: 0,
    student4Name: "",
    student4Class: "",
    student4Age: 0,
  });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    SetFormState((prevState) => ({
      ...prevState,
      [name]: name.includes("Age") ? Number(value) : value,
    }));
  };


  const handleSubmit = async (
  )=> {
    if (step !== 3) {
      setStep(step + 1);
      return;
    }
    if (!participationConsent || !privacyConsent) {
      setConsentError(
        "Please accept participation consent and data privacy consent to submit.",
      );
      return;
    }
    setIsSubmitting(true);
    setMessage("");

    // 2. Map fields strictly matching your RegistrationInsert type mapping
    const registrationData = {
      school_name: formState.schoolName,
      school_address: formState.schoolAddress,
      coach_name: formState.coachName,
      coach_email: formState.coachEmail,
      coach_phone: formState.coachPhone,
      student1_name: formState.student1Name,
      student1_class: formState.student1Class,
      student1_age: formState.student1Age,
      student2_name: formState.student2Name,
      student2_class: formState.student2Class,
      student2_age: formState.student2Age,
      student3_name: formState.student3Name,
      student3_class: formState.student3Class,
      student3_age: formState.student3Age,
      student4_name: formState.student4Name,
      student4_class: formState.student4Class,
      student4_age: formState.student4Age,
    }
  
    console.log("Submitting registration data:", registrationData);

    try {
      // 3. Insert directly into your Supabase database table
      const { error } = await supabase
        .from("SB_Registration")
        .insert([registrationData]);

      if (error) throw error;

      // 4. Handle a successful registration turn
      setMessage("🎉 Registration successful! Confirmation is on its way.");
      // Reset form state if needed
      SetFormState({
        schoolName: "",
        schoolAddress: "",
        coachName: "",
        coachEmail: "",
        coachPhone: "",
        student1Name: "",
        student1Class: "",
        student1Age: 0,
        student2Name: "",
        student2Class: "",
        student2Age: 0,
        student3Name: "",
        student3Class: "",
        student3Age: 0,
        student4Name: "",
        student4Class: "",
        student4Age: 0,
      });
    } catch (error: any) {
      if (error) {
        console.error("Submission failed:", error.message, error.details, error.hint);
        setMessage(`❌ Error: ${error.message}`);
      } else {
        setMessage("❌ An unexpected validation error occurred.");
      }
    } finally {
      setIsSubmitting(false);
      setDone(true);
    }
  };

  return (
    <main
      className={`site-shell min-h-screen bg-[#061334] text-slate-200 ${isLight ? "light" : ""}`}
    >
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#061334]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="flex items-center gap-3 transition hover:opacity-90"
          >
            <div className="shrink-0 w-[40px] h-[40px] relative flex items-center justify-center rounded-full overflow-hidden bg-white/5">
              <Image
                src={`RCCGLogo.png`}
                alt="RCCG Logo"
                width={50}
                height={50}
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-[.18em] text-white">
              Beautiful Gate
              <span className="text-amber-300">{` `}Parish</span>
            </span>
          </a>
          <nav className="hidden gap-8 text-xs text-slate-300 md:flex">
            <a className="transition hover:text-amber-300" href="#why">
              Why join
            </a>
            <a className="transition hover:text-amber-300" href="#prizes">
              Prizes
            </a>
            <a className="transition hover:text-amber-300" href="#register">
              Register
            </a>
            <a className="transition hover:text-amber-300" href="#portal">
              Portal
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              hidden
              type="button"
              aria-label={
                isLight ? "Switch to dark mode" : "Switch to light mode"
              }
              onClick={() => setIsLight((value) => !value)}
              className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-amber-200 transition hover:-translate-y-0.5 hover:border-amber-300/50 hover:bg-amber-300/10"
            >
              {isLight ? <Moon /> : <Sun />}
            </button>
            <Button
              asChild
              size="sm"
              className="bg-amber-300 text-[#061334] hover:bg-amber-200"
            >
              <a href="#register">Enter competition</a>
            </Button>
          </div>
        </div>
      </header>
      <motion.section
        id="top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden px-5 py-24 sm:px-8"
      >
        <div aria-hidden="true" className="letter-motif select-none">
          A&nbsp;&nbsp;B&nbsp;&nbsp;C&nbsp;&nbsp;D&nbsp;&nbsp;E&nbsp;&nbsp;F&nbsp;&nbsp;G&nbsp;&nbsp;H
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_35%,rgba(26,74,167,.46),transparent_35%),radial-gradient(circle_at_15%_85%,rgba(245,183,60,.08),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-amber-200">
              RCCG Beautiful Gate Parish, Lakowe presents
            </div>
            <h1 className="max-w-3xl font-display text-6xl font-semibold leading-[.9] tracking-[-.045em] text-white sm:text-8xl">
              Spelling
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Competition
              </span>{" "}
              <br />
              <span className="text-white/90">2026</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              A high-stakes spelling championship for sharp minds, brave voices,
              and a generation that knows the value of every word.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-300 text-[#061334] hover:bg-amber-200"
              >
                <a href="#register">Register school</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 "
              >
                <a href="#portal" className="flex items-center gap-2">
                  School portal <LockKeyhole data-icon="inline-end" />
                </a>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-7 text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <Clock3 className="text-amber-300" />
                31 October 2026
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="text-amber-300" />
                1-8 Redeemed Close, Slot B/Stop, Adeba-Lakowe, Lagos
              </span>
            </div>
          </div>
          <div
            className={`rounded-3xl border border-white/15 bg-white/[.08] p-7 shadow-2xl shadow-blue-950/30 backdrop-blur-xl ${cardHover}`}
          >
            <div className="flex justify-between border-b border-white/10 pb-5 text-[10px] font-bold uppercase tracking-[.2em] text-slate-300">
              <span>The grand finale</span>
              <Trophy className="text-amber-300" />
            </div>
            <div className="py-10">
              <div className="text-xs uppercase tracking-[.2em] text-slate-400">
                Countdown to championship
              </div>
              <div className="mt-4">
                <Countdown />
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Days&nbsp;&nbsp; : &nbsp;&nbsp;Hours&nbsp;&nbsp; :
                &nbsp;&nbsp;Minutes&nbsp;&nbsp; : &nbsp;&nbsp;Seconds
              </div>
            </div>
            <div
              className={`rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-300/20 to-orange-400/10 p-5 ${cardHover}`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-200">
                <Trophy />
                Grand prize
              </div>
              <div className="mt-3 font-display text-5xl text-white">
                ₦500,000
              </div>
              <div className="mt-2 text-sm text-slate-300">
                1st place champion
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <motion.section
        id="why"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
        className="border-y border-white/10 bg-[#071a43] px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[.25em] text-amber-300">
              More than a competition
            </div>
            <h2 className="max-w-xl font-display text-4xl text-white sm:text-5xl">
              A stage for every kind of
              <span className="text-amber-300">{` `}brilliance.</span>
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className={`group rounded-2xl border border-white/10 bg-white/[.035] p-6 
              ${cardHover}`}
              >
                <span className="mb-8 flex size-11 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300 transition group-hover:bg-amber-300/20">
                  <Icon />
                </span>
                <h3 className="font-display text-2xl text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>
      <motion.section
        id="prizes"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
        className="px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-[10px] font-bold uppercase tracking-[.25em] text-amber-300">
            Earn your place
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1st place", "₦500,000"],
              ["2nd place", "₦300,000"],
              ["3rd place", "₦200,000"],
            ].map(([place, amount], i) => (
              <div
                key={place}
                className={`rounded-2xl border p-6 
                ${cardHover} 
                  ${i === 0 ? "border-amber-300/50 bg-amber-300/10 shadow-lg shadow-amber-950/20" : "border-white/10 bg-white/[.035]"}`}
              >
                <Trophy className="text-amber-300" />
                <div className="mt-8 text-xs uppercase tracking-widest text-slate-400">
                  {place}
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-white">
                  {amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="register"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
        className="border-t border-white/10 bg-[#07183d] px-5 py-24 sm:px-4"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[.25em] text-amber-300">
              Secure your place
            </div>
            <h2 className="font-display text-4xl text-white md:text-5xl w-full">
              Register the next generation of wordsmiths.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Open to secondary schools only. Register four participants with
              full name, class (JSS 1–SSS 3), and age. One school. Four
              students. One unforgettable day.
            </p>
          </div>
          <div
            className={`rounded-3xl border border-white/10 bg-white/[.055] p-6 md:p-5 ${cardHover} w-full`}
          >
            {done ? (
              <div className="py-16 text-center">
                <Check className="mx-auto size-14 text-emerald-300" />
                <p className="mt-2 text-sm text-slate-300">{message}</p>
              </div>
            ) : (
              // Registration Form Here
              <>
                <div className="w-full mb-8 flex gap-2 flex-wrap">
                  {steps.map((item, i) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setStep(i)}
                      className={`shrink-0 rounded-full px-3 sm:px-2 py-2 text-[10px] font-bold uppercase tracking-wider transition hover:-translate-y-0.5 
        ${
          i === step
            ? "bg-amber-300 text-[#061334]"
            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-amber-200"
        }`}
                    >
                      {i + 1}.{item}
                    </button>
                  ))}
                </div>
                <div className="grid gap-5 md:grid-cols-2 w-full">
                  {step === 0 && (
                    <>
                      <Field
                        label="School name"
                        name="schoolName"
                        value={formState.schoolName}
                        onChange={handleFieldChange}
                        placeholder="Enter school name"
                      />
                      <Field
                        label="School address"
                        name="schoolAddress"
                        value={formState.schoolAddress}
                        onChange={handleFieldChange}
                        placeholder="Enter school address"
                      />
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <Field
                        label="Teacher / coach name"
                        name="coachName"
                        value={formState.coachName}
                        onChange={handleFieldChange}
                        placeholder="Full name"
                      />
                      <Field
                        label="Teacher email / coach email"
                        name="coachEmail"
                        type="email"
                        value={formState.coachEmail}
                        onChange={handleFieldChange}
                        placeholder="teacher@school.edu.ng"
                      />
                      <Field
                        label="Phone number"
                        name="coachPhone"
                        type="tel"
                        value={formState.coachPhone}
                        onChange={handleFieldChange}
                        placeholder="+234 800 000 0000"
                      />
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <p className="md:col-span-2 text-sm leading-6 text-slate-300 w-full">
                        Enter all four secondary-school participants. Class must
                        be JSS 1–SSS 3. Age should typically fall between 10 and
                        19.
                      </p>
                      {[1, 2, 3, 4].map((index) => {
                        const nameKey =
                          `student${index}Name` as keyof typeof formState;
                        const classKey =
                          `student${index}Class` as keyof typeof formState;
                        const ageKey =
                          `student${index}Age` as keyof typeof formState;
                        return (
                          <StudentFields
                            onChange={handleFieldChange} // Pass the handler
                            values={{
                              name: formState[nameKey] as string,
                              class: formState[classKey] as string,
                              age: formState[ageKey] as number | string,
                            }}
                            key={index}
                            index={index}
                          />
                        );
                      })}
                    </>
                  )}
                  {step === 3 && (
                    <div className="md:col-span-2 grid gap-4">
                      <label
                        className={`flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300 
                      ${cardHover}`}
                      >
                        <input
                          type="checkbox"
                          name="participationConsent"
                          required
                          checked={participationConsent}
                          onChange={(event) => {
                            setParticipationConsent(event.target.checked);
                            setConsentError("");
                          }}
                          className="mt-1 size-4 shrink-0 accent-amber-300"
                        />
                        I confirm this school is registering four
                        secondary-school students, and that a parent, guardian,
                        or authorised school official consents to their
                        participation in the Spelling Competition 2026.
                      </label>
                      <label
                        className={`flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300 
                        ${cardHover}`}
                      >
                        <input
                          type="checkbox"
                          name="privacyConsent"
                          required
                          checked={privacyConsent}
                          onChange={(event) => {
                            setPrivacyConsent(event.target.checked);
                            setConsentError("");
                          }}
                          className="mt-1 size-4 shrink-0 accent-amber-300"
                        />
                        I consent to RCCG Beautiful Gate Parish collecting and
                        processing the personal data of the school, coach, and
                        four student participants (full names, class, age, and
                        contact details) solely to register, communicate with,
                        and administer this competition. Data of minors will be
                        handled with care, kept only as long as needed for the
                        event, and will not be sold or used for unrelated
                        marketing.
                      </label>
                      {consentError ? (
                        <p className="text-sm text-amber-200">{consentError}</p>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    className="bg-amber-300 text-[#061334] transition hover:-translate-y-0.5 hover:bg-amber-200"
                  >
                    {isSubmitting ? (
                      <div className="text-center">
                        <p className="text-sm text-slate-300">Submitting...</p>
                      </div>
                    ) : step === 3 ? (
                      "Submit registration"
                    ) : (
                      "Continue"
                    )}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.section>
      <motion.section
        id="portal"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
        className="px-5 lg:w-2/4 mx-auto py-24 sm:px-8"
      >
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[.25em] text-amber-300">
            School portal
          </div>
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Your materials,
            <span className="text-amber-300">one code away.</span>
          </h2>
          <div
            className={`mt-9 rounded-3xl border border-white/15 bg-white/[.08] 
          p-6 text-left shadow-xl shadow-blue-950/20 backdrop-blur-xl 
          ${cardHover}`}
          >
            <Field
              label="School Username"
              name="username"
              placeholder="username"
              required={true}
            />
            <Field
              label="School access code"
              name="accessCode"
              placeholder="BG-SB26-XXXX"
              required={true}
            />
            <Button
              className="mt-4 h-12 w-full bg-amber-300 text-[#061334] 
          transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              <Download data-icon="inline-start" />
              Access school portal
            </Button>
          </div>
        </div>
      </motion.section>
      <Footer />
    </main>
  );
}
