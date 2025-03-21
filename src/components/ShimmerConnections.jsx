import { motion } from "framer-motion";

const ShimmerConnections = () => {
  return (
    <motion.section
      className="min-h-screen mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-12">
          <motion.h2
            className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Loading your connections...
          </motion.h2>
        </div>

        <motion.div
          className="grid gap-6 lg:gap-8 md:grid-cols-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="flex items-center rounded-lg shadow w-160 mx-auto bg-gray-800 border-gray-700 p-4 sm:p-6 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-28 object-cover sm:w-80 sm:h-40 rounded-full bg-gray-600"></div>

              <div className="p-4 w-full">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-600 rounded w-2/3 mb-2"></div>
                </div>

                <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/4 mb-2"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ShimmerConnections;
