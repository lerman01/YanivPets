export class HttpResponse<T> {

    private errors?: Array<object>
    private data?: T

    public setData(data: T) {
        this.data = data;
        return this;
    }

    public setErrors(errors: Array<object>) {
        this.errors = errors;
        return this;
    }
}