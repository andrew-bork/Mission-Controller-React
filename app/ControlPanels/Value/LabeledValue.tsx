

export default function LabeledValue({label, value}:{label:string, value:string}) {
    return (
    <div style={{margin: "10px", height: "min-content", padding: "5px"}}>
        <span style={{display: "inline-block", width: "75px", textAlign: "right"}}>{label}</span><br/>
        <span style={{fontSize: "36px", display: "inline-block", textAlign: "right"}}>{value}</span>
    </div>)
}