"use client"
import { useEffect, useState } from "react";
import PrimaryFlightDisplay from "./ControlPanels/pfd";
import AircraftEngineGauge from "./ControlPanels/Gauges/AircraftEngine";
import LinearHorizontalHalfGauge, { LinearVerticalHalfGauge } from "./ControlPanels/Gauges/LinearHalfGauge";

export default function MissionControl() {

    const b:any = {};
    const [data, setData] = useState(b);

    function tryToGetReading(keys:Array<string>, fallback:any=null) : number | string | boolean | null {
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
            <div style={{width: "50%", height: "20%"}}>

                <PrimaryFlightDisplay roll={tryToGetReading(["gyro", "roll"])} pitch={tryToGetReading(["gyro", "roll"])}></PrimaryFlightDisplay>
            </div>
            <div style={{width: "30%", height: "100%"}}>
            <AircraftEngineGauge value={tryToGetReading(["engine", "power"])} title={"Engine 1"} toString={(value) => (value * 100).toFixed(1)}></AircraftEngineGauge>
            <div style={{width: "100%", height: "100px"}}>
                <span>Engine 1</span>
                <LinearHorizontalHalfGauge value={tryToGetReading(["engine", "power"], 0)} setpoint={NaN} bounds={{min: 0, max: 1}}></LinearHorizontalHalfGauge>
            </div>
            <div style={{width: "100%", height: "200px"}}> 
                <div style={{width: "100%", height: "100%"}}>
                    <span>Engine 2</span>
                    <div style={{width: "100%", height: "100%"}}>
                        <LinearVerticalHalfGauge value={tryToGetReading(["engine", "power"], 0)} setpoint={NaN} bounds={{min: 0, max: 1}}></LinearVerticalHalfGauge>
                    </div>
                </div>
            </div>
            </div>
        </main>
    )}
