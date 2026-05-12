import React, { useState } from 'react'
import { Check, Type } from 'lucide-react'

const fonts = [
  { name: 'Outfit', value: 'Outfit' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Playfair', value: 'Playfair Display' },
  { name: 'System', value: 'Arial' },
]

const FontPicker = ({ selectedFont = 'Outfit', onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-slate-600 bg-linear-to-br from-slate-50 to-slate-100 ring-slate-300 hover:ring transition-all px-3 py-2 rounded-lg'>
        <Type size={16} />
        <span className='max-sm:hidden'>Font</span>
      </button>
      {isOpen && (
        <div className='absolute top-full left-0 w-56 p-2 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
          {fonts.map(font => (
            <button key={font.value} onClick={() => { onChange(font.value); setIsOpen(false) }} className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded text-sm hover:bg-slate-50 ${selectedFont === font.value ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'}`} style={{ fontFamily: `"${font.value}", sans-serif` }}>
              {font.name}
              {selectedFont === font.value && <Check className='size-4' />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FontPicker
