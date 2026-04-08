import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    INodeExecutionData,
    INodePropertyOptions,
    INodeType,
    INodeTypeDescription,
    IDataObject,
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

    methods = {
        loadOptions: {
            async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('openProjectApi');
                const baseUrl = `${credentials.baseUrl}/api/v3`;
                const response = await this.helpers.httpRequestWithAuthentication.call(
                    this, 'openProjectApi',
                    { method: 'GET', url: `${baseUrl}/projects`, json: true },
                );
                const projects: IDataObject[] = (response._embedded?.elements ?? []) as IDataObject[];
                return projects.map((project: IDataObject): INodePropertyOptions => ({
                    name: project.name as string,
                    value: String(project.id),
                }));
            },

            async getProjectMembers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('openProjectApi');
                const baseUrl = `${credentials.baseUrl}/api/v3`;
                const projectId = this.getCurrentNodeParameter('projectId') as string;
                if (!projectId) return [];
                const response = await this.helpers.httpRequestWithAuthentication.call(
                    this, 'openProjectApi',
                    { method: 'GET', url: `${baseUrl}/projects/${projectId}/memberships`, json: true },
                );
                const memberships: IDataObject[] = (response._embedded?.elements ?? []) as IDataObject[];
                return memberships.map((membership: IDataObject): INodePropertyOptions => {
                    const principal = (membership._links as IDataObject)?.principal as IDataObject;
                    const href = principal?.href as string ?? '';
                    const userId = href.split('/').pop() ?? '';
                    return {
                        name: principal?.title as string ?? userId,
                        value: userId,
                    };
                });
            },
        },
    };

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
                    console.log(response);
                    const projects = response._embedded?.elements ?? [];
                    returnData.push(...projects);

                } else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i) as string;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/projects/${id}`, json: true },
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
                if (operation === 'getAll') {
                    const projectId = this.getNodeParameter('projectId', i) as string;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/projects/${projectId}/work_packages`, json: true },
                    );
                    const workPackages = response._embedded?.elements ?? [];
                    returnData.push(...workPackages);

                } else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i) as string;
                    // Fetch both simultaneously
                    const [response, activitiesResponse] = await Promise.all([
                        this.helpers.httpRequestWithAuthentication.call(
                            this, 'openProjectApi',
                            { method: 'GET', url: `${baseUrl}/work_packages/${id}`, json: true },
                        ),
                        this.helpers.httpRequestWithAuthentication.call(
                            this, 'openProjectApi',
                            { method: 'GET', url: `${baseUrl}/work_packages/${id}/activities`, json: true },
                        ),
                    ]);

                        // Get last activity
                    const activities = activitiesResponse._embedded?.elements ?? [];
                    const lastActivity = activities[activities.length - 1];

                
                    const result: IDataObject = {
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
                        statusName: response._links?.status?.title,
                        typeName: response._links?.type?.title,
                        priorityName: response._links?.priority?.title,
                        projectName: response._links?.project?.title,
                        categoryName: response._links?.category?.title,
                        versionName: response._links?.version?.title,
                        assigneeName: response._links?.assignee?.title,
                        responsibleName: response._links?.responsible?.title,
                        authorName: response._links?.author?.title,
                
                        // IDs for further API calls
                        statusId: response._embedded?.status?.id,
                        assigneeId: response._embedded?.assignee?.id,
                        responsibleId: response._embedded?.responsible?.id,
                        projectId: response._embedded?.project?.id,
                        isClosed: response._embedded?.status?.isClosed,

                         // Last activity
                        lastActivityAt: lastActivity?.createdAt ?? null,
                        lastActivityBy: lastActivity?.links?.user?.title ?? lastActivity?._links?.user?.title ?? null,
                        lastActivityComment: lastActivity?.comment?.raw ?? null,
                    };
                
                    returnData.push(result);
                
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

                } else if (operation === 'getFiltered') {
                    const projectId = this.getNodeParameter('projectId', i) as string;
                    const assigneeInputMethod = this.getNodeParameter('assigneeInputMethod', i) as string;
                    const priorityId = this.getNodeParameter('priorityId', i) as string;
                    const statusFilter = this.getNodeParameter('statusFilter', i) as string;
                    const dueDateFilter = this.getNodeParameter('dueDateFilter', i) as string;

                    const filters: IDataObject[] = [];

                    if (assigneeInputMethod === 'manual') {
                        const assigneeId = this.getNodeParameter('assigneeId', i) as string;
                        if (assigneeId) {
                            filters.push({ assignee: { operator: '=', values: [assigneeId] } });
                        }
                    } else if (assigneeInputMethod === 'select') {
                        const assigneeSelected = this.getNodeParameter('assigneeSelected', i) as string;
                        if (assigneeSelected) {
                            filters.push({ assignee: { operator: '=', values: [assigneeSelected] } });
                        }
                    }

                    if (priorityId) {
                        filters.push({ priority: { operator: '=', values: [priorityId] } });
                    }

                    if (statusFilter === 'o') {
                        filters.push({ status: { operator: 'o', values: [] } });
                    } else if (statusFilter === 'c') {
                        filters.push({ status: { operator: 'c', values: [] } });
                    } else if (statusFilter === 'manual') {
                        const statusId = this.getNodeParameter('statusId', i) as string;
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

                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url, json: true },
                    );

                    const elements: IDataObject[] = (response._embedded?.elements ?? []) as IDataObject[];
                    const flattened = elements.map((wp: IDataObject): IDataObject => ({
                        id: wp.id,
                        subject: wp.subject,
                        percentageDone: wp.percentageDone,
                        startDate: wp.startDate,
                        dueDate: wp.dueDate,
                        createdAt: wp.createdAt,
                        updatedAt: wp.updatedAt,
                        statusName: (wp._links as IDataObject)?.status ? ((wp._links as IDataObject).status as IDataObject).title : undefined,
                        priorityName: (wp._links as IDataObject)?.priority ? ((wp._links as IDataObject).priority as IDataObject).title : undefined,
                        assigneeName: (wp._links as IDataObject)?.assignee ? ((wp._links as IDataObject).assignee as IDataObject).title : undefined,
                        projectName: (wp._links as IDataObject)?.project ? ((wp._links as IDataObject).project as IDataObject).title : undefined,
                        typeName: (wp._links as IDataObject)?.type ? ((wp._links as IDataObject).type as IDataObject).title : undefined,
                    }));
                    returnData.push(...flattened);
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