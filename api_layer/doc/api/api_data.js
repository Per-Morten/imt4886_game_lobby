define({ "api": [
  {
    "type": "post",
    "url": "/match/",
    "title": "Create a match with the specified parameters",
    "name": "CreateMatch",
    "group": "Match",
    "description": "<p>Creates a match with the given JSON object. Returns 200 on success together with the newly created match.</p>",
    "parameter": {
      "fields": {
        "MatchInfo": [
          {
            "group": "MatchInfo",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the match, provided by the host.</p>"
          },
          {
            "group": "MatchInfo",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The gameToken belonging to this game (given to developers on per game basis).</p>"
          },
          {
            "group": "MatchInfo",
            "type": "String",
            "optional": false,
            "field": "hostIP",
            "description": "<p>The ip address of the machine hosting the match.</p>"
          },
          {
            "group": "MatchInfo",
            "type": "Number",
            "optional": false,
            "field": "hostPort",
            "description": "<p>The port which the host is listening on for the match.</p>"
          },
          {
            "group": "MatchInfo",
            "type": "Number",
            "optional": false,
            "field": "maxPlayerCount",
            "description": "<p>(optional) The maximum number of players in the match.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "_id",
            "description": "<p>The unique identifier of the match.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "__v",
            "description": "<p>The version of the match in the database.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the match.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The identifier of the game the match belongs to.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "status",
            "description": "<p>The current status of the game. 0 for waiting, 1 for in session.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "hostIP",
            "description": "<p>The ip address of the host of the match.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "hostPort",
            "description": "<p>The port that the match is run on.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "playerCount",
            "description": "<p>The number of players in the match.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59c7f0c9b0a0932165c058b6\",\n  \"__v\": 0,\n  \"name\": \"Match 1\",\n  \"gameToken\": \"Game 1\",\n  \"status\": 0,\n  \"hostIP\": \"127.0.0.0\",\n  \"hostPort\": 3000,\n  \"playerCount\": 1,\n  \"maxPlayerCount\": 300\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Could not create the match because of some invalid parameters. For example invalid ip addresses, ports, or maxPlayerCount.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "InvalidToken",
            "description": "<p>Invalid gameToken or gameToken that has not yet been accepted was sent. Tokens need to be accepted by an admin before use.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "source/controllers/Match.js",
    "groupTitle": "Match"
  },
  {
    "type": "delete",
    "url": "/match/",
    "title": "Delete the specified match",
    "name": "DeleteMatch",
    "group": "Match",
    "description": "<p>Deletes the match with the requested id. Returns 204 on success, 404 if the match with requested id couldn't be found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the match.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "204": [
          {
            "group": "204",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 OK\n{}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "MatchNotFound",
            "description": "<p>The supplied ID was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "source/controllers/Match.js",
    "groupTitle": "Match"
  },
  {
    "type": "get",
    "url": "/match/",
    "title": "Get match with a specific id",
    "name": "GetMatch",
    "group": "Match",
    "description": "<p>Gets the match with the specified id. Returns 200 on success with the object, 404 if the match with requested id couldn't be found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>The unique id of the match.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "_id",
            "description": "<p>The unique identifier of the match.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "__v",
            "description": "<p>The version of the match in the database.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the match.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The identifier of the game the match belongs to.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "status",
            "description": "<p>The current status of the game. 0 for waiting, 1 for in session.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "hostIP",
            "description": "<p>The ip address of the host of the match.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "hostPort",
            "description": "<p>The port that the match is run on.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "playerCount",
            "description": "<p>The number of players in the match.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59c7f0c9b0a0932165c058b6\",\n  \"__v\": 0,\n  \"name\": \"Match 1\",\n  \"gameToken\": \"Game 1\",\n  \"status\": 1,\n  \"hostIP\": \"127.0.0.0\",\n  \"hostPort\": 3000,\n  \"playerCount\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "MatchNotFound",
            "description": "<p>The supplied ID was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "source/controllers/Match.js",
    "groupTitle": "Match"
  },
  {
    "type": "put",
    "url": "/match/status",
    "title": "Update status of specified match",
    "name": "UpdateMatchStatus",
    "group": "Match",
    "description": "<p>The status of the match with the specified ID is updated Returns 204 on success, 404 if the match with requested ID couldn't be found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>the unique ID of the match.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "{0..1}"
            ],
            "optional": false,
            "field": "status",
            "description": "<p>the current status of the match. 0 if waiting 1 if in session.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "204": [
          {
            "group": "204",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 OK\n{}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "MatchNotFound",
            "description": "<p>The supplied ID was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "source/controllers/Match.js",
    "groupTitle": "Match"
  },
  {
    "type": "put",
    "url": "/match/player_count/",
    "title": "Update the player count on a specific match",
    "name": "UpdatePlayerCount",
    "group": "Match",
    "description": "<p>Updates the number of players on the specified match. Returns 204 on success, 404 if the match with requested id couldn't be found. 400 if the request was invalid.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the match.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "{1..inf}"
            ],
            "optional": false,
            "field": "player_count",
            "description": "<p>The new number of players.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "204": [
          {
            "group": "204",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 OK\n{}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The supplied playerCount did not adhere to the given limits.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "MatchNotFound",
            "description": "<p>The supplied ID was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Not Found\n{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "source/controllers/Match.js",
    "groupTitle": "Match"
  },
  {
    "type": "get",
    "url": "/matches/in_session/",
    "title": "Request matches that are in session with given gameToken",
    "name": "GetMatchesInSessionJSONBody",
    "group": "Matches",
    "description": "<p>Returns a list of all matches that are in session and contain the provided gameToken. This list is empty if no matches were found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "source/controllers/Matches.js",
    "groupTitle": "Matches"
  },
  {
    "type": "get",
    "url": "/matches/in_session/no_body/:gameToken",
    "title": "Request matches that are in session with given gameToken",
    "name": "GetMatchesInSessionNoBody",
    "group": "Matches",
    "description": "<p>Returns a list of all matches that are in session and contain the provided gameToken. This list is empty if no matches were found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "source/controllers/Matches.js",
    "groupTitle": "Matches"
  },
  {
    "type": "get",
    "url": "/matches/",
    "title": "Request matches with given gameToken",
    "name": "GetMatchesJSONBody",
    "group": "Matches",
    "description": "<p>Returns a JSON array of all matches that contain the provided gameToken. This array is empty if no matches were found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "source/controllers/Matches.js",
    "groupTitle": "Matches"
  },
  {
    "type": "get",
    "url": "/matches/no_body/:gameToken",
    "title": "Request matches with given gameToken",
    "name": "GetMatchesNoBody",
    "group": "Matches",
    "description": "<p>Returns a JSON array of all matches that contain the provided gameToken. This array is empty if no matches were found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "source/controllers/Matches.js",
    "groupTitle": "Matches"
  },
  {
    "type": "get",
    "url": "/matches/not_full/",
    "title": "Request all the matches that are not full with a given gameToken",
    "name": "GetMatchesNotFullJSONBody",
    "group": "Matches",
    "description": "<p>Returns a JSON array of all matches where playerCount &lt; maxPlayerCount. The array does not include matches that have not specified maxPlayerCount.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  { _id: '59da7d0e704a440b4fc6d840',\n    name: 'Test Match 2',\n    gameToken: '59da7d0e704a440b4fc6d83d',\n    status: 0,\n    hostIP: '127.0.0.1',\n    hostPort: 3000,\n    __v: 0,\n    maxPlayerCount: 9007199254740991,\n    playerCount: 1 },\n  { _id: '59da7d0e704a440b4fc6d842',\n    name: 'Test Match 4',\n    gameToken: '59da7d0e704a440b4fc6d83d',\n    status: 0,\n    hostIP: '127.0.0.1',\n    hostPort: 3000,\n    __v: 0,\n    maxPlayerCount: 36,\n    playerCount: 35 },\n  { _id: '59da7d0e704a440b4fc6d843',\n    name: 'Test Match 5',\n    gameToken: '59da7d0e704a440b4fc6d83d',\n    status: 0,\n    hostIP: '127.0.0.1',\n    hostPort: 3000,\n    __v: 0,\n    maxPlayerCount: 36,\n    playerCount: 22 }\n ]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>The supplied GameToken was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "source/controllers/Matches.js",
    "groupTitle": "Matches"
  },
  {
    "type": "get",
    "url": "/matches/not_full/no_body/:gameToken",
    "title": "Request all the matches that are not full with a given gameToken",
    "name": "GetMatchesNotFullNoBody",
    "group": "Matches",
    "description": "<p>Returns a JSON array of all matches where playerCount &lt; maxPlayerCount. The array does not include matches that have not specified maxPlayerCount.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  { _id: '59da7d0e704a440b4fc6d840',\n    name: 'Test Match 2',\n    gameToken: '59da7d0e704a440b4fc6d83d',\n    status: 0,\n    hostIP: '127.0.0.1',\n    hostPort: 3000,\n    __v: 0,\n    maxPlayerCount: 9007199254740991,\n    playerCount: 1 },\n  { _id: '59da7d0e704a440b4fc6d842',\n    name: 'Test Match 4',\n    gameToken: '59da7d0e704a440b4fc6d83d',\n    status: 0,\n    hostIP: '127.0.0.1',\n    hostPort: 3000,\n    __v: 0,\n    maxPlayerCount: 36,\n    playerCount: 35 },\n  { _id: '59da7d0e704a440b4fc6d843',\n    name: 'Test Match 5',\n    gameToken: '59da7d0e704a440b4fc6d83d',\n    status: 0,\n    hostIP: '127.0.0.1',\n    hostPort: 3000,\n    __v: 0,\n    maxPlayerCount: 36,\n    playerCount: 22 }\n ]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>The supplied GameToken was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "source/controllers/Matches.js",
    "groupTitle": "Matches"
  }
] });
