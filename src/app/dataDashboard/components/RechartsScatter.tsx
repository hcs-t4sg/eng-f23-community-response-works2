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
        // In case the data doesn't have a location
        return;
      }
  
      const location = request.location;
      let longitude = location?.longitude;
      let latitude = location?.latitude ;
      if (longitude  == undefined || latitude == undefined) {
        // In case the data in longitude/latitude isn't correct. This happened with one of the objects Eli worked with for CreatedAt property
        return;
      }
      
      else {
        longitudes_latitudes.push({
            longitude,
            latitude
        })
      }
    });
    
    // rounding to two decimal places to potentially help see the other points that are currently not visible
    longitudes_latitudes.forEach((element: { latitude: number, longitude: number }) => {
        element.latitude = +(element.latitude.toFixed(2));
        element.longitude = +(element.longitude.toFixed(2));
    });
    console.log(longitudes_latitudes);


    return (
        
      <ScatterChart width={700} height={800}>
        <CartesianGrid />
        <XAxis type="number" dataKey="latitude" domain={[40, 50]}/>
        <YAxis type="number" dataKey="longitude"  domain={[-75, 100]} />
        <Scatter data={longitudes_latitudes} fill="green" />
        </ScatterChart>
    );
    
  }
  
