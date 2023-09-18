/**
 * This is not a standard gauge.
 * I added this gauge because it looks cool.
 */

export default function AircraftEngineGauge({value, title, toString}:{value:number, title:string, toString:(value:number) => string}) {
    const M_T_FT = 3.281;
    const R_T_D = 180 / Math.PI;
    const D_T_R = 1 / R_T_D;
    const RT_2 = Math.sqrt(2);
    const r = 2;
    const innerR = r - .2;
    return <svg viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg" style={{maxWidth: "100%", maxHeight: "100%"}} fill="none" stroke="black" strokeWidth="0.08px" strokeLinecap="round">
        
        <path d={`M ${- r / RT_2 + 2.5} ${- r / RT_2 + 2.5} A ${r} ${r} 0 1 0 ${r + 2.5} 2.5`}></path>
        <path d={`M 2.5 2.5 L ${innerR+2.5} 2.5`} transform={`rotate(${value * 225}, 2.5, 2.5)`}></path>
        <text x="2.6" y="1.6" text-anchor="start" dominant-baseline="bottom" font-size=".4px" stroke="none" fill="black">{title}</text>
        <text x="4.6" y="2.3" text-anchor="end" dominant-baseline="bottom" font-size=".8px" stroke="none" fill="black">{(value == null ? "N/A": toString(value))}%</text>
    </svg>
}