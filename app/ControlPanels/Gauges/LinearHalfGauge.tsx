interface LinearGaugeProps {
    value?: number,
    bounds?: {
        min?:number, 
        max?:number
    },
    size?: number,
    fill?: string,
};

export default function LinearHorizontalHalfGauge({value, bounds,size, fill } : LinearGaugeProps) {
    bounds = bounds ?? {min: 0, max: 10};
    bounds.min = bounds.min ?? 0;
    bounds.max = bounds.max ?? 0;
    size = size ?? 20;
    value = value ?? 0;
    fill = fill ?? "#00ff00";

    
    const width = value * 20 / (bounds.max - bounds.min);
    return (<svg style={{maxWidth: "100%", maxHeight: "100%"}} viewBox={`0 0 ${size} 2`} xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" stroke="black">
            <rect x={0} y={0.5} width={width} height={1} stroke="none" fill={fill}></rect>
        </svg>)

}

export function LinearVerticalHalfGauge({value, bounds, setpoint} : {value: number, bounds:{min: number, max: number}, setpoint: number|null} = {value: 0, setpoint: null, bounds: {min: 0, max: 10}}) {
    const height = value * 20 / (bounds.max - bounds.min);
    return <svg style={{maxWidth: "100%", maxHeight: "100%"}} viewBox="0 0 2 20" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <rect x={0.5} y={20-height} height={height} width={1} stroke="none" fill="#00ff00"></rect>
    </svg>

}