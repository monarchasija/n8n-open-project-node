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
                    default: {},
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
                        {
                            displayName: 'Assignee',
                            name: 'assignee',
                            type: 'resourceLocator',
                            default: {},
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
                                        searchFilterRequired: false,
                                    },
                                },
                                
                            ],
                        }
                    ],
                },
                
        ],
    };

    methods = {
        listSearch: {
            async searchProjects(
                this: ILoadOptionsFunctions,
                query?: string,
            ): Promise<{ results: Array<{ name: string; value: string }> }> {
                const credentials = await this.getCredentials('openProjectApi');
                const baseUrl = `${credentials.baseUrl}/api/v3`;
                const qs: Record<string, string | number> = { pageSize: 50 };
                const q = query?.trim();
                if (q) {
                    qs.filters = JSON.stringify([
                        { name: { operator: '~', values: [q] } },
                    ]);
                }
                const response = await this.helpers.httpRequestWithAuthentication.call(
                    this,
                    'openProjectApi',
                    { method: 'GET', url: `${baseUrl}/projects`, json: true, qs },
                );
                const elements = response._embedded?.elements ?? [];
                return {
                    results: elements.map((project: { name: string; id: number }) => ({
                        name: project.name,
                        value: String(project.id),
                    })),
                };
            },

            async searchUsers(
                this: ILoadOptionsFunctions,
                query?: string,
            ): Promise<{ results: Array<{ name: string; value: string }> }> {
                const projectId = this.getNodeParameter('projectId', '', {
                    extractValue: true,
                }) as string;

                const q = query?.trim();
                if (!projectId?.trim() || !q) {
                    // UI will require a query (searchFilterRequired: true),
                    // but keep this defensive to avoid bad requests.
                    return { results: [{name: 'me', value: 'me'}] };
                }

                const credentials = await this.getCredentials('openProjectApi');
                const baseUrl = `${credentials.baseUrl}/api/v3`;

                // OpenProject can't filter /users by project directly.
                // We list memberships in the selected project, optionally narrowed by principal name.
                const filters: Array<Record<string, any>> = [
                    { project: { operator: '=', values: [String(projectId)] } },
                    { any_name_attribute: { operator: '~', values: [q] } },
                ];

                const response = await this.helpers.httpRequestWithAuthentication.call(
                    this,
                    'openProjectApi',
                    {
                        method: 'GET',
                        url: `${baseUrl}/memberships`,
                        json: true,
                        qs: { filters: JSON.stringify(filters), pageSize: 200 },
                    },
                );

                const elements = response._embedded?.elements ?? [];
                const seen = new Set<string>();
                const results: Array<{ name: string; value: string }> = [{name: 'me', value: 'me'}];

                for (const membership of elements) {
                    const links = (membership as IDataObject)._links as IDataObject | undefined;
                    const principal = links?.principal as { href?: string; title?: string } | undefined;
                    const href = principal?.href ?? '';
                    const title = principal?.title ?? '';
                    const userMatch = href.match(/\/users\/(\d+)\/?$/);
                    if (!userMatch || !title) continue;
                    const id = userMatch[1];
                    if (seen.has(id)) continue;
                    seen.add(id);
                    results.push({ name: title, value: id });
                }

                // results.sort((a, b) => a.name.localeCompare(b.name));
                return { results };
            },
        },
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

            }

            // ─── WORK PACKAGES ──────────────────────────────────────────
            else if (resource === 'workPackage') {
                if (operation === 'getFiltered') {
                    const projectId = this.getNodeParameter('projectId', i, '', {
                        extractValue: true,
                    }) as string;
                    const filterParams = this.getNodeParameter('filters', i, {}) as Record<string, any>;
                    // const opts = this.getNodeParameter('additionalOptions', i, {}) as Record<string, any>;
                  
                    // Build the filters array for OpenProject API
                    const filters: Array<Record<string, any>> = [];
                  
                    // Multi-value filters (operator "=")
                    const statusValues = filterParams.status_id as string[] | string | undefined;
                    const assigneeValues = filterParams.assignee.value as string | undefined;
                    console.log("assigneeValues", assigneeValues);
                    if (assigneeValues) {
                        filters.push({ assigned_to: { operator: '=', values: [assigneeValues] } });
                    }
                    console.log("filters", filters);
                    if (statusValues && (Array.isArray(statusValues) ? statusValues.length > 0 : statusValues !== '')) {
                    const values = Array.isArray(statusValues) ? statusValues : [statusValues];
                    filters.push({ status: { operator: '=', values } });
                    }
                    console.log("filters", filters);
                  
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
                    console.log("qs", qs);
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/${endpoint}`, json: true, qs },
                    );
                    const workPackages = response._embedded?.elements ?? [];
                    returnData.push(...workPackages.map((wp: any) => ({ json: wp })));
                } else if (operation === 'get') {
                    const id = this.getNodeParameter('id', i) as string;
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this, 'openProjectApi',
                        { method: 'GET', url: `${baseUrl}/work_packages/${id}`, json: true },
                    );
                    
                    returnData.push(response);

                }
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
