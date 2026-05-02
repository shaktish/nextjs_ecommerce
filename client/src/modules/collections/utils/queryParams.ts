
export const buildQueryParams = (
    searchParams: URLSearchParams,
    key: string,
    value: string,
    isMulti = true
): URLSearchParams => {
    const params = new URLSearchParams(searchParams.toString());

    if (!isMulti) {
        params.set(key, value);
        return params;
    }

    const existing = params.get(key)?.split(",") || [];

    const updated = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];

    if (updated.length) {
        params.set(key, updated.join(","));
    } else {
        params.delete(key);
    }

    return params;
};

export const updatePageParam = (
    searchParams: URLSearchParams,
    page: number
): URLSearchParams => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return params;
};