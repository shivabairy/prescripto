import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext)
    const [appointments, setAppointments] = useState([])
    const navigate = useNavigate()

    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/user/appointments',
                { headers: { token } }
            )
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
                { appointmentId },
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Prescripto',
            description: 'Appointment Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        backendUrl + '/api/user/verifyRazorpay',
                        response,
                        { headers: { token } }
                    )
                    if (data.success) {
                        toast.success('Payment Successful!')
                        getUserAppointments()
                    }
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/payment-razorpay',
                { appointmentId },
                { headers: { token } }
            )
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
            <div>
                {appointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={index}>
                        
                        {/* Doctor Image */}
                        <div>
                            <img className='w-32 bg-indigo-50 rounded-lg' src={item.docData.image} alt='' />
                        </div>

                        {/* Doctor Info */}
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold text-base'>{item.docData.name}</p>
                            <p className='text-primary'>{item.docData.speciality}</p>
                            <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                            <p>{item.docData.address.line1}</p>
                            <p>{item.docData.address.line2}</p>
                            <p className='mt-1'>
                                <span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                                {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>

                            {/* Payment Status Badge */}
                            {item.payment && !item.cancelled && (
                                <div className='flex items-center gap-1 mt-2'>
                                    <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                    <span className='text-xs text-green-600 font-medium'>Payment Confirmed</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col gap-2 justify-end min-w-[180px]'>

                            {/* Not cancelled, not paid, not completed → show Pay & Cancel */}
                            {!item.cancelled && !item.payment && !item.isCompleted && <>
                                <button
                                    onClick={() => appointmentRazorpay(item._id)}
                                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300'>
                                    💳 Pay Online
                                </button>
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300'>
                                    Cancel Appointment
                                </button>
                            </>}

                            {/* Paid but not completed → show Paid badge + Cancel */}
                            {!item.cancelled && item.payment && !item.isCompleted && <>
                                <div className='sm:min-w-48 py-2 px-4 bg-green-50 border border-green-400 rounded-lg flex items-center justify-center gap-2'>
                                    <svg className='w-4 h-4 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                    </svg>
                                    <span className='text-green-600 text-sm font-medium'>Paid</span>
                                </div>
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300'>
                                    Cancel Appointment
                                </button>
                            </>}

                            {/* Cancelled */}
                            {item.cancelled && !item.isCompleted &&
                                <div className='sm:min-w-48 py-2 px-4 bg-red-50 border border-red-400 rounded-lg flex items-center justify-center gap-2'>
                                    <svg className='w-4 h-4 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                    <span className='text-red-500 text-sm font-medium'>Appointment Cancelled</span>
                                </div>
                            }

                            {/* Completed */}
                            {item.isCompleted &&
                                <div className='sm:min-w-48 py-2 px-4 bg-blue-50 border border-blue-400 rounded-lg flex items-center justify-center gap-2'>
                                    <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                    <span className='text-blue-500 text-sm font-medium'>Completed</span>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments