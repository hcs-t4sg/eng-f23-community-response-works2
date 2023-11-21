import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { request } from '../requests';

export default function RechartsScatter(
    {dashboardData}:
    {dashboardData: request[] | undefined}
    ) {
    let longitudes_latitudes: { latitude: number, longitude: number}[] = [];

    dashboardData?.forEach((request) => {
      if (request.location === undefined) {
        // In case the data doesn't have a location
        return;
      }

      const location = request.location;
      let longitude = location?.longitude;
      let latitude = location?.latitude ;
      if (longitude == undefined || latitude == undefined) {
        // In case the data in longitude/latitude isn't defined.=
        return;
      } else {
        longitudes_latitudes.push({
            longitude,
            latitude
        })
      }
    });

    // Rounding to two decimal places to potentially help see the other points
    // that are currently not visible
    longitudes_latitudes.forEach((element: { latitude: number, longitude: number }) => {
      element.latitude = +(element.latitude.toFixed(2));
      element.longitude = +(element.longitude.toFixed(2));
    });

    return (
      <div className='flex flex-col justify-center align-middle'>
        <h2 className='text-center'>Locations of Requests</h2>
        <div className='place-self-center w-full h-72'>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart width={500} height={500}>
              <CartesianGrid />
              <XAxis type="number" dataKey="latitude" domain={[40, 50]}/>
              <YAxis type="number" dataKey="longitude"  domain={[-75, 100]} />
              <Scatter data={longitudes_latitudes} fill="green" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

