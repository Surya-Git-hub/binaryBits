import React from 'react'
import SignUp from '../components/signup'

const page = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-1/3">
                <SignUp />
            </div>
        </div>
    )
}

export default page;