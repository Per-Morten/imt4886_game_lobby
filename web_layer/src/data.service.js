export class DataService {
    constructor(url) {
        this.baseURL = url;
        this.MongoDBURI = "";
    }

    getAllMatches (GameID: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', _this.baseURL + '/matches/no_body/' + GameID, true);
            xhr.send();
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    getSingleMatch (MatchID: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            let params = {
                "id" : MatchID
            }

            xhr.open('GET', _this.baseURL + '/match/', true);//TODO
            xhr.send(params.id);
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    getAllGames () {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', _this.baseURL + '/games/', true);
            xhr.send();
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    getSingleGame (GameName: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', _this.baseURL + '/games/' + GameName, true);
            xhr.send();
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    addGame (GameName: string, description: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            let params = "name="+ GameName + "&description=" + description;
            console.log(params);

            xhr.open('POST', _this.baseURL + '/game/', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(params);
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    approveGame(GameId: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            let params = {"id": GameId, "valid": true};


            xhr.open('PUT', _this.baseURL + '/game/', true);//TODO
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.send(params);
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    deleteGame(GameId: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            let params = {"id": GameId};


            xhr.open('DELETE', _this.baseURL + '/game/', true);//TODO
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.send(params);
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    updateGame(GameId: string, Update: object) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            let params = {"id": GameId};
            if (Update.name) {
                params +=  {"name": Update.name};
            }
            if (Update.description) {
                params += {"description": Update.description};
            }


            xhr.open('PUT', _this.baseURL + '/game/', true);//TODO
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.send(params);
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;


            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }
}
