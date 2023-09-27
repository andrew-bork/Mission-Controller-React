interface CircularGaugeProps {
    value?: number,
    bounds?: {
        min?:number, 
        max?:number
    },
    size?: number,
    fill?: string,
    title?: string,
};

export default function CircularHalfGauge({value, bounds,size, fill, title } : CircularGaugeProps) {
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