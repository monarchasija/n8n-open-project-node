"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenProject = void 0;
var OpenProject = /** @class */ (function () {
    function OpenProject() {
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
    OpenProject.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, returnData, credentials, baseUrl, i, resource, operation, response, projects, id, response, name_1, identifier, additionalFields, body, response, id, additionalFields, response, id, projectId, response, workPackages, id, response, projectId, subject, additionalFields, body, response, id, additionalFields, response, id, response, entries, id, response, workPackageId, hours, spentOn, additionalFields, body, response, id, hours, spentOn, additionalFields, body, response, id;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        items = this.getInputData();
                        returnData = [];
                        return [4 /*yield*/, this.getCredentials('openProjectApi')];
                    case 1:
                        credentials = _g.sent();
                        baseUrl = "".concat(credentials.baseUrl, "/api/v3");
                        i = 0;
                        _g.label = 2;
                    case 2:
                        if (!(i < items.length)) return [3 /*break*/, 35];
                        resource = this.getNodeParameter('resource', i);
                        operation = this.getNodeParameter('operation', i);
                        if (!(resource === 'project')) return [3 /*break*/, 13];
                        if (!(operation === 'getAll')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: "".concat(baseUrl, "/projects"), json: true })];
                    case 3:
                        response = _g.sent();
                        projects = (_b = (_a = response._embedded) === null || _a === void 0 ? void 0 : _a.elements) !== null && _b !== void 0 ? _b : [];
                        returnData.push.apply(returnData, projects);
                        return [3 /*break*/, 12];
                    case 4:
                        if (!(operation === 'get')) return [3 /*break*/, 6];
                        id = this.getNodeParameter('id', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: "".concat(baseUrl, "/projects/").concat(id), json: true })];
                    case 5:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 12];
                    case 6:
                        if (!(operation === 'create')) return [3 /*break*/, 8];
                        name_1 = this.getNodeParameter('name', i);
                        identifier = this.getNodeParameter('identifier', i);
                        additionalFields = this.getNodeParameter('additionalFields', i);
                        body = __assign({ name: name_1, identifier: identifier }, additionalFields);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'POST', url: "".concat(baseUrl, "/projects"), body: body, json: true })];
                    case 7:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 12];
                    case 8:
                        if (!(operation === 'update')) return [3 /*break*/, 10];
                        id = this.getNodeParameter('id', i);
                        additionalFields = this.getNodeParameter('additionalFields', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'PATCH', url: "".concat(baseUrl, "/projects/").concat(id), body: additionalFields, json: true })];
                    case 9:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 12];
                    case 10:
                        if (!(operation === 'delete')) return [3 /*break*/, 12];
                        id = this.getNodeParameter('id', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'DELETE', url: "".concat(baseUrl, "/projects/").concat(id), json: true })];
                    case 11:
                        _g.sent();
                        returnData.push({ success: true, id: id });
                        _g.label = 12;
                    case 12: return [3 /*break*/, 34];
                    case 13:
                        if (!(resource === 'workPackage')) return [3 /*break*/, 24];
                        if (!(operation === 'getAll')) return [3 /*break*/, 15];
                        projectId = this.getNodeParameter('projectId', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: "".concat(baseUrl, "/projects/").concat(projectId, "/work_packages"), json: true })];
                    case 14:
                        response = _g.sent();
                        workPackages = (_d = (_c = response._embedded) === null || _c === void 0 ? void 0 : _c.elements) !== null && _d !== void 0 ? _d : [];
                        returnData.push.apply(returnData, workPackages);
                        return [3 /*break*/, 23];
                    case 15:
                        if (!(operation === 'get')) return [3 /*break*/, 17];
                        id = this.getNodeParameter('id', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: "".concat(baseUrl, "/work_packages/").concat(id), json: true })];
                    case 16:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 23];
                    case 17:
                        if (!(operation === 'create')) return [3 /*break*/, 19];
                        projectId = this.getNodeParameter('projectId', i);
                        subject = this.getNodeParameter('subject', i);
                        additionalFields = this.getNodeParameter('additionalFields', i);
                        body = { subject: subject };
                        if (additionalFields.description) {
                            body.description = { raw: additionalFields.description };
                        }
                        if (additionalFields.assigneeId) {
                            body._links = { assignee: { href: "/api/v3/users/".concat(additionalFields.assigneeId) } };
                        }
                        if (additionalFields.dueDate)
                            body.dueDate = additionalFields.dueDate;
                        if (additionalFields.startDate)
                            body.startDate = additionalFields.startDate;
                        if (additionalFields.estimatedHours)
                            body.estimatedTime = "PT".concat(additionalFields.estimatedHours, "H");
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'POST', url: "".concat(baseUrl, "/projects/").concat(projectId, "/work_packages"), body: body, json: true })];
                    case 18:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 23];
                    case 19:
                        if (!(operation === 'update')) return [3 /*break*/, 21];
                        id = this.getNodeParameter('id', i);
                        additionalFields = this.getNodeParameter('additionalFields', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'PATCH', url: "".concat(baseUrl, "/work_packages/").concat(id), body: additionalFields, json: true })];
                    case 20:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 23];
                    case 21:
                        if (!(operation === 'delete')) return [3 /*break*/, 23];
                        id = this.getNodeParameter('id', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'DELETE', url: "".concat(baseUrl, "/work_packages/").concat(id), json: true })];
                    case 22:
                        _g.sent();
                        returnData.push({ success: true, id: id });
                        _g.label = 23;
                    case 23: return [3 /*break*/, 34];
                    case 24:
                        if (!(resource === 'timeEntry')) return [3 /*break*/, 34];
                        if (!(operation === 'getAll')) return [3 /*break*/, 26];
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: "".concat(baseUrl, "/time_entries"), json: true })];
                    case 25:
                        response = _g.sent();
                        entries = (_f = (_e = response._embedded) === null || _e === void 0 ? void 0 : _e.elements) !== null && _f !== void 0 ? _f : [];
                        returnData.push.apply(returnData, entries);
                        return [3 /*break*/, 34];
                    case 26:
                        if (!(operation === 'get')) return [3 /*break*/, 28];
                        id = this.getNodeParameter('id', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'GET', url: "".concat(baseUrl, "/time_entries/").concat(id), json: true })];
                    case 27:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 34];
                    case 28:
                        if (!(operation === 'create')) return [3 /*break*/, 30];
                        workPackageId = this.getNodeParameter('workPackageId', i);
                        hours = this.getNodeParameter('hours', i);
                        spentOn = this.getNodeParameter('spentOn', i);
                        additionalFields = this.getNodeParameter('additionalFields', i);
                        body = {
                            hours: "PT".concat(hours, "H"),
                            spentOn: spentOn,
                            _links: {
                                workPackage: { href: "/api/v3/work_packages/".concat(workPackageId) },
                            },
                        };
                        if (additionalFields.comment) {
                            body.comment = { raw: additionalFields.comment };
                        }
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'POST', url: "".concat(baseUrl, "/time_entries"), body: body, json: true })];
                    case 29:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 34];
                    case 30:
                        if (!(operation === 'update')) return [3 /*break*/, 32];
                        id = this.getNodeParameter('id', i);
                        hours = this.getNodeParameter('hours', i);
                        spentOn = this.getNodeParameter('spentOn', i);
                        additionalFields = this.getNodeParameter('additionalFields', i);
                        body = {
                            hours: "PT".concat(hours, "H"),
                            spentOn: spentOn,
                        };
                        if (additionalFields.comment) {
                            body.comment = { raw: additionalFields.comment };
                        }
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'PATCH', url: "".concat(baseUrl, "/time_entries/").concat(id), body: body, json: true })];
                    case 31:
                        response = _g.sent();
                        returnData.push(response);
                        return [3 /*break*/, 34];
                    case 32:
                        if (!(operation === 'delete')) return [3 /*break*/, 34];
                        id = this.getNodeParameter('id', i);
                        return [4 /*yield*/, this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', { method: 'DELETE', url: "".concat(baseUrl, "/time_entries/").concat(id), json: true })];
                    case 33:
                        _g.sent();
                        returnData.push({ success: true, id: id });
                        _g.label = 34;
                    case 34:
                        i++;
                        return [3 /*break*/, 2];
                    case 35: return [2 /*return*/, [this.helpers.returnJsonArray(returnData)]];
                }
            });
        });
    };
    return OpenProject;
}());
exports.OpenProject = OpenProject;
