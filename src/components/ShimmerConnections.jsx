import { motion } from "framer-motion";

const ShimmerConnections = () => {
  return (
    <motion.section
      className="min-h-screen mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
        {/* Header shimmer */}
        <div className="mx-auto max-w-screen-sm text-center mb-8">
          <div className="h-8 w-60 mx-auto rounded-xl shimmer-bg"></div>
        </div>

        {/* Cards shimmer */}
        <div className="flex flex-col gap-6 items-center">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="flex items-center rounded-xl border border-gray-700 shadow-2xl shadow-gray-900/60 
                        w-[360px] sm:w-[450px] mx-auto bg-slate-800/25 backdrop-blur-sm p-4 sm:p-6 shimmer-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile circle shimmer */}
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-slate-700/60 shimmer-bg flex-shrink-0"></div>

              {/* Text shimmer */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-40 bg-slate-700/60 rounded shimmer-bg"></div>
                  <div className="h-7 w-16 ml-2 bg-slate-700/60 rounded-lg shimmer-bg"></div>
                </div>

                <div className="h-4 w-48 bg-slate-700/60 rounded shimmer-bg"></div>

                <div className="h-4 w-40 bg-slate-700/60 rounded shimmer-bg"></div>

                <div className="h-3 w-32 bg-slate-700/60 rounded shimmer-bg"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ShimmerConnections;
