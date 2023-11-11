import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { request } from "../requests";

export default function RequestsByType({ dashboardData } : { dashboardData: request[] | undefined }) {
  // 1. Loop through the array of types per request
  //   Line 27: data.type.forEach((type) => {
  // 2. Loop through all of the types current stored in the variables `types`
  // 3. Check to see if the type (make sure to slice the string when comparing) 
  //    you currently have is defined in the `types` array
  // 4.
  //   a. If it is in the array => add to the quantity that is currently stored
  //      types[0].quantity = types[0].quantity + 1
  //   b. If it's not in the array => create a new category and slice the type
  //      types.push({category: data.category, quantity: 1});

  // 5. Check to see if there is a sort function based on key for object arrays.
  //    If so use that function. If not then loop through the entire types array
  //    and sort by quantity.
  // 6. Truncate to the top 10 entires

  // 7. Pass the data into the barcharts. Use recharts documentation for this:
  //    https://recharts.org/en-US/api/BarChart

  let types: {
    category: string;
    quantity: number;
  }[] = [
    {
      category: "ale",
      quantity: 0,
    },
  ];

  // This wll loop through all of the requests: Steps 1-4
  dashboardData?.forEach((data) => {
    if (data.type === undefined) {
      // In case the data doesn't have any type
      return;
    }
    
    // Grbbing all of the types of the requests
    data.type.forEach((type) => {
      if (types.includes(type.category.slice(0, 3))){
        types[0].quantity = types[0].quantity + 1 //how do i get the index
      } else {
        types.push({category: data.category.slice(0,3), quantity: 1})
      }
  
    });
  });

  // Step 5-6 here :) loop through types array and order them
  // 
    data.type.forEach(types) => {
      
    }

    types = types.slice(0,10)
    

  return (
    // Step 7 here:
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
