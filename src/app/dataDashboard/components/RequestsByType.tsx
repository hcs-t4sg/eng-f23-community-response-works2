import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { request } from "../requests";

export default function RequestsByType({ dashboardData } : { dashboardData: request[] | undefined }) {
  let types: any = [];
  dashboardData?.forEach((data) => {

  });

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={150} height={40} data={dashboardData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="type" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}
