"use client"
import { useEffect, useState } from "react";
import PrimaryFlightDisplay from "./ControlPanels/pfd";
import AircraftEngineGauge from "./ControlPanels/Gauges/AircraftEngine";
import Console from "./ControlPanels/conosle";

export default function MissionControl() {

    const b:any = {};
    const [data, setData] = useState(b);

    function tryToGetReading(keys:Array<string>) : null|number {
        return keys.reduce(
                    (prev, curr) => {
                        if(prev == null) return null;
                        if(curr in prev) return prev[curr];
                        return null;
                    }
                ,data);
    }

    useEffect(() => {
        let fetching = false;
        const timeout = setTimeout(() => {
            if(fetching) return;

            fetching = true;
            fetch("http://localhost:1234/data")
                .then(res => res.json())
                .then((data) => {
                // console.log(data)
                fetching = false;
                if(data.success) setData(data.result);
            });
        }, 100);
        return () => {
            clearTimeout(timeout);
        }
    });

    let [now, setNow] = useState(Date.now());
    useEffect(() => {
        const timeout = setTimeout(() => {
            setNow(Date.now());
        }, 100);
        return () => {
            clearTimeout(timeout);
        }
    });

    function getContact() {
        const last_update_recieved = tryToGetReading(["system", "last_contact_recieved"]);
        if(last_update_recieved == null) return "Never";
        let elapsed = (now - last_update_recieved);
        if(elapsed < 1000) {
            return "now";
        }else {
            elapsed /= 1000;
            if(elapsed < 60){
                return ((now - last_update_recieved) / 1000).toFixed(0) + "s ago";
            }else {
                let min = Math.floor(elapsed / 60);
                let sec = elapsed % 60;
                return (min + "m "+sec.toFixed(0)+"s ago");
            }
        }
    }

    return (
        <main style={{width: "100%", height: "100%", display: "flex"}}>
            <div style={{width: "50%", height: "100%"}}>

                <PrimaryFlightDisplay roll={(tryToGetReading(["gyro", "x"]) ?? 0)* 20} pitch={(tryToGetReading(["gyro", "y"]) ?? 0) * 20}></PrimaryFlightDisplay>
            </div>
            <div style={{width: "30%", height: "100%"}}>
                <span>Last contact at {getContact()}</span>
                <Console></Console>
            {/* <AircraftEngineGauge value={tryToGetReading(["engine", "power"])} title={"Engine 1"} toString={(value) => (value * 100).toFixed(1)}></AircraftEngineGauge> */}
            
            </div>
        </main>
    )}
