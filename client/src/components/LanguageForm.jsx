import { Languages, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const LanguageForm = ({ data = [], onChange }) => {

    const addLanguage = () => {
        const newLang = {
            name: "",
            level: ""
        };
        onChange([...data, newLang])
    }

    const removeLanguage = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateLanguage = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const levels = ["Native", "Fluent", "Professional", "Intermediate", "Elementary"]

    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Languages </h3>
                    <p className='text-sm text-gray-500'>Add languages you speak</p>
                </div>
                <button onClick={addLanguage} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors'>
                    <Plus className='size-4' />
                    Add Language
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Languages className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No languages added yet.</p>
                </div>) : (
                <div className="space-y-4">
                    {data.map((lang, index) => (
                        <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                            <div className='flex justify-between items-start'>
                                <h4>Language #{index + 1}</h4>
                                <button onClick={() => removeLanguage(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>
                                <input value={lang.name || ""} onChange={(e) => updateLanguage(index, "name", e.target.value)} type="text" placeholder='Language (e.g. English)' className='px-3 py-2 text-sm rounded-lg' />
                                <select value={lang.level || ""} onChange={(e) => updateLanguage(index, "level", e.target.value)} className='px-3 py-2 text-sm rounded-lg'>
                                    <option value="">Select Level (Optional)</option>
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguageForm