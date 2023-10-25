import { AtLeast } from '.';

export type AnyFunction = (...args: any[]) => any;

export interface AuthTokens {
    refreshToken: string,
    accessToken: string
}

export type DynamicAppVersionConfig = {
    latestIOS: string,
    latestAndroid: string,
    requiresUpdate: boolean,
    testing: boolean
}

export type DynamicConfig = {
    appVersion: DynamicAppVersionConfig[]
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    organizations: { [key: string]: UserOrgConfig }
    displayColor: string
    race?: string
    pronouns?: string
    bio?: string
    acceptedTOSVersion?: string
    // location?
}

export type EditableUser = Pick<ProtectedUser, 'organizations'>
export type EditableMe = Omit<Me, 'organizations'>
export type AdminEditableUser = Pick<UserOrgConfig, 'roleIds' | 'attributes'>

export type UserOrgConfig = {
    roleIds: string[],
    attributes: CategorizedItem[],
    onDuty: boolean
}

export type SystemProperties = 'password';
export type PrivateProperties = 'race'

export type MinUser = AtLeast<User, 'email' | SystemProperties | 'name'>

export type ProtectedUser = Omit<User, PrivateProperties | SystemProperties>;

export type TeamMemberMetadata = {
    orgMembers: ProtectedUser[],
    removedOrgMembers: ProtectedUser[],
    deletedUsers: string[]
}

// this will change from being the same as ProtectedUser when we get
// more profile fields
export type Me = Omit<User, SystemProperties>

export type BasicCredentials = {
    email: string, 
    password: string
}

// Organizations
export interface Organization {
    name: string;
    id: string;
    requestPrefix: string,
    members: ProtectedUser[];
    lastRequestId: number;
    // lastDayTimestamp: string;
    pendingUsers: PendingUser[]
    removedMembers: ProtectedUser[]
    roleDefinitions: Role[]
    attributeCategories: AttributeCategory[] 
    tagCategories: TagCategory[]
}

export type OrganizationMetadata = Pick<Organization, 'id' | 'name' | 'requestPrefix' | 'roleDefinitions' | 'attributeCategories' | 'tagCategories'>;
export type MinOrg = AtLeast<Organization, 'name'>;

export type Role = {
    id: string,
    name: string,
    permissionGroups: PatchPermissionGroups[]
}

export type MinRole = AtLeast<Role, 'name' | 'permissionGroups'>

export type AttributeCategory = {
    id: string,
    name: string,
    attributes: Attribute[]
}

export type MinAttributeCategory = AtLeast<AttributeCategory, 'name'>
export type AttributeCategoryUpdates = AtLeast<Omit<AttributeCategory, 'attributes'>, 'id'>

export type Attribute = CategorizedItemDefinition

export type MinAttribute = AtLeast<Attribute, 'name'>

export type Category = { 
    name: string, 
    items: {
        id: string,
        name: string 
    }[]
}

export type CategorizedItem = {
    categoryId: string,
    itemId: string
}

export type CategorizedItemDefinition = {
    id: string,
    name: string
}

export type CategorizedItemUpdates = {
    categoryNameChanges: { id: string, name: string }[];
    itemNameChanges: { categoryId: string, itemId: string, name: string }[];

    deletedCategories: string[];
    deletedItems: { [categoryId: string]: string[] };

    newCategories: { [id: string]: Category }
    
    newItems: { 
        [categoryId: string]: string[]
    }
}

export type TagCategory = {
    id: string,
    name: string,
    tags: Tag[]
}

export type MinTagCategory = AtLeast<TagCategory, 'name'>
export type TagCategoryUpdates = AtLeast<Omit<TagCategory, 'tags'>, 'id'>

export type Tag = CategorizedItemDefinition

// export type TagsMap = { [key: string]: string[] }
export type AttributesMap = { [key: string]: string[] }

export type MinTag = AtLeast<Tag, 'name'>

export type PendingUser = {
    email: string
    phone: string
    roleIds: string[]
    attributes: CategorizedItem[]
    pendingId: string
}

export type AuthCode = {
    userId: string
    createdAt: string
    code: string
}

export enum UserRole {
    Admin,
    Dispatcher,
    Responder
}

export const UserRoleToLabelMap: { [key in UserRole]: string } = {
    [UserRole.Admin]: 'Admin',
    [UserRole.Dispatcher]: 'Dispatcher',
    [UserRole.Responder]: 'Responder'
}

export const UserRoleToInfoLabelMap: { [key in UserRole]: string } = {
    [UserRole.Admin]: 'Admin: Manage org team members',
    [UserRole.Dispatcher]: 'Dispatcher: Manage requests and their responders',
    [UserRole.Responder]: 'Responder: Respond to requests'
}

export type AddressableLocation = {
    latitude: number,
    longitude: number,
    address: string
}

export type HelpRequestAssignment = {
    timestamp: number,
    responderIds: string[]
}

export type HelpRequest = {
    // virtual fields proviced by db
    createdAt: string
    updatedAt: string
    id: string

    // PATCH defined fields
    displayId: string
    orgId: string
    location: AddressableLocation
    type: RequestType[]
    // TODO: change to descriptiom
    notes: string
    chat?: Chat
    dispatcherId: string
    status: RequestStatus

    callerName: string,
    callerContactInfo: string,
    callStartedAt: string,
    callEndedAt: string,
    priority: RequestPriority | null,
    tagHandles: CategorizedItem[],
    positions: Position[]
    /**
     * 
     * Optioon 1: array of these events that we use mobx computed caching to project into a map of what people should be in what sections in the ui
     * 
     * Events for
     * - sent
     *  - by: string 
     *  - to: string[]
     *  - sentAt: string
     * - seen
     *  - by: string
     *  - seenAt: string
     * - joined
     *  - user: string
     *  - position: string
     *  - joinedAt: string
     * - requested to join
     *  - id: string
     *  - requester: string
     *  - position: string
     *  - requestedAt: string
     * - request denied
     *  - requestId: string
     *  - by: string
     *  - deniedAt: string
     * - request accepted
     *  - requestId: string
     *  - by: string
     *  - acceptedAt: string
     * - left
     *  - user: string
     *  - position: string
     *  - leftAt: string
     * - kicked
     *  - user: string
     *  - by: string
     *  - kickedAt: string 
     * 
     * option 2:
     * have those events only on the object the db sees but never sent to the frontend...the backend computes the new frontend model 
     * pros: ui doesn't have data about other users activity details
     * cons: slower api calls doing cpu bound checks
     * 
     * recommendation do it in ui and can port that to backend if need be
     */
    teamEvents: RequestTeamEvent[]

    statusEvents: RequestStatusEvent[]
}

export type RequestStatusEvent = {
    status: RequestStatus,
    setBy: string,
    setAt: string
}

export type RequestTeamEventParams = {
    [PatchEventType.RequestRespondersNotified]: {
        by: string
        to: string[]
        sentAt: string
    },
    [PatchEventType.RequestRespondersNotificationAck]: {
        by: string,
        seenAt: string
    },
    [PatchEventType.RequestRespondersRequestToJoinAck]: {
        by: string,
        seenAt: string,
        position: string,
        requester: string
    },
    [PatchEventType.RequestRespondersJoined]: {
        user: string
        position: string
        joinedAt: string
    },
    [PatchEventType.RequestRespondersRequestToJoin]: {
        requester: string
        position: string
        requestedAt: string
    },
    [PatchEventType.RequestRespondersAccepted]: {
        requester: string
        position: string
        by: string
        acceptedAt: string
    },
    [PatchEventType.RequestRespondersDeclined]: {
        requester: string
        position: string
        by: string
        deniedAt: string
    },
    [PatchEventType.RequestRespondersLeft]: {
        user: string
        position: string
        leftAt: string
    },
    [PatchEventType.RequestRespondersRemoved]: {
        user: string
        by: string
        revokedAt: string, 
        position: string 
    }
};

export type RequestTeamEvent<Type extends RequestTeamEventTypes = RequestTeamEventTypes> = {
    type: Type
} & RequestTeamEventParams[Type];

export type Position = {
    id: string,
    attributes: CategorizedItem[],
    role: string,
    min: number,
    max: number,
    joinedUsers: string[]
}

export enum PositionStatus {
    MinSatisfied,
    MinUnSatisfied,
    Empty
}

export enum RequestPriority {
    Low,
    Medium,
    High
}

export const RequestPriorityToLabelMap: { [key in RequestPriority]: string } = {
    [RequestPriority.High]: 'Critical',
    [RequestPriority.Medium]: 'Urgent',
    [RequestPriority.Low]: 'Non-Urgent',
}

export enum HelpRequestFilter {
    Active = 'ac',
    Closed = 'cl',
    All = 'al'
};

export enum HelpRequestSortBy {
    ByTime = 'bt',
    ByStatus = 'bs',
    BySeverity = 'bv'
    // ByDistance = 'bd'
};

export type MinHelpRequest = AtLeast<HelpRequest, 'type'>

export enum TeamFilter {
    Everyone = 'ev',
    OnDuty = 'on',
    OffDuty = 'off'
};

export enum TeamSortBy {
    ByLastName = 'bln',
    ByFirstName = 'bfn'
};

export type Chat = {
    id: string,
    messages: ChatMessage[],
    lastMessageId: number,
    userReceipts?: { [userId: string]: number }
}

export type ChatMessage = {
    id: number,
    userId: string,
    message: string,
    timestamp: number
}

// Note: this being a number enum
export enum RequestStatus {
    // automatically updated
    Unassigned,
    PartiallyAssigned,
    Ready,
    // updated by any responder
    // TODO: should you be able to skip to ontheway before all responders are ready?
    OnTheWay,
    OnSite,
    Done,
    Closed
}

export const RequestStatusToLabelMap: { [key in RequestStatus]: string | ((stats: AggregatePositionStats) => string) } = {
    [RequestStatus.Unassigned]: 'Unassigned',
    [RequestStatus.PartiallyAssigned]: (stats: AggregatePositionStats) => {
        return `${stats.totalMinFilled} of ${stats.totalMinToFill}`
    },
    [RequestStatus.Ready]: 'Ready',
    [RequestStatus.OnTheWay]: 'On the way',
    [RequestStatus.OnSite]: 'On site',
    [RequestStatus.Done]: 'Finished',
    [RequestStatus.Closed]: 'Archived'
}

export const HelpRequestFilterToLabelMap: { [key in HelpRequestFilter] : string } = {
    [HelpRequestFilter.Active]: 'Active',
    [HelpRequestFilter.Closed]: 'Archived',
    [HelpRequestFilter.All]: 'All'
}

export const HelpRequestSortByToLabelMap: { [key in HelpRequestSortBy] : string } = {
    [HelpRequestSortBy.ByTime]: 'By time',
    [HelpRequestSortBy.ByStatus]: 'By status',
    [HelpRequestSortBy.BySeverity]: 'By priority'
    // [HelpRequestSortBy.ByDistance]: 'By distance'
}

export type ResponderRequestStatuses = 
    RequestStatus.OnTheWay
    | RequestStatus.OnSite
    | RequestStatus.Done;

export enum Delimiters {
    Enum = ':'
}

export enum RequestTypeCategory {
    Alarm = 'ala',
    AnimalRelated = 'ani',
    AssistHouseless = 'ash',
    ChildInDanger = 'chd',
    CommunityCare = 'coc',
    Copwatch = 'cpw',
    DeescalationMediation = 'dem',
    Disturbance = 'dis',
    DomesticIntimatePartnerViolence = 'dov',
    EmotionalSupport = 'emo',
    Error = 'err',
    FirstAid = 'fai',
    Harassment = 'har',
    Internal = 'int',
    InterpersonalHarm = 'inh',
    Kidnapping = 'kid',
    LegalSupport = 'les',
    MentalHealthCrisis = 'mhc',
    MissingFoundPerson = 'mfp',
    ObstructingTrafficWalkway = 'otw',
    SexualViolence = 'sev',
    Shooting = 'sho',
    SubstanceUse = 'suu',
    TheftFraud = 'thf',
    VerbalResourceAssistance = 'vra',
    WitnessingTrouble = 'wit',
}

export enum RequestType {
    CarAlarmGoingOff = RequestTypeCategory.Alarm + ':' + 'a1',
    HomeBusinessAlarmGoingOff = RequestTypeCategory.Alarm + Delimiters.Enum + 'a2',
    AnimalCruelty = RequestTypeCategory.AnimalRelated + Delimiters.Enum + 'an1',
    LooseAnimalDangerousUnknown	= RequestTypeCategory.AnimalRelated	+ Delimiters.Enum + 'an2',
    LooseAnimalFriendly = RequestTypeCategory.AnimalRelated	+ Delimiters.Enum + 'an3',
    LostPetAnimal = RequestTypeCategory.AnimalRelated + Delimiters.Enum + 'an4',
    OtherAssistanceWithAnimal = RequestTypeCategory.AnimalRelated + Delimiters.Enum + 'an5',
    TrappedPetAnimal = RequestTypeCategory.AnimalRelated + Delimiters.Enum + 'an6',
    WildlifeViolations = RequestTypeCategory.AnimalRelated + Delimiters.Enum + 'an7',
    PersonWhoIsHouselessNeedsAssistance = RequestTypeCategory.AssistHouseless + Delimiters.Enum + 'ah1',
    SleepingInPublicPlace = RequestTypeCategory.AssistHouseless + Delimiters.Enum + 'ah2',
    VigilanteHarassingPeopleWhoAreHouseless = RequestTypeCategory.AssistHouseless + Delimiters.Enum + 'ah3',
    ChildAbandoned = RequestTypeCategory.ChildInDanger + Delimiters.Enum + 'minor1',
    ChildAbuseByParentGuardian = RequestTypeCategory.ChildInDanger + Delimiters.Enum + 'minor2',
    ChildAbuseEndangeredGeneral = RequestTypeCategory.ChildInDanger + Delimiters.Enum + 'minor3',
    ChildMolested = RequestTypeCategory.ChildInDanger + Delimiters.Enum + 'minor4',
    ChildNeglect = RequestTypeCategory.ChildInDanger + Delimiters.Enum + 'minor5',
    RunawayChild = RequestTypeCategory.ChildInDanger + Delimiters.Enum + 'minor6',
    AbandonedVehicle = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc1',
    CallerInDanger = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc2',
    CheckBuildingForSafety = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc3',
    DetermineIfHelpIsNeededForPerson = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc4',
    EmployeeCoworkerHasBeenAbsent = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc5',
    InoperableVehicle = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc6',
    LitteringDumpingTrash = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc7',
    LockedOutOfResidenceAccident = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc8',
    Loitering = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc9',
    NeedHelpUndefined = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc10',
    PersonCallerTrappedSomewhere = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc11',
    SexWorkerNeedsHelp = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc12',
    SuspiciousPerson = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc13',
    SuspiciousSituation = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc14',
    SuspiciousVehicle = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc15',
    UnknownProblem = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc16',
    WelfareCheckGeneralUnknown = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc17',
    YouthOutsideLateAtNightPastCurfew = RequestTypeCategory.CommunityCare + Delimiters.Enum + 'cc18',
    ArrestingAMinor = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw1',
    CallerBeingArrested = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw2',
    CopsOnTheTrain = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw3',
    EncampmentRaid = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw4',
    HaveFootageEvidenceOfPoliceHarm = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw5',
    PoliceCheckpoint = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw6',
    PoliceGivingTickets = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw7',
    PoliceSearchAndFrisk = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw8',
    PoliceTakingDestroyingProperty = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw9',
    PoliceTamperingWithEvidence = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw10',
    PoliceAgencyHarassmentOfPeopleWhoAreHouseless = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw11',
    VerbalAbuseHarrassmentByPoliceOfficer = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw12',
    ViolenceHarmByPoliceOfficer = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw13',
    WitnessingAnArrest = RequestTypeCategory.Copwatch + Delimiters.Enum + 'cw14',
    ArgumentAmongFamily = RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm1',
    ArgumentBetweenAdults	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm2',
    ArgumentBetweenYouth = RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm3',
    ArgumentBetweenYouthAndAdults	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm4',
    DirectActionAssistance	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm5',
    FalseImprisonmentByBusiness	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm6',
    Fight = RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm7',
    FraudAtPlaceOfBusiness	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm8',
    LockedOutOfResidenceByCoHabitant	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm9',
    MarchParadeAssistance = RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm10',
    NoMoneyNotPayingBusinessAfterService	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm11',
    RequestToStandbyAndPreservePeace	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm12',
    Shoplifting	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm13',
    Trespassing	= RequestTypeCategory.DeescalationMediation + Delimiters.Enum + 'dm14',
    Fireworks = RequestTypeCategory.Disturbance + Delimiters.Enum + 'dist1',
    GeneralDisturbance = RequestTypeCategory.Disturbance + Delimiters.Enum + 'dist2',
    NoiseComplaint = RequestTypeCategory.Disturbance + Delimiters.Enum + 'dist3',
    ReportingADemonstrationProtest = RequestTypeCategory.Disturbance + Delimiters.Enum + 'dist4',
    SexualActivityConsensualInPublic = RequestTypeCategory.Disturbance + Delimiters.Enum + 'dist5',
    IntimatePartnerViolenceNoInjury = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv1',
    IntimatePartnerViolenceWithInjury = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv2',
    MoveOutWhileAbusivePartnerIsGone = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv3',
    OtherRoommateIssue = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv4',
    PhysicalViolenceBetweenCoHabitants = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv5',
    RestrainingOrderViolationPartnerSpouse = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv6',
    SexualAssaultRapeByPartner = RequestTypeCategory.DomesticIntimatePartnerViolence + Delimiters.Enum + 'ipv7',
    Advice = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es1',
    PostpartumDepression = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es2',
    ProcessingChildhoodAbuse = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es3',
    ProcessingHomophobicParentsRejection = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es4',
    ProcessingIPVDomesticViolence = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es5',
    ProcessingLossOfALovedOne = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es6',
    ProcessingOtherUnlistedTrauma = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es7',
    ProcessingPregnancyAbortion = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es8',
    ProcessingSexualViolence = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es9',
    ProcessingStateViolence = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es10',
    StressAnxiety = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es11',
    SuicidalIdeationSuicidePrevention = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es12',
    WitnessDeathMurder = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es13',
    WitnessSuicideCompleted = RequestTypeCategory.EmotionalSupport + Delimiters.Enum + 'es14',
    AccidentalCallCrywolf = RequestTypeCategory.Error + Delimiters.Enum + 'err1',
    CallerHungUp = RequestTypeCategory.Error + Delimiters.Enum + 'err2',
    CantUnderstandCaller = RequestTypeCategory.Error + Delimiters.Enum + 'err3',
    PrankCall = RequestTypeCategory.Error + Delimiters.Enum + 'err4',
    RequestForHelpWhenClosed = RequestTypeCategory.Error + Delimiters.Enum + 'err5',
    RudePrejudicedCaller = RequestTypeCategory.Error + Delimiters.Enum + 'err6',
    TestCallTraining = RequestTypeCategory.Error + Delimiters.Enum + 'err7',
    BiteOrSting = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa1',
    BleedingInternal = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa2',
    BleedingOtherWoundPuncture = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa3',
    BluntTraumaContusion = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa4',
    BrokenBone = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa5',
    BulletWound = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa6',
    BurnHeatChemicalElectricalEtc = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa7',
    ChestPainHeartAttackStroke = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa8',
    Choking = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa9',
    ComplaintOfPainGeneral = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa10',
    Dehydrated = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa11',
    Diabetic = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa12',
    DigestiveIssueDiarrheaFoodPoisoning = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa13',
    OtherMajorInjury = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa14',
    OtherMinorInjury = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa15',
    Overdose = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa16',
    PersonDownUnconscious = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa17',
    Poison = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa18',
    PregnancyDeliveryOfBaby = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa19',
    RespiratoryBreathingIssue = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa20',
    Seizure = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa21',
    SickCovid = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa22',
    SickNotCovidUnknown = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa23',
    StabWound = RequestTypeCategory.FirstAid + Delimiters.Enum + 'fa24',
    HarassmentGeneral = RequestTypeCategory.Harassment + Delimiters.Enum + 'h1',
    Peeper = RequestTypeCategory.Harassment + Delimiters.Enum + 'h2',
    Stalker = RequestTypeCategory.Harassment + Delimiters.Enum + 'h3',
    AssistResponder = RequestTypeCategory.Internal + Delimiters.Enum + 'int1',
    ResponderInjured = RequestTypeCategory.Internal + Delimiters.Enum + 'int2',
    HateCrimeSlur = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih1',
    InterpersonalViolenceGeneral = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih2',
    MaliciousDamageToPersonalProperty = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih3',
    PhysicalViolenceNoInjury = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih4',
    PhysicalViolenceWInjury = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih5',
    RestrainingOrderViolationOther = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih6',
    ThreatenNoWeapon = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih7',
    ThreatenWWeaponOrSubstance = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih8',
    VerbalEmotionalFinancialAbuse = RequestTypeCategory.InterpersonalHarm + Delimiters.Enum + 'ih9',
    AbductionByFamilyMember = RequestTypeCategory.Kidnapping + Delimiters.Enum + 'kn1',
    CoHabitantPreventingPersonFromLeaving = RequestTypeCategory.Kidnapping + Delimiters.Enum + 'kn2',
    KidnappingGeneralUnknown = RequestTypeCategory.Kidnapping + Delimiters.Enum + 'kn3',
    ChildProtectiveServicesDispute = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls1',
    EvictionLandlordTenantIssue = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls2',
    GenderAffirmingLegalSupport = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls3',
    ImmigrationDeportationSupport = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls4',
    LandlordTenantDisputeGeneral = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls5',
    LandlordTenantDisputeLockoutEviction = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls6',
    LegalSupportAtProtestDirectAction = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls7',
    MassArrest = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls8',
    OtherUnlistedLegalSupport = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls9',
    SharedCustodyIssuesWithChildren = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls10',
    SupportFilingComplaintAgainstPoliceOfficer = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls11',
    WorkplaceLegalSupport = RequestTypeCategory.LegalSupport + Delimiters.Enum + 'ls12',
    MentalHealthCrisisGeneralNonViolent = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc1',
    MentalIllnessAutism = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc2',
    MentalIllnessBipolar = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc3',
    MentalIllnessDementiaDisorientation = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc4',
    MentalIllnessDepressionAnxiety = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc5',
    MentalIllnessEatingDisorder = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc6',
    MentalIllnessNonviolentUndefinedPsychosis = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc7',
    MentalIllnessPTSD = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc8',
    MentalIllnessSchizophrenia = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc9',
    MentalIllnessViolentUndefinedPsychosis = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc10',
    PublicNudityIndecentExposure = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc11',
    SelfHarming = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc12',
    SuicideAttemptThreat = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc13',
    UrinatingDefecatingInPublic = RequestTypeCategory.MentalHealthCrisis + Delimiters.Enum + 'mhc14',
    FoundAdult = RequestTypeCategory.MissingFoundPerson + Delimiters.Enum + 'miss1',
    FoundYouth = RequestTypeCategory.MissingFoundPerson + Delimiters.Enum + 'miss2',
    MissingPersonIsAtRisk = RequestTypeCategory.MissingFoundPerson + Delimiters.Enum + 'miss3',
    YouthDidNotArriveAtHomeSchool = RequestTypeCategory.MissingFoundPerson + Delimiters.Enum + 'miss4',
    ObjectObstructingTraffic = RequestTypeCategory.ObstructingTrafficWalkway + Delimiters.Enum + 'traff1',
    PersonObstructingTraffic = RequestTypeCategory.ObstructingTrafficWalkway + Delimiters.Enum + 'traff2',
    TreeDown = RequestTypeCategory.ObstructingTrafficWalkway + Delimiters.Enum + 'traff3',
    VehicleBlockingDriveway = RequestTypeCategory.ObstructingTrafficWalkway + Delimiters.Enum + 'traff4',
    VehicleDoubleParking = RequestTypeCategory.ObstructingTrafficWalkway + Delimiters.Enum + 'traff5',
    AttemptedRape = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv1',
    AttemptedSexualAssault = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv2',
    Incest = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv3',
    Rape = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv4',
    RevengePorn = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv5',
    SexualAssault = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv6',
    SexualAssaultRapeNotByIntimatePartner = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv7',
    SexualHarassment = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv8',
    SexualHarmByPoliceOfficer = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv9',
    StatutoryRapeSexBetweenMinorAndAdult = RequestTypeCategory.SexualViolence + Delimiters.Enum + 'sv10',
    HeardShooting = RequestTypeCategory.Shooting + Delimiters.Enum + 'sh1',
    SawShootingInCommunity = RequestTypeCategory.Shooting + Delimiters.Enum + 'sh2',
    ShootingAtCallerDirectHomeCar = RequestTypeCategory.Shooting + Delimiters.Enum + 'sh3',
    ShootingAtNeighborDirectHomeCar = RequestTypeCategory.Shooting + Delimiters.Enum + 'sh4',
    IntoxicatedInBarClub = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub1',
    IntoxicatedInVehicleNotDriving = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub2',
    IntoxicatedInsideBuilding = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub3',
    IntoxicatedOnTheStreetSidewalk = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub4',
    NeedlesDrugParaphernaliaOnGround = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub5',
    SubstanceUseInPublic = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub6',
    YouthChildWithControlledSubstance = RequestTypeCategory.SubstanceUse + Delimiters.Enum + 'sub7',
    AttemptedBurglaryRobbery = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf1',
    Carjacking = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf2',
    FraudGeneral = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf3',
    HomeOfficeBurglarized = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf4',
    Robbery = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf5',
    StolenVehicle = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf6',
    TheftOfPersonalProperty = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf7',
    VehicleBurglarized = RequestTypeCategory.TheftFraud + Delimiters.Enum + 'tf8',
    AccessingAnAbortion = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst1',
    CallerRecievingPrankCalls = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst2',
    ChronicCaller = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst3',
    FindingCovidTesting = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst4',
    FindingShelter = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst5',
    FindingSTDSTITesting = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst6',
    GeneralComplaints = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst7',
    HelpGettingFoodWater = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst8',
    HelpGettingMedicine = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst9',
    InfoAboutCommunityMeeting = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst10',
    InfoAboutThisProgramCrisisTeam = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst11',
    NeedATow = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst12',
    OtherFinancialMutualAid = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst13',
    Transport = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst14',
    UtilitiesShutOff = RequestTypeCategory.VerbalResourceAssistance	+ Delimiters.Enum + 'asst15',
    BrandishingWeapon = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt1',
    Gambling = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt2',
    NegativeActivityWhereChildrenArePresent = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt3',
    PersonWithAGun = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt4',
    SellingDrugs = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt5',
    SexTrafficking = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt6',
    SexWork = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt7',
    ThrowingObjectsSubstance = RequestTypeCategory.WitnessingTrouble + Delimiters.Enum + 'wt8',
}

export const RequestTypeCategoryToLabelMap: { [key in RequestTypeCategory]: string } = {
    [RequestTypeCategory.Alarm]: 'Alarm',
    [RequestTypeCategory.AnimalRelated]: 'Animal-Related',
    [RequestTypeCategory.AssistHouseless]: 'Assist Houseless',
    [RequestTypeCategory.ChildInDanger]: 'Child in Danger',
    [RequestTypeCategory.CommunityCare]: 'Community Care',
    [RequestTypeCategory.Copwatch]: 'Copwatch',
    [RequestTypeCategory.DeescalationMediation]: 'De-escalation/Mediation',
    [RequestTypeCategory.Disturbance]: 'Disturbance',
    [RequestTypeCategory.DomesticIntimatePartnerViolence]: 'Domestic/Intimate Partner Violence',
    [RequestTypeCategory.EmotionalSupport]: 'Emotional Support',
    [RequestTypeCategory.Error]: 'Error',
    [RequestTypeCategory.FirstAid]: 'First Aid',
    [RequestTypeCategory.Harassment]: 'Harassment',
    [RequestTypeCategory.Internal]: 'Internal',
    [RequestTypeCategory.InterpersonalHarm]: 'Interpersonal Harm',
    [RequestTypeCategory.Kidnapping]: 'Kidnapping',
    [RequestTypeCategory.LegalSupport]: 'Legal Support',
    [RequestTypeCategory.MentalHealthCrisis]: 'Mental Health Crisis',
    [RequestTypeCategory.MissingFoundPerson]: 'Missing/Found Person',
    [RequestTypeCategory.ObstructingTrafficWalkway]: 'Obstructing Traffic/Walkway',
    [RequestTypeCategory.SexualViolence]: 'Sexual Violence',
    [RequestTypeCategory.Shooting]: 'Shooting',
    [RequestTypeCategory.SubstanceUse]: 'Substance Use',
    [RequestTypeCategory.TheftFraud]: 'Theft/Fraud',
    [RequestTypeCategory.VerbalResourceAssistance]: 'Verbal/Resource Assistance',
    [RequestTypeCategory.WitnessingTrouble]: 'Witnessing Trouble',
}

export const RequestTypeToLabelMap: { [key in RequestType]: string } = {
    [RequestType.CarAlarmGoingOff]: `Car alarm going off`,
    [RequestType.HomeBusinessAlarmGoingOff]: `Home/Business alarm going off`,
    [RequestType.AnimalCruelty]: `Animal Cruelty`,
    [RequestType.LooseAnimalDangerousUnknown]: `Loose animal -- dangerous/unknown`,
    [RequestType.LooseAnimalFriendly]: `Loose animal -- friendly`,
    [RequestType.LostPetAnimal]: `Lost pet/animal`,
    [RequestType.OtherAssistanceWithAnimal]: `Other assistance with animal`,
    [RequestType.TrappedPetAnimal]: `Trapped pet/animal`,
    [RequestType.WildlifeViolations]: `Wildlife violations`,
    [RequestType.PersonWhoIsHouselessNeedsAssistance]: `Person who is houseless needs assistance`,
    [RequestType.SleepingInPublicPlace]: `Sleeping in public place`,
    [RequestType.VigilanteHarassingPeopleWhoAreHouseless]: `Vigilante harassing people who are houseless`,
    [RequestType.ChildAbandoned]: `Child Abandoned`,
    [RequestType.ChildAbuseByParentGuardian]: `Child Abuse (by parent/guardian)`,
    [RequestType.ChildAbuseEndangeredGeneral]: `Child Abuse/Endangered (general)`,
    [RequestType.ChildMolested]: `Child Molested`,
    [RequestType.ChildNeglect]: `Child Neglect`,
    [RequestType.RunawayChild]: `Runaway child`,
    [RequestType.AbandonedVehicle]: `Abandoned Vehicle`,
    [RequestType.CallerInDanger]: `Caller in Danger`,
    [RequestType.CheckBuildingForSafety]: `Check building for safety`,
    [RequestType.DetermineIfHelpIsNeededForPerson]: `Determine if help is needed for person`,
    [RequestType.EmployeeCoworkerHasBeenAbsent]: `Employee/coworker has been absent`,
    [RequestType.InoperableVehicle]: `Inoperable Vehicle`,
    [RequestType.LitteringDumpingTrash]: `Littering/Dumping trash`,
    [RequestType.LockedOutOfResidenceAccident]: `Locked out of residence - accident`,
    [RequestType.Loitering]: `Loitering`,
    [RequestType.NeedHelpUndefined]: `Need Help (Undefined)`,
    [RequestType.PersonCallerTrappedSomewhere]: `Person/caller trapped somewhere`,
    [RequestType.SexWorkerNeedsHelp]: `Sex worker needs help`,
    [RequestType.SuspiciousPerson]: `Suspicious person`,
    [RequestType.SuspiciousSituation]: `Suspicious situation`,
    [RequestType.SuspiciousVehicle]: `Suspicious vehicle`,
    [RequestType.UnknownProblem]: `Unknown Problem`,
    [RequestType.WelfareCheckGeneralUnknown]: `Welfare check (general/unknown)`,
    [RequestType.YouthOutsideLateAtNightPastCurfew]: `Youth outside late at night/past curfew`,
    [RequestType.ArrestingAMinor]: `Arresting a minor`,
    [RequestType.CallerBeingArrested]: `Caller being arrested`,
    [RequestType.CopsOnTheTrain]: `Cops on the train`,
    [RequestType.EncampmentRaid]: `Encampment Raid`,
    [RequestType.HaveFootageEvidenceOfPoliceHarm]: `Have footage/evidence of police harm`,
    [RequestType.PoliceCheckpoint]: `Police checkpoint`,
    [RequestType.PoliceGivingTickets]: `Police giving tickets`,
    [RequestType.PoliceSearchAndFrisk]: `Police search & frisk`,
    [RequestType.PoliceTakingDestroyingProperty]: `Police taking/destroying property`,
    [RequestType.PoliceTamperingWithEvidence]: `Police tampering with evidence`,
    [RequestType.PoliceAgencyHarassmentOfPeopleWhoAreHouseless]: `Police/agency harassment of people who are houseless`,
    [RequestType.VerbalAbuseHarrassmentByPoliceOfficer]: `Verbal abuse/harrassment by police officer`,
    [RequestType.ViolenceHarmByPoliceOfficer]: `Violence/harm by police officer`,
    [RequestType.WitnessingAnArrest]: `Witnessing an arrest`,
    [RequestType.ArgumentAmongFamily]: `Argument among family`,
    [RequestType.ArgumentBetweenAdults]: `Argument between adults`,
    [RequestType.ArgumentBetweenYouth]: `Argument between youth`,
    [RequestType.ArgumentBetweenYouthAndAdults]: `Argument between youth & adults`,
    [RequestType.DirectActionAssistance]: `Direct Action assistance`,
    [RequestType.FalseImprisonmentByBusiness]: `False imprisonment by business`,
    [RequestType.Fight]: `Fight`,
    [RequestType.FraudAtPlaceOfBusiness]: `Fraud at place of business`,
    [RequestType.LockedOutOfResidenceByCoHabitant]: `Locked out of residence by co-habitant`,
    [RequestType.MarchParadeAssistance]: `March/parade assistance`,
    [RequestType.NoMoneyNotPayingBusinessAfterService]: `No money/not paying business after service`,
    [RequestType.RequestToStandbyAndPreservePeace]: `Request to standby and preserve peace`,
    [RequestType.Shoplifting]: `Shoplifting`,
    [RequestType.Trespassing]: `Trespassing`,
    [RequestType.Fireworks]: `Fireworks`,
    [RequestType.GeneralDisturbance]: `General disturbance`,
    [RequestType.NoiseComplaint]: `Noise complaint`,
    [RequestType.ReportingADemonstrationProtest]: `Reporting a demonstration/protest`,
    [RequestType.SexualActivityConsensualInPublic]: `Sexual Activity (consensual) in Public`,
    [RequestType.IntimatePartnerViolenceNoInjury]: `Intimate Partner Violence - no injury`,
    [RequestType.IntimatePartnerViolenceWithInjury]: `Intimate Partner Violence - with injury`,
    [RequestType.MoveOutWhileAbusivePartnerIsGone]: `Move out while abusive partner is gone`,
    [RequestType.OtherRoommateIssue]: `Other roommate issue`,
    [RequestType.PhysicalViolenceBetweenCoHabitants]: `Physical violence (between co-habitants)`,
    [RequestType.RestrainingOrderViolationPartnerSpouse]: `Restraining Order Violation - partner/spouse`,
    [RequestType.SexualAssaultRapeByPartner]: `Sexual assault/rape (by partner)`,
    [RequestType.Advice]: `Advice`,
    [RequestType.PostpartumDepression]: `Postpartum depression`,
    [RequestType.ProcessingChildhoodAbuse]: `Processing childhood abuse`,
    [RequestType.ProcessingHomophobicParentsRejection]: `Processing homophobic parents/rejection`,
    [RequestType.ProcessingIPVDomesticViolence]: `Processing IPV/domestic violence`,
    [RequestType.ProcessingLossOfALovedOne]: `Processing loss of a loved one`,
    [RequestType.ProcessingOtherUnlistedTrauma]: `Processing other/unlisted trauma`,
    [RequestType.ProcessingPregnancyAbortion]: `Processing pregnancy/abortion`,
    [RequestType.ProcessingSexualViolence]: `Processing sexual violence`,
    [RequestType.ProcessingStateViolence]: `Processing state violence`,
    [RequestType.StressAnxiety]: `Stress/anxiety`,
    [RequestType.SuicidalIdeationSuicidePrevention]: `Suicidal Ideation/Suicide Prevention`,
    [RequestType.WitnessDeathMurder]: `Witness death/murder`,
    [RequestType.WitnessSuicideCompleted]: `Witness suicide completed`,
    [RequestType.AccidentalCallCrywolf]: `Accidental call/crywolf`,
    [RequestType.CallerHungUp]: `Caller hung up`,
    [RequestType.CantUnderstandCaller]: `Can't Understand Caller`,
    [RequestType.PrankCall]: `Prank Call`,
    [RequestType.RequestForHelpWhenClosed]: `Request for help when closed`,
    [RequestType.RudePrejudicedCaller]: `Rude/Prejudiced caller`,
    [RequestType.TestCallTraining]: `Test Call/Training`,
    [RequestType.BiteOrSting]: `Bite or sting`,
    [RequestType.BleedingInternal]: `Bleeding (internal)`,
    [RequestType.BleedingOtherWoundPuncture]: `Bleeding (other wound/puncture)`,
    [RequestType.BluntTraumaContusion]: `Blunt trauma/contusion`,
    [RequestType.BrokenBone]: `Broken bone`,
    [RequestType.BulletWound]: `Bullet wound`,
    [RequestType.BurnHeatChemicalElectricalEtc]: `Burn (heat/chemical/electrical/etc)`,
    [RequestType.ChestPainHeartAttackStroke]: `Chest pain/heart attack/stroke`,
    [RequestType.Choking]: `Choking`,
    [RequestType.ComplaintOfPainGeneral]: `Complaint of pain (general)`,
    [RequestType.Dehydrated]: `Dehydrated`,
    [RequestType.Diabetic]: `Diabetic`,
    [RequestType.DigestiveIssueDiarrheaFoodPoisoning]: `Digestive Issue (Diarrhea, Food Poisoning)`,
    [RequestType.OtherMajorInjury]: `Other Major Injury`,
    [RequestType.OtherMinorInjury]: `Other Minor Injury`,
    [RequestType.Overdose]: `Overdose`,
    [RequestType.PersonDownUnconscious]: `Person down/unconscious`,
    [RequestType.Poison]: `Poison`,
    [RequestType.PregnancyDeliveryOfBaby]: `Pregnancy/delivery of baby`,
    [RequestType.RespiratoryBreathingIssue]: `Respiratory/Breathing Issue`,
    [RequestType.Seizure]: `Seizure`,
    [RequestType.SickCovid]: `Sick (Covid)`,
    [RequestType.SickNotCovidUnknown]: `Sick (not Covid/unknown)`,
    [RequestType.StabWound]: `Stab wound`,
    [RequestType.HarassmentGeneral]: `Harassment (general)`,
    [RequestType.Peeper]: `Peeper`,
    [RequestType.Stalker]: `Stalker`,
    [RequestType.AssistResponder]: `Assist Responder`,
    [RequestType.ResponderInjured]: `Responder Injured`,
    [RequestType.HateCrimeSlur]: `Hate Crime/Slur`,
    [RequestType.InterpersonalViolenceGeneral]: `Interpersonal Violence (general)`,
    [RequestType.MaliciousDamageToPersonalProperty]: `Malicious damage to personal property`,
    [RequestType.PhysicalViolenceNoInjury]: `Physical violence (no injury)`,
    [RequestType.PhysicalViolenceWInjury]: `Physical violence (w/injury)`,
    [RequestType.RestrainingOrderViolationOther]: `Restraining Order Violation - other`,
    [RequestType.ThreatenNoWeapon]: `Threaten (no weapon)`,
    [RequestType.ThreatenWWeaponOrSubstance]: `Threaten (w/weapon or substance)`,
    [RequestType.VerbalEmotionalFinancialAbuse]: `Verbal/Emotional/Financial Abuse`,
    [RequestType.AbductionByFamilyMember]: `Abduction by family member`,
    [RequestType.CoHabitantPreventingPersonFromLeaving]: `Co-habitant preventing person from leaving`,
    [RequestType.KidnappingGeneralUnknown]: `Kidnapping (general/unknown)`,
    [RequestType.ChildProtectiveServicesDispute]: `Child Protective Services dispute`,
    [RequestType.EvictionLandlordTenantIssue]: `Eviction/landlord-tenant issue`,
    [RequestType.GenderAffirmingLegalSupport]: `Gender-affirming legal support`,
    [RequestType.ImmigrationDeportationSupport]: `Immigration/Deportation support`,
    [RequestType.LandlordTenantDisputeGeneral]: `Landlord-Tenant Dispute - general`,
    [RequestType.LandlordTenantDisputeLockoutEviction]: `Landlord-Tenant Dispute - Lockout/Eviction`,
    [RequestType.LegalSupportAtProtestDirectAction]: `Legal support at protest/direct action`,
    [RequestType.MassArrest]: `Mass arrest`,
    [RequestType.OtherUnlistedLegalSupport]: `Other/unlisted legal support`,
    [RequestType.SharedCustodyIssuesWithChildren]: `Shared Custody Issues with children`,
    [RequestType.SupportFilingComplaintAgainstPoliceOfficer]: `Support filing complaint against police officer`,
    [RequestType.WorkplaceLegalSupport]: `Workplace legal support`,
    [RequestType.MentalHealthCrisisGeneralNonViolent]: `Mental Health Crisis (general/non-violent)`,
    [RequestType.MentalIllnessAutism]: `Mental Illness - Autism`,
    [RequestType.MentalIllnessBipolar]: `Mental Illness - Bipolar`,
    [RequestType.MentalIllnessDementiaDisorientation]: `Mental Illness - Dementia/Disorientation`,
    [RequestType.MentalIllnessDepressionAnxiety]: `Mental Illness - Depression/Anxiety`,
    [RequestType.MentalIllnessEatingDisorder]: `Mental Illness - Eating Disorder`,
    [RequestType.MentalIllnessNonviolentUndefinedPsychosis]: `Mental Illness - Nonviolent Undefined Psychosis`,
    [RequestType.MentalIllnessPTSD]: `Mental Illness - PTSD`,
    [RequestType.MentalIllnessSchizophrenia]: `Mental Illness - Schizophrenia`,
    [RequestType.MentalIllnessViolentUndefinedPsychosis]: `Mental Illness - Violent Undefined Psychosis`,
    [RequestType.PublicNudityIndecentExposure]: `Public nudity/indecent exposure`,
    [RequestType.SelfHarming]: `Self-harming`,
    [RequestType.SuicideAttemptThreat]: `Suicide Attempt/Threat`,
    [RequestType.UrinatingDefecatingInPublic]: `Urinating/defecating in public`,
    [RequestType.FoundAdult]: `Found Adult`,
    [RequestType.FoundYouth]: `Found Youth`,
    [RequestType.MissingPersonIsAtRisk]: `Missing Person is at risk`,
    [RequestType.YouthDidNotArriveAtHomeSchool]: `Youth did not arrive at home/school`,
    [RequestType.ObjectObstructingTraffic]: `Object obstructing traffic`,
    [RequestType.PersonObstructingTraffic]: `Person Obstructing Traffic`,
    [RequestType.TreeDown]: `Tree Down`,
    [RequestType.VehicleBlockingDriveway]: `Vehicle Blocking Driveway`,
    [RequestType.VehicleDoubleParking]: `Vehicle Double Parking`,
    [RequestType.AttemptedRape]: `Attempted Rape`,
    [RequestType.AttemptedSexualAssault]: `Attempted Sexual Assault`,
    [RequestType.Incest]: `Incest`,
    [RequestType.Rape]: `Rape`,
    [RequestType.RevengePorn]: `Revenge Porn`,
    [RequestType.SexualAssault]: `Sexual Assault`,
    [RequestType.SexualAssaultRapeNotByIntimatePartner]: `Sexual assault/rape (not by intimate partner)`,
    [RequestType.SexualHarassment]: `Sexual Harassment`,
    [RequestType.SexualHarmByPoliceOfficer]: `Sexual harm by police officer`,
    [RequestType.StatutoryRapeSexBetweenMinorAndAdult]: `Statutory rape (sex between minor and adult)`,
    [RequestType.HeardShooting]: `Heard Shooting`,
    [RequestType.SawShootingInCommunity]: `Saw Shooting in Community`,
    [RequestType.ShootingAtCallerDirectHomeCar]: `Shooting at caller (direct/home/car)`,
    [RequestType.ShootingAtNeighborDirectHomeCar]: `Shooting at neighbor (direct/home/car)`,
    [RequestType.IntoxicatedInBarClub]: `Intoxicated in bar/club`,
    [RequestType.IntoxicatedInVehicleNotDriving]: `Intoxicated in vehicle (not driving)`,
    [RequestType.IntoxicatedInsideBuilding]: `Intoxicated inside building`,
    [RequestType.IntoxicatedOnTheStreetSidewalk]: `Intoxicated on the street/sidewalk`,
    [RequestType.NeedlesDrugParaphernaliaOnGround]: `Needles/drug paraphernalia on ground`,
    [RequestType.SubstanceUseInPublic]: `Substance use in public`,
    [RequestType.YouthChildWithControlledSubstance]: `Youth/child with controlled substance`,
    [RequestType.AttemptedBurglaryRobbery]: `Attempted Burglary/Robbery`,
    [RequestType.Carjacking]: `Carjacking`,
    [RequestType.FraudGeneral]: `Fraud (general)`,
    [RequestType.HomeOfficeBurglarized]: `Home/Office burglarized`,
    [RequestType.Robbery]: `Robbery`,
    [RequestType.StolenVehicle]: `Stolen Vehicle`,
    [RequestType.TheftOfPersonalProperty]: `Theft of Personal Property`,
    [RequestType.VehicleBurglarized]: `Vehicle Burglarized`,
    [RequestType.AccessingAnAbortion]: `Accessing an abortion`,
    [RequestType.CallerRecievingPrankCalls]: `Caller Recieving Prank Calls`,
    [RequestType.ChronicCaller]: `Chronic Caller`,
    [RequestType.FindingCovidTesting]: `Finding Covid Testing`,
    [RequestType.FindingShelter]: `Finding Shelter`,
    [RequestType.FindingSTDSTITesting]: `Finding STD/STI Testing`,
    [RequestType.GeneralComplaints]: `General complaints`,
    [RequestType.HelpGettingFoodWater]: `Help getting food/water`,
    [RequestType.HelpGettingMedicine]: `Help getting medicine`,
    [RequestType.InfoAboutCommunityMeeting]: `Info about Community Meeting`,
    [RequestType.InfoAboutThisProgramCrisisTeam]: `Info about this program/crisis team`,
    [RequestType.NeedATow]: `Need a tow`,
    [RequestType.OtherFinancialMutualAid]: `Other financial/mutual aid`,
    [RequestType.Transport]: `Transport`,
    [RequestType.UtilitiesShutOff]: `Utilities shut off`,
    [RequestType.BrandishingWeapon]: `Brandishing weapon`,
    [RequestType.Gambling]: `Gambling`,
    [RequestType.NegativeActivityWhereChildrenArePresent]: `Negative activity where children are present`,
    [RequestType.PersonWithAGun]: `Person with a gun`,
    [RequestType.SellingDrugs]: `Selling drugs`,
    [RequestType.SexTrafficking]: `Sex Trafficking`,
    [RequestType.SexWork]: `Sex Work`,
    [RequestType.ThrowingObjectsSubstance]: `Throwing objects/substance`,
}

export const RequestTypeCategories: Map<string, Category> = new Map();

// NOTE: because of the +'s in the RequestType enum it thinks it's return value can be a 
// number so these unknwn to string conversions are necessary
export function requestTypeToRequestTypeCategory(typ: RequestType): RequestTypeCategory {
    return (typ as unknown as string).split(Delimiters.Enum)[0] as RequestTypeCategory
}

export function requestTypesToCategorizedItems(typs: RequestType[]): CategorizedItem[] {
    return typs.map(typ => {
        return {
            categoryId: requestTypeToRequestTypeCategory(typ),
            itemId: typ as unknown as string
        }
    });
}

export function categorizedItemsToRequestType(items: CategorizedItem[]): RequestType[] {
    return items.map(item => item.itemId as unknown as RequestType)
}

export type Location = {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number | null;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
};

export type AppSecrets = {
    googleMapsApiKey: string
}

export enum LinkExperience {
    SignUpThroughOrganization = 'suto',
    JoinOrganization = 'jo',
    ResetPassword = 'rp'
}

export type LinkParams = {
    [LinkExperience.SignUpThroughOrganization]: {
        orgId: string,
        email: string,
        pendingId: string
    },
    [LinkExperience.JoinOrganization]: {
        orgId: string,
        email: string,
        pendingId: string
    },
    [LinkExperience.ResetPassword]: {
        code: string
    }  
} 

/**
 * TODO: 
 * 1) make these the ONLY event list
 * 2) remove PatchUIEvent all together and make ui do logic for how it should
 * handle updating data and/or showing notifications
 *     a) update store
 * 3) backend only handles the different update/notification heuristics  
 *     a) as a "Best try" over the websocket (user only see's if they are in app)
 *     b) as a notification so it will be picked up in the background
 *     c) can we try socket and tell if it fails/succeeds from an ack from the front end to fall back to notifications?
 * 4) UI unifies how it handles events from notifications vs the websocket and decides what warrants
 * a visual (system) notification vs handling in app ui (even if it comes through a notification!)
 * 5) delete dead code around old properties types on
 *     a) the user model
 *     b) the request model
 *     c) notification types
 *     d) old concepts ie. roles.v1/skills/etc
 */
export enum PatchEventType {
    // User.System.<_>
    UserForceLogout = '0.0.0',
    UserCreated = '0.0.1',
    UserEdited = '0.0.2',
    UserDeleted = '0.0.3',

    // User.Org.<_>
    UserAddedToOrg = '0.1.0',
    UserRemovedFromOrg = '0.1.1',
    UserChangedRolesInOrg = '0.1.2',

    // User.Duty.<_>
    UserOnDuty = '0.2.0',
    UserOffDuty = '0.2.1',

    // Request.System.<_>
    RequestCreated = '1.0.0', // to users notified
    RequestEdited =	'1.0.1',
    RequestDeleted = '1.0.2',


    // TODO: what do we do about team events on request?!?!
    // 1) roll TeamEventType into these and have TeamEventType just be 
    // a subset of this type
    // 2) have different bindings from PatchEventType variants to the params it needs for
    // - PatchEvent (used in background and sent to user)
    // - RequestTeamEvent (used on request model)

    // Request.Responders.<_>
    // RequestRespondersAssigned =	'1.1.0',

    /**
     * SENT TO: request admins 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: no
     */
    RequestRespondersNotified = '1.1.0',

    /**
     * SENT TO: request admins 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: no
     */
    RequestRespondersNotificationAck = '1.1.1',

    /**
     * SENT TO: request admins 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: yes
     */
    RequestRespondersRequestToJoin = '1.1.2',  
     /**
     * SENT TO: nobody currently
     * SENT VIA WEBSOCKET: n/a
     * SENT VIA NOTIFICATION: n/a
     * SHOULD SHOW NOTIFICATION: n/a
     */
    RequestRespondersRequestToJoinAck = '1.1.3',  
    /**
     * SENT TO: requester...NOTE: already joined users get same as joined notification 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: yes
     */
    RequestRespondersAccepted =	'1.1.4',  
    /**
     * SENT TO: already joined users + request admins 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: yes
     */
    RequestRespondersJoined =	'1.1.5',  
    /**
     * SENT TO: requester 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: yes
     */
    RequestRespondersDeclined =	'1.1.6',  
    /**
     * SENT TO: already joined users + request admins 
     * SENT VIA WEBSOCKET: yes 
     * SENT VIA NOTIFICATION: yes
     */
    RequestRespondersLeft =	'1.1.7',      
    /**
     * SENT TO: the kicked user...NOTE: already joined users get same as left notification 
     * SENT VIA WEBSOCKET: yes
     * SENT VIA NOTIFICATION: yes
     * SHOULD SHOW NOTIFICATION: yes
     */
    RequestRespondersRemoved =	'1.1.8',  

    // Request.Chat.<_>
    RequestChatNewMessage =	'1.2.0',

    // Organization.System.<_>
    OrganizationEdited = '2.0.0',
    OrganizationDeleted = '2.0.1',

    // Organization.Roles.<_>
    OrganizationRoleCreated = '2.1.0',
    OrganizationRoleEdited = '2.1.1',
    OrganizationRoleDeleted = '2.1.2',

    // Organization.Attributes.<_>
    OrganizationAttributesUpdated = '2.2.0',

    // Organization.Tags.<_>
    OrganizationTagsUpdated = '2.3.0',

    // TODO(Shift): will need their own events

    // System.DynamicConfig.<_>
    SystemDynamicConfigUpdated = '3.0.0'
}

// PatchEventType Convenience Type
export type RequestTeamEventTypes =
    PatchEventType.RequestRespondersNotified
    | PatchEventType.RequestRespondersNotificationAck
    | PatchEventType.RequestRespondersJoined
    | PatchEventType.RequestRespondersRequestToJoin
    | PatchEventType.RequestRespondersRequestToJoinAck
    | PatchEventType.RequestRespondersLeft
    | PatchEventType.RequestRespondersRemoved
    | PatchEventType.RequestRespondersAccepted
    | PatchEventType.RequestRespondersDeclined;

// PatchEventType Convenience Type
export type IndividualRequestEventType = RequestTeamEventTypes
    | PatchEventType.RequestChatNewMessage
    | PatchEventType.RequestCreated
    | PatchEventType.RequestDeleted
    | PatchEventType.RequestEdited;

// PatchEventType Convenience Type
// these deletes/updates might affect multiple 
// requests that need to be refreshed
export type BulkRequestEventType = 
    PatchEventType.OrganizationRoleDeleted
    | PatchEventType.OrganizationAttributesUpdated
    | PatchEventType.OrganizationTagsUpdated

// PatchEventType Convenience Type
export type IndividualUserEventType = PatchEventType.UserCreated
    | PatchEventType.UserEdited
    | PatchEventType.UserDeleted
    | PatchEventType.UserAddedToOrg
    | PatchEventType.UserRemovedFromOrg
    | PatchEventType.UserChangedRolesInOrg
    | PatchEventType.UserOnDuty
    | PatchEventType.UserOffDuty

// PatchEventType Convenience Type
// these deletes/updates might affect multiple 
// users that need to be refreshed
export type BulkUserEventType = 
    PatchEventType.OrganizationRoleDeleted
    | PatchEventType.OrganizationAttributesUpdated

// PatchEventType Convenience Type
export type OrgEventType = PatchEventType.OrganizationEdited
    | PatchEventType.OrganizationDeleted
    | PatchEventType.OrganizationRoleCreated
    | PatchEventType.OrganizationRoleEdited
    | PatchEventType.OrganizationRoleDeleted
    | PatchEventType.OrganizationAttributesUpdated
    | PatchEventType.OrganizationTagsUpdated

export type NotificationEventType = SilentNotificationEventType | NoisyNotificationEventType;

// PatchEventType Convenience Type
export type SilentNotificationEventType = PatchEventType.UserForceLogout
    | PatchEventType.RequestRespondersNotificationAck
    | PatchEventType.UserEdited
    | PatchEventType.UserOnDuty
    | PatchEventType.UserOffDuty
    | PatchEventType.UserChangedRolesInOrg
    | PatchEventType.UserAddedToOrg
    | PatchEventType.RequestCreated
    | PatchEventType.RequestEdited
    | PatchEventType.OrganizationEdited
    | PatchEventType.OrganizationTagsUpdated
    | PatchEventType.OrganizationAttributesUpdated
    | PatchEventType.OrganizationRoleCreated
    | PatchEventType.OrganizationRoleEdited
    | PatchEventType.OrganizationRoleDeleted
    | PatchEventType.SystemDynamicConfigUpdated

// PatchEventType Convenience Type
export type NoisyNotificationEventType = PatchEventType.RequestRespondersJoined
    | PatchEventType.RequestRespondersLeft
    | PatchEventType.RequestRespondersAccepted
    | PatchEventType.RequestRespondersDeclined
    | PatchEventType.RequestRespondersRemoved
    | PatchEventType.RequestRespondersRequestToJoin
    | PatchEventType.RequestRespondersNotified
    | PatchEventType.RequestChatNewMessage

export type PatchEventParams = {
    [PatchEventType.UserForceLogout]: {
        userId: string,
        refreshToken: string
    },
    [PatchEventType.UserCreated]: {
        // orgId: string,
        userId: string
    }
    [PatchEventType.UserEdited]: {
        userId: string, 
        orgId: string
    },
    [PatchEventType.UserDeleted]: {
        // orgId: string,
        userId: string
    }, 
    [PatchEventType.UserAddedToOrg]: {
        userId: string,
        orgId: string
    }, 
    [PatchEventType.UserRemovedFromOrg]: {
        userId: string,
        orgId: string
    }, 
    [PatchEventType.UserChangedRolesInOrg]: {
        userId: string,
        orgId: string
    }, 
    [PatchEventType.UserOnDuty]: {
        userId: string,
        orgId: string
    }, 
    [PatchEventType.UserOffDuty]: {
        userId: string,
        orgId: string
    }, 
    [PatchEventType.RequestCreated]: {
        orgId:string,
        requestId: string
    }, 
    [PatchEventType.RequestEdited]: {
        orgId:string,
        requestId: string
    }, 
    [PatchEventType.RequestDeleted]: {
        orgId:string,
        requestId: string
    }, 
    [PatchEventType.RequestRespondersNotified]: {
        // orgId: string,
        requestId: string,
        notifierId: string,
        userIds: string[]
    },
    [PatchEventType.RequestRespondersNotificationAck]: {
        // orgId: string,
        requestId: string
    },
    [PatchEventType.RequestRespondersRequestToJoin]: {
        orgId: string,
        responderId: string,
        requestId: string,
        positionId: string
    },
    [PatchEventType.RequestRespondersRequestToJoinAck]: {
        orgId: string,
        requestId: string,
        joinRequests: {
            positionId: string
            userId: string,
        }[]
    },
    [PatchEventType.RequestRespondersAccepted]: {
        orgId: string,
        responderId: string,
        requestId: string,
        positionId: string,
        accepterId: string
    }, 
    [PatchEventType.RequestRespondersJoined]: {
        orgId: string,
        responderId: string,
        requestId: string,
        positionId: string
    }, 
    [PatchEventType.RequestRespondersDeclined]: {
        orgId: string,
        responderId: string,
        requestId: string,
        positionId: string,
        declinerId: string
    }, 
    [PatchEventType.RequestRespondersLeft]: {
        orgId: string,
        responderId: string,
        requestId: string,
        positionId: string
    }, 
    [PatchEventType.RequestRespondersRemoved]: {
        orgId: string,
        responderId: string,
        requestId: string,
        positionId: string,
        removerId: string
    }, 
    [PatchEventType.RequestChatNewMessage]: {
        orgId: string,
        requestId: string,
        userId: string
    },
    [PatchEventType.OrganizationEdited]: {
        orgId: string
    },
    [PatchEventType.OrganizationDeleted]: {
        orgId: string
    },
    [PatchEventType.OrganizationRoleCreated]: {
        orgId: string,
        roleId: string
    },
    [PatchEventType.OrganizationRoleEdited]: {
        orgId: string,
        roleId: string
    },
    [PatchEventType.OrganizationRoleDeleted]: {
        orgId: string,
        roleId: string,
        updatedRequestIds: string[],
        updatedUserIds: string[]
    },
    [PatchEventType.OrganizationAttributesUpdated]: {
        orgId: string,
        updatedRequestIds: string[],
        updatedUserIds: string[],
        deletedCategoryIds: CategorizedItemUpdates['deletedCategories'],
        deletedItems: CategorizedItemUpdates['deletedItems']
    },
    [PatchEventType.OrganizationTagsUpdated]: {
        orgId: string,
        updatedRequestIds: string[],
        deletedCategoryIds: CategorizedItemUpdates['deletedCategories'],
        deletedItems: CategorizedItemUpdates['deletedItems']
    },
    [PatchEventType.SystemDynamicConfigUpdated]: {

    }
}

export type PatchEventPacket<T extends PatchEventType = PatchEventType> = {
    event: T,
    params: PatchEventParams[T],
    silent?: boolean
}

export type PatchNotification<T extends PatchEventType = PatchEventType> = {
    body: string,
    payload: PatchEventPacket<T>
}

export type DateTimeRange = {
    startDate: Date
    endDate: Date
}

export enum RecurringPeriod {
    Day = 'd',
    Week = 'w',
    Month = 'm',
}

export type RecurringTimePeriod = ({
    period: RecurringPeriod.Month,
    dayScope?: boolean,
    weekScope?: boolean
} | {
    period: RecurringPeriod.Week,
    days: number[]
} | {
    period: RecurringPeriod.Day
}) & { numberOf: number }

export type RecurringTimeConstraints = {
    every?: RecurringTimePeriod
    until?: {
        date: Date,
        repititions: null
    } | {
        date: null,
        repititions: number
    }
}

export type RecurringDateTimeRange = RecurringTimeConstraints & DateTimeRange;
export enum PatchPermissions {
    // Edit organization settings
    EditOrgSettings = 'eos',
    // Create, edit, and delete org Roles
    RoleAdmin = 'ra',
    // Create, edit, and delete org Attributes
    AttributeAdmin = 'attra',
    // Create, edit, and delete org Tags
    TagAdmin = 'ta',
    // Export org data
    ExportData = 'ed',
    // Invite people to org
    InviteToOrg = 'ito',
    // Remove people from org
    RemoveFromOrg = 'rfo',
    // Assign Roles to people in org
    AssignRoles = 'ar',
    // Assign Attributes to people in org
    AssignAttributes = 'aattr',
    // Create and manage chats
    ChatAdmin = 'ca',
    // Invite people to chats (user can see)
    InviteToChat = 'itc',
    // See all chats in org (incl. all request/shift chats)
    SeeAllChats = 'sac',
    // See all Shift chats
    SeeShiftChats = 'ssc',
    // See all Request chats
    SeeRequestChats = 'src',
    // Create and manage shifts,
    ShiftAdmin = 'sa',
    // Create and manage all requests
    RequestAdmin = 'reqa',
    // Edit data for requests (user is on)
    EditRequestData = 'erd',
    // Archive requests (user is on)
    CloseRequests = 'cr'
}

export enum PatchPermissionGroups {
    ManageOrg = 'mo',
    EditRoles = 'er',
    ManageMetadata = 'mm',
    ExportData = 'ed',
    ManageTeam = 'mt',
    ManageChats = 'mc',
    InviteToChats = 'itc',
    SeeAllChats = 'sac',
    ManageSchedule = 'ms',
    ManageRequests = 'mr',
    ContributeToRequests = 'ctr',
    CloseRequests = 'cr'
}

export type PatchPermissionGroupMetadata = {
    name: string,
    description: string,
    permissions: PatchPermissions[],
    forces?: PatchPermissionGroups[]
}

export const PermissionGroupMetadata: { [key in PatchPermissionGroups]: PatchPermissionGroupMetadata } = {
    [PatchPermissionGroups.ManageOrg]: {
        name: 'Manage organization',
        description: 'Change name and other org-wide settings',
        permissions: [
            PatchPermissions.EditOrgSettings
        ]
    },
    [PatchPermissionGroups.EditRoles]: {
        name: 'Edit roles',
        description: 'Define roles and set permissions',
        permissions: [
            PatchPermissions.RoleAdmin
        ]
    },
    [PatchPermissionGroups.ManageMetadata]: {
        name: 'Manage metadata',
        description: 'Define attributes for people and tags for requests',
        permissions: [
            PatchPermissions.AttributeAdmin,
            PatchPermissions.TagAdmin
        ]
    },
    [PatchPermissionGroups.ExportData]: {
        name: 'Export data',
        description: 'Save locations, timing, and other info',
        permissions: [
            PatchPermissions.ExportData
        ]
    },
    [PatchPermissionGroups.ManageTeam]: {
        name: 'Manage team',
        description: 'Invite people and assign roles and attributes',
        permissions: [
            PatchPermissions.InviteToOrg,
            PatchPermissions.RemoveFromOrg,
            PatchPermissions.AssignRoles,
            PatchPermissions.AssignAttributes,
        ]
    },
    [PatchPermissionGroups.ManageChats]: {
        name: 'Manage channels',
        description: 'Create channels and invite people',
        permissions: [
            PatchPermissions.ChatAdmin
        ],
        forces: [PatchPermissionGroups.InviteToChats]
    },
    [PatchPermissionGroups.InviteToChats]: {
        name: 'Invite to channels',
        description: `Add people to any channels you're in`,
        permissions: [
            PatchPermissions.InviteToChat
        ]
    },
    [PatchPermissionGroups.SeeAllChats]: {
        name: 'See all channels',
        description: `View and post without being a member`,
        permissions: [
            PatchPermissions.SeeAllChats,
            PatchPermissions.SeeRequestChats, 
            PatchPermissions.SeeShiftChats
        ]
    },
    [PatchPermissionGroups.ManageSchedule]: {
        name: 'Manage schedule',
        description: `Create, edit, and remove shifts`,
        permissions: [
            PatchPermissions.ShiftAdmin,
            PatchPermissions.SeeShiftChats
        ]
    },
    [PatchPermissionGroups.ManageRequests]: {
        name: 'Manage requests',
        description: `Create requests and notify team`,
        permissions: [
            PatchPermissions.RequestAdmin,
            PatchPermissions.SeeRequestChats
        ],
        forces: [PatchPermissionGroups.ContributeToRequests, PatchPermissionGroups.CloseRequests]
    },
    [PatchPermissionGroups.ContributeToRequests]: {
        name: 'Contribute to requests',
        description: `Edit data and set status when on a request`,
        permissions: [
            PatchPermissions.EditRequestData
        ]
    },
    [PatchPermissionGroups.CloseRequests]: {
        name: 'Archive requests',
        description: `Make requests inactive.`,
        permissions: [
            PatchPermissions.CloseRequests
        ]
    }
}

// DEFAULT ROLES

export enum DefaultRoleIds {
    Anyone = '__anyone',
    Admin = '__admin',
    Dispatcher = '__dispatcher',
    Responder = '__responder',
}

export enum RequestDetailsTabs {
    Overview = 'Overview', 
    Channel = 'Channel',
    Team = 'Team'
}

export const DefaultRoles: Role[] = [
    {
        id: DefaultRoleIds.Anyone,
        name: 'Anyone',
        permissionGroups: [
            PatchPermissionGroups.InviteToChats
        ]
    },
    {
        id: DefaultRoleIds.Admin,
        name: 'Admin',
        permissionGroups: [
            PatchPermissionGroups.ManageOrg,
            PatchPermissionGroups.ManageChats,
            PatchPermissionGroups.ManageMetadata,
            PatchPermissionGroups.ManageRequests,
            PatchPermissionGroups.ManageSchedule,
            PatchPermissionGroups.ManageTeam,
            PatchPermissionGroups.SeeAllChats,
            PatchPermissionGroups.ExportData,
            PatchPermissionGroups.EditRoles
        ]
    },
    {
        id: DefaultRoleIds.Dispatcher,
        name: 'Dispatcher',
        permissionGroups: [
            PatchPermissionGroups.ManageRequests
        ]
    },
    {
        id: DefaultRoleIds.Responder,
        name: 'Responder',
        permissionGroups: [
            PatchPermissionGroups.ContributeToRequests
        ]
    }
]

export enum StatusOption {
    Any = 'any',
    Available = 'ava',
    // TODO: put back when we have shifts
    // OnShift = 'ons' 
}

export enum EligibilityOption {
    Eligible = 'eli',
    Everyone = 'eve'
}

// DEFAULT TAGS

export enum DefaultTagCategoryIds {
    CommunicationType = '__communicationtype',
    Context = '__context',
    Equipment = '__equipment',
    Medication = '__medication',
    Resolution = '__resolution',
    Referral = '__referral',
}

export const DefaultTagCategories: TagCategory[] = [
    {
        id: DefaultTagCategoryIds.Referral,
        name: 'Referred to',
        tags: [
            { name: 'Shelter', id: DefaultTagCategoryIds.Referral + Delimiters.Enum + 'ref01' },
            { name: 'Hospital', id: DefaultTagCategoryIds.Referral + Delimiters.Enum + 'ref02' },
            { name: 'Legal aid', id: DefaultTagCategoryIds.Referral + Delimiters.Enum + 'ref03' },
            { name: 'Child care', id: DefaultTagCategoryIds.Referral + Delimiters.Enum + 'ref04' },
            { name: 'Other resource', id: DefaultTagCategoryIds.Referral + Delimiters.Enum + 'ref05' },
        ]
    },
    {
        id: DefaultTagCategoryIds.Resolution,
        name: 'Resolution',
        tags: [
            { name: 'Food/water provided', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res01' },
            { name: 'First aid provided', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res02' },
            { name: 'Mental health first aid provided', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res03' },
            { name: 'Move out assistance provided', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res04' },
            { name: 'Referral provided', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res05' },
            { name: 'Transportation provided', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res06' },
            { name: 'Refused assistance', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res07' },
            { name: 'Did not find', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res08' },
            { name: 'Request canceled', id: DefaultTagCategoryIds.Resolution + Delimiters.Enum + 'res09' },
        ]
    },
    {
        id: DefaultTagCategoryIds.Medication,
        name: 'Medication needed',
        tags: [
            { name: 'Albuterol', id: DefaultTagCategoryIds.Medication + Delimiters.Enum + 'med01' },
            { name: 'Epinephrine', id: DefaultTagCategoryIds.Medication + Delimiters.Enum + 'med02' },
            { name: 'Naloxone', id: DefaultTagCategoryIds.Medication + Delimiters.Enum + 'med03' },
        ]
    },
    {
        id: DefaultTagCategoryIds.Equipment,
        name: 'Equipment needed',
        tags: [
            { name: 'AED Defribrillator', id: DefaultTagCategoryIds.Equipment + Delimiters.Enum + 'equip01' },
            { name: 'Nebulizer', id: DefaultTagCategoryIds.Equipment + Delimiters.Enum + 'equip02' },
            { name: 'Vehicle', id: DefaultTagCategoryIds.Equipment + Delimiters.Enum + 'equip03' },
        ]
    },
    {
        id: DefaultTagCategoryIds.Context,
        name: 'Location',
        tags: [
            { name: 'Weapon present', id: DefaultTagCategoryIds.Context + Delimiters.Enum + 'con01' },
            { name: 'Police present', id: DefaultTagCategoryIds.Context + Delimiters.Enum + 'con02' },
            { name: 'Unsafe location', id: DefaultTagCategoryIds.Context + Delimiters.Enum + 'con03' },
            { name: 'Crowd at location', id: DefaultTagCategoryIds.Context + Delimiters.Enum + 'con04' },
        ]
    },
    {
        id: DefaultTagCategoryIds.CommunicationType,
        name: 'Request method',
        tags: [
            { name: 'Phone', id: DefaultTagCategoryIds.CommunicationType + Delimiters.Enum + 'com01' },
            { name: 'Text', id: DefaultTagCategoryIds.CommunicationType + Delimiters.Enum + 'com02' },
            { name: 'Social media', id: DefaultTagCategoryIds.CommunicationType + Delimiters.Enum + 'com03' },
            { name: 'Staff-initiated', id: DefaultTagCategoryIds.CommunicationType + Delimiters.Enum + 'com04' },
            { name: 'On behalf of another person', id: DefaultTagCategoryIds.CommunicationType + Delimiters.Enum + 'com05' },
        ]
    },
]

// DEFAULT ATTRIBUTES

export enum DefaultAttributeCategoryIds {
    Languages = '__languages',
    Skills = '__skills',
    Trainings = '__trainings',
}

export const DefaultAttributeCategories: AttributeCategory[] = [
    {
        id: DefaultAttributeCategoryIds.Languages,
        name: 'Languages',
        attributes: [
            { name: 'Amharic', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan01' },
            { name: 'Arabic', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan02' },
            { name: 'Bengali', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan03' },
            { name: 'Cantonese', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan04' },
            { name: 'Haitian Creole', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan05' },
            { name: 'Jamaican Creole', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan06' },
            { name: 'Other Creole', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan07' },
            { name: 'French', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan08' },
            { name: 'Hindi', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan09' },
            { name: 'Korean', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan10' },
            { name: 'Mandarin', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan11' },
            { name: 'Oromo', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan17' },
            { name: 'Portuguese', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan12' },
            { name: 'Spanish', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan13' },
            { name: 'Swahili', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan18' },
            { name: 'Tagalog', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan14' },
            { name: 'Vietnamese', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan15' },
            { name: 'Yoruba', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan16' },
            { name: 'Other language', id: DefaultAttributeCategoryIds.Languages + Delimiters.Enum + 'lan99' },
        ]
    },
    {
        id: DefaultAttributeCategoryIds.Skills,
        name: 'Capabilities',
        attributes: [
            { name: 'conflict resolution', id: DefaultAttributeCategoryIds.Skills + Delimiters.Enum + 'skills01' },
            { name: 'de-escalation', id: DefaultAttributeCategoryIds.Skills + Delimiters.Enum + 'skills02' },
            { name: 'first aid', id: DefaultAttributeCategoryIds.Skills + Delimiters.Enum + 'skills03' },
            { name: 'mental health first aid', id: DefaultAttributeCategoryIds.Skills + Delimiters.Enum + 'skills04' },
            { name: 'substance use support', id: DefaultAttributeCategoryIds.Skills + Delimiters.Enum + 'skills05' },
            { name: 'strenuous physical activity', id: DefaultAttributeCategoryIds.Skills + Delimiters.Enum + 'skills06' },
        ]
    },
    {
        id: DefaultAttributeCategoryIds.Trainings,
        name: 'Trainings',
        attributes: [
            { name: 'CPR', id: DefaultAttributeCategoryIds.Trainings + Delimiters.Enum + 'train01' },
            { name: 'Stop the Bleed', id: DefaultAttributeCategoryIds.Trainings + Delimiters.Enum + 'train02' },
        ]
    }
]

export type AggregatePositionStats = {
    totalMinFilled: number,
    totalMinToFill: number,
    totalFilled: number
}

/**
 * The set of changes you can make to an array of items without
 * editing the actual items themselves
 */
export type ArrayCollectionUpdate<Added, Removed=Added> = {
    addedItems: Added[],
    removedItems: Removed[]
}

/**
 * The set of changes you can make to an array of items including
 * editing the actual items themselves (which might require a separate `Update` type
 * tailored to the items the array is holding)
 */
export type ArrayItemUpdate<Added, Update=Added, Removed=Added> = ArrayCollectionUpdate<Added, Removed> & {
    itemUpdates: Update[]
}

// Position Diff Types
export type ReplaceablePositionProps = Pick<Position, 'role' | 'min' | 'max'>

export type PositionUpdate = {
    id: string,
    replacedProperties: {
        [key in keyof ReplaceablePositionProps]?: Position[key]
    }
    attributeUpdates: ArrayCollectionUpdate<CategorizedItem>
}

// convenience type tying Position to PositionUpdate 
export type PositionSetUpdate = ArrayItemUpdate<Position, PositionUpdate>

// Request Diff Types
export type ReplaceableRequestProps = Pick<HelpRequest, 'location' | 'notes' | 'callerName' | 'callerContactInfo' | 'callStartedAt' | 'callEndedAt' | 'priority'>

export type RequestUpdates = {
    replacedProperties: {
        [key in keyof ReplaceableRequestProps]?: HelpRequest[key]
    },
    tagUpdates: ArrayCollectionUpdate<CategorizedItem>,
    typeUpdates: ArrayCollectionUpdate<RequestType>,
    positionUpdates: PositionSetUpdate
}