import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        month: 'January',
        new_users: 4000,
        users_lost: 2400,
        total_users: 2400,
    },
    {
        month: 'February',
        new_users: 3000,
        users_lost: 1398,
        total_users: 2210,
    },
    {
        month: 'March',
        new_users: 2000,
        users_lost: 9800,
        total_users: 2290,
    },
    {
        month: 'April',
        new_users: 2780,
        users_lost: 3908,
        total_users: 2000,
    },
    {
        month: 'May',
        new_users: 1890,
        users_lost: 4800,
        total_users: 2181,
    },
    {
        month: 'June',
        new_users: 2390,
        users_lost: 3800,
        total_users: 2500,
    },
    {
        month: 'July',
        new_users: 3490,
        users_lost: 4300,
        total_users: 2100,
    },
];

const mockusers = [
    {
        "id": "__dispatcher",
        "name": "Dispatcher 2",
        "email": "dispatcher2@test.com",
        "password": "pa$$word1",
        "phone": "555-5556-2",
        "organizations": {
        },
        "displayColor": "",
        "pronouns": "they/them",
        "bio": "",
        "acceptedTOSVersion": ""
    },
    {
        "id": "__dispatcher",
        "name": "Dispatcher 3",
        "email": "dispatcher3@test.com",
        "password": "pa$$word2",
        "phone": "555-5556-3",
        "organizations": {   },
        "displayColor": "",
        "pronouns": "they/them",
        "bio": "",
        "acceptedTOSVersion": ""
    }

]
     

export default function RechartsLine() {
    return (
        
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 5
            }}
            
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
                type="monotone"
                dataKey="users_lost"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="new_users" stroke="#82ca9d" />
            <Line type="monotone" dataKey="total_users" stroke="#ffa500" />
        </LineChart>
    );
}