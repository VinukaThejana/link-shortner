
export const getBackendPath = (path: string, params?: string[]): string => {
  if (!Array.isArray(params)) {
    return `${import.meta.env.PUBLIC_BACKEND}${path}`
  }

  var p = "";
  var i = 0;
  for (const param of params) {
    if (i === params.length - 1) {
      p += param;
      continue;
    }

    p += `${param}&`
  }

  return `${import.meta.env.PUBLIC_BACKEND}${path}?${p}`
}
