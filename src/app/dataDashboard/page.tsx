'use client'

import React, { useEffect, useState } from 'react';
import { request, requests_mock_response } from './requests';
import RequestsPerMonth from './components/RequestsPerMonth';
import RequestsByType from './components/RequestsByType';

// Example function to show how an API might behave
async function queryExampleAPI(querystring: string) {

  // Set some artificial loading time
  // The await keyword pauses execution of an async function until the awaited function resolves
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (querystring === "crisis-response-data") {
    const mockData = requests_mock_response();

    const response = {
      error: null,
      data: mockData
    }
    return response; // An `async` function returns a `Promise` that must be `await`ed inside another `async` function
  }

  // Sometimes APIs will return an error if your query is invalid or there are other issues
  const response = {
    error: new Error("Invalid API response"),
    data: null
  };
  return response;
}

function DataDashboard() {
  // Defining a state variable to store the data
  // State variable is initially null, but will update once the API request finishes
  const [dashboardData, setDashboardData] = useState<request[] | undefined>();

  // As if data was loading but will replace this with actual API requests
  useEffect(() => {
    const fetchAPIData = async () => {
      // TODO: Fetch data from an API endpoint or update it as needed
      const { error, data } = await queryExampleAPI("crisis-response-data");

      if (error) {
        // Handle errors in API fetching. Ideally error messages should be displayed in the
        // frontend UI, not just console.logged. Fine for development though.
        console.log(error.message);
        return;
      }

      setDashboardData(data);
      return;
    };

    fetchAPIData();
  }, []); // Make sure to include the dependency array in useEffect, or your app will infinite loop

  return (
    <div className='p-8 w-screen'>
      <h1>Data Dashboard</h1>
      <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-4">
        {/* Number - Div for total responses */}
        <div className='row-span-2 col-span-2'>
          <div className='border border-teal-300 col-span-2 rounded-md p-2 mb-4'>
            <h2 className='text-xl'>
              Total Responses: {dashboardData ? dashboardData.length : 0}
            </h2>
          </div>
          <div className='border border-teal-300 col-span-2 rounded-md p-2'>
            <h2 className='text-xl'>
              {/* TODO: Doesn't currently actually check the current month. Will need to fix. */}
              Responses Past Month: {dashboardData ? dashboardData.length : 0}
            </h2>
          </div>
        </div>

        {/* Number - Div for num responses last most */}
        <div className='border border-teal-300 col-span-2 row-span-4 rounded-md'>
          <RequestsPerMonth dashboardData={dashboardData} />
        </div>

        {/* Bar/line chart - Div for requests over time */}
        <div className='border border-teal-300 rounded-md row-span-2 col-span-2 p-5'>
          <RequestsByType dashboardData={dashboardData} />
        </div>

        {/* Side bar chart ordered by size - Div for responses by crisis type */}

        {/* Responses by location will be given here */}
        <div className=''></div>
      </div>
    </div>
  );
}

export default DataDashboard;
