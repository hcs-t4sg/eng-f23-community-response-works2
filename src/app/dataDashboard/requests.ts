import { MockRequests } from "./api_request/t4sg_mock";

/**
 * Initial data which was given by Patch without filled in fields.
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
export function json_mock_request() {
  return MockRequests();
}

export type request = {
  _id: {
    $oid: string,
  },
  type: string[],
  teamEvents: {
    type: string,
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
  createdAt: string,
  updatedAt?: string,
}

/**
 * This is a mock API requests for getting information on the calls
 * that come in to patch for a given organization.
*/
export function requests_mock_response(): request[] {
  return [
    {
      _id: {
        $oid: '652eed8795f749001ff5f9b8',
      },
      type: ['err:err7'],
      teamEvents: [
        {
          type: '1.1.0',
          sentAt: '2023-10-17T20:24:51.207Z',
          by: '652ecd89d75f83402313aa32',
          to: ['652ecd88d75f83402313aa27', '652ecd89d75f83402313aa2e'],
        },
      ],
      location: {
        latitude: 42.374482871090315,
        longitude: -71.11547190696001,
        address: '311 Sever Hall, Harvard Yard, Cambridge, MA 02138, USA',
      },
      callStartedAt: '1:24 PM',
      callEndedAt: '',
      priority: null,
      tagHandles: [],
      statusEvents: [],
      status: 0,
      displayId: '1',
      createdAt: '2023-10-17T20:24:39.645Z',
      updatedAt: '2023-10-17T20:31:17.680Z',
    },
    {
      _id: {
        $oid: '6538205595f749001ff6075f',
      },
      type: ['dem:dm2'],
      teamEvents: [],
      location: {
        latitude: 42.3711910231672,
        longitude: -71.11756972968578,
        address: 'Rosovsky Hall, 59 Plympton St, Cambridge, MA 02138, USA',
      },
      callStartedAt: '3:50 PM',
      callEndedAt: '',
      priority: 0,
      tagHandles: [],
      statusEvents: [
        {
          _id: '65396a2195f749001ff608ac',
          status: 3,
          setBy: '652ecd89d75f83402313aa2e',
          setAt: '2023-10-25T19:18:57.560Z',
        },
        {
          _id: '65396b4195f749001ff608c1',
          status: 4,
          setBy: '652ecd89d75f83402313aa2e',
          setAt: '2023-10-25T19:23:45.812Z',
        },
      ],
      status: 4,
      displayId: '2',
      createdAt: '2023-10-25T19:23:45.812Z',
    },
    {
      _id: {
        $oid: '653bd23c95f749001ff609d6',
      },
      type: ['ala:a1'],
      teamEvents: [],
      location: null,
      callStartedAt: '11:07 AM',
      callEndedAt: '',
      priority: null,
      tagHandles: [],
      statusEvents: [
        {
          _id: '653bd77595f749001ff60b40',
          status: 3,
          setBy: '652ecd89d75f83402313aa2e',
          setAt: '2023-10-27T15:29:57.467Z',
        },
      ],
      status: 3,
      displayId: '3',
      createdAt: '2023-10-27T15:07:40.803Z',
      updatedAt: '2023-10-27T15:29:57.469Z',
    },
    {
      _id: {
        $oid: '653bd42695f749001ff60a1b',
      },
      type: ['dis:dist1'],
      teamEvents: [],
      location: {
        latitude: 42.37268230000001,
        longitude: -71.1185993,
        address: 'Smith Campus Center, Massachusetts Avenue, Cambridge, MA, USA',
      },
      callStartedAt: '11:07 AM',
      callEndedAt: '',
      priority: 0,
      tagHandles: [
        {
          _id: '653bd42695f749001ff60a1c',
          categoryId: '__communicationtype',
          itemId: '__communicationtype:com01',
        },
        {
          _id: '653bd42695f749001ff60a1d',
          categoryId: '__medication',
          itemId: '__medication:med01',
        },
        {
          _id: '653bd42695f749001ff60a1e',
          categoryId: '__resolution',
          itemId: '__resolution:res05',
        },
        {
          _id: '653bd42695f749001ff60a1f',
          categoryId: '__resolution',
          itemId: '__resolution:res06',
        },
      ],
      statusEvents: [
        {
          _id: '653bd5b695f749001ff60acb',
          status: 3,
          setBy: '652ecd89d75f83402313aa2e',
          setAt: '2023-10-27T15:22:30.098Z',
        },
        {
          _id: '653bd77a95f749001ff60b55',
          status: 4,
          setBy: '652ecd89d75f83402313aa2e',
          setAt: '2023-10-27T15:30:02.203Z',
        },
      ],
      status: 4,
      displayId: '4',
      createdAt: '2023-10-27T15:15:50.261Z',
      updatedAt: '2023-10-27T15:30:02.206Z',
    },
    {
      _id: {
        $oid: '653bd4d495f749001ff60a3d',
      },
      type: ['cpw:cw1', 'cpw:cw2', 'cpw:cw3', 'cpw:cw5', 'cpw:cw4', 'cpw:cw6', 'cpw:cw7'],
      teamEvents: [],
      location: {
        latitude: 42.365819417053864,
        longitude: -71.12190116196871,
        address: '35 Harvard Way, Boston, MA 02163, USA',
      },
      callStartedAt: '11:16 AM',
      callEndedAt: '11:17 AM',
      priority: 1,
      tagHandles: [
        {
          _id: '653bd4d495f749001ff60a3e',
          categoryId: '__communicationtype',
          itemId: '__communicationtype:com01',
        },
      ],
      statusEvents: [
        {
          _id: '653bd5b195f749001ff60ab6',
          status: 3,
          setBy: '652ecd89d75f83402313aa2e',
          setAt: '2023-10-27T15:22:25.351Z',
        },
      ],
      createdAt: '2023-10-27T15:15:50.261Z',
    },
    {
      _id: {
        $oid: '653bd54195f749001ff60a5b',
      },
      type: ['ash:ah1'],
      teamEvents: [],
      location: {
        latitude: 42.3732123,
        longitude: -71.119384,
        address: 'CVS Pharmacy, John F. Kennedy Street, Cambridge, MA, USA',
      },
      callStartedAt: '11:18 AM',
      callEndedAt: '11:30 AM',
      priority: 2,
      tagHandles: [
        {
          _id: '653bd54195f749001ff60a5c',
          categoryId: '__communicationtype',
          itemId: '__communicationtype:com01',
        },
        {
          _id: '653bd54195f749001ff60a5d',
          categoryId: '__context',
          itemId: '__context:con03',
        },
        {
          _id: '653bd54195f749001ff60a5e',
          categoryId: '__context',
          itemId: '__context:con04',
        },
        {
          _id: '653bd54195f749001ff60a5f',
          categoryId: '__equipment',
          itemId: '__equipment:equip02',
        },
        {
          _id: '653bd54195f749001ff60a60',
          categoryId: '__medication',
          itemId: '__medication:med03',
        },
        {
          _id: '653bd54195f749001ff60a61',
          categoryId: '__resolution',
          itemId: '__resolution:res02',
        },
        {
          _id: '653bd54195f749001ff60a62',
          categoryId: '__referral',
          itemId: '__referral:ref01',
        },
      ],
      statusEvents: [
        {
          _id: '653bd55295f749001ff60a83',
          status: 3,
          setBy: '652ecd88d75f83402313aa27',
          setAt: '2023-10-27T15:20:50.358Z',
        },
        {
          _id: '653bd72f95f749001ff60b05',
          status: 4,
          setBy: '652ecd88d75f83402313aa27',
          setAt: '2023-10-27T15:28:47.218Z',
        },
      ],
      status: 4,
      displayId: '6',
      createdAt: '2023-10-27T15:20:33.498Z',
      updatedAt: '2023-10-27T15:28:47.221Z',
    },
    {
      _id: {
        $oid: '653bd5a595f749001ff60a9c',
      },
      type: ['ash:ah1', 'ash:ah2', 'mhc:mhc1'],
      teamEvents: [],
      location: {
        latitude: 42.366417661077286,
        longitude: -71.12619001418352,
        address: '79 N Harvard St, Boston, MA 02163, USA',
      },
      callStartedAt: '11:20 AM',
      callEndedAt: '11:21 AM',
      priority: 0,
      tagHandles: [
        {
          _id: '653bd5a595f749001ff60a9d',
          categoryId: '__communicationtype',
          itemId: '__communicationtype:com04',
        },
      ],
      statusEvents: [],
      status: 0,
      displayId: '7',
      createdAt: '2023-10-27T15:22:13.254Z',
      updatedAt: '2023-10-27T15:22:13.254Z',
    },
    {
      _id: {
        $oid: '653bd72995f749001ff60ae1',
      },
      type: ['dem:dm2', 'dov:ipv5'],
      teamEvents: [],
      location: {
        latitude: 38.62850882232869,
        longitude: -90.62110640108585,
        address: '1021 Strecker Rd, Wildwood, MO 63005, USA',
      },
      callStartedAt: '11:24 AM',
      callEndedAt: '12:30 PM',
      priority: 2,
      tagHandles: [
        {
          _id: '653bd72995f749001ff60ae2',
          categoryId: '__communicationtype',
          itemId: '__communicationtype:com01',
        },
        {
          _id: '653bd72995f749001ff60ae3',
          categoryId: '__context',
          itemId: '__context:con03',
        },
        {
          _id: '653bd72995f749001ff60ae4',
          categoryId: '__referral',
          itemId: '__referral:ref03',
        },
        {
          _id: '653bd72995f749001ff60ae5',
          categoryId: '__resolution',
          itemId: '__resolution:res05',
        },
        {
          _id: '653bd72995f749001ff60ae6',
          categoryId: '__resolution',
          itemId: '__resolution:res02',
        },
      ],
      statusEvents: [],
      status: 0,
      displayId: '8',
      createdAt: '2023-10-27T15:28:41.978Z',
      updatedAt: '2023-10-27T15:28:41.978Z',
    },
    {
      _id: {
        $oid: '653bd77095f749001ff60b21',
      },
      type: [
        'ala:a1',
        'ani:an1',
        'ash:ah1',
        'chd:minor1',
        'coc:cc1',
        'cpw:cw1',
        'dem:dm1',
        'dis:dist1',
        'dov:ipv1',
        'emo:es1',
        'err:err1',
        'fai:fa1',
        'har:h1',
        'int:int1',
        'inh:ih1',
        'kid:kn1',
        'les:ls1',
        'mhc:mhc1',
        'mfp:miss1',
        'otw:traff1',
        'sev:sv1',
        'sho:sh1',
        'suu:sub1',
        'thf:tf1',
        'vra:asst1',
        'wit:wt1',
      ],
      teamEvents: [],
      location: {
        latitude: 42.369607456533004,
        longitude: -71.10808912664653,
        address: '5 Centre St, Cambridge, MA 02139, USA',
      },
      callStartedAt: '11:24 AM',
      callEndedAt: '11:29 AM',
      priority: 2,
      tagHandles: [
        {
          _id: '653bd77095f749001ff60b22',
          categoryId: '__communicationtype',
          itemId: '__communicationtype:com01',
        },
        {
          _id: '653bd77095f749001ff60b23',
          categoryId: '__context',
          itemId: '__context:con01',
        },
        {
          _id: '653bd77095f749001ff60b24',
          categoryId: '__equipment',
          itemId: '__equipment:equip01',
        },
        {
          _id: '653bd77095f749001ff60b25',
          categoryId: '__medication',
          itemId: '__medication:med01',
        },
        {
          _id: '653bd77095f749001ff60b26',
          categoryId: '__resolution',
          itemId: '__resolution:res01',
        },
        {
          _id: '653bd77095f749001ff60b27',
          categoryId: '__referral',
          itemId: '__referral:ref01',
        },
      ],
      statusEvents: [],
      status: 0,
      displayId: '9',
      createdAt: '2023-10-27T15:29:52.239Z',
      updatedAt: '2023-10-27T15:29:52.239Z',
    },
  ];
}
