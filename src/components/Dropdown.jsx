import { useState } from "react";

export default function Dropdown({label, options}) {
    const [value, setValue] = useState("");

    return (
        <div style={{display: "flex", width: "100%", alignItems: "center"}}>
        <p>{label}</p>
        <select
            style={{margin: "10px"}}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        >
            {options.reverse().map((o, i) => 
                <option key={i} value={o}>{o}</option>
            )}

        </select>
        </div>
    );
}