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
                        // { name: 'Project', value: 'project' },
                        { name: 'Work Package', value: 'workPackage' },
                        // { name: 'Time Entry', value: 'timeEntry' },
                    ],
                    default: 'project',
                },
                // ─── PROJECT OPERATIONS ──────────────────────────────────────
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
                // ─── WORK PACKAGE FIELDS ─────────────────────────────────────
                {
                    displayName: 'Project',
                    name: 'projectId',
                    type: 'resourceLocator',
                    default: { mode: 'list', value: '' },
                    required: true,
                    displayOptions: {
                        show: { resource: ['workPackage'], operation: ['getFiltered'] },
                    },
                    description: 'The project to get work packages from',
                    modes: [
                        {
                            displayName: 'From List',
                            name: 'list',
                            type: 'list',
                            placeholder: 'Search projects…',
                            typeOptions: {
                                searchListMethod: 'searchProjects',
                                searchable: true,
                                searchFilterRequired: false,
                            },
                        },
                        {
                            displayName: 'By ID',
                            name: 'id',
                            type: 'string',
                            placeholder: 'e.g. 42',
                            validation: [
                                {
                                    type: 'regex',
                                    properties: {
                                        regex: '^[0-9]+$',
                                        errorMessage: 'Enter a numeric project ID',
                                    },
                                },
                            ],
                        },
                    ],
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
                                { name: 'Bugs Treatment', value: '45' },
                                { name: 'In Progress', value: '47' },
                                { name: 'Closed', value: '56' },
                                { name: 'Rejected', value: '15' },
                                { name: 'Open', value: '60' },
                                { name: 'Product Confirmation', value: '65' },
                                { name: 'Resolved on LIVE', value: '67' },
                                { name: 'To Do', value: '1' },
                            ],
                            default: '',
                        },
                        {
                            displayName: 'Assignee',
                            name: 'assignee',
                            type: 'resourceLocator',
                            default: { mode: 'list', value: '' },
                            required: false,
                            description: 'The assignee to filter work packages by',
                            modes: [
                                {
                                    displayName: 'From List',
                                    name: 'list',
                                    type: 'list',
                                    placeholder: 'Search project members…',
                                    typeOptions: {
                                        searchListMethod: 'searchUsers',
                                        searchable: true,
                                        searchFilterRequired: true,
                                    },
                                },
                                {
                                    displayName: 'By ID',
                                    name: 'id',
                                    type: 'string',
                                    placeholder: 'e.g. 5',
                                    validation: [
                                        {
                                            type: 'regex',
                                            properties: {
                                                regex: '^[0-9]+$',
                                                errorMessage: 'Enter a numeric user ID',
                                            },
                                        },
                                    ],
                                },
                            ],
                        }
                    ],
                },
            ],
        };
        this.methods = {
            listSearch: {
                async searchProjects(query) {
                    var _a, _b;
                    const credentials = await this.getCredentials('openProjectApi');
                    const baseUrl = `${credentials.baseUrl}/api/v3`;
                    const qs = { pageSize: 50 };
                    const q = query === null || query === void 0 ? void 0 : query.trim();
                    if (q) {
                        qs.filters = JSON.stringify([
                            { name: { operator: '~', values: [q] } },
                        ]);
                    }
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/projects`, json: true, qs });
                    const elements = (_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : [];
                    return {
                        results: elements.map((project) => ({
                            name: project.name,
                            value: String(project.id),
                        })),
                    };
                },
                async searchUsers(query) {
                    var _a, _b, _c, _d;
                    const projectId = this.getNodeParameter('projectId', '', {
                        extractValue: true,
                    });
                    const q = query === null || query === void 0 ? void 0 : query.trim();
                    if (!(projectId === null || projectId === void 0 ? void 0 : projectId.trim()) || !q) {
                        // UI will require a query (searchFilterRequired: true),
                        // but keep this defensive to avoid bad requests.
                        return { results: [] };
                    }
                    const credentials = await this.getCredentials('openProjectApi');
                    const baseUrl = `${credentials.baseUrl}/api/v3`;
                    // OpenProject can't filter /users by project directly.
                    // We list memberships in the selected project, optionally narrowed by principal name.
                    const filters = [
                        { project: { operator: '=', values: [String(projectId)] } },
                        { any_name_attribute: { operator: '~', values: [q] } },
                    ];
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', {
                        method: 'GET',
                        url: `${baseUrl}/memberships`,
                        json: true,
                        qs: { filters: JSON.stringify(filters), pageSize: 200 },
                    });
                    const elements = (_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : [];
                    const seen = new Set();
                    const results = [];
                    for (const membership of elements) {
                        const links = membership._links;
                        const principal = links === null || links === void 0 ? void 0 : links.principal;
                        const href = (_c = principal === null || principal === void 0 ? void 0 : principal.href) !== null && _c !== void 0 ? _c : '';
                        const title = (_d = principal === null || principal === void 0 ? void 0 : principal.title) !== null && _d !== void 0 ? _d : '';
                        const userMatch = href.match(/\/users\/(\d+)\/?$/);
                        if (!userMatch || !title)
                            continue;
                        const id = userMatch[1];
                        if (seen.has(id))
                            continue;
                        seen.add(id);
                        results.push({ name: title, value: id });
                    }
                    results.sort((a, b) => a.name.localeCompare(b.name));
                    return { results };
                },
            },
        };
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('openProjectApi');
        const baseUrl = `${credentials.baseUrl}/api/v3`;
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            // ─── PROJECTS ───────────────────────────────────────────────
            if (resource === 'project') {
            }
            // ─── WORK PACKAGES ──────────────────────────────────────────
            else if (resource === 'workPackage') {
                if (operation === 'getFiltered') {
                    const projectId = this.getNodeParameter('projectId', i, '', {
                        extractValue: true,
                    });
                    const filterParams = this.getNodeParameter('filters', i, {});
                    // const opts = this.getNodeParameter('additionalOptions', i, {}) as Record<string, any>;
                    // Build the filters array for OpenProject API
                    const filters = [];
                    // Multi-value filters (operator "=")
                    const statusValues = filterParams.status_id;
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
                    const qs = {};
                    if (filters.length)
                        qs.filters = JSON.stringify(filters);
                    // if (opts.pageSize)  qs.pageSize = opts.pageSize;
                    // if (opts.offset)    qs.offset   = opts.offset;
                    // if (opts.sortBy)    qs.sortBy   = JSON.stringify([[opts.sortBy, opts.sortDir ?? 'desc']]);
                    // Choose endpoint: project-scoped or global
                    const endpoint = projectId
                        ? `/projects/${projectId}/work_packages`
                        : '/work_packages';
                    // console.log("values", qs.filters[0].status.values);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/${endpoint}`, json: true, qs });
                    const workPackages = (_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : [];
                    returnData.push(...workPackages.map((wp) => ({ json: wp })));
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i);
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: `${baseUrl}/work_packages/${id}`, json: true });
                    returnData.push(response);
                }
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.OpenProject = OpenProject;
//# sourceMappingURL=OpenProject.node.js.map