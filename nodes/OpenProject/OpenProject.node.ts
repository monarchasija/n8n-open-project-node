import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    INodePropertyOptions,
} from 'n8n-workflow';

export class OpenProject implements INodeType {
    description: INodeTypeDescription = {
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
                    // { name: 'Project', value: 'project' },
                    { name: 'Work Package', value: 'workPackage' },
                    // { name: 'Time Entry', value: 'timeEntry' },
                ],
                default: 'project',
            },

            // ─── PROJECT OPERATIONS ──────────────────────────────────────
            // {
            //     displayName: 'Operation',
            //     name: 'operation',
            //     type: 'options',
            //     noDataExpression: true,
            //     displayOptions: { show: { resource: ['project'] } },
            //     options: [
            //         { name: 'Create', value: 'create', action: 'Create a project' },
            //         { name: 'Get', value: 'get', action: 'Get a project' },
            //         { name: 'Get All', value: 'getAll', action: 'Get all projects' },
            //         { name: 'Update', value: 'update', action: 'Update a project' },
            //         { name: 'Delete', value: 'delete', action: 'Delete a project' },
            //     ],
            //     default: 'getAll',
            // },

            // ─── WORK PACKAGE OPERATIONS ─────────────────────────────────
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['workPackage'] } },
                options: [
                    // { name: 'Create', value: 'create', action: 'Create a work package' },
                    { name: 'Get', value: 'get', action: 'Get a work package' },
                    { name: 'Get Filtered', value: 'getFiltered', action: 'Get filtered work packages' },
                    // { name: 'Update', value: 'update', action: 'Update a work package' },
                    // { name: 'Delete', value: 'delete', action: 'Delete a work package' },
                ],
                default: 'get',
            },

            // ─── TIME ENTRY OPERATIONS ───────────────────────────────────
            // {
            //     displayName: 'Operation',
            //     name: 'operation',
            //     type: 'options',
            //     noDataExpression: true,
            //     displayOptions: { show: { resource: ['timeEntry'] } },
            //     options: [
            //         { name: 'Create', value: 'create', action: 'Create a time entry' },
            //         { name: 'Get', value: 'get', action: 'Get a time entry' },
            //         { name: 'Get All', value: 'getAll', action: 'Get all time entries' },
            //         { name: 'Update', value: 'update', action: 'Update a time entry' },
            //         { name: 'Delete', value: 'delete', action: 'Delete a time entry' },
            //     ],
            //     default: 'getAll',
            // },

            // ─── SHARED: ID FIELD ────────────────────────────────────────
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['get',
                            //  'update', 'delete'
                            ],
                    },
                },
                description: 'The ID of the resource',
            },

            // ─── PROJECT FIELDS ──────────────────────────────────────────
            // {
            //     displayName: 'Name',
            //     name: 'name',
            //     type: 'string',
            //     default: '',
            //     required: true,
            //     displayOptions: {
            //         show: { resource: ['project'], operation: ['create'] },
            //     },
            //     description: 'Name of the project',
            // },
            // {
            //     displayName: 'Identifier',
            //     name: 'identifier',
            //     type: 'string',
            //     default: '',
            //     required: true,
            //     displayOptions: {
            //         show: { resource: ['project'], operation: ['create'] },
            //     },
            //     description: 'Unique identifier/slug for the project (e.g. my-project)',
            // },
            // {
            //     displayName: 'Additional Fields',
            //     name: 'additionalFields',
            //     type: 'collection',
            //     placeholder: 'Add Field',
            //     default: {},
            //     displayOptions: {
            //         show: { resource: ['project'], operation: ['create', 'update'] },
            //     },
            //     options: [
            //         {
            //             displayName: 'Description',
            //             name: 'description',
            //             type: 'string',
            //             default: '',
            //             typeOptions: { rows: 3 },
            //         },
            //         {
            //             displayName: 'Public',
            //             name: 'public',
            //             type: 'boolean',
            //             default: false,
            //         },
            //         {
            //             displayName: 'Status',
            //             name: 'status',
            //             type: 'options',
            //             options: [
            //                 { name: 'Active', value: 'active' },
            //                 { name: 'Off Track', value: 'off_track' },
            //                 { name: 'At Risk', value: 'at_risk' },
            //                 { name: 'On Track', value: 'on_track' },
            //             ],
            //             default: 'active',
            //         },
            //     ],
            // },

            // ─── WORK PACKAGE FIELDS ─────────────────────────────────────
                {
                    displayName: 'Project ID',
                    name: 'projectId',
                    type: 'options',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                    description: 'The ID of the project to get work packages from',
                    typeOptions: {
                        loadOptionsMethod: 'getProjects',
                    },
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                    options: [
                        {
                            displayName: 'Status',
                            name: 'status_id',
                            type: 'options',
                            options: [
                                { name: 'Bugs Treatment',         value: '45' },
                                { name: 'In Progress', value: '47' },
                                { name: 'Closed',      value: '56' },
                                { name: 'Rejected',    value: '15' },
                                { name: 'Open',         value: '60' },
                                { name: 'Product Confirmation',         value: '65' },
                                { name: 'Resolved on LIVE',         value: '67' },
                                { name: 'To Do',         value: '1' },
                              ],
                            default: '',
                        },
                    ],
                },
                {
                    displayName: 'Assignee',
                    name: 'assignee',
                    type: 'options',
                    default: '',
                    required: false,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getUsers',
                        loadOptionsDependsOn: ['projectId'],
                    },
                    description: 'The ID of the assignee to get work packages from',
                }

            // ─── TIME ENTRY FIELDS ───────────────────────────────────────
            // {
            //     displayName: 'Work Package ID',
            //     name: 'workPackageId',
            //     type: 'string',
            //     default: '',
            //     required: true,
            //     displayOptions: {
            //         show: { resource: ['timeEntry'], operation: ['create'] },
            //     },
            //     description: 'The ID of the work package to log time against',
            // },
            // {
            //     displayName: 'Hours',
            //     name: 'hours',
            //     type: 'number',
            //     default: 1,
            //     required: true,
            //     displayOptions: {
            //         show: { resource: ['timeEntry'], operation: ['create', 'update'] },
            //     },
            //     description: 'Number of hours to log',
            // },
            // {
            //     displayName: 'Spent On (Date)',
            //     name: 'spentOn',
            //     type: 'dateTime',
            //     default: '',
            //     required: true,
            //     displayOptions: {
            //         show: { resource: ['timeEntry'], operation: ['create', 'update'] },
            //     },
            //     description: 'The date the time was spent',
            // },
            // {
            //     displayName: 'Additional Fields',
            //     name: 'additionalFields',
            //     type: 'collection',
            //     placeholder: 'Add Field',
            //     default: {},
            //     displayOptions: {
            //         show: { resource: ['timeEntry'], operation: ['create', 'update'] },
            //     },
            //     options: [
            //         {
            //             displayName: 'Comment',
            //             name: 'comment',
            //             type: 'string',
            //             default: '',
            //             typeOptions: { rows: 2 },
            //         },
            //     ],
            // },
        ],
    };

    async getProjects(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials('openProjectApi');
        const baseUrl = `${credentials.baseUrl}/api/v3`;
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this, 'openProjectApi',
            { method: 'GET', url: `${baseUrl}/projects`, json: true },
        );
        return response._embedded?.elements.map((project: any) => ({ name: project.name, value: project.id })) ?? [];
    }

    async getUsers(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials('openProjectApi');
        const baseUrl = `${credentials.baseUrl}/api/v3`;
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this, 'openProjectApi',
            { method: 'GET', url: `${baseUrl}/users`, json: true },
        );
        return response._embedded?.elements.map((user: any) => ({ name: user.name, value: user.id })) ?? [];
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const credentials = await this.getCredentials('openProjectApi');
        const baseUrl = `${credentials.baseUrl}/api/v3`;

        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i) as string;
            const operation = this.getNodeParameter('operation', i) as string;

            // ─── PROJECTS ───────────────────────────────────────────────
            if (resource === 'project') {
                if (operation === 'getAll') {
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/projects`, json: true },
                    );
                    const projects = response._embedded?.elements ?? [];
                    returnData.push(...projects);

                } else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i) as string;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/projects/${id}/activities`, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'create') {
                    const name = this.getNodeParameter('name', i) as string;
                    const identifier = this.getNodeParameter('identifier', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
                    const body: IDataObject = { name, identifier, ...additionalFields };
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'POST', url: `${baseUrl}/projects`, body, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'update') {
                    const id = this.getNodeParameter('id', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'PATCH', url: `${baseUrl}/projects/${id}`, body: additionalFields, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'delete') {
                    const id = this.getNodeParameter('id', i) as string;
                    await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'DELETE', url: `${baseUrl}/projects/${id}`, json: true },
                    );
                    returnData.push({ success: true, id });
                }
            }

            // ─── WORK PACKAGES ──────────────────────────────────────────
            else if (resource === 'workPackage') {
                if (operation === 'getFiltered') {
                    const projectId = this.getNodeParameter('projectId', i, '') as string;
                    const filterParams = this.getNodeParameter('filters', i, {}) as Record<string, any>;
                    console.log(filterParams);
                    // const opts = this.getNodeParameter('additionalOptions', i, {}) as Record<string, any>;
                  
                    // Build the filters array for OpenProject API
                    const filters: Array<Record<string, any>> = [];
                  
                    // Multi-value filters (operator "=")
                    const statusValues = filterParams.status_id as string[] | string | undefined;
                    if (statusValues && (Array.isArray(statusValues) ? statusValues.length > 0 : statusValues !== '')) {
                    const values = Array.isArray(statusValues) ? statusValues : [statusValues];
                    filters.push({ status: { operator: '=', values } });
                    }
                  
                    // Single-value ID filters
                    // const singleIdFilters = ['author_id', 'assigned_to_id', 'version_id', 'category_id'];
                    // for (const field of singleIdFilters) {
                    //   const val = filterParams[field] as string | undefined;
                    //   if (val) {
                    //     filters.push({ [field]: { operator: '=', values: [val] } });
                    //   }
                    // }
                  
                    // Subject contains
                    // if (filterParams.subject) {
                    //   filters.push({ subject: { operator: '**', values: [filterParams.subject] } });
                    // }
                  
                    // Date filters
                    // if (filterParams.created_at_after) {
                    //   filters.push({ created_at: { operator: '>d', values: [filterParams.created_at_after] } });
                    // }
                    // if (filterParams.created_at_before) {
                    //   filters.push({ created_at: { operator: '<d', values: [filterParams.created_at_before] } });
                    // }
                    // if (filterParams.updated_at_after) {
                    //   filters.push({ updated_at: { operator: '>d', values: [filterParams.updated_at_after] } });
                    // }
                    // if (filterParams.due_date_before) {
                    //   filters.push({ due_date: { operator: '<d', values: [filterParams.due_date_before] } });
                    // }
                  
                    // Build query string
                    const qs: Record<string, any> = {};
                    if (filters.length) qs.filters = JSON.stringify(filters);
                    // if (opts.pageSize)  qs.pageSize = opts.pageSize;
                    // if (opts.offset)    qs.offset   = opts.offset;
                    // if (opts.sortBy)    qs.sortBy   = JSON.stringify([[opts.sortBy, opts.sortDir ?? 'desc']]);
                  
                    // Choose endpoint: project-scoped or global
                    const endpoint = projectId
                      ? `/projects/${projectId}/work_packages`
                      : '/work_packages';
                    console.log("endpoint", endpoint);
                    console.log("qs", qs.filters);
                    // console.log("values", qs.filters[0].status.values);
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/${endpoint}`, json: true, qs },
                    );
                    console.log("response", response);
                    const workPackages = response._embedded?.elements ?? [];
                    returnData.push(...workPackages.map((wp: any) => ({ json: wp })));
                } else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i) as string;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/work_packages/${id}`, json: true },
                    );
                    
                    returnData.push(response);

                } else if (operation === 'create') {
                    const projectId = this.getNodeParameter('projectId', i) as string;
                    const subject = this.getNodeParameter('subject', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = { subject };

                    if (additionalFields.description) {
                        body.description = { raw: additionalFields.description };
                    }
                    if (additionalFields.assigneeId) {
                        body._links = { assignee: { href: `/api/v3/users/${additionalFields.assigneeId}` } };
                    }
                    if (additionalFields.dueDate) body.dueDate = additionalFields.dueDate;
                    if (additionalFields.startDate) body.startDate = additionalFields.startDate;
                    if (additionalFields.estimatedHours) body.estimatedTime = `PT${additionalFields.estimatedHours}H`;

                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'POST', url: `${baseUrl}/projects/${projectId}/work_packages`, body, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'update') {
                    const id = this.getNodeParameter('id', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'PATCH', url: `${baseUrl}/work_packages/${id}`, body: additionalFields, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'delete') {
                    const id = this.getNodeParameter('id', i) as string;
                    await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'DELETE', url: `${baseUrl}/work_packages/${id}`, json: true },
                    );
                    returnData.push({ success: true, id });
                }
            }

            // ─── TIME ENTRIES ────────────────────────────────────────────
            else if (resource === 'timeEntry') {
                if (operation === 'getAll') {
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/time_entries`, json: true },
                    );
                    const entries = response._embedded?.elements ?? [];
                    returnData.push(...entries);

                } else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i) as string;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/time_entries/${id}`, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'create') {
                    const workPackageId = this.getNodeParameter('workPackageId', i) as string;
                    const hours = this.getNodeParameter('hours', i) as number;
                    const spentOn = this.getNodeParameter('spentOn', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = {
                        hours: `PT${hours}H`,
                        spentOn,
                        _links: {
                            workPackage: { href: `/api/v3/work_packages/${workPackageId}` },
                        },
                    };

                    if (additionalFields.comment) {
                        body.comment = { raw: additionalFields.comment };
                    }

                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'POST', url: `${baseUrl}/time_entries`, body, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'update') {
                    const id = this.getNodeParameter('id', i) as string;
                    const hours = this.getNodeParameter('hours', i) as number;
                    const spentOn = this.getNodeParameter('spentOn', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = {
                        hours: `PT${hours}H`,
                        spentOn,
                    };
                    if (additionalFields.comment) {
                        body.comment = { raw: additionalFields.comment };
                    }

                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'PATCH', url: `${baseUrl}/time_entries/${id}`, body, json: true },
                    );
                    returnData.push(response);

                } else if (operation === 'delete') {
                    const id = this.getNodeParameter('id', i) as string;
                    await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'DELETE', url: `${baseUrl}/time_entries/${id}`, json: true },
                    );
                    returnData.push({ success: true, id });
                }
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}