import React, { useEffect, useState } from 'react'

import bwipjs from "bwip-js";

const BarCode = ({ code, ...props }) => {
    const [img, setImg] = useState('')
    useEffect(() => {
        let canvas = document.createElement('canvas');
        try {
            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrixrectangular',       // Barcode type
                text: code,    // Text to encode
                scale: 3,               // 3x scaling factor
                height: 10,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign: 'center',        // Always good to set this
            });

            setImg(canvas.toDataURL('image/png'));
        } catch (e) {
            // `e` may be a string or Error object
        }
    }, [code])
    return (
        <img src={img} {...props} alt="code" />
    )
}

export default BarCode