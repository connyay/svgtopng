define({ api: [
  {
    "type": "post",
    "url": "/",
    "title": "Convert SVG",
    "name": "ConvertSVG",
    "group": "svgtopng",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "UUID",
            "optional": false,
            "description": "<p>The UUID of converted image</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "    142a5752-e0a6-43a3-b004-1c91408be375\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js"
  },
  {
    "type": "delete",
    "url": "/:uuid",
    "title": "Delete SVG & PNG",
    "name": "DeleteSvgAndPng",
    "group": "svgtopng",
    "version": "0.0.0",
    "filename": "./index.js"
  },
  {
    "type": "get",
    "url": "/i/:uuid",
    "title": "Return Image",
    "name": "ReturnImage",
    "group": "svgtopng",
    "version": "0.0.0",
    "filename": "./index.js"
  },
  {
    "type": "get",
    "url": "/i/:uuid/b64",
    "title": "Return Image as base64",
    "name": "ReturnImageAsBase64",
    "group": "svgtopng",
    "version": "0.0.0",
    "filename": "./index.js"
  },
  {
    "type": "get",
    "url": "/s/:uuid",
    "title": "Return SVG",
    "name": "ReturnSVG",
    "group": "svgtopng",
    "version": "0.0.0",
    "filename": "./index.js"
  }
] });