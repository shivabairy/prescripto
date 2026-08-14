import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>

      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Left */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />

          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Prescripto is committed to simplifying healthcare access by
            connecting patients with trusted doctors. Browse specialists,
            book appointments seamlessly, and manage your healthcare
            journey all in one place.
          </p>
        </div>

        {/* Center */}
        <div>
          <p className='text-xl font-medium mb-5'>
            COMPANY
          </p>

          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='cursor-pointer'>Home</li>
            <li className='cursor-pointer'>About Us</li>
            <li className='cursor-pointer'>Contact Us</li>
            <li className='cursor-pointer'>Privacy Policy</li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <p className='text-xl font-medium mb-5'>
            GET IN TOUCH
          </p>

          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>info@prescripto.com</li>
            <li>798 Healthcare Street, Medical City</li>
          </ul>
        </div>

      </div>

      <hr />

      <p className='py-5 text-sm text-center'>
        Copyright © 2026 Prescripto - All Rights Reserved.
      </p>

    </div>
  )
}

export default Footer