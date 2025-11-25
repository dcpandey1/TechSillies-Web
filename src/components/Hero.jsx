import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-blue-950 to-gray-950 opacity-20"></div>
        <div className="absolute inset-0 bg-auto bg-center"></div>

        <div className="container mx-auto lg:px-12 px-5 py-16 md:py-32 relative z-10 lg:h-[90vh]">
          <div className="flex flex-col md:flex-row items-center justify-around">
            {/* Left Content */}
            <div className="w-full md:w-1/2 mb-12 md:mb-0 relative">
              <h1 className="text-3xl md:text-7xl font-bold mb-6 leading-tight">
                Ask for Referral
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary inline-block text-transparent bg-clip-text">
                  Hassle-free
                </span>
              </h1>

              <p className="text-lg sm:text-2xl mb-5 text-gray-300">
                No small talk. No spam. Just connect with real employees and request the referrals you need.
              </p>

              <div className="flex flex-col w-1/12 sm:w-auto sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/login">
                  <button className="group relative w-full sm:w-auto px-6 py-3 min-w-[160px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg  group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <span className="text-white font-medium text-sm sm:text-lg">Get Started</span>
                      <svg
                        className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Card */}
            <div className="w-full md:w-2/5 md:pl-12">
              <div className="relative rounded-3xl p-8  bg-slate-800/25 backdrop-blur-sm  border border-gray-700 shadow-2xl border-white/20   shadow-gray-900/70  overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02]">
                {/* Shimmer effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.5s_infinite]"></div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-6 drop-shadow-sm">Why Use Tech Sillies?</h2>
                  <ul className="space-y-5 text-lg">
                    <li className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-lime-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Find employees by company instantly</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span>No spam — employees control availability</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7"
                        />
                      </svg>
                      <span>AI-powered resume match & score</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-rose-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      <span>One-click referral requests, no DMs needed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
