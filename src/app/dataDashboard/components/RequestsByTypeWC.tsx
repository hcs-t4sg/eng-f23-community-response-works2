import { request } from "../requests";
import { TagCloud } from 'react-tagcloud'

export default function RequestsByTypeWC({ dashboardData } : { dashboardData: request[] | undefined }) {
  let types: {
    value: string;
    count: number;
  }[] = [];

  // This wll loop through all of the requests: Steps 1-4
  dashboardData?.forEach((data) => {
    if (data.type === undefined) {
      // In case the data doesn't have any type
      return;
    }

    // Grbbing all of the types of the requests
    data.type.forEach((type) => {
      type = type.slice(0, 3);
      const wantedType = types.find((element) => element.value == type);
      if (wantedType){
        wantedType.count += 1;
      } else {
        types.push({value: type, count: 1});
      }
    });
  });

  types.sort((a, b) => (a.count > b.count ? -1 : 1));

  return (
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={types}
      />
  );
}