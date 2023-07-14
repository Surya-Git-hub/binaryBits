import React from 'react';

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center">
        <img
          className="w-20 h-20 rounded-full mr-4"
          src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
          alt="Profile Picture"
        />
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-600">Frontend Developer</p>
          <p className="text-gray-600">San Francisco, CA</p>
          <div className="flex mt-4">
            <a
              className="text-blue-500 hover:text-blue-700 mr-4"
              href="https://twitter.com/johndoe"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              className="text-blue-500 hover:text-blue-700"
              href="https://github.com/johndoe"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Featured Articles</h2>
        {/* Add your featured articles section here */}
      </div>

      <div className="mt-8 h-screen">
        <h2 className="text-xl font-bold mb-4">Articles</h2>
        {/* Add your articles section here */}
      </div>
    </div>
  );
};

export default ProfilePage;
