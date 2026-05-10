import React from 'react'
import Title from './Title'
import { MessageSquareQuote } from 'lucide-react'

const Testimonial = () => {
    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@briarmartin',
            text: 'ResumeAI helped me land 3 interviews in the first week. The AI suggestions were incredibly accurate.',
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            text: 'The ATS scoring feature is a game-changer. I finally understand what recruiters are looking for.',
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            text: 'Beautiful templates that actually look professional. Way better than any other resume builder I tried.',
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Riley Chen',
            handle: '@rileychen',
            text: 'The PDF export is flawless. My resume looks exactly the same on screen and on paper. Highly recommend!',
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-5 rounded-2xl mx-3 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 w-72 shrink-0 group">
            <div className="flex gap-3 items-center">
                <img className="size-10 rounded-full ring-2 ring-emerald-100" src={card.image} alt={card.name} />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-slate-800">{card.name}</p>
                        <svg className="fill-emerald-500 shrink-0" width="14" height="14" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-400">{card.handle}</span>
                </div>
            </div>
            <p className="text-sm py-3 text-slate-600 leading-relaxed">{card.text}</p>
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="size-3.5 fill-amber-400" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div id='testimonials' className='flex flex-col items-center pt-16 pb-4 scroll-mt-12'>
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-400/10 rounded-full px-4 py-1.5 font-medium">
                    <MessageSquareQuote className='size-4' />
                    <span>Testimonials</span>
                </div>
                <Title title="Loved by Professionals" description="Hear from thousands of job seekers who landed their dream roles using ResumeAI." />
            </div>
            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-8 pb-4">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
            </div>
            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-8 pb-4">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
            </div>
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-inner {
                    animation: marqueeScroll 30s linear infinite;
                }
                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>
        </>
    );
}

export default Testimonial