import { AtLeast } from '.';
import {
    HelpRequest,
    Location,
    Me,
    Organization,
    OrganizationMetadata,
    UserRole,
    MinOrg,
    ProtectedUser,
    MinUser,
    BasicCredentials,
    MinHelpRequest,
    ResponderRequestStatuses,
    AuthTokens,
    AppSecrets,
    PendingUser,
    Role,
    MinRole,
    CategorizedItemUpdates,
    AdminEditableUser,
    CategorizedItem,
    TeamMemberMetadata,
    RequestUpdates,
    DynamicConfig
} from './models';

// TODO: type makes sure param types match but doesn't enforce you pass anything but token
// changing args to be a single object would fix this and allow for specific apis to take extra params for things
// but also make sure the original params are required for the call...but would require
// all api function signatures to take an object of params vs a more natural function call. 
export type TokenContext = { token: string };
export type OrgContext = TokenContext & { orgId: string };
export type RequestContext = OrgContext & { requestId: string }
export type RoleContext = OrgContext & { roleId: string }

type Authenticated<T extends (...args: any) => Promise<any>> = (ctx: TokenContext, ...args: Parameters<T>) => ReturnType<T>
type AuthenticatedWithOrg<T extends (...args: any) => Promise<any>> = (ctx: OrgContext, ...args: Parameters<T>) => ReturnType<T>
type AuthenticatedWithRequest<T extends (...args: any) => Promise<any>> = (ctx: RequestContext, ...args: Parameters<T>) => ReturnType<T>

// these check if you are logged in
type SSAuthenticated<T extends (...args: any) => Promise<any>, User> = (user: User, ...args: Rest<Parameters<T>>) => ReturnType<T>

// these check that you have the specified role for a given org
type SSAuthenticatedWithOrg<T extends (...args: any) => Promise<any>, User> = (orgId: string, user: User, ...args: Rest<Parameters<T>>) => ReturnType<T>

// these check that you're either a dispatcher for the org or 
// a responder currently assigned to the request
type SSAuthenticatedWithRequest<T extends (...args: any) => Promise<any>, Req, User> = (orgId: string, user: User, helpRequest: Req, ...args: Rest<Parameters<T>>) => ReturnType<T>

type Rest<T extends any[]> = T extends [any, ...infer U] ? U : never;

export type ServerSide<Req, User> = {
    [ api in keyof IApiClient ]: Parameters<IApiClient[api]>[0] extends RequestContext
        ? SSAuthenticatedWithRequest<IApiClient[api], Req, User>
        : Parameters<IApiClient[api]>[0] extends OrgContext
            ? SSAuthenticatedWithOrg<IApiClient[api], User>
            : Parameters<IApiClient[api]>[0] extends TokenContext
                ? SSAuthenticated<IApiClient[api], User>
                : IApiClient[api]
}


// need these to handle mapping from client side to serverside types ie. the Map class on the server and 
// an object on the client
type MapJson<T = Map<string | number, any>> = T extends Map<any, infer V> ? { [key: string]: V } : never;

export type ClientSideFormat<T> = {
    [key in keyof T]: T[key] extends Map<any, any> 
        ? MapJson<T[key]>
        : T[key]
}
 
type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

type ClientSide<T extends (...args: any) => Promise<any>> = (...args: Parameters<T>) => Promise<ClientSideFormat<UnwrapPromise<ReturnType<T>>>>

export type ClientSideApi<ToChange extends keyof IApiClient> = {
    [ api in keyof IApiClient ]: api extends ToChange
        ? ClientSide<IApiClient[api]>
        : IApiClient[api]
}

export interface IApiClient {
    // no auth
    signUp: (minUser: MinUser) => Promise<AuthTokens>
    signIn: (credentials: BasicCredentials) => Promise<AuthTokens>
    refreshAuth: (refreshToken: string) => Promise<string>
    signUpThroughOrg: (orgId: string, pendingId: string, user: MinUser) => Promise<AuthTokens>
    sendResetCode: (email: string, baseUrl: string) => Promise<void>
    signInWithCode: (code: string) => Promise<AuthTokens>
    getDynamicConfig: () => Promise<DynamicConfig>

    // must be signed in
    signOut: Authenticated<() => Promise<void>>
    me: Authenticated<() => Promise<Me>>
    reportLocation: Authenticated<(locations: Location[]) => Promise<void>>
    reportPushToken: Authenticated<(token: string) => Promise<void>>
    createOrg: Authenticated<(org: MinOrg) => Promise<{ user: Me, org: Organization }>>
    getSecrets: Authenticated<() => Promise<AppSecrets>>
    deleteMyAccount: Authenticated<() => Promise<void>>

    updatePassword: Authenticated<(password: string, resetCode?: string) => Promise<void>>

    // must be signed in and have the correct roles within the target org
    getOrgMetadata: AuthenticatedWithOrg<() => Promise<OrganizationMetadata>>
    editOrgMetadata: AuthenticatedWithOrg<(orgUpdates: Partial<Pick<OrganizationMetadata, 'name' | 'requestPrefix'>>) => Promise<OrganizationMetadata>>
    editRole: AuthenticatedWithOrg<(roleUpdates: AtLeast<Role, 'id'>) => Promise<Role>>
    createNewRole: AuthenticatedWithOrg<(role: MinRole) => Promise<Role>>
    deleteRoles: AuthenticatedWithOrg<(roleIds: string[]) => Promise<{ updatedUserIds: string[], updatedRequestIds: string[] }>>
    addRolesToUser: AuthenticatedWithOrg<(userId: string, roles: string[]) => Promise<ProtectedUser>>
    
    updateAttributes: AuthenticatedWithOrg<(updates: CategorizedItemUpdates) => Promise<OrganizationMetadata>>
    updateTags: AuthenticatedWithOrg<(updates: CategorizedItemUpdates) => Promise<OrganizationMetadata>>
    

    broadcastRequest: AuthenticatedWithOrg<(requestId: string, to: string[]) => Promise<void>>
    addUserToOrg: AuthenticatedWithOrg<(userId: string, roles: UserRole[], roleIds: string[], attributes: CategorizedItem[]) => Promise<{ user: ProtectedUser, org: Organization }>>
    removeUserFromOrg: AuthenticatedWithOrg<(userId: string) => Promise<{ user: ProtectedUser, org: Organization }>>
    addUserRoles: AuthenticatedWithOrg<(userId: string, roles: UserRole[]) => Promise<ProtectedUser>>

    inviteUserToOrg: AuthenticatedWithOrg<(email: string, phone: string, roleIds: string[], attributes: CategorizedItem[], baseUrl: string) => Promise<PendingUser>>

    setOnDutyStatus: AuthenticatedWithOrg<(onDuty: boolean) => Promise<Me>>;
    createNewRequest: AuthenticatedWithOrg<(request: MinHelpRequest) => Promise<HelpRequest>>
    getRequests: AuthenticatedWithOrg<(requestIds?: string[]) => Promise<HelpRequest[]>>
    getRequest: AuthenticatedWithOrg<(requestId: string) => Promise<HelpRequest>>
    getTeamMembers: AuthenticatedWithOrg<(userIds?: string[]) => Promise<TeamMemberMetadata>>
    
    editMe: AuthenticatedWithOrg<(me: Partial<Me>, protectedUser?: Partial<AdminEditableUser>) => Promise<Me>>
    editUser: AuthenticatedWithOrg<(userId: string, user: Partial<AdminEditableUser>) => Promise<ProtectedUser>>
    
    notifyRespondersAboutRequest: AuthenticatedWithOrg<(requestId: string, to: string[]) => Promise<HelpRequest>>
    ackRequestNotification: AuthenticatedWithOrg<(requestId: string) => Promise<HelpRequest>>
    joinRequest: AuthenticatedWithOrg<(requestId: string, positionId: string) => Promise<HelpRequest>>
    leaveRequest: AuthenticatedWithOrg<(requestId: string, positionId: string) => Promise<HelpRequest>>
    requestToJoinRequest: AuthenticatedWithOrg<(requestId: string, positionId: string) => Promise<HelpRequest>>
    ackRequestsToJoinNotification: AuthenticatedWithOrg<(requestId: string, joinRequests: { userId: string, positionId: string }[]) => Promise<HelpRequest>>
    confirmRequestToJoinRequest: AuthenticatedWithOrg<(requestId: string, userId: string, positionId: string) => Promise<HelpRequest>>
    declineRequestToJoinRequest: AuthenticatedWithOrg<(requestId: string, userId: string, positionId: string) => Promise<HelpRequest>>
    removeUserFromRequest: AuthenticatedWithOrg<(userId: string, requestId: string, positionId: string) => Promise<HelpRequest>>
    
    editRequest: AuthenticatedWithRequest<(requestUpdates: AtLeast<HelpRequest, 'id'>) => Promise<HelpRequest>>
    editRequestV2: AuthenticatedWithRequest<(requestUpdates: RequestUpdates) => Promise<HelpRequest>>
    sendChatMessage: AuthenticatedWithRequest<(message: string) => Promise<HelpRequest>>
    updateRequestChatReceipt: AuthenticatedWithRequest<(lastMessageId: number) => Promise<HelpRequest>>
    setRequestStatus: AuthenticatedWithRequest<(status: ResponderRequestStatuses) => Promise<HelpRequest>>
    resetRequestStatus: AuthenticatedWithRequest<() => Promise<HelpRequest>>
    closeRequest: AuthenticatedWithRequest<() => Promise<HelpRequest>>
    reopenRequest: AuthenticatedWithRequest<() => Promise<HelpRequest>>
    // getResources: () => string
}

type ApiRoutes = {
    [key in keyof IApiClient]: () => string
}

 class API {

    base = `/api`

    namespaces = {
        users: `/users`,
        dispatch: `/dispatch`,
        responder: '/responder',
        organization: '/organization',
        request: '/request'
    }

    orgIdHeader = 'X-Raheem-Org'
    requestIdHeader = 'X-Raheem-Request'

    server: ApiRoutes = {
        signUp: () => {
            return `/signup`
        },
        signIn: () => {
            return `/signin`
        },
        signOut: () => {
            return `/signout`
        },
        me: () => {
            return `/me`
        },
        editMe: () => {
            return `/editMe`
        },
        deleteMyAccount: () => {
            return '/deleteMyAccount'
        },
        broadcastRequest: () => {
            return '/broadcastRequest'
        },
        reportLocation: () => {
            return '/reportLocation'
        }, 
        reportPushToken: () => {
            return '/reportPushToken'
        },
        notifyRespondersAboutRequest: () => {
            return '/assignIncident'
        },
        ackRequestNotification: () => {
            return '/ackRequestNotification'
        },
        ackRequestsToJoinNotification: () => {
            return '/ackRequestsToJoinNotification'
        },
        confirmRequestToJoinRequest: () => {
            return '/confirmRequestToJoinRequest'
        },
        declineRequestToJoinRequest: () => {
            return '/declineRequestToJoinRequest'
        }, 
        createOrg: () => {
            return '/createOrg'
        },
        getOrgMetadata: () => {
            return '/getOrgMetadata'
        },
        editOrgMetadata: () => {
            return '/editOrgMetadata'
        },
        editRole: () => {
            return '/editRole'
        },
        createNewRole: () => {
            return '/createNewRole'
        },
        deleteRoles: () => {
            return '/deleteRoles'
        },
        addRolesToUser: () => {
            return '/addRolesToUser'
        },
        addUserToOrg: () => {
            return '/addUserToOrg'
        },
        removeUserFromOrg: () => {
            return '/removeUserFromOrg'
        },
        addUserRoles: () => {
            return '/addUserRole'
        },
        createNewRequest: () => {
            return '/createNewRequest'
        },
        getRequests: () => {
            return '/getRequests'
        },
        getRequest: () => {
            return '/getRequest'
        },
        editRequest: () => {
            return '/editRequest'
        },
        editRequestV2: () => {
            return '/editRequestV2'
        },
        getTeamMembers: () => {
            return '/getTeamMembers'
        },
        sendChatMessage: () => {
            return '/sendChatMessage'
        },
        setRequestStatus: () => {
            return '/setRequestStatus'
        },
        resetRequestStatus: () => {
            return '/resetRequestStatus'
        },
        reopenRequest: () => {
            return '/reopenRequest'
        },
        closeRequest: () => {
            return '/closeRequest'
        },
        setOnDutyStatus: () => {
            return '/setOnDutyStatus'
        }, 
        updateRequestChatReceipt: () => {
            return '/updateRequestChatReceipt'
        },
        refreshAuth: () => {
            return '/refreshAuth'
        },
        getSecrets: () => {
            return '/getSecrets'
        },
        joinRequest: () => {
            return '/joinRequest'
        },
        leaveRequest: () => {
            return '/leaveRequest'
        },
        requestToJoinRequest: () => {
            return '/requestToJoinRequest'
        },
        removeUserFromRequest: () => {
            return '/removeUserFromRequest'
        },
        inviteUserToOrg: () => {
            return '/inviteUserToOrg'
        },
        signUpThroughOrg: () => {
            return '/signUpThroughOrg'
        },
        editUser: () => {
            return '/editUser'
        },
        updateAttributes: () => {
            return '/updateAttributes'
        },
        updateTags: () => {
            return '/updateTags'
        },
        updatePassword: () => {
            return `/updatePassword`
        },
        sendResetCode: () => {
            return `/sendResetCode`
        },
        signInWithCode: () => {
            return `/signInWithCode`
        },
        getDynamicConfig: () => {
            return `/getDynamicConfig`
        },
    }

    client: ApiRoutes = {
        // users
        getDynamicConfig: () => {
            return `${this.base}${this.namespaces.users}${this.server.getDynamicConfig()}`
        },
        signUp: () => {
            return `${this.base}${this.namespaces.users}${this.server.signUp()}`
        },
        signUpThroughOrg: () => {
            return `${this.base}${this.namespaces.users}${this.server.signUpThroughOrg()}`
        },
        updatePassword: () => {
            return `${this.base}${this.namespaces.users}${this.server.updatePassword()}`
        },
        sendResetCode: () => {
            return `${this.base}${this.namespaces.users}${this.server.sendResetCode()}`
        },
        signInWithCode: () => {
            return `${this.base}${this.namespaces.users}${this.server.signInWithCode()}`
        },
        signIn: () => {
            return `${this.base}${this.namespaces.users}${this.server.signIn()}`
        },
        signOut: () => {
            return `${this.base}${this.namespaces.users}${this.server.signOut()}`
        },
        refreshAuth: () => {
            return `${this.base}${this.namespaces.users}${this.server.refreshAuth()}`
        },
        me: () => {
            return `${this.base}${this.namespaces.users}${this.server.me()}`
        },
        deleteMyAccount: () => {
            return `${this.base}${this.namespaces.users}${this.server.deleteMyAccount()}`
        },
        editMe: () => {
            return `${this.base}${this.namespaces.users}${this.server.editMe()}`
        },
        editUser: () => {
            return `${this.base}${this.namespaces.users}${this.server.editUser()}`
        },
        reportLocation: () => {
            return `${this.base}${this.namespaces.users}${this.server.reportLocation()}`
        },
        reportPushToken: () => {
            return `${this.base}${this.namespaces.users}${this.server.reportPushToken()}`
        },
        // putting this here because there isn't a great place for it and it doesn't deserve it's own 
        // controller *kanye shrug*
        getSecrets: () => {
            return `${this.base}${this.namespaces.users}${this.server.getSecrets()}`
        },

        // dispatch
        broadcastRequest: () => {
            return `${this.base}${this.namespaces.dispatch}${this.server.broadcastRequest()}`
        },
        notifyRespondersAboutRequest: () => {
            return `${this.base}${this.namespaces.dispatch}${this.server.notifyRespondersAboutRequest()}`
        },
        removeUserFromRequest: () => {
            return `${this.base}${this.namespaces.dispatch}${this.server.removeUserFromRequest()}`
        },
        confirmRequestToJoinRequest: () => {
            return `${this.base}${this.namespaces.dispatch}${this.server.confirmRequestToJoinRequest()}`
        },
        declineRequestToJoinRequest: () => {
            return `${this.base}${this.namespaces.dispatch}${this.server.declineRequestToJoinRequest()}`
        },
        ackRequestsToJoinNotification: () => {
            return `${this.base}${this.namespaces.dispatch}${this.server.ackRequestsToJoinNotification()}`
        },
        

        // respond
        setOnDutyStatus: () => {
            return `${this.base}${this.namespaces.responder}${this.server.setOnDutyStatus()}`
        },
        leaveRequest: () => {
            return `${this.base}${this.namespaces.responder}${this.server.leaveRequest()}`
        },
        joinRequest: () => {
            return `${this.base}${this.namespaces.responder}${this.server.joinRequest()}`
        },
        requestToJoinRequest: () => {
            return `${this.base}${this.namespaces.responder}${this.server.requestToJoinRequest()}`
        },
        ackRequestNotification: () => {
            return `${this.base}${this.namespaces.responder}${this.server.ackRequestNotification()}`
        },

        // organization
        createOrg: () => {
            return `${this.base}${this.namespaces.organization}${this.server.createOrg()}`
        },
        getOrgMetadata: () => {
            return `${this.base}${this.namespaces.organization}${this.server.getOrgMetadata()}`
        },
        editOrgMetadata: () => {
            return `${this.base}${this.namespaces.organization}${this.server.editOrgMetadata()}`
        },
        editRole: () => {
            return `${this.base}${this.namespaces.organization}${this.server.editRole()}`
        },
        createNewRole: () => {
            return `${this.base}${this.namespaces.organization}${this.server.createNewRole()}`
        },
        deleteRoles: () => {
            return `${this.base}${this.namespaces.organization}${this.server.deleteRoles()}`
        },
        addRolesToUser: () => {
            return `${this.base}${this.namespaces.organization}${this.server.addRolesToUser()}`
        },
        addUserToOrg: () => {
            return `${this.base}${this.namespaces.organization}${this.server.addUserToOrg()}`
        },
        removeUserFromOrg: () => {
            return `${this.base}${this.namespaces.organization}${this.server.removeUserFromOrg()}`
        },
        addUserRoles: () => {
            return `${this.base}${this.namespaces.organization}${this.server.addUserRoles()}`
        },
        getTeamMembers: () => {
            return `${this.base}${this.namespaces.organization}${this.server.getTeamMembers()}`
        },
        inviteUserToOrg: () => {
            return `${this.base}${this.namespaces.organization}${this.server.inviteUserToOrg()}`
        },

        updateAttributes: () => {
            return `${this.base}${this.namespaces.organization}${this.server.updateAttributes()}`
        },
        updateTags: () => {
            return `${this.base}${this.namespaces.organization}${this.server.updateTags()}`
        },

        // request
        createNewRequest: () => {
            return `${this.base}${this.namespaces.request}${this.server.createNewRequest()}`
        },
        getRequests: () => {
            return `${this.base}${this.namespaces.request}${this.server.getRequests()}`
        },
        getRequest: () => {
            return `${this.base}${this.namespaces.request}${this.server.getRequest()}`
        },
        editRequest: () => {
            return `${this.base}${this.namespaces.request}${this.server.editRequest()}`
        },
        editRequestV2: () => {
            return `${this.base}${this.namespaces.request}${this.server.editRequestV2()}`
        },
        sendChatMessage: () => {
            return `${this.base}${this.namespaces.request}${this.server.sendChatMessage()}`
        },
        setRequestStatus: () => {
            return `${this.base}${this.namespaces.request}${this.server.setRequestStatus()}`
        },
        resetRequestStatus: () => {
            return `${this.base}${this.namespaces.request}${this.server.resetRequestStatus()}`
        },
        reopenRequest: () => {
            return `${this.base}${this.namespaces.request}${this.server.reopenRequest()}`
        },
        closeRequest: () => {
            return `${this.base}${this.namespaces.request}${this.server.closeRequest()}`
        },
        updateRequestChatReceipt: () => {
            return `${this.base}${this.namespaces.request}${this.server.updateRequestChatReceipt()}`
        }
    }
}

export default new API();