import React from 'react';

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

            xhr.open('GET', _this.baseURL + '/games/all/placeholder', true);//TODO: MAKE
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

    getSingleGame (GameID: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', _this.baseURL + '/game/placeholder' + GameID, true);//TODO: MAKE
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

    addGame (GameName: string) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            let params = {
                "name": GameName
            }

            xhr.open('POST', _this.baseURL + '/placeholder/', true);//TODO
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
