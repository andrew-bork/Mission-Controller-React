"use client"
import { useEffect, useState } from "react";
import PrimaryFlightDisplay from "./ControlPanels/pfd";
import AircraftEngineGauge from "./ControlPanels/Gauges/AircraftEngine";

export default function MissionControl() {

    const b:any = {};
    const [data, setData] = useState(b);

    function tryToGetReading(keys:Array<string>) : number | string | boolean | null {
        return keys.reduce(
                    (prev, curr) => {
                        if(prev == null) return null;
                        if(curr in prev) return prev[curr];
                        return null;
                    }
                ,data);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch("http://localhost:1234/data").then(res => res.json()).then((data) => {
                // console.log(data)
                if(data.success) setData(data.result);
            });
        }, 10);
        return () => {
            clearTimeout(timeout);
        }
    });

    return (
        <main style={{width: "100%", height: "100%", display: "flex"}}>
            <div style={{width: "50%", height: "100%"}}>

                <PrimaryFlightDisplay roll={tryToGetReading(["gyro", "roll"])} pitch={tryToGetReading(["gyro", "roll"])}></PrimaryFlightDisplay>
            </div>
            <div style={{width: "10%", height: "100%"}}>
            <AircraftEngineGauge value={tryToGetReading(["engine", "power"])} title={"Engine 1"} toString={(value) => (value * 100).toFixed(1)}></AircraftEngineGauge>
            </div>
        </main>
    )}
