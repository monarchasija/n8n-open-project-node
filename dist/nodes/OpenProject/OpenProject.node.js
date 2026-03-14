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
                        { name: 'Time Entry', value: 'timeEntry' },
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
                    displayName: 'Project ID',
                    name: 'projectId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['create', 'getAll'] },
                    },
                    description: 'The ID of the project this work package belongs to',
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
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f;
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
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/work_packages/${id}`, json: true });
                    returnData.push(response);
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
            }
            // ─── TIME ENTRIES ────────────────────────────────────────────
            else if (resource === 'timeEntry') {
                if (operation === 'getAll') {
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/time_entries`, json: true });
                    const entries = (_f = (_e = response._embedded) === null || _e === void 0 ? void 0 : _e.elements) !== null && _f !== void 0 ? _f : [];
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