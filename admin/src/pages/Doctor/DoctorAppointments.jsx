import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)

    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    }

    const calculateAge = (dob) => {
        if (!dob || dob === 'Not Specified') return 'N/A'
        const today = new Date()
        const birthDate = new Date(dob)
        return today.getFullYear() - birthDate.getFullYear()
    }

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>

                {/* Appointments */}
                {appointments.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                        key={index}>

                        <p className='max-sm:hidden'>{index + 1}</p>

                        <div className='flex items-center gap-2'>
                            <img className='w-8 rounded-full' src={item.userData.image} alt='' />
                            <p>{item.userData.name}</p>
                        </div>

                        <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

                        <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

                        <p>${item.amount}</p>

                        {item.cancelled
                            ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                            : item.isCompleted
                                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                                : <div className='flex gap-2'>
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className='text-xs border border-red-400 text-red-400 px-2 py-1 rounded hover:bg-red-400 hover:text-white transition-all'>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => completeAppointment(item._id)}
                                            className='text-xs border border-green-400 text-green-400 px-2 py-1 rounded hover:bg-green-400 hover:text-white transition-all'>
                                            Complete
                                        </button>
                                    </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DoctorAppointments