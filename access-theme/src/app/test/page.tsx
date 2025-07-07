"use client"; 
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const plates = [
  { id: 1, src: "/ishihara/plate1.jpg", expected: "12", type: "control" },
  { id: 2, src: "/ishihara/plate2.jpg", expected: { normal: "8", protan: "3", deutan: "3" }, type: "screening" },
  { id: 3, src: "/ishihara/plate3.jpg", expected: { normal: "6", protan: "6", deutan: "5" }, type: "screening" },
  { id: 5, src: "/ishihara/plate5.jpg", expected: { normal: "45", protan: "5", deutan: "45" }, type: "screening" },
  { id: 7, src: "/ishihara/plate7.jpg", expected: { normal: "5", protan: "-", deutan: "-" }, type: "screening" },
  { id: 22, src: "/ishihara/plate22.jpg", expected: { normal: "26", protan: "6", deutan: "2" }, type: "diagnostic" },
  { id: 23, src: "/ishihara/plate23.jpg", expected: { normal: "42", protan: "2", deutan: "4" }, type: "diagnostic" },
  { id: 24, src: "/ishihara/plate24.jpg", expected: { normal: "35", protan: "5", deutan: "3" }, type: "diagnostic" },
  { id: 25, src: "/ishihara/plate25.jpg", expected: { normal: "96", protan: "6", deutan: "9" }, type: "diagnostic" }
];

