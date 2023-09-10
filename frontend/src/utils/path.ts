
export function getBackendURL(path: string, params?: {key: string, value: string | number | boolean}[]): string {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND;
  if (!Array.isArray(params)) {
    return `${backendURL}${path}`;
  }

  var p = "";
  var i = 0;
  for (const param of params) {
    if (i === params.length - 1) {
      p += `${param.key}=${param.value}`;
      continue;
    }

    p += `${param.key}=${param.value}&`;
  }

  return `${backendURL}${path}?${p}`;
}
