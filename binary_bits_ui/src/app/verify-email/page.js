"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function verifyEmail() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // console.log("router",router);

    useEffect(() => {
        // Check if the token is available in the URL query parameters
        if (token) {
            // Make a GET request to the backend API with the token
            axios
                .get(`http://localhost:5000/api/user/verify?token=${token}`)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                    if (response.status==200){
                        router.push('/sign-in')
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    return (
        <div>
            <h1>Backend Data</h1>
            {loading ? (
                <p>Loading...</p>
            ) : data ? (
                <p>{data.message}</p>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};
