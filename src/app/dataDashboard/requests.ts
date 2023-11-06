import data from './api_request/mockData.json'

export type request = {
  _id: {
    $oid: string,
  },
  type: string[],
  teamEvents: {
    type?: string,
    sentAt: string,
    by: string,
    to: string[]
  }[],
  location: {
    latitude: number,
    longitude: number,
    address: string,
  } | null,
  callStartedAt: string,
  callEndedAt: string,
  priority: number | null,
  tagHandles: {
    _id: string,
    categoryId: string,
    itemId: string,
  }[],
  statusEvents: {
    _id: string,
    status: number,
    setBy: string,
    setAt: string,
  }[],
  status?: number,
  displayId?: string,
  createdAt?: string,
  updatedAt?: string,
}

/**
 * This is a mock API requests for getting information on the calls
 * that come in to patch for a given organization.
*/
export function requests_mock_response(): request[] {
  return data;
}
