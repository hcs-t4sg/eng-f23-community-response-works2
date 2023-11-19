import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis } from 'recharts';
import { request } from '../requests';





export default function RechartsScatter(
    {dashboardData}:
    {dashboardData: request[] | undefined}
    ) {

    let longitudes_latitudes: { latitude: number, longitude: number}[] = [
      
    ];
    dashboardData?.forEach((request) => {
        console.log(request)
      if (request.location === undefined) {
        // In case the data doesn't have a createdAt
        return;
      }
  
      const location = request.location;
      let longitude = location?.longitude;
      let latitude = location?.latitude ;
      if (longitude  == undefined || latitude == undefined) {
        // In case the data in createdAt isn't correct. This happened with one of the objects
        console.log(request);
        return;
      }
      
      else {
        longitudes_latitudes.push({
            longitude,
            latitude
        })
      }
    //   monthlyRequest[month].requests += 1;
    

    });
    
    // rounding to two decimal places to potentially help see the other points that are currently not visible
    longitudes_latitudes.forEach((element : {latitude: number, longitude:number}) => {
        element.latitude = +(element.latitude.toFixed(2));
        element.longitude = +(element.longitude.toFixed(2));
    });
    console.log(longitudes_latitudes)
    return (
     

        <ScatterChart width={700} height={800}>
            <CartesianGrid />
            <XAxis type="number" dataKey="latitude" domain={[40, 50]}/>
            <YAxis type="number" dataKey="longitude"  domain={[-100, 100]} />
            <Scatter data={longitudes_latitudes} fill="green" />
         </ScatterChart>
      
    );
  }
  


// export default function RechartsScatter() {
//     const locations = [
//         {
//             latitude: 1,
//             longitude: 2,
//         },
//         {
//             latitude: 3,
//             longitude:4,
//         },
//         {
//             latitude: 5,
//             longitude: 6
//         },
//         {
//             latitude: 7,
//             longitude: 8
//         },
    
//     ]

//     return (
//         <ScatterChart width={400} height={400}>
//             <CartesianGrid />
//             <XAxis type="number" dataKey="latitude" />
//             <YAxis type="number" dataKey="longitude" />
//             <Scatter data={locations} fill="green" />
//         </ScatterChart>
//     );
// }
