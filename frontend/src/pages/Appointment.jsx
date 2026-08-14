import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const navigate = useNavigate()

    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [docInfo, setDocInfo] = useState(null)

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSlots = async () => {
        setDocSlots([])
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(today.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10, 0, 0, 0)
                currentDate.setMinutes(0, 0, 0, 0)
            }

            let timeSlots = []
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                
                // Check if slot is already booked
                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()
                const slotDate = day + '_' + month + '_' + year
                const slotBooked = docInfo?.slots_booked || {}

                if (!slotBooked[slotDate] || !slotBooked[slotDate].includes(formattedTime)) {
                    timeSlots.push({
                        dateTime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }
            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment')
            return navigate('/login')
        }

        try {
            const date = docSlots[slotIndex][0].dateTime

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            const slotDate = day + '_' + month + '_' + year

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    return docInfo && (
        <div>
            <div className='flex flex-col sm:flex-row gap-5 mt-5'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt='' />
                </div>
                <div className='flex-1 border border-blue-200 rounded-lg p-5 flex flex-col gap-3'>
                    <p className='text-2xl font-medium flex items-center gap-2'>
                        {docInfo.name}
                        <img className='w-4' src={assets.verified_icon} alt='' />
                    </p>
                    <div className='flex items-center gap-2 text-sm text-green-500'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full border-gray-500 text-gray-500'>
                            {docInfo.experience}
                        </button>
                    </div>
                    <div>
                        <p className='flex items-center gap-2 font-medium'>
                            About <img src={assets.info_icon} alt='' />
                        </p>
                        <p className='text-sm max-w-[700px] mt-1 text-gray-600'>{docInfo.about}</p>
                    </div>
                    <p className='text-lg font-medium'>
                        Appointment Fee: {currencySymbol}{docInfo.fees}
                    </p>
                </div>
            </div>

            {/*-----Booking Slots-----*/}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                
                {/* Check if doctor is available */}
                {docInfo.available ? (
                    <>
                        <p>Booking Slots</p>
                        <div className='flex gap-5 items-center w-full overflow-x-scroll mt-4'>
                            {docSlots.length && docSlots.map((item, index) => (
                                <div
                                    onClick={() => setSlotIndex(index)}
                                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300'}`}
                                    key={index}>
                                    <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                                    <p>{item[0] && item[0].dateTime.getDate()}</p>
                                </div>
                            ))}
                        </div>

                        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                            {docSlots.length && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
                                <p
                                    onClick={() => setSlotTime(item.time)}
                                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'border border-gray-300'}`}
                                    key={index}>
                                    {item.time.toLowerCase()}
                                </p>
                            ))}
                        </div>

                        <button
                            onClick={bookAppointment}
                            className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                            Book Appointment
                        </button>
                    </>
                ) : (
                    /* Doctor Not Available */
                    <div className='flex flex-col items-center gap-4 my-10'>
                        <div className='flex items-center gap-2'>
                            <p className='w-3 h-3 bg-gray-400 rounded-full'></p>
                            <p className='text-gray-500 text-lg font-medium'>Not Available</p>
                        </div>
                        <p className='text-gray-400 text-sm'>
                            This doctor is currently not available for appointments.
                        </p>
                        <button
                            onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }}
                            className='bg-primary text-white px-8 py-3 rounded-full text-sm'>
                            Browse Other Doctors
                        </button>
                    </div>
                )}

            </div>

            {/* Related Doctors */}
            {docInfo && (
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            )}
        </div>
    )
}

export default Appointment