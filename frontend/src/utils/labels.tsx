import makeRequest from "./makeRequests";


export function getLabels() {
  return makeRequest('/notes/label')
}

export function createLabel(title: string) {
  const requestData = {
    title
  };
  return makeRequest('/notes/label', {
    method: "POST",
    data: requestData
  })
}

export function deleteLabel(id: string) {
  return makeRequest(`/notes/label/${id}`, {
    method: "DELETE",
  })
}

export function updateLabel(id: string, title: string) {
  const requestData = {
    title
  };
  return makeRequest(`/notes/label/${id}`, {
    method: "PATCH",
    data: requestData
  })
}