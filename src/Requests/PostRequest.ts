import { AbstractRequest } from './AbstractRequest'

export class PostRequest extends AbstractRequest {
    protected rules: Record<string, string> = {
        'title': 'required|string|max:255',
        'content': 'required|string|max:255',
    };
}
