"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenProject = void 0;
class OpenProject {
    constructor() {
        this.description = {
            displayName: 'OpenProject',
            name: 'openProject',
            icon: 'file:icon.svg',
            group: ['transform'],
            version: 1,
            description: 'Manage projects, work packages, and time tracking in OpenProject',
            defaults: {
                name: 'OpenProject',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'openProjectApi',
                    required: true,
                },
            ],
            properties: [
                // ─── RESOURCE ───────────────────────────────────────────────
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Project', value: 'project' },
                        { name: 'Work Package', value: 'workPackage' },
                    ],
                    default: 'project',
                },
                // ─── PROJECT OPERATIONS ──────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['project'] } },
                    options: [
                        { name: 'Create', value: 'create', action: 'Create a project' },
                        { name: 'Get', value: 'get', action: 'Get a project' },
                        { name: 'Get All', value: 'getAll', action: 'Get all projects' },
                        { name: 'Update', value: 'update', action: 'Update a project' },
                        { name: 'Delete', value: 'delete', action: 'Delete a project' },
                    ],
                    default: 'getAll',
                },
                // ─── WORK PACKAGE OPERATIONS ─────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['workPackage'] } },
                    options: [
                        { name: 'Create', value: 'create', action: 'Create a work package' },
                        { name: 'Get', value: 'get', action: 'Get a work package' },
                        { name: 'Get All', value: 'getAll', action: 'Get all work packages' },
                        { name: 'Get Filtered', value: 'getFiltered', action: 'Get filtered work packages' },
                        { name: 'Update', value: 'update', action: 'Update a work package' },
                        { name: 'Delete', value: 'delete', action: 'Delete a work package' },
                    ],
                    default: 'getAll',
                },
                // ─── TIME ENTRY OPERATIONS ───────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['timeEntry'] } },
                    options: [
                        { name: 'Create', value: 'create', action: 'Create a time entry' },
                        { name: 'Get', value: 'get', action: 'Get a time entry' },
                        { name: 'Get All', value: 'getAll', action: 'Get all time entries' },
                        { name: 'Update', value: 'update', action: 'Update a time entry' },
                        { name: 'Delete', value: 'delete', action: 'Delete a time entry' },
                    ],
                    default: 'getAll',
                },
                // ─── SHARED: ID FIELD ────────────────────────────────────────
                {
                    displayName: 'ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['get', 'update', 'delete'],
                        },
                    },
                    description: 'The ID of the resource',
                },
                // ─── PROJECT FIELDS ──────────────────────────────────────────
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['project'], operation: ['create'] },
                    },
                    description: 'Name of the project',
                },
                {
                    displayName: 'Identifier',
                    name: 'identifier',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['project'], operation: ['create'] },
                    },
                    description: 'Unique identifier/slug for the project (e.g. my-project)',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['project'], operation: ['create', 'update'] },
                    },
                    options: [
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            default: '',
                            typeOptions: { rows: 3 },
                        },
                        {
                            displayName: 'Public',
                            name: 'public',
                            type: 'boolean',
                            default: false,
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                { name: 'Active', value: 'active' },
                                { name: 'Off Track', value: 'off_track' },
                                { name: 'At Risk', value: 'at_risk' },
                                { name: 'On Track', value: 'on_track' },
                            ],
                            default: 'active',
                        },
                    ],
                },
                // ─── WORK PACKAGE FIELDS ─────────────────────────────────────
                {
                    displayName: 'Project',
                    name: 'projectId',
                    type: 'options',
                    typeOptions: { loadOptionsMethod: 'getProjects' },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['create', 'getAll'] },
                    },
                    description: 'The project this work package belongs to',
                },
                // ─── GET FILTERED FIELDS ─────────────────────────────────────
                {
                    displayName: 'Project',
                    name: 'projectId',
                    type: 'options',
                    typeOptions: { loadOptionsMethod: 'getProjects' },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                    description: 'The project to fetch work packages from',
                },
                {
                    displayName: 'Assignee Input Method',
                    name: 'assigneeInputMethod',
                    type: 'options',
                    options: [
                        { name: 'None', value: 'none' },
                        { name: 'Enter ID Manually', value: 'manual' },
                        { name: 'Select from Project Members', value: 'select' },
                    ],
                    default: 'none',
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                },
                {
                    displayName: 'Assignee ID',
                    name: 'assigneeId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['workPackage'],
                            operation: ['getFiltered'],
                            assigneeInputMethod: ['manual'],
                        },
                    },
                    description: 'User ID of the assignee to filter by',
                },
                {
                    displayName: 'Assignee',
                    name: 'assigneeSelected',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getProjectMembers',
                        loadOptionsDependsOn: ['projectId'],
                    },
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['workPackage'],
                            operation: ['getFiltered'],
                            assigneeInputMethod: ['select'],
                        },
                    },
                    description: 'Select the assignee from the project members',
                },
                {
                    displayName: 'Priority',
                    name: 'priorityId',
                    type: 'options',
                    options: [
                        { name: '(Any)', value: '' },
                        { name: 'Low', value: '1' },
                        { name: 'Normal', value: '8' },
                        { name: 'High', value: '9' },
                        { name: 'Immediate', value: '10' },
                    ],
                    default: '',
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                },
                {
                    displayName: 'Status',
                    name: 'statusFilter',
                    type: 'options',
                    options: [
                        { name: '(Any)', value: '' },
                        { name: 'Open', value: 'o' },
                        { name: 'Closed', value: 'c' },
                        { name: 'Specific ID (manual input)', value: 'manual' },
                    ],
                    default: '',
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                },
                {
                    displayName: 'Status ID',
                    name: 'statusId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['workPackage'],
                            operation: ['getFiltered'],
                            statusFilter: ['manual'],
                        },
                    },
                    description: 'Specific status ID to filter by',
                },
                {
                    displayName: 'Due Date Filter',
                    name: 'dueDateFilter',
                    type: 'options',
                    options: [
                        { name: 'None', value: 'none' },
                        { name: 'Overdue', value: '<t+0' },
                        { name: 'Due This Week', value: 'w' },
                        { name: 'Due in 7 Days', value: '<t+7' },
                    ],
                    default: 'none',
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['create'] },
                    },
                    description: 'Title/subject of the work package',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['create', 'update'] },
                    },
                    options: [
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            default: '',
                            typeOptions: { rows: 3 },
                        },
                        {
                            displayName: 'Assignee ID',
                            name: 'assigneeId',
                            type: 'string',
                            default: '',
                            description: 'User ID to assign the work package to',
                        },
                        {
                            displayName: 'Due Date',
                            name: 'dueDate',
                            type: 'dateTime',
                            default: '',
                        },
                        {
                            displayName: 'Start Date',
                            name: 'startDate',
                            type: 'dateTime',
                            default: '',
                        },
                        {
                            displayName: 'Estimated Hours',
                            name: 'estimatedHours',
                            type: 'number',
                            default: 0,
                        },
                        {
                            displayName: 'Priority',
                            name: 'priority',
                            type: 'options',
                            options: [
                                { name: 'Low', value: 'low' },
                                { name: 'Normal', value: 'normal' },
                                { name: 'High', value: 'high' },
                                { name: 'Immediate', value: 'immediate' },
                            ],
                            default: 'normal',
                        },
                    ],
                },
                // ─── TIME ENTRY FIELDS ───────────────────────────────────────
                {
                    displayName: 'Work Package ID',
                    name: 'workPackageId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['timeEntry'], operation: ['create'] },
                    },
                    description: 'The ID of the work package to log time against',
                },
                {
                    displayName: 'Hours',
                    name: 'hours',
                    type: 'number',
                    default: 1,
                    required: true,
                    displayOptions: {
                        show: { resource: ['timeEntry'], operation: ['create', 'update'] },
                    },
                    description: 'Number of hours to log',
                },
                {
                    displayName: 'Spent On (Date)',
                    name: 'spentOn',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['timeEntry'], operation: ['create', 'update'] },
                    },
                    description: 'The date the time was spent',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['timeEntry'], operation: ['create', 'update'] },
                    },
                    options: [
                        {
                            displayName: 'Comment',
                            name: 'comment',
                            type: 'string',
                            default: '',
                            typeOptions: { rows: 2 },
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getProjects() {
                    var _a, _b;
                    const credentials = await this.getCredentials('openProjectApi');
                    const baseUrl = `${credentials.baseUrl}/api/v3`;
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/projects`, json: true });
                    const projects = ((_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : []);
                    return projects.map((project) => ({
                        name: project.name,
                        value: String(project.id),
                    }));
                },
                async getProjectMembers() {
                    var _a, _b;
                    const credentials = await this.getCredentials('openProjectApi');
                    const baseUrl = `${credentials.baseUrl}/api/v3`;
                    const projectId = this.getCurrentNodeParameter('projectId');
                    if (!projectId)
                        return [];
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/projects/${projectId}/memberships`, json: true });
                    const memberships = ((_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : []);
                    return memberships.map((membership) => {
                        var _a, _b, _c, _d;
                        const principal = (_a = membership._links) === null || _a === void 0 ? void 0 : _a.principal;
                        const href = (_b = principal === null || principal === void 0 ? void 0 : principal.href) !== null && _b !== void 0 ? _b : '';
                        const userId = (_c = href.split('/').pop()) !== null && _c !== void 0 ? _c : '';
                        return {
                            name: (_d = principal === null || principal === void 0 ? void 0 : principal.title) !== null && _d !== void 0 ? _d : userId,
                            value: userId,
                        };
                    });
                },
            },
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('openProjectApi');
        const baseUrl = `${credentials.baseUrl}/api/v3`;
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            // ─── PROJECTS ───────────────────────────────────────────────
            if (resource === 'project') {
                if (operation === 'getAll') {
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/projects`, json: true });
                    console.log('[n8n-nodes-open-project] GET /api/v3/projects response:', JSON.stringify(response, null, 2));
                    const projects = (_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : [];
                    returnData.push(...projects);
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/projects/${id}`, json: true });
                    returnData.push(response);
                }
                else if (operation === 'create') {
                    const name = this.getNodeParameter('name', i);
                    const identifier = this.getNodeParameter('identifier', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const body = { name, identifier, ...additionalFields };
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'POST', url: `${baseUrl}/projects`, body, json: true });
                    returnData.push(response);
                }
                else if (operation === 'update') {
                    const id = this.getNodeParameter('id', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'PATCH', url: `${baseUrl}/projects/${id}`, body: additionalFields, json: true });
                    returnData.push(response);
                }
                else if (operation === 'delete') {
                    const id = this.getNodeParameter('id', i);
                    await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'DELETE', url: `${baseUrl}/projects/${id}`, json: true });
                    returnData.push({ success: true, id });
                }
            }
            // ─── WORK PACKAGES ──────────────────────────────────────────
            else if (resource === 'workPackage') {
                if (operation === 'getAll') {
                    const projectId = this.getNodeParameter('projectId', i);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/projects/${projectId}/work_packages`, json: true });
                    const workPackages = (_d = (_c = response._embedded) === null || _c === void 0 ? void 0 : _c.elements) !== null && _d !== void 0 ? _d : [];
                    returnData.push(...workPackages);
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i);
                    // Fetch both simultaneously
                    const [response, activitiesResponse] = await Promise.all([
                        this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/work_packages/${id}`, json: true }),
                        this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/work_packages/${id}/activities`, json: true }),
                    ]);
                    // Get last activity
                    const activities = (_f = (_e = activitiesResponse._embedded) === null || _e === void 0 ? void 0 : _e.elements) !== null && _f !== void 0 ? _f : [];
                    const lastActivity = activities[activities.length - 1];
                    const result = {
                        // Core
                        id: response.id,
                        subject: response.subject,
                        percentageDone: response.percentageDone,
                        startDate: response.startDate,
                        dueDate: response.dueDate,
                        estimatedTime: response.estimatedTime,
                        spentTime: response.spentTime,
                        createdAt: response.createdAt,
                        updatedAt: response.updatedAt,
                        // Flattened from _links
                        statusName: (_h = (_g = response._links) === null || _g === void 0 ? void 0 : _g.status) === null || _h === void 0 ? void 0 : _h.title,
                        typeName: (_k = (_j = response._links) === null || _j === void 0 ? void 0 : _j.type) === null || _k === void 0 ? void 0 : _k.title,
                        priorityName: (_m = (_l = response._links) === null || _l === void 0 ? void 0 : _l.priority) === null || _m === void 0 ? void 0 : _m.title,
                        projectName: (_p = (_o = response._links) === null || _o === void 0 ? void 0 : _o.project) === null || _p === void 0 ? void 0 : _p.title,
                        categoryName: (_r = (_q = response._links) === null || _q === void 0 ? void 0 : _q.category) === null || _r === void 0 ? void 0 : _r.title,
                        versionName: (_t = (_s = response._links) === null || _s === void 0 ? void 0 : _s.version) === null || _t === void 0 ? void 0 : _t.title,
                        assigneeName: (_v = (_u = response._links) === null || _u === void 0 ? void 0 : _u.assignee) === null || _v === void 0 ? void 0 : _v.title,
                        responsibleName: (_x = (_w = response._links) === null || _w === void 0 ? void 0 : _w.responsible) === null || _x === void 0 ? void 0 : _x.title,
                        authorName: (_z = (_y = response._links) === null || _y === void 0 ? void 0 : _y.author) === null || _z === void 0 ? void 0 : _z.title,
                        // IDs for further API calls
                        statusId: (_1 = (_0 = response._embedded) === null || _0 === void 0 ? void 0 : _0.status) === null || _1 === void 0 ? void 0 : _1.id,
                        assigneeId: (_3 = (_2 = response._embedded) === null || _2 === void 0 ? void 0 : _2.assignee) === null || _3 === void 0 ? void 0 : _3.id,
                        responsibleId: (_5 = (_4 = response._embedded) === null || _4 === void 0 ? void 0 : _4.responsible) === null || _5 === void 0 ? void 0 : _5.id,
                        projectId: (_7 = (_6 = response._embedded) === null || _6 === void 0 ? void 0 : _6.project) === null || _7 === void 0 ? void 0 : _7.id,
                        isClosed: (_9 = (_8 = response._embedded) === null || _8 === void 0 ? void 0 : _8.status) === null || _9 === void 0 ? void 0 : _9.isClosed,
                        // Last activity
                        lastActivityAt: (_10 = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.createdAt) !== null && _10 !== void 0 ? _10 : null,
                        lastActivityBy: (_16 = (_13 = (_12 = (_11 = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.links) === null || _11 === void 0 ? void 0 : _11.user) === null || _12 === void 0 ? void 0 : _12.title) !== null && _13 !== void 0 ? _13 : (_15 = (_14 = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity._links) === null || _14 === void 0 ? void 0 : _14.user) === null || _15 === void 0 ? void 0 : _15.title) !== null && _16 !== void 0 ? _16 : null,
                        lastActivityComment: (_18 = (_17 = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.comment) === null || _17 === void 0 ? void 0 : _17.raw) !== null && _18 !== void 0 ? _18 : null,
                    };
                    returnData.push(result);
                }
                else if (operation === 'create') {
                    const projectId = this.getNodeParameter('projectId', i);
                    const subject = this.getNodeParameter('subject', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const body = { subject };
                    if (additionalFields.description) {
                        body.description = { raw: additionalFields.description };
                    }
                    if (additionalFields.assigneeId) {
                        body._links = { assignee: { href: `/api/v3/users/${additionalFields.assigneeId}` } };
                    }
                    if (additionalFields.dueDate)
                        body.dueDate = additionalFields.dueDate;
                    if (additionalFields.startDate)
                        body.startDate = additionalFields.startDate;
                    if (additionalFields.estimatedHours)
                        body.estimatedTime = `PT${additionalFields.estimatedHours}H`;
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'POST', url: `${baseUrl}/projects/${projectId}/work_packages`, body, json: true });
                    returnData.push(response);
                }
                else if (operation === 'update') {
                    const id = this.getNodeParameter('id', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'PATCH', url: `${baseUrl}/work_packages/${id}`, body: additionalFields, json: true });
                    returnData.push(response);
                }
                else if (operation === 'delete') {
                    const id = this.getNodeParameter('id', i);
                    await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'DELETE', url: `${baseUrl}/work_packages/${id}`, json: true });
                    returnData.push({ success: true, id });
                }
                else if (operation === 'getFiltered') {
                    const projectId = this.getNodeParameter('projectId', i);
                    const assigneeInputMethod = this.getNodeParameter('assigneeInputMethod', i);
                    const priorityId = this.getNodeParameter('priorityId', i);
                    const statusFilter = this.getNodeParameter('statusFilter', i);
                    const dueDateFilter = this.getNodeParameter('dueDateFilter', i);
                    const filters = [];
                    if (assigneeInputMethod === 'manual') {
                        const assigneeId = this.getNodeParameter('assigneeId', i);
                        if (assigneeId) {
                            filters.push({ assignee: { operator: '=', values: [assigneeId] } });
                        }
                    }
                    else if (assigneeInputMethod === 'select') {
                        const assigneeSelected = this.getNodeParameter('assigneeSelected', i);
                        if (assigneeSelected) {
                            filters.push({ assignee: { operator: '=', values: [assigneeSelected] } });
                        }
                    }
                    if (priorityId) {
                        filters.push({ priority: { operator: '=', values: [priorityId] } });
                    }
                    if (statusFilter === 'o') {
                        filters.push({ status: { operator: 'o', values: [] } });
                    }
                    else if (statusFilter === 'c') {
                        filters.push({ status: { operator: 'c', values: [] } });
                    }
                    else if (statusFilter === 'manual') {
                        const statusId = this.getNodeParameter('statusId', i);
                        if (statusId) {
                            filters.push({ status: { operator: '=', values: [statusId] } });
                        }
                    }
                    if (dueDateFilter && dueDateFilter !== 'none') {
                        filters.push({ dueDate: { operator: dueDateFilter, values: [] } });
                    }
                    let url = `${baseUrl}/projects/${projectId}/work_packages`;
                    if (filters.length > 0) {
                        url += `?filters=${encodeURIComponent(JSON.stringify(filters))}`;
                    }
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url, json: true });
                    const elements = ((_20 = (_19 = response._embedded) === null || _19 === void 0 ? void 0 : _19.elements) !== null && _20 !== void 0 ? _20 : []);
                    const flattened = elements.map((wp) => {
                        var _a, _b, _c, _d, _e;
                        return ({
                            id: wp.id,
                            subject: wp.subject,
                            percentageDone: wp.percentageDone,
                            startDate: wp.startDate,
                            dueDate: wp.dueDate,
                            createdAt: wp.createdAt,
                            updatedAt: wp.updatedAt,
                            statusName: ((_a = wp._links) === null || _a === void 0 ? void 0 : _a.status) ? wp._links.status.title : undefined,
                            priorityName: ((_b = wp._links) === null || _b === void 0 ? void 0 : _b.priority) ? wp._links.priority.title : undefined,
                            assigneeName: ((_c = wp._links) === null || _c === void 0 ? void 0 : _c.assignee) ? wp._links.assignee.title : undefined,
                            projectName: ((_d = wp._links) === null || _d === void 0 ? void 0 : _d.project) ? wp._links.project.title : undefined,
                            typeName: ((_e = wp._links) === null || _e === void 0 ? void 0 : _e.type) ? wp._links.type.title : undefined,
                        });
                    });
                    returnData.push(...flattened);
                }
            }
            // ─── TIME ENTRIES ────────────────────────────────────────────
            else if (resource === 'timeEntry') {
                if (operation === 'getAll') {
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/time_entries`, json: true });
                    const entries = (_22 = (_21 = response._embedded) === null || _21 === void 0 ? void 0 : _21.elements) !== null && _22 !== void 0 ? _22 : [];
                    returnData.push(...entries);
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/time_entries/${id}`, json: true });
                    returnData.push(response);
                }
                else if (operation === 'create') {
                    const workPackageId = this.getNodeParameter('workPackageId', i);
                    const hours = this.getNodeParameter('hours', i);
                    const spentOn = this.getNodeParameter('spentOn', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const body = {
                        hours: `PT${hours}H`,
                        spentOn,
                        _links: {
                            workPackage: { href: `/api/v3/work_packages/${workPackageId}` },
                        },
                    };
                    if (additionalFields.comment) {
                        body.comment = { raw: additionalFields.comment };
                    }
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'POST', url: `${baseUrl}/time_entries`, body, json: true });
                    returnData.push(response);
                }
                else if (operation === 'update') {
                    const id = this.getNodeParameter('id', i);
                    const hours = this.getNodeParameter('hours', i);
                    const spentOn = this.getNodeParameter('spentOn', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const body = {
                        hours: `PT${hours}H`,
                        spentOn,
                    };
                    if (additionalFields.comment) {
                        body.comment = { raw: additionalFields.comment };
                    }
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'PATCH', url: `${baseUrl}/time_entries/${id}`, body, json: true });
                    returnData.push(response);
                }
                else if (operation === 'delete') {
                    const id = this.getNodeParameter('id', i);
                    await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'DELETE', url: `${baseUrl}/time_entries/${id}`, json: true });
                    returnData.push({ success: true, id });
                }
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.OpenProject = OpenProject;
//# sourceMappingURL=OpenProject.node.js.map