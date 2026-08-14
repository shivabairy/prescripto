import React from 'react'
import {assets} from '../assets/assets'


const Contact = () => {
  return (
    <div>
      <div className = 'flex items-center justify-center text-gray-900 text-2xl font-medium'>
        <p>CONTACT <span className='text-blue-700 font-medium'>US</span></p>
      </div>
      <div className='flex flex-col justify-center md:flex-row gap-10 mt-10 px-3 sm:px-0'>
        <img className='w-full md:max-w-[360px]' src = {assets.contact_image} alt='/'></img>
        <div className='flex flex-col justify-center items-start gap-4 text-sm'>
          <p className='font-semibold text-lg text-gray-700'>OUR OFFICE</p>
          <p>54709 Willms Station<br/>Suite 350, Washington, USA </p>
          <p>Tel: (415) 555‑0132 <br/>Email: info@prescripto.com</p>
          <p className='font-semibold text-lg text-gray-700'>CARRERS AT PRESCRIPTO</p>
          <p>Learn more about our teams and job openings.</p>
          <button className='bg-white-700 text-gray border border-black py-2 px-4 rounded-md hover:bg-gray-100'>Explore Opportunities</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
