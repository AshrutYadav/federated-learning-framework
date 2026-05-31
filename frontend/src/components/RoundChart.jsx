import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip
}
from "recharts"

export default function RoundChart(){

const data=[

{round:1,updates:5},

{round:2,updates:14},

{round:3,updates:23}

]

return(

<LineChart
width={800}
height={300}
data={data}
>

<CartesianGrid/>

<XAxis
dataKey="round"
/>

<YAxis/>

<Tooltip/>

<Line
dataKey="updates"
/>

</LineChart>

)

}