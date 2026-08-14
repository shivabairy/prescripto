import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currencySymbol, backendUrl } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available
            }

            console.log('Sending to:', backendUrl + '/api/doctor/update-profile')
            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile',
                updateData,
                { headers: { dtoken: dToken } }
            )

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>

                {/* Profile Image */}
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt='' />
                </div>

                {/* Profile Info */}
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* Name & Degree */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {profileData.name}
                    </p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {profileData.experience}
                        </button>
                    </div>

                    {/* About */}
                    <div className='mt-3'>
                        <p className='text-sm font-medium text-neutral-800'>About:</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
                    </div>

                    {/* Fees */}
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment Fee:
                        <span className='text-gray-800'>
                            {' '}{currencySymbol}
                            {isEdit
                                ? <input
                                    type='number'
                                    className='border rounded px-2 py-1 ml-1 w-24'
                                    onChange={(e) => setProfileData(prev => ({
                                        ...prev, fees: e.target.value
                                    }))}
                                    value={profileData.fees}
                                  />
                                : profileData.fees
                            }
                        </span>
                    </p>

                    {/* Address */}
                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'>
                            {isEdit
                                ? <span>
                                    <input
                                        className='border rounded px-2 py-1 mb-1 block'
                                        type='text'
                                        onChange={(e) => setProfileData(prev => ({
                                            ...prev,
                                            address: { ...prev.address, line1: e.target.value }
                                        }))}
                                        value={profileData.address?.line1 || ''}
                                    />
                                    <input
                                        className='border rounded px-2 py-1 block'
                                        type='text'
                                        onChange={(e) => setProfileData(prev => ({
                                            ...prev,
                                            address: { ...prev.address, line2: e.target.value }
                                        }))}
                                        value={profileData.address?.line2 || ''}
                                    />
                                  </span>
                                : <span>
                                    {profileData.address?.line1}
                                    <br />
                                    {profileData.address?.line2}
                                  </span>
                            }
                        </p>
                    </div>

                    {/* Availability */}
                    <div className='flex gap-1 pt-2'>
                        <input
                            type='checkbox'
                            checked={profileData.available}
                            onChange={() => isEdit && setProfileData(prev => ({
                                ...prev, available: !prev.available
                            }))}
                        />
                        <label>Available</label>
                    </div>

                    {/* Buttons */}
                    <div className='mt-5'>
                        {isEdit
                            ? <button
                                onClick={updateProfile}
                                className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'>
                                Save Information
                              </button>
                            : <button
                                onClick={() => setIsEdit(true)}
                                className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'>
                                Edit
                              </button>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile