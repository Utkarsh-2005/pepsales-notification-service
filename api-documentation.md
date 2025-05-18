```markdown
# API Documentation

Base URL:  
`https://notification-service-utkarsh.koyeb.app`

All protected endpoints require this header:

```

x-api-key: supersecret123

````

---

## 1. Create User

Endpoint:  
`POST /users`  

Authentication: none

Request body:
```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
````

Response (201):

```json
{
  "success": true,
  "data": {
    "uid": "xwql80vj77",
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2025-05-18T12:34:56.789Z",
    "apiKey": "supersecret123"
  }
}
```

Errors:

* 400 Bad Request
* 409 Conflict

---

## 2. Get User Info

Endpoint:
`GET /users/{uid}`

Authentication: x-api-key

Path parameter:

* `uid` (string)

Response (200):

```json
{
  "success": true,
  "data": {
    "uid": "xwql80vj77",
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2025-05-18T12:34:56.789Z"
  }
}
```

Errors:

* 401 Unauthorized
* 404 Not Found

---

## 3. Send Notification

Endpoint:
`POST /notifications`

Authentication: x-api-key

Request headers:

```
x-api-key: supersecret123
Content-Type: application/json
```

Request body:

```json
{
  "userId": "<recipient-uid>",
  "type": "email" | "sms" | "in-app",
  "to": "<email or phone or uid>",
  "message": "Hello world"
}
```

Response (201):

```json
{
  "success": true,
  "data": {
    "_id": "64f234d123456789abcdef12",
    "userId": "xwql80vj77",
    "type": "in-app",
    "to": "xwql80vj77",
    "message": "Hello world",
    "status": "queued",
    "createdAt": "2025-05-18T12:34:56.789Z"
  }
}
```

Errors:

* 400 Bad Request
* 401 Unauthorized
* 404 Not Found

---

## 4. Get User Notifications

Endpoint:
`GET /users/{uid}/notifications`

Authentication: x-api-key

Path parameter:

* `uid` (string)

Response (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f234d123456789abcdef12",
      "userId": "xwql80vj77",
      "type": "sms",
      "to": "+1234567890",
      "message": "Hello from SMS",
      "status": "sent",
      "createdAt": "2025-05-18T12:34:56.789Z"
    }
  ]
}
```

Errors:

* 401 Unauthorized
* 404 Not Found

---

Sample HTTP request:

```http
POST https://notification-service-utkarsh.koyeb.app/notifications
x-api-key: supersecret123
Content-Type: application/json

{
  "userId": "xwql80vj77",
  "type": "in-app",
  "to": "xwql80vj77",
  "message": "Live update incoming!"
}
```

Live frontend:
[https://notification-ui-xy4e.vercel.app/](https://notification-ui-xy4e.vercel.app/)

```
```
