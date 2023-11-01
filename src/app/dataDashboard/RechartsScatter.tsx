import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function RechartsScatter() {
    const locations = [
        {
            latitude: 1,
            longitude: 2,
        },
        {
            latitude: 3,
            longitude:4,
        },
        {
            latitude: 5,
            longitude: 6
        },
        {
            latitude: 7,
            longitude: 8
        },
    
    ]

    return (
        <ScatterChart width={400} height={400}>
            <CartesianGrid />
            <XAxis type="number" dataKey="latitude" />
            <YAxis type="number" dataKey="longitude" />
            <Scatter data={locations} fill="green" />
        </ScatterChart>
    );
}
