import React from 'react';
import { DocumentData } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import DocumentFront from './DocumentFront';
import DocumentQR from './DocumentQR';
import DocumentBack from './DocumentBack';

interface DocumentSliderProps {
    data: DocumentData;
}

const DocumentSlider: React.FC<DocumentSliderProps> = ({ data }) => {
    return (
        <div className="w-full mx-auto" style={{ height: '85vh', minHeight: '550px' }}>
            <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="swiper-container"
                initialSlide={1} // Start with the front of the document (index 1)
            >
                <SwiperSlide><DocumentBack data={data} /></SwiperSlide>
                <SwiperSlide><DocumentFront data={data} /></SwiperSlide>
                <SwiperSlide><DocumentQR documentId={data.id} /></SwiperSlide>
            </Swiper>
        </div>
    );
};

export default DocumentSlider;