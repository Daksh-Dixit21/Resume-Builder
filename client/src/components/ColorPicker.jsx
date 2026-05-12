import React, {useState} from 'react'
import { Check, Palette } from 'lucide-react';

const ColorPicker = ({selectedColor, onChange}) => {
  
    const colors = [
        {name: "Blue", value: "#3B82F6"},
        {name: "Sky", value: "#0284C7"},
        { name: "Indigo", value: "#6366F1"},
        {name: "Purple", value: "#8B5CF6"},
        {name: "Violet", value: "#7C3AED"},
        {name: "Green", value: "#059669"},
        {name: "Emerald", value: "#10B981"},
        {name: "Lime", value: "#65A30D"},
        {name: "Red", value: "#EF4444"},
        {name: "Rose", value: "#E11D48"},
        {name: "Orange", value: "#F97316"},
        {name: "Amber", value: "#D97706"},
        {name: "Teal", value: "#14B8A6"},
        {name: "Cyan", value: "#06B6D4"},
        {name: "Pink", value: "#EC4899"},
        {name: "Fuchsia", value: "#C026D3"},
        {name: "Gray", value: "#6B7280"},
        {name: "Slate", value: "#334155"},
        {name: "Black", value: "#1F2937"}
    ]

    const [isOpen, setIsOpen] = useState(false);
  
    return (
    <div className='relative'>
        <button onClick={()=> setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-purple-600 bg-linear-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'>
            <Palette size={16} />
            <span className='max-sm:hidden'>Accent</span>
        </button>
        {isOpen && (
            <div className='grid grid-cols-5 w-72 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                {colors.map((color) => (
                    <div key={color.value} className='relative cursor-pointer group flex flex-col items-center' onClick={() => { onChange(color.value); setIsOpen(false) }}>
                        <div className='relative'>
                            <div className='w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors' style={{ backgroundColor: color.value }} />
                            {selectedColor === color.value && (
                                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                                    <Check size={14} color="#ffffff" />
                                </div>
                            )}
                        </div>
                        <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
                    </div>
                ))}

            </div>
        )}
    </div>
  )
}

export default ColorPicker
