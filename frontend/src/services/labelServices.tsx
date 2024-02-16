import makeRequest from "../utils/makeRequests";


export function getLabels() {
  return makeRequest('/notes/label')
}

export function deleteLabel(labelId: string) {
  return makeRequest(`/notes/label/${labelId}`, {
    method: "DELETE",
  })
}

export function updateLabel(labelId: string, title: string) {
  const requestData = {
    title
  };
  return makeRequest(`/notes/label/${labelId}`, {
    method: "PATCH",
    data: requestData
  })
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