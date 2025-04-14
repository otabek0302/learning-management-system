const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      {/* Hero Section */}
      <section className="text-center mt-20">
        <h1 className="text-5xl font-bold mb-4">Learn Anything, Anytime, Anywhere 🌎</h1>
        <p className="text-lg text-gray-600 mb-6">
          Join thousands of learners on the best LMS platform.
        </p>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl">
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Expert Instructors</h2>
          <p className="text-gray-500">Learn from industry experts who love teaching.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Flexible Learning</h2>
          <p className="text-gray-500">Study at your own pace with lifetime access.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Certifications</h2>
          <p className="text-gray-500">Earn certificates to boost your career.</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