export default function ColorBlindTestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const currentPlate = plates[step];

  const handleSubmit = () => {
    if (!input.trim()) return;
    setAnswers([...answers, input.trim()]);
    setInput("");
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    const updatedAnswers = [...answers];
    updatedAnswers.pop();
    setAnswers(updatedAnswers);
    setStep(step - 1);
    setInput(updatedAnswers[step - 1] || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (step >= plates.length) {
    return <ResultPage answers={answers} />;
  }

  const progressPercentage = ((step + 1) / plates.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-inter p-4 flex items-center justify-center">
      <motion.div 
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            Color Vision Test
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Step {step + 1} of {plates.length}
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut",
                delay: 0.4
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                }}
              />
            </motion.div>
          </div>
          <motion.span 
            className="block text-center text-gray-600 font-medium mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {Math.round(progressPercentage)}% Complete
          </motion.span>
        </motion.div>

        {/* Plate Section with Animated Image */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPlate.id}
                className="w-full max-w-sm h-auto rounded-2xl shadow-xl border-4 border-white mx-auto"
                src={currentPlate.src}
                alt={`Ishihara test plate ${currentPlate.id}`}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: 90
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: -90
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              />
            </AnimatePresence>
            
            <motion.div 
              className="flex justify-center gap-4 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.span 
                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Plate {currentPlate.id}
              </motion.span>
              <motion.span 
                className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold capitalize"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPlate.type}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label htmlFor="number-input" className="block text-xl font-semibold text-gray-800 mb-4">
            What number do you see?
          </label>
          <motion.input
            id="number-input"
            className="w-48 px-6 py-4 text-xl font-semibold text-center border-3 border-gray-200 rounded-2xl bg-white text-gray-800 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
            type="text"
            placeholder="Enter number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoFocus
            whileFocus={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          />
          <p className="text-gray-500 mt-3 text-sm">
            If you don&apos;t see a number, enter &quot;0&quot; or leave blank
          </p>
        </motion.div>

        {/* Button Section */}
        <motion.div 
          className="flex justify-center items-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {step > 0 && (
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none px-8 py-4 text-lg font-semibold rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/30 min-w-[180px] min-h-[48px] justify-center"
              onClick={handleBack}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                animate={{ x: [-2, 0, -2] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                ←
              </motion.span>
              Back
            </motion.button>
          )}
          
          <motion.button
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none px-8 py-4 text-lg font-semibold rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/30 min-w-[180px] min-h-[48px] justify-center ${
              !input.trim() ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            onClick={handleSubmit}
            disabled={!input.trim()}
            whileHover={input.trim() ? { 
              scale: 1.05,
              boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)"
            } : {}}
            whileTap={input.trim() ? { scale: 0.95 } : {}}
          >
            {step === plates.length - 1 ? "Complete Test" : "Next Plate"}
            <motion.span
              animate={input.trim() ? { x: [0, 2, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ResultPage({ answers }: { answers: string[] }) {
  const result = analyze(answers);

  const conditionDetails = {
    Protanopia: {
      title: "What is Protanopia?",
      description:
        "Protanopia is a type of red-green color blindness where the red cones (photopigments) in the eye are absent. This makes it difficult to distinguish between red and green hues.",
      cause:
        "It is a genetic condition caused by a mutation on the X chromosome affecting the L-cone photopigment. It is more common in males.",
    },
    Deuteranopia: {
      title: "What is Deuteranopia?",
      description:
        "Deuteranopia is a form of red-green color blindness where the green cones (photopigments) are missing, causing confusion between green and red shades.",
      cause:
        "It is also hereditary and results from anomalies in the M-cone photopigments of the retina. Like Protanopia, it is more prevalent in men.",
    },
  };

  const likelyType =
    result.type.includes("Protanopia") ? "Protanopia" :
    result.type.includes("Deuteranopia") ? "Deuteranopia" :
    null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-inter p-4 flex items-center justify-center">
      <motion.div 
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
          >
            {result.type === "Invalid Test" ? "⚠️" :
              result.type === "Normal Vision" ? "✅" : "📋"}
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-800">Test Complete</h2>
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div 
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold inline-block">
              {result.type}
            </span>
          </motion.div>
          <p className="text-lg text-gray-600 leading-relaxed">{result.message}</p>
        </motion.div>

        {likelyType && (
          <motion.div 
            className="bg-amber-50 border-l-6 border-amber-500 p-6 rounded-xl mb-8 text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-amber-800 text-xl font-semibold mb-3">
              {conditionDetails[likelyType].title}
            </h3>
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>Explanation:</strong> {conditionDetails[likelyType].description}
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Cause:</strong> {conditionDetails[likelyType].cause}
            </p>
          </motion.div>
        )}

        <motion.div 
          className="flex gap-4 justify-center mb-8 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/30 min-w-[160px]"
            onClick={() => window.location.reload()}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Take Test Again
          </motion.button>
          <motion.button
            className="bg-gray-100 text-gray-700 px-8 py-4 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 min-w-[160px]"
            onClick={() =>
              window.open(
                "https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness",
                "_blank"
              )
            }
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Important:</strong> This test is for screening purposes only.
            For a definitive diagnosis, please consult with an eye care professional.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function analyze(answers: string[]) {
  const incorrect = (i: number) => {
    const userAnswer = answers[i];
    const correctAnswer = typeof plates[i].expected === "string"
      ? plates[i].expected
      : plates[i].expected.normal;
    return userAnswer !== correctAnswer;
  };

  const failedControl = incorrect(0);
  const screeningFails = [1, 2, 3, 4].filter(i => incorrect(i));
  const diagnostics = answers.slice(5).map((ans, i) => ({
    plate: plates[i + 5],
    answer: ans,
  }));

  let likely = "normal";
  let protanScore = 0;
  let deutanScore = 0;

  diagnostics.forEach(({ plate, answer }) => {
    if (
      typeof plate.expected !== "string" &&
      plate.expected.protan === answer
    )
      protanScore++;
    if (
      typeof plate.expected !== "string" &&
      plate.expected.deutan === answer
    )
      deutanScore++;
  });

  if (protanScore >= 3) likely = "Protanopia";
  else if (deutanScore >= 3) likely = "Deuteranopia";

  return {
    type: failedControl ? "Invalid Test" : screeningFails.length >= 2 ? `Likely ${likely}` : "Normal Vision",
    message: failedControl
      ? "Test conditions may not be optimal. Please ensure good lighting and retake the test."
      : screeningFails.length >= 2
        ? `Results suggest possible ${likely}. We recommend consulting an eye care professional for comprehensive testing.`
        : "No significant signs of color vision deficiency detected. Your color vision appears normal."
  };
}