export function buildHeaders(obj) {
    const headers = new Headers();

    Object.entries(obj).forEach(([key, value]) => headers.append(key, value));

    return headers;
}

export function buildQueryParams(obj) {
    let queryParams = '';

    queryParams = Object.entries(obj).reduce(function(acc, [key, value]) {
        acc.push(`${key}=${value}`);

        return acc;
    }, []).join('&');

    return `?${queryParams}`;
}
