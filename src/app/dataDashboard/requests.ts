import { MockRequests } from "./api_request/t4sg_mock";

/**
 * This is a mock API request for getting information on the calls
 * that come in to patch for a given organization.
 * @returns {
 *   id: 'xxx-req7-xxx',
 *   orgId: MockOrgMetadata().id,
 *   notes: 'mock description 7',
 *   displayId: '7',
 *   callerName: '',
 *   callerContactInfo: '',
 *   callStartedAt: '',
 *   callEndedAt: '',
 *   dispatcherId: MockUsers()[0].id, 
 *   type: [],
 *   positions: [],
 *   tagHandles: [],
 *   status: RequestStatus.Closed,
 *   teamEvents: [],
 *   statusEvents: [],
 *   createdAt: '',
 *   updatedAt: '',
 *   location: {
 *     latitude: 40.69776419999999,
 *     longitude: -73.9303333,
 *     address: "960 Willoughby Avenue, Brooklyn, NY, USA"
 *   },
 *   priority: null,
 * }
 */
export default function json_mock_request() {
  return MockRequests();
}