import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class OpenProject implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            searchProjects(this: ILoadOptionsFunctions, query?: string): Promise<{
                results: Array<{
                    name: string;
                    value: string;
                }>;
            }>;
            searchUsers(this: ILoadOptionsFunctions, query?: string): Promise<{
                results: Array<{
                    name: string;
                    value: string;
                }>;
            }>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
