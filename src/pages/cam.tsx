import Link from "next/link";
import React from "react";
import Webcam from "react-webcam";

class WebcamCapture extends React.Component {
    render() {
        const videoConstraints = {
            facingMode: "user"
        };

        return (
            <div className="p-8 h-2xl w-2xl flex flex-col justify-start items-center">
                <div className="h-64 w-64">

                    <Webcam videoConstraints={videoConstraints} />
                </div>

                <div className="border flex">

                    <div>
                        <Link href="/">
                            <a> Home </a>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default WebcamCapture