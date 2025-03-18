import React from 'react'

const Spinner = () => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 rounded-3xl">
            <div className="border-4 border-white border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
        </div>
    )
}

export default Spinner
