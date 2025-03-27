"use client";
     import { useState, useEffect } from "react";
     import { motion, AnimatePresence } from "framer-motion";
     import { Download, Copy, ArrowLeft, ArrowRight, Star, Loader2, Sparkles } from "lucide-react";
     import { toast, ToastContainer } from "react-toastify";
     import "react-toastify/dist/ReactToastify.css";

     const API_BASE_URL = "http://localhost:8000";

     export default function GenerateResume() {
       const [step, setStep] = useState("start");
       const [formData, setFormData] = useState({
         name: "",
         email: "",
         phone: "",
         education: "",
         experience: "",
         skills: "",
         jobTitle: "",
         yearsExperience: "",
         template: "modern",
       });
       const [resumeFile, setResumeFile] = useState(null);
       const [atsScore, setAtsScore] = useState(null);
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState(null);
       const [dotPositions, setDotPositions] = useState(
         [...Array(10)].map(() => ({
           left: `${Math.random() * 100}%`,
           top: `${Math.random() * 100}%`,
         }))
       );

       const templates = {
         modern: { class: "bg-gray-900 text-white p-6 rounded shadow-lg", name: "Modern" },
         classic: { class: "bg-white text-black p-6 border border-gray-300", name: "Classic" },
         creative: { class: "bg-blue-100 text-black p-6 rounded shadow-lg", name: "Creative" },
         executive: { class: "bg-gray-100 text-black p-6 border border-gray-400", name: "Executive" },
         minimalist: { class: "bg-white text-gray-800 p-6 rounded shadow-md", name: "Minimalist" },
       };

       const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

       const handleFileUpload = async (e) => {
         const file = e.target.files[0];
         if (!file) return;
         setResumeFile(file);
         setLoading(true);
         const form = new FormData();
         form.append("resume", file);

         try {
           const res = await fetch(`${API_BASE_URL}/extract-resume/`, {
             method: "POST",
             body: form,
           });
           if (!res.ok) throw new Error("Failed to extract resume data. Please upload a valid PDF or text file.");
           const data = await res.json();
           setFormData((prev) => ({
             ...prev,
             ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""])),
           }));
           toast.success("Resume data extracted successfully!", { position: "top-right" });
         } catch (err) {
           setError(err.message);
           toast.error(err.message, { position: "top-right" });
         } finally {
           setLoading(false);
         }
       };

       const suggestContent = async () => {
         if (!formData.jobTitle) {
           setError("Please provide a job title to generate suggestions.");
           return;
         }
         setLoading(true);
         try {
           const res = await fetch(`${API_BASE_URL}/suggest-content/`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ jobTitle: formData.jobTitle, yearsExperience: formData.yearsExperience || "2" }),
           });
           if (!res.ok) throw new Error("Failed to fetch AI suggestions. Please try again.");
           const data = await res.json();
           setFormData((prev) => ({
             ...prev,
             ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""])),
           }));
           toast.success("AI suggestions generated successfully!", { position: "top-right" });
         } catch (err) {
           setError(err.message);
           toast.error(err.message, { position: "top-right" });
         } finally {
           setLoading(false);
         }
       };

       const enhanceSection = async (section) => {
         if (!formData[section]) {
           setError(`Please provide content for the ${section} section to enhance.`);
           return;
         }
         setLoading(true);
         try {
           const res = await fetch(`${API_BASE_URL}/enhance-section/`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               section,
               content: formData[section] || "",
               jobTitle: formData.jobTitle || undefined,
             }),
           });
           if (!res.ok) throw new Error(`Failed to enhance ${section}. Please try again.`);
           const data = await res.json();
           setFormData((prev) => ({ ...prev, [section]: data.enhanced ?? "" }));
           toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} enhanced successfully!`, { position: "top-right" });
         } catch (err) {
           setError(err.message);
           toast.error(err.message, { position: "top-right" });
         } finally {
           setLoading(false);
         }
       };

       useEffect(() => {
         const updateAtsScore = async () => {
           try {
             const res = await fetch(`${API_BASE_URL}/ats-preview/`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData),
             });
             if (res.ok) {
               const data = await res.json();
               setAtsScore(data.ats_score);
             }
           } catch (err) {
             console.error("ATS score fetch failed:", err);
           }
         };
         if (step === "preview") updateAtsScore();
       }, [formData, step]);

       const generateResume = async (format = "pdf") => {
         setLoading(true);
         try {
           const res = await fetch(`${API_BASE_URL}/generate-resume/`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ ...formData, format }),
           });
           if (!res.ok) throw new Error(`Failed to generate resume in ${format.toUpperCase()} format.`);
           const blob = await res.blob();
           const url = window.URL.createObjectURL(blob);
           const link = document.createElement("a");
           link.href = url;
           link.download = `resume.${format}`;
           link.click();
           window.URL.revokeObjectURL(url);
           toast.success(`Resume downloaded as ${format.toUpperCase()}!`, { position: "top-right" });
         } catch (err) {
           setError(err.message);
           toast.error(err.message, { position: "top-right" });
         } finally {
           setLoading(false);
         }
       };

       const renderStep = () => {
         switch (step) {
           case "start":
             return (
               <div className="text-center">
                 <h3 className="text-3xl font-bold text-purple-400 mb-6 text-center relative z-10">
                   ✨ Generate Your Resume ✨
                 </h3>
                 <p className="text-gray-300 mb-8">Choose how you’d like to create your resume:</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-6">
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setStep("quick")}
                     className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                   >
                     <Sparkles className="w-5 h-5" /> Quick Resume
                   </motion.button>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setStep("custom-1")}
                     className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                   >
                     <Sparkles className="w-5 h-5" /> Custom Resume
                   </motion.button>
                 </div>
               </div>
             );

           case "quick":
             return (
               <div>
                 <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                   ✨ Quick Resume ✨
                 </h3>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Job Title <span className="text-purple-400 text-sm">(Required for AI suggestions)</span>
                     </label>
                     <input
                       type="text"
                       placeholder="e.g., Software Engineer"
                       value={formData.jobTitle}
                       onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Job Title"
                     />
                   </div>
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Years of Experience
                     </label>
                     <input
                       type="number"
                       placeholder="e.g., 2"
                       value={formData.yearsExperience}
                       onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Years of Experience"
                     />
                   </div>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => { suggestContent(); setStep("preview"); }}
                     className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                     disabled={loading || !formData.jobTitle}
                   >
                     {loading ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                       <>
                         <Sparkles className="w-5 h-5" /> Generate Resume
                       </>
                     )}
                   </motion.button>
                 </div>
               </div>
             );

           case "custom-1":
             return (
               <div>
                 <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                   ✨ Step 1: Personal Info ✨
                 </h3>
                 <div className="flex justify-between mb-6">
                   <div className="flex items-center gap-2">
                     <motion.div className="w-4 h-4 bg-purple-500 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                     <motion.div className="w-4 h-4 bg-gray-600 rounded-full" />
                     <motion.div className="w-4 h-4 bg-gray-600 rounded-full" />
                   </div>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setStep("start")}
                     className="px-4 py-2 bg-gray-600 rounded-lg text-white text-sm flex items-center gap-2"
                   >
                     <ArrowLeft className="w-4 h-4" /> Back to Start
                   </motion.button>
                 </div>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Upload Resume (Optional)
                     </label>
                     <input
                       type="file"
                       accept=".pdf,.txt"
                       onChange={handleFileUpload}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Upload Resume"
                     />
                   </div>
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Name <span className="text-purple-400 text-sm">(Required)</span>
                     </label>
                     <input
                       type="text"
                       placeholder="e.g., John Doe"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Name"
                     />
                   </div>
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Email <span className="text-purple-400 text-sm">(Required)</span>
                     </label>
                     <input
                       type="email"
                       placeholder="e.g., john.doe@example.com"
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Email"
                     />
                   </div>
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Phone
                     </label>
                     <input
                       type="text"
                       placeholder="e.g., +1 234 567 8900"
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Phone"
                     />
                   </div>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => {
                       if (!formData.name) {
                         setError("Please provide your name.");
                         return;
                       }
                       if (!formData.email) {
                         setError("Please provide your email.");
                         return;
                       }
                       if (!validateEmail(formData.email)) {
                         setError("Please provide a valid email address.");
                         return;
                       }
                       setError(null);
                       setStep("custom-2");
                     }}
                     className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                   >
                     Next <ArrowRight className="w-5 h-5" />
                   </motion.button>
                 </div>
               </div>
             );

           case "custom-2":
             return (
               <div>
                 <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                   ✨ Step 2: Experience & Education ✨
                 </h3>
                 <div className="flex justify-between mb-6">
                   <div className="flex items-center gap-2">
                     <motion.div className="w-4 h-4 bg-gray-600 rounded-full" />
                     <motion.div className="w-4 h-4 bg-purple-500 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                     <motion.div className="w-4 h-4 bg-gray-600 rounded-full" />
                   </div>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setStep("start")}
                     className="px-4 py-2 bg-gray-600 rounded-lg text-white text-sm flex items-center gap-2"
                   >
                     <ArrowLeft className="w-4 h-4" /> Back to Start
                   </motion.button>
                 </div>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                       Job Title (Optional for AI Suggestions)
                     </label>
                     <input
                       type="text"
                       placeholder="e.g., Software Engineer"
                       value={formData.jobTitle}
                       onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Job Title"
                     />
                   </div>
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-gray-200 font-semibold text-sm sm:text-base">
                         Experience
                       </label>
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => enhanceSection("experience")}
                         className="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm flex items-center gap-2"
                         disabled={loading}
                       >
                         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         Enhance
                       </motion.button>
                     </div>
                     <textarea
                       placeholder="e.g., Software Engineer at XYZ Corp, 2020-2023..."
                       value={formData.experience}
                       onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg h-32 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Experience"
                     />
                   </div>
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-gray-200 font-semibold text-sm sm:text-base">
                         Education
                       </label>
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => enhanceSection("education")}
                         className="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm flex items-center gap-2"
                         disabled={loading}
                       >
                         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         Enhance
                       </motion.button>
                     </div>
                     <textarea
                       placeholder="e.g., B.S. in Computer Science, ABC University, 2016-2020"
                       value={formData.education}
                       onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg h-32 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Education"
                     />
                   </div>
                   <div className="flex justify-between">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setStep("custom-1")}
                       className="px-6 py-3 bg-gray-600 rounded-lg text-white text-lg flex items-center gap-2"
                     >
                       <ArrowLeft className="w-5 h-5" /> Back
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setStep("custom-3")}
                       className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-lg flex items-center gap-2"
                     >
                       Next <ArrowRight className="w-5 h-5" />
                     </motion.button>
                   </div>
                 </div>
               </div>
             );

           case "custom-3":
             return (
               <div>
                 <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                   ✨ Step 3: Skills ✨
                 </h3>
                 <div className="flex justify-between mb-6">
                   <div className="flex items-center gap-2">
                     <motion.div className="w-4 h-4 bg-gray-600 rounded-full" />
                     <motion.div className="w-4 h-4 bg-gray-600 rounded-full" />
                     <motion.div className="w-4 h-4 bg-purple-500 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                   </div>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setStep("start")}
                     className="px-4 py-2 bg-gray-600 rounded-lg text-white text-sm flex items-center gap-2"
                   >
                     <ArrowLeft className="w-4 h-4" /> Back to Start
                   </motion.button>
                 </div>
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-gray-200 font-semibold text-sm sm:text-base">
                         Skills
                       </label>
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => enhanceSection("skills")}
                         className="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm flex items-center gap-2"
                         disabled={loading}
                       >
                         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         Enhance
                       </motion.button>
                     </div>
                     <textarea
                       placeholder="e.g., JavaScript, Python, Project Management..."
                       value={formData.skills}
                       onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                       className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg h-32 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                       aria-label="Skills"
                     />
                   </div>
                   <div className="flex justify-between">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setStep("custom-2")}
                       className="px-6 py-3 bg-gray-600 rounded-lg text-white text-lg flex items-center gap-2"
                     >
                       <ArrowLeft className="w-5 h-5" /> Back
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setStep("preview")}
                       className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-lg flex items-center gap-2"
                     >
                       Preview <ArrowRight className="w-5 h-5" />
                     </motion.button>
                   </div>
                 </div>
               </div>
             );

           case "preview":
             return (
               <div>
                 <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                   ✨ Preview & Export ✨
                 </h3>
                 <div className="flex flex-col md:flex-row gap-8">
                   <div className="flex-1">
                     <div className="mb-6">
                       <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                         Select Template
                       </label>
                       <select
                         value={formData.template}
                         onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                         className="w-full p-4 bg-gray-700 rounded-lg text-gray-300 text-lg focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
                         aria-label="Select Template"
                       >
                         {Object.keys(templates).map((key) => (
                           <option key={key} value={key}>
                             {templates[key].name}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div className={`${templates[formData.template].class} text-lg`}>
                       <h4 className="font-bold text-xl">{formData.name || "Your Name"}</h4>
                       <p>{formData.email} | {formData.phone}</p>
                       <h5 className="font-semibold mt-4">Education</h5>
                       <p>{formData.education || "Add your education"}</p>
                       <h5 className="font-semibold mt-4">Experience</h5>
                       <p>{formData.experience || "Add your experience"}</p>
                       <h5 className="font-semibold mt-4">Skills</h5>
                       <p>{formData.skills || "Add your skills"}</p>
                     </div>
                   </div>
                   <div className="flex-1">
                     <p className="text-gray-200 text-lg mb-6">
                       ATS Score: {atsScore !== null ? `${atsScore}%` : "Calculating..."}
                     </p>
                     <div className="flex flex-col gap-4">
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => generateResume("pdf")}
                         className="py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                         disabled={loading}
                       >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                         Download PDF
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => generateResume("docx")}
                         className="py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                         disabled={loading}
                       >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                         Download Word
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => {
                           navigator.clipboard.writeText(
                             `${formData.name}\n${formData.email} | ${formData.phone}\n\nEducation\n${formData.education}\n\nExperience\n${formData.experience}\n\nSkills\n${formData.skills}`
                           );
                           toast.success("Resume text copied to clipboard!", { position: "top-right" });
                         }}
                         className="py-4 bg-gray-600 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                       >
                         <Copy className="w-5 h-5" /> Copy Text
                       </motion.button>
                     </div>
                   </div>
                 </div>
               </div>
             );

           default:
             return null;
         }
       };

       return (
         <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -50 }}
           className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto relative overflow-hidden"
         >
           <div className="absolute inset-0 pointer-events-none z-0">
             {dotPositions.map((pos, i) => (
               <motion.div
                 key={i}
                 className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-50"
                 style={{ left: pos.left, top: pos.top }}
                 animate={{
                   x: [0, Math.random() * 100 - 50],
                   y: [0, Math.random() * 100 - 50],
                   opacity: [0.3, 0.8, 0.3],
                 }}
                 transition={{
                   duration: 3 + Math.random() * 2,
                   repeat: Infinity,
                   repeatType: "reverse",
                   ease: "easeInOut",
                 }}
               />
             ))}
           </div>

           <div className="relative z-10">
             <AnimatePresence mode="wait">
               <motion.div
                 key={step}
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -50 }}
                 transition={{ duration: 0.3 }}
               >
                 {renderStep()}
               </motion.div>
             </AnimatePresence>

             <AnimatePresence>
               {error && (
                 <motion.div
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="mt-6 p-4 bg-red-500/20 rounded-lg text-red-300 text-lg"
                 >
                   {error}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           <ToastContainer />
         </motion.div>
       );
     }