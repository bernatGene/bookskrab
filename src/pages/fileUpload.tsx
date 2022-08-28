import React from "react";
import Link from "next/link";



export default function App() {
    const showFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result || "Error";
            console.log(text);
        };
        if (e.target.files && e.target.files[0]) {
            reader.readAsText(e.target.files[0]);
        }
    };

    return (
        <div>
            <input type="file" onChange={showFile} />
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