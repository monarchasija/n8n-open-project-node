import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class OpenProject implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getProjectMembers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
