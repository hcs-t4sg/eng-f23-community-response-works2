import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { request } from "../requests";

export default function RequestsByType({ dashboardData } : { dashboardData: request[] | undefined }) {
  let types: {
    category: string;
    quantity: number;
  }[] = [];

  // This wll loop through all of the requests: Steps 1-4
  dashboardData?.forEach((data) => {
    if (data.type === undefined) {
      // In case the data doesn't have any type
      return;
    }

    // Grbbing all of the types of the requests
    data.type.forEach((type) => {
      const wantedType = types.find((element) => element.category == type.slice(0, 3));
      if (wantedType){
        wantedType.quantity += 1;
      } else {
        types.push({category: type.slice(0,3), quantity: 1});
      }
    });
  });

  types.sort((a, b) => (a.quantity > b.quantity ? -1 : 1));
  types = types.slice(0, 10);

  return (
    <>
      <h3 className='w-full text-center'>Requests By Type</h3>
      <div className='w-full h-72'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
              width={150}
              height={40}
              data={types}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 20,
              }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" label={{ value: "Request Type Category", position: "insideBottom", offset: -10 }}/>
            <YAxis label={{ value: "Quantity", angle: -90 }} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
