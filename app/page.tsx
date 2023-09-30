"use client"
import { useEffect, useState } from "react";
import PrimaryFlightDisplay from "./ControlPanels/other/pfd";
import AircraftEngineGauge from "./ControlPanels/Gauges/AircraftEngine";
import LabeledValue from "./ControlPanels/Value/LabeledValue";

export default function MissionControl() {

    const HOST = "http://localhost:2032";

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

    function readNumber(keys:Array<string>) : number {
        const reading = tryToGetReading(keys);
        if(typeof(reading) === "number") return reading;
        return NaN;
    }

    function readString(keys:Array<string>) : string {
        const reading = tryToGetReading(keys);
        if(typeof(reading) === "string") return reading;
        // throw "Not a string"
        return "Not a string";
    }

    function execute(command : string, args : Array<string>) {
        fetch(`${HOST}/execute`, {
            method: "POST", 
            body: JSON.stringify({
                    command,
                    args
                }),
            headers: {
                "Content-Type": "application/json",
            }
    }).then((res) => res.json()).then((response) => {
        if(!response.success) {
            alert("Something went wrong with the command");
        }
    }).catch(() => {
            alert("Failed to contact rest server");
        })
    }

    const [_, rerender] = useState();

    const [fetchStatus, setFetchStatus] = useState("Failed");

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${HOST}/data`).then(res => res.json())
                .then((data) => {
                    if(data.success) {
                        setData(data.result);
                    }
                    setFetchStatus("Success");
                }).catch(() => {
                    setFetchStatus("Failed");
                });
        }, 50);

        const interval1s = setInterval(() => {
            rerender([]);
        }, 1000);
        return () => {
            clearInterval(interval);
            clearInterval(interval1s);
        }
    });

    let lastContactMessage = "Never";
    let lastContact = readNumber(["system", "last_contact_recieved"]);
    let elapsed = Infinity;
    let maxElapsedBeforeDisconnectStatus = 2;
    // console.log(data);
    if(!isNaN(lastContact)) {
        const now = Date.now(); 
        elapsed = (now - lastContact) / 1000;
        // console.log(elapsed);
        
        if(elapsed < 5){
            lastContactMessage = `just now`;
        }else if(elapsed < 60) {
            lastContactMessage = `${elapsed.toFixed(0)}s ago`;
        }else {
            let minute = Math.floor(elapsed/60);
            let second = Math.floor(elapsed % 60);
            lastContactMessage = `${minute}m and ${second}s ago`;
        }

    }

    function leftpad(string : string, char : string, n : number) {
        while(string.length < n) {
            string = char + string;
        }
        return string;
    }

    return (
        <main style={{width: "100%", height: "100%", display: "flex"}}>
            <div style={{width: "50%", height: "100%"}}>

                <PrimaryFlightDisplay roll={readNumber(["gyro", "x"]) * 57.2958} pitch={readNumber(["gyro", "y"]) * 57.2958}></PrimaryFlightDisplay>
            </div>
            <div style={{color: "black", width: "30%", height: "100%", display: "flex", flexWrap: "wrap", alignContent: "start"}}>
                <LabeledValue label="Roll" value={leftpad((readNumber(["gyro", "x"]) * 57.2958).toFixed(0), " ", 4)+"°"}></LabeledValue>
                <LabeledValue label="Pitch" value={leftpad((readNumber(["gyro", "y"]) * 57.2958).toFixed(0), " ", 4)+"°"}></LabeledValue>
                <LabeledValue label="Roll Vel" value={leftpad((readNumber(["gyro_v", "x"]) * 57.2958).toFixed(0), " ", 4)+"°"}></LabeledValue>
                <LabeledValue label="Pitch Vel" value={leftpad((readNumber(["gyro_v", "y"]) * 57.2958).toFixed(0), " ", 4)+"°"}></LabeledValue>
                <button style={{margin: "10px", height: "min-content", width: "min-content", padding: "10px", border: ".5px black solid"}} onClick={() => {execute("ping", []);}}>Ping!</button>
                <button style={{margin: "10px", height: "min-content", width: "min-content", padding: "10px", border: ".5px black solid"}} onClick={() => {execute("bananify", []);}}>Banana status</button>
                <div style={{margin: "10px"}}>
                    <span>Status </span> | <span><b>{(elapsed < maxElapsedBeforeDisconnectStatus ? readString(["system", "status"]) : "disconnected")}</b></span>
                </div>
                <div style={{margin: "10px"}}>
                    <span>Last contact </span> | <span><b>{lastContactMessage}</b></span>
                </div>
                <div style={{margin: "10px"}}>
                    <span>Last <i><code>fetch()</code></i> Status </span> | <span><b>{fetchStatus}</b></span>
                </div>
            </div>
        </main>
    )}
