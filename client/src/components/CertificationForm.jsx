import { Award, Plus, Trash2, ExternalLink } from 'lucide-react'
import React from 'react'

const CertificationForm = ({ data = [], onChange }) => {

    const addCertification = () => {
        const newCert = {
            name: "",
            issuer: "",
            date: "",
            link: ""
        };
        onChange([...data, newCert])
    }

    const removeCertification = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateCertification = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Certifications </h3>
                    <p className='text-sm text-gray-500'>List your professional certifications and licenses</p>
                </div>
                <button onClick={addCertification} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors'>
                    <Plus className='size-4' />
                    Add Certification
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Award className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No certifications added yet.</p>
                </div>) : (
                <div className="space-y-4">
                    {data.map((cert, index) => (
                        <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                            <div className='flex justify-between items-start'>
                                <h4>Certification #{index + 1}</h4>
                                <button onClick={() => removeCertification(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>
                                <input value={cert.name || ""} onChange={(e) => updateCertification(index, "name", e.target.value)} type="text" placeholder='Certification Name' className='px-3 py-2 text-sm rounded-lg' />
                                <input value={cert.issuer || ""} onChange={(e) => updateCertification(index, "issuer", e.target.value)} type="text" placeholder='Issuing Organization' className='px-3 py-2 text-sm rounded-lg' />
                                <input value={cert.date || ""} onChange={(e) => updateCertification(index, "date", e.target.value)} type="month" className='px-3 py-2 text-sm rounded-lg' />
                                <input value={cert.link || ""} onChange={(e) => updateCertification(index, "link", e.target.value)} type="url" placeholder='Credential Link (Optional)' className='px-3 py-2 text-sm rounded-lg' />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CertificationForm