"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from "formik";
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/helpers/supa"


const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function CreateProfile() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [formData, setFormData] = useState({
        profession: '',
        bio: ''
    });

    const initialValues = {
        file: "",
        fileDataURL: "",
        profession: "",
        bio: "",
    };

    // useFormik({
    //     initialValues,
    //     validateOnChange: true,
    //     validationOnBlur: false,
    //     onSubmit: async (values, action) => {
    //         let tid;
    //         try {
    //             const api = axios.create({
    //                 baseURL: 'http://localhost:5000',
    //             });
    //             tid = toast.loading("Updating profile ...")
    //             const res = await api.post('http://localhost:5000/api/user/register', values);
    //             if (res.status == 201) {
    //                 // Handle successful signup
    //                 console.log('Signup successful', res);
    //                 toast.success("update success ✌️", {
    //                     id: tid,
    //                     duration: 3000,
    //                 })
    //                 router.push('/')

    //             } else {
    //                 console.log('profile creation failed', res);
    //                 toast.error("error occoured 👎", {
    //                     id: tid,
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Error:", error);
    //             toast.error("error occured 👎", {
    //                 id: tid,
    //             });
    //         }
    //     }
    // })

    const handleChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const fData = new FormData();
        fData.append("profession", formData.profession);
        fData.append("bio", formData.bio);
        
        try {

            const filename = `${uuidv4()}-${file.name}`;
            console.log("storing the image");
            const { data, error } = await supabase.storage
                .from("ProfilePics")
                .upload(filename, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            const filepath = data.path;
            console.log(filepath)
            fData.append("profilePhoto", filepath);

            const api = axios.create({
                baseURL: 'http://localhost:5000',
                withCredentials: true,
            });
            const res = await api.post('http://localhost:5000/api/user/profile', fData)

            if (res.status == 201) {
                router.push('/')
            } else {
                router.push('/create-profile');
                console.log("Something went wrong");
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const changeHandler = (e) => {
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            alert("Image mime type is not valid");
            return;
        }
        setFile(file);
    }

    useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [file]);


    return (
        <div className="mx-auto w-full max-w-7xl bg-slate-100 py-2">
            <div className="mx-auto my-4 max-w-2xl md:my-6">
                {/* Form */}
                <div className="overflow-hidden rounded-xl bg-white p-4 shadow">
                    <h3 className="text-sm font-bold font-large text-gray-900 lg:px-8">Provide Personal Info</h3>
                    <div className="flex items-center space-x-2 m-5">
                        {fileDataURL ?
                            <img
                                className="inline-block h-12 w-12 rounded-full"
                                src={fileDataURL}
                                alt="Dan_Abromov"
                            /> : <img
                                className="inline-block h-12 w-12 rounded-full"
                                src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
                                alt="Dan_Abromov"
                            />}


                        <span className="text-sm font-medium text-gray-900">{"Dan Abromov"}</span>
                    </div>
                    <div className="mt-6 gap-6 space-y-4 md:grid md:grid md:space-y-0">
                        <div className="w-full">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="profession"
                            >
                                Profession
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                type="text"
                                placeholder="Enter your profession"
                                id="profession"
                                onChange={(e) => { handleChange(e) }}
                            ></input>
                        </div>
                        <div className="col-span-2 grid">
                            <div className="w-full">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="bio"
                                >
                                    Bio
                                </label>
                                <textarea
                                    className="flex h-40 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Tell us about yourself"
                                    id="bio"
                                    onChange={(e) => { handleChange(e) }}
                                ></textarea>
                            </div>
                        </div>
                        <div className='col-span-2 grid'>
                            <div className="w-full">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="bio"
                                >
                                    Upload Profile Picture
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload profile pic</span> or drag and drop profile pic</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={changeHandler} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 grid">
                            <button
                                type="button"
                                className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                onClick={(e) => { handleClick(e) }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
