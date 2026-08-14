import React from 'react'
import {assets} from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-gray-900 text-2xl pt-10 mt-5'>
        <p>
          ABOUT <span className='text-blue-700 font-medium'>US</span>
        </p>
      </div>

      <div className='flex flex-col gap-12 my-10 text-gray-700 px-3 sm:px-0 md:flex-row'>
          <img className='w-full md:max-w-[360px]' src={assets.about_image} alt=""/>
          <div className='flex flex-col gap-3 text-sm md:max-w-lg'>
           <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
           <p>
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
           </p>
           <b className='text-gray-900'>Our Vision</b>
           <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
          </div>
      </div>

      <div>
        <p className='text-center text-gray-900 text-xl font-semibold'>Why Choose Us</p>
      </div>
      <div className='flex flex-col gap-10 my-10 text-gray-700 px-3 sm:px-0 md:flex-row'>
        <div className='border px-10 md:px-20 py-10 rounded-lg hover:shadow-lg transition-shadow duration-500'>
          <b>Efficiency :</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='border px-10 md:px-20 py-10 rounded-lg hover:shadow-lg transition-shadow duration-500'>
          <b>Convenience :</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='border px-10 md:px-20 py-10 rounded-lg hover:shadow-lg transition-shadow duration-500'>
          <b>Personalization :</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>

      </div>
    </div>
  )
}

export default About
