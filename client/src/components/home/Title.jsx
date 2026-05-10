import React from 'react'

const Title = ({title, description}) => {
  return (
    <div className='text-center mt-6 mb-2'>
        <h2 className='text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight'>{title}</h2>
        <p className='max-w-2xl mx-auto mt-4 text-slate-500 leading-relaxed'>{description}</p>
    </div>
  )
}

export default Title