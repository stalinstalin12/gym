import SubNav from "./subNav";

const ContactPage = () => {
  return (<div><SubNav/>
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      
      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl p-6">
        {/* Left Section */}
        <div className="lg:w-1/2 p-6 space-y-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          <div>
            <h2 className="font-semibold text-lg">Address</h2>
            <p className="text-gray-400">4671 Sugar Camp Road, Owatonna, Minnesota, 55060</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Phone</h2>
            <p className="text-gray-400">507-475-6094</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Email</h2>
            <p className="text-gray-400">wrub7d780@temporary-mail.net</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 bg-white rounded-lg p-6 shadow-lg text-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-center">Send Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;
