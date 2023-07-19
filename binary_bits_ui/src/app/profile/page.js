// import React from 'react';

// const ProfilePage = () => {
//     return (
//         <div className="container mx-auto px-4 py-8">

//             <div className="flex items-center">
//                 <img
//                     className="w-20 h-20 rounded-full mr-4"
//                     src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
//                     alt="Profile Picture"
//                 />
//                 <div>
//                     <h1 className="text-2xl font-bold">John Doe</h1>
//                     <p className="text-gray-600">Frontend Developer</p>
//                     <p className="text-gray-600">San Francisco, CA</p>
//                     <div className="flex mt-4">
//                         <a
//                             className="text-blue-500 hover:text-blue-700 mr-4"
//                             href="https://twitter.com/johndoe"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             Twitter
//                         </a>
//                         <a
//                             className="text-blue-500 hover:text-blue-700"
//                             href="https://github.com/johndoe"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             GitHub
//                         </a>
//                     </div>
//                 </div>
//                 <div className="flex mt-4">
//                         <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
//                             Follow
//                         </button>
//                         <div>
//                             <p className="font-bold">Followers: 100</p>
//                             <p className="font-bold">Following: 50</p>
//                         </div>
//                     </div>
//             </div>
//             <p className="mt-4">
//                 Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 Phasellus et varius urna.
//             </p>
//             <p className="mt-2">Organization: ABC Company</p>
//             <div className="mt-8">
//                 <h2 className="text-xl font-bold mb-4">Featured Articles</h2>
//                 {/* Add your featured articles section here */}
//             </div>

//             <div className="mt-8 h-screen">
//                 <h2 className="text-xl font-bold mb-4">Articles</h2>
//                 {/* Add your articles section here */}
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;

import React from 'react'

export default function Profile() {
    return (
        <section className="px-2 py-10 md:px-0">
            <div className="mx-auto max-w-4xl">
                <div className="md:flex md:items-center md:justify-center md:space-x-14">
                    <div className="relative h-auto w-48 md:flex md:flex-col flex-shrink-0 items-center justify-center">
                        <img
                            className="relative h-48 w-48 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                            alt=""
                        />
                    </div>
                    <p className="mt-7 text-lg font-semibold text-black text-center">John Doe</p>
                        <p className="mt-1 text-base text-gray-600 text-center">{733} Followers </p>
                        <button className= ' px-4 bg-gray-950 text-white rounded-lg'>Follow</button>

                    <div className="mt-10 md:mt-0">
                        <blockquote>
                            <p className="text-xl text-black">
                                “Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam aliquam repellat
                                laborum minima tempore deserunt explicabo placeat! Fugit, molestias nesciunt.”
                            </p>
                        </blockquote>
                        
                    </div>
                </div>
            </div>
        </section>
    )
}
