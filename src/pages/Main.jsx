import { useState } from "react";

export default function MainPage() {
    const [c, setC] = useState(0);
    
    return (
        <div>
            <h1>Main Page</h1>
            <button onClick={() => setC(c + 1)}>Click me: {c}</button>
        </div>
    );
};