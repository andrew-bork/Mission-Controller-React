"use client"

import { useState } from "react";


function ConsoleHistory({lines}:{lines: string[]}) {
    return <ul>
        {lines.map((line, i) => {

            return <li key={i}><span>{line}</span></li>
        })}
    </ul>
}

function ConsoleInput() {
    return <div>
        <input/>
    </div>
}

export default function Console() {
    const [lines, setLines] = useState(["hello", "world"]);
    

    return <div>
        <ConsoleHistory lines={lines}></ConsoleHistory>
        <ConsoleInput></ConsoleInput>
    </div>


}