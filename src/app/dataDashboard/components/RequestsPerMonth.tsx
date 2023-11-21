import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { request } from '../requests';

export default function RequestsPerMonth(
  {dashboardData}:
  {dashboardData: request[] | undefined}
  ) {
  let monthlyRequest: {id: number, month: string, requests: number}[] = [
    {
      id: 0,
      month: 'Jan',
      requests: 0,
    },
    {
      id: 1,
      month: 'Feb',
      requests: 0,
    },
    {
      id: 2,
      month: 'Mar',
      requests: 0,
    },
    {
      id: 3,
      month: 'Apr',
      requests: 0,
    },
    {
      id: 4,
      month: 'May',
      requests: 0,
    },
    {
      id: 5,
      month: 'Jun',
      requests: 0,
    },
    {
      id: 6,
      month: 'Jul',
      requests: 0,
    },
    {
      id: 7,
      month: 'Aug',
      requests: 0,
    },
    {
      id: 8,
      month: 'Sept',
      requests: 0,
    },
    {
      id: 9,
      month: 'Oct',
      requests: 0,
    },
    {
      id: 10,
      month: 'Nov',
      requests: 0,
    },
    {
      id: 11,
      month: 'Dec',
      requests: 0,
    },
  ];
  dashboardData?.forEach((request) => {
    if (request.createdAt === undefined) {
      // In case the data doesn't have a createdAt
      return;
    }

    const dateObject = new Date(request.createdAt);
    const month = dateObject.getMonth();
    if (month == null) {
      // In case the data in createdAt isn't correct. This happened with one of the objects
      console.log(request);
      return;
    }

    monthlyRequest[month].requests += 1;
  });

  return (
    <>
      <h3 className='w-full text-center'>Responses Per Month</h3>

      <div className='w-full h-72'>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={monthlyRequest}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: "Month Of The Year", position: "insideBottom", offset: -10 }} />
            <YAxis label={{ value: "Requests", angle: -90 }} />
            <Tooltip labelClassName='text-black'/>
            <Line type="monotone" dataKey="requests" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
