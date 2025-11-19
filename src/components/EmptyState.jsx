import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export const EmptyState = ({ message }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex justify-center items-center mt-2 px-4 py-8 sm:py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        {/* Cute Dog SVG */}
        <motion.svg
          width="250"
          height="250"
          viewBox="0 0 250 250"
          className="mx-auto mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* Dog body */}
          <ellipse cx="125" cy="155" rx="55" ry="37" fill="#ffffff" />
          <ellipse cx="125" cy="162" rx="75" ry="22" fill="#0f172a" opacity="0.45" />

          {/* Front paws */}
          <ellipse cx="100" cy="160" rx="12" ry="10" fill="#ffffff" />
          <ellipse cx="150" cy="160" rx="12" ry="10" fill="#ffffff" />

          {/* Dog head */}
          <circle cx="125" cy="105" r="43" fill="#ffffff" />

          {/* Ears */}
          <path d="M92 85 C78 63 76 52 84 50 C92 48 100 60 105 72 Z" fill="#fb923c" />
          <path d="M158 85 C172 63 174 52 166 50 C158 48 150 60 145 72 Z" fill="#fb923c" />

          {/* Eye patches */}
          <circle cx="108" cy="105" r="12.5" fill="#ffffff" />
          <circle cx="142" cy="105" r="12.5" fill="#ffffff" />

          {/* Eyes */}
          <circle cx="108" cy="105" r="5" fill="#020617" />
          <circle cx="142" cy="105" r="5" fill="#020617" />

          {/* Nose */}
          <ellipse cx="125" cy="118" rx="7" ry="6" fill="#111827" />

          {/* Mouth */}
          <path
            d="M118 125 Q125 133 132 125"
            stroke="#111827"
            strokeWidth="2.3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Blush */}
          <circle cx="100" cy="113" r="5" fill="#fecaca" opacity="0.85" />
          <circle cx="150" cy="113" r="5" fill="#fecaca" opacity="0.85" />

          {/* Tail */}
          <path
            d="M172 150 Q190 142 194 128"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Little stars */}
          <circle cx="75" cy="75" r="3.3" fill="#38bdf8" />
          <circle cx="175" cy="70" r="3.3" fill="#4f46e5" />
          <circle cx="70" cy="150" r="2.8" fill="#22c55e" />
          <circle cx="178" cy="160" r="2.8" fill="#eab308" />
        </motion.svg>

        {/* Title */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          You are all caught up !!
        </motion.h2>

        {/* Message */}
        <motion.p
          className="mt-2 text-lg sm:text-xl md:text-2xl text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {message}
          <br />
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate("/")}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Users
        </motion.button>
      </div>
    </motion.div>
  );
};
