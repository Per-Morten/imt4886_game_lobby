define({ "api": [
  {
    "type": "post",
    "url": "/game/",
    "title": "Create a game with the specified parameters",
    "name": "CreateGame",
    "group": "Game",
    "description": "<p>Creates a game with the given JSON object. Returns 200 on success together with the newly created game.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the game, must be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>A description of the game.</p>"
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
            "description": "<p>The unique identifier of the game. This is also the gameToken.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "__v",
            "description": "<p>The version of the game in the database.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the game.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "valid",
            "description": "<p>Flag stating if the game is valid or not.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "description",
            "description": "<p>A description of the game</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59c7f0c9b0a0932165c058b6\",\n  \"__v\": 0,\n  \"name\": \"Game 1\",\n  \"valid\": false,\n  \"description\": \"A fun new game\"\n}",
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
            "description": "<p>Could not create the game because of some invalid parameters. For example sending in a name that already exists.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "source/controllers/Game.js",
    "groupTitle": "Game"
  },
  {
    "type": "delete",
    "url": "/game/",
    "title": "Delete the specified game",
    "name": "DeleteGame",
    "group": "Game",
    "description": "<p>Deletes the game with the requested id. Returns 204 on success, 404 if the game with requested id couldn't be found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the game.</p>"
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
            "field": "GameNotFound",
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
    "filename": "source/controllers/Game.js",
    "groupTitle": "Game"
  },
  {
    "type": "get",
    "url": "/game/:id",
    "title": "Get game with a specific id",
    "name": "GetGame",
    "group": "Game",
    "description": "<p>Gets the game with the specified id. Returns 200 on success with the object, 404 if the game with requested id couldn't be found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>The unique id of the game.</p>"
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
            "description": "<p>The unique identifier of the game.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "__v",
            "description": "<p>The version of the game in the database.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the game.</p>"
          },
          {
            "group": "200",
            "optional": false,
            "field": "valid",
            "description": "<p>Flag stating if the game is valid or not.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59c7f0c9b0a0932165c058b6\",\n  \"__v\": 0,\n  \"name\": \"Game 1\",\n  \"valid\": false,\n  \"description\": \"A fun game\"\n}",
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
            "field": "GameNotFound",
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
    "filename": "source/controllers/Game.js",
    "groupTitle": "Game"
  },
  {
    "type": "put",
    "url": "/game/",
    "title": "Update the specified game",
    "name": "UpdateGame",
    "group": "Game",
    "description": "<p>Updates the game that is specified with the new value. Returns 204 on success. 404 if the game with requested ID couldn't be found. 400 if validation fails, for example if name is not available.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>the unique ID of the game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>The new name of the game</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "valid",
            "description": "<p>Set the valid value of the game</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>A description of the game.</p>"
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
            "field": "GameNotFound",
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
    "filename": "source/controllers/Game.js",
    "groupTitle": "Game"
  },
  {
    "type": "get",
    "url": "/games/",
    "title": "Request all games",
    "name": "GetGames",
    "group": "Games",
    "description": "<p>Returns a JSON array of all games that exists in the database. This array is empty if no games were found.</p>",
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
    "filename": "source/controllers/Games.js",
    "groupTitle": "Games"
  },
  {
    "type": "get",
    "url": "/games/:name",
    "title": "Request all with a partial match on name",
    "name": "GetGamesByName",
    "group": "Games",
    "description": "<p>Returns a JSON array of all games that exists in the database with a name that partially matches with the supplied name..</p>",
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
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "No",
            "description": "<p>games with suplied name was found..</p>"
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
    "filename": "source/controllers/Games.js",
    "groupTitle": "Games"
  },
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
          },
          {
            "group": "MatchInfo",
            "type": "Number",
            "optional": false,
            "field": "playerCount",
            "description": "<p>(optional) The current number of players, defaults to 0. Cannot be less than 0 or more than maxPlayerCount.</p>"
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
          },
          {
            "group": "200",
            "optional": false,
            "field": "maxPlayerCount",
            "description": "<p>The maximum number of players in the match.</p>"
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
          },
          {
            "group": "200",
            "optional": false,
            "field": "maxPlayerCount",
            "description": "<p>The maximum number of players in the match.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59c7f0c9b0a0932165c058b6\",\n  \"__v\": 0,\n  \"name\": \"Match 1\",\n  \"gameToken\": \"Game 1\",\n  \"status\": 1,\n  \"hostIP\": \"127.0.0.0\",\n  \"hostPort\": 3000,\n  \"playerCount\": 1,\n  \"maxPlayerCount\": 2\n}",
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
    "type": "post",
    "url": "/match_report/",
    "title": "Create a match report with given data",
    "name": "CreateMatchReport",
    "group": "MatchReport",
    "description": "<p>Creates a match report with the given JSON object. Returns 200 on success together with the newly created match report.</p>",
    "parameter": {
      "fields": {
        "MatchReportInfo": [
          {
            "group": "MatchReportInfo",
            "type": "String",
            "optional": false,
            "field": "matchID",
            "description": "<p>The ID of the match that this report belongs to.</p>"
          },
          {
            "group": "MatchReportInfo",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The gameToken belonging to this game</p>"
          },
          {
            "group": "MatchReportInfo",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>An object containing arbitrary data from the match.</p>"
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
            "field": "matchID",
            "description": "<p>The ID of the match that this report belongs to.</p>"
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
            "field": "data",
            "description": "<p>An object containing custom data that the developer adds to a report</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59c7f0c9b0a0932165c058b6\",\n  \"__v\": 0,\n  \"matchID\": \"4ug12o5uuihgvygf1243\",\n  \"gameToken\": \"aodhfa32048837bawioaf\",\n  \"data\": {\n     \"duration\": 2000,\n     \"score\": 50000,\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
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
    "filename": "source/controllers/MatchReport.js",
    "groupTitle": "MatchReport"
  },
  {
    "type": "delete",
    "url": "/match_report/",
    "title": "Delete the specified match report",
    "name": "DeleteMatchReport",
    "group": "MatchReport",
    "description": "<p>Deletes the match report with the requested id. Returns 204 on success, 404 if the match with requested id couldn't be found.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the match report.</p>"
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
            "field": "MatchReportNotFound",
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
    "filename": "source/controllers/MatchReport.js",
    "groupTitle": "MatchReport"
  },
  {
    "type": "get",
    "url": "/match_reports/average/",
    "title": "Requests an average value from a specified field and gameToken in all reports.",
    "name": "GetMatchReportAverageJSONBody",
    "group": "MatchReports",
    "description": "<p>This request takes a gameToken and a string used to represent a field name within the variable data object of a report. (Acquired from the body) The request then returns the average of this field from all reports within a given gameToken/game.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>The name of the field we want the average value from</p>"
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
          "content": "HTTP/1.1 200 OK\n{850}",
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
    "filename": "source/controllers/MatchReports.js",
    "groupTitle": "MatchReports"
  },
  {
    "type": "get",
    "url": "/match_reports/average/no_body/:gameToken/:fieldName",
    "title": "Requests an average value from a specified field and gameToken in all reports.",
    "name": "GetMatchReportAverageNoBody",
    "group": "MatchReports",
    "description": "<p>This request takes a gameToken and a string used to represent a field name within the variable data object of a report. The request then returns the average of this field from all reports within a given gameToken/game.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>The name of the field we want the average value from</p>"
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
          "content": "HTTP/1.1 200 OK\n{850}",
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
    "filename": "source/controllers/MatchReports.js",
    "groupTitle": "MatchReports"
  },
  {
    "type": "get",
    "url": "/match_reports/median/",
    "title": "Requests an median value from a specified field and gameToken in all reports.",
    "name": "GetMatchReportMedianJSONBody",
    "group": "MatchReports",
    "description": "<p>This request takes a gameToken and a string used to represent a field name within the variable data object of a report. (Acquired from the body) The request then returns the median of this field from all reports within a given gameToken/game.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>The name of the field we want the median value from</p>"
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
          "content": "HTTP/1.1 200 OK\n{500}",
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
    "filename": "source/controllers/MatchReports.js",
    "groupTitle": "MatchReports"
  },
  {
    "type": "get",
    "url": "/match_reports/median/no_body/:gameToken/:fieldName",
    "title": "Requests an average value from a specified field and gameToken in all reports.",
    "name": "GetMatchReportMedianNoBody",
    "group": "MatchReports",
    "description": "<p>This request takes a gameToken and a string used to represent a field name within the variable data object of a report. The request then returns the median of this field from all reports within a given gameToken/game.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>The name of the field we want the median value from</p>"
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
          "content": "HTTP/1.1 200 OK\n{500}",
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
    "filename": "source/controllers/MatchReports.js",
    "groupTitle": "MatchReports"
  },
  {
    "type": "get",
    "url": "/match_reports/",
    "title": "Requests all match reports with given gameToken",
    "name": "GetMatchReportsJSONBody",
    "group": "MatchReports",
    "description": "<p>Acquires the gameToken from the body of the request and returns a JSON array of all match reports.</p>",
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
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"59c7f0c9b0a0932165c058b6\",\n    \"__v\": 0,\n    \"matchID\": \"4ug12o5uuihgvygf1243\",\n    \"gameToken\": \"aodhfa32048837bawioaf\",\n    \"data\": {\n       \"duration\": 2000,\n       \"score\": 50000,\n    },\n  }\n]",
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
    "filename": "source/controllers/MatchReports.js",
    "groupTitle": "MatchReports"
  },
  {
    "type": "get",
    "url": "/match_reports/no_body/:gameToken",
    "title": "Requests all match reports with given gameToken",
    "name": "GetMatchReportsNoBody",
    "group": "MatchReports",
    "description": "<p>Returns a JSON array of all match reports.</p>",
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
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"59c7f0c9b0a0932165c058b6\",\n    \"__v\": 0,\n    \"matchID\": \"4ug12o5uuihgvygf1243\",\n    \"gameToken\": \"aodhfa32048837bawioaf\",\n    \"data\": {\n       \"duration\": 2000,\n       \"score\": 50000,\n    },\n  }\n]",
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
    "filename": "source/controllers/MatchReports.js",
    "groupTitle": "MatchReports"
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
              "{0..match.maxPlayerCount}"
            ],
            "optional": false,
            "field": "playerCount",
            "description": "<p>The new number of players. Cannot be less than 0, or greater than the maxPlayerCount the match is created with.</p>"
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
  },
  {
    "type": "get",
    "url": "/matches/not_in_session/",
    "title": "Request matches that are not in session with given gameToken",
    "name": "GetMatchesNotInSession",
    "group": "Matches",
    "description": "<p>Returns a list of all matches that are not in session and contain the provided gameToken. This list is empty if no matches were found.</p>",
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
    "url": "/matches/not_in_session/no_body/:gameToken",
    "title": "Request matches that are not in session with given gameToken",
    "name": "GetMatchesNotInSessionNoBody",
    "group": "Matches",
    "description": "<p>Returns a list of all matches that are not in session and contain the provided gameToken. This list is empty if no matches were found.</p>",
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
    "url": "/matches/with_name",
    "title": "Requests all matches with a given token and partially matched name.",
    "name": "GetMatchesWithNameJSONBody",
    "group": "Matches",
    "description": "<p>Returns a JSON array of all matches that partially match the given name.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The match name we are searching for</p>"
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
            "field": "Supplied",
            "description": "<p>gameToken was not found or no matches with given name were found.</p>"
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
    "url": "/matches/with_name/no_body/:gameToken/:name",
    "title": "Requests all matches with a given token and partially matched name.",
    "name": "GetMatchesWithNameNoBody",
    "group": "Matches",
    "description": "<p>Returns a JSON array of all matches that partially match the given name.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gameToken",
            "description": "<p>The unique game token of a game.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The match name we are searching for</p>"
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
            "field": "Supplied",
            "description": "<p>gameToken was not found or no matches with given name were found.</p>"
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
