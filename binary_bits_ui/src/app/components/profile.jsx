export default function Profile({ name, followers, bio, photo_url, country, github, organization }) {
    return (
        <section className="px-2 py-10 md:px-0">
            <div className="mx-auto max-w-4xl">
                <div className="md:flex md:items-center md:justify-center md:space-x-14">
                    <div className="relative h-auto w-48 md:flex md:flex-col flex-shrink-0 items-center justify-center">
                        <img
                            className="relative h-48 w-48 rounded-full object-cover"
                            src={photo_url}
                            alt="profilePhoto"
                        />
                    </div>
                    <p className="mt-7 text-lg font-semibold text-black md:text-center">{name}</p>
                    <p className="text-md font-normal">{organization}</p>
                    <p>{github}</p>
                    <p>{country}</p>
                    <p className="mt-1 text-base text-gray-600 md:text-center">{followers} Followers </p>
                    <button className=' px-4 bg-gray-950 text-white rounded-lg'>Follow</button>
                    <div className="mt-10 md:mt-0">
                        <blockquote>
                            <p className="text-xl text-black">{bio}</p>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    )
}