/**
 * Uploads and returns id of new json
 * @param json Input data
 * @returns {Promise<string>} Id
 */
export function uploadJson(json) {
    return fetch('https://blobse.us.to/new', {
        method: "POST", mode: "cors", cache: "no-cache", credentials: "same-origin",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        redirect: "follow", referrer: "no-referrer", body: JSON.stringify(json),
    }).then(r=>r.json()).then(r=>r.resource.replace("https://blobse.us.to/blob/", ""));
}

/**
 * Updates an existing json
 * @param id Corresponds to existing id
 * @param json New data to replace the current version with
 * @returns {Promise<any>} Response
 */
export function updateJson(id, json) {
    return fetch('https://blobse.us.to/blob/' + id, {
        method: "PUT", mode: "cors", cache: "no-cache", credentials: "same-origin",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        redirect: "follow", referrer: "no-referrer", body: JSON.stringify(json),
    }).then(r=>r.json());
}

/**
 * Return a json corresponding to the given id
 * @param id Id of json
 * @returns {Promise<any>} Json data
 */
export function getJson(id) {
    return fetch('https://blobse.us.to/blob/' + id, {
        method: "GET", mode: "cors", cache: "no-cache", credentials: "same-origin",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        redirect: "follow", referrer: "no-referrer",
    }).then(r=>r.json());
}
