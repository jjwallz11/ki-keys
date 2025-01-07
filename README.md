# [Patriotic Keys App]

## Database Schema Design

[kk-db-schema]: ./images/db_design.jpeg

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/session
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "role": "locksmith || owner",
        "firstName": "Barry",
        "lastName": "Allen",
        "email": "barry.allen@email.com",
        "username": "BAtheFlash"
      }
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "barry.allen@email.com", // or username "BAtheFlash"
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "role": "locksmith || owner",
        "firstName": "Barry",
        "lastName": "Allen",
        "email": "barry.allen@email.com",
        "username": "BAtheFlash"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "firstName": "Barry",
      "lastName": "Allen",
      "email": "barry.allen@email.com",
      "username": "BAtheFlash",
      "role": "locksmith || owner",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "role": "locksmith || owner",
        "firstName": "Barry",
        "lastName": "Allen",
        "email": "barry.allen@email.com",
        "username": "BAtheFlash"
      }
    }
    ```

- Error response: User already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "role": "Role is required",
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## VEHICLES

### Get all Vehicles

Returns all the vehicles.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/vehicles
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Vehicles": [
        {
          "id": 1,
          "ownerId": 1,
          "vin": "12456789asdfghjk",
          "year": 1988,
          "make": "GMC",
          "model": "Sierra",
          "keyType": "keyType", // "smart key": or "transponder": or "high-security":
          "price": 225, //225, 100, 75, each is associated with a type of key.
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url", // maybe of VIN?
          "keyImage": "image url",
          "status": "status", // "active", "locked", "awaiting key", etc.
        }
      ]
    }
    ```

### Get all Vehicles owned by the Current User

Returns all the vehicles owned (created) by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/vehicles/current
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Vehicles": [
        {
          "id": 1,
          "ownerId": 1,
          "vin": "12456789asdfghjk",
          "year": 1988,
          "make": "GMC",
          "model": "Sierra",
          "keyType": "keyType", // "smart key": or "transponder": or "high-security":
          "price": 225, //225, 100, 75, each is associated with a type of key.
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url", // maybe of VIN?
          "keyImage": "image url",
          "status": "status", // "active", "locked", "awaiting key", etc.
        }
      ]
    }
    ```

### Get details of a Vehicle from an { identifier }

Returns the details of a vehicle specified by its VIN or Id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/vehicles/{identifier}
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Vehicles": [
        {
          "id": 1,
          "ownerId": 1,
          "vin": "12456789asdfghjk",
          "year": 1988,
          "make": "GMC",
          "model": "Sierra",
          "keyType": "keyType", // "smart key": or "transponder": or "high-security":
          "price": 225, //225, 100, 75, each is associated with a type of key.
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url", // maybe of VIN?
          "keyImage": "image url",
          "status": "status", // "active", "locked", "awaiting key", etc.
        }
      ],
      "VehicleImages": [
        {
          "id": 1,
          "url": "image url",
          "preview": true
        },
        {
          "id": 2,
          "url": "image url",
          "preview": false
        }
      ],
      "Owner": {
        "id": 1,
        "firstName": "Barry",
        "lastName": "Allen"
      }
    }
    ```

- Error response: Couldn't find a Vehicle with the specified {identifier}

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

### Add a Vehicle

Adds and returns a new vehicle.

- Require Authentication: true
- Request

- LOCKSMITH VIEW

  - Method: POST
  - Route path: /api/vehicles
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "vin": "12456789asdfghjk",
      "year": 1988,
      "make": "GMC",
      "model": "Sierra",
      "keyType": "keyType", // "smart key": or "transponder": or "high-security":,
      "price": 225, //225, 100, 75, each is associated with a type of key.
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "previewImage": "image url", // maybe of VIN?
      "keyImage": "image url",
      "status": "status", // "active", "locked", "awaiting key", etc.
    }
    ```

- OWNER VIEW

  - Method: POST
  - Route path: /api/vehicles
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "vin": "12456789asdfghjk",
      "year": 1988,
      "make": "GMC",
      "model": "Sierra",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "previewImage": "image url", // maybe of VIN?
      "status": "status", // "active", "locked", "awaiting key", etc.
    }
    ```

- Successful Response if Locksmith

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "locksmithId": 1,
      "vin": "12456789asdfghjk",
      "year": 1988,
      "make": "GMC",
      "model": "Sierra",
      "keyType": "keyType", // "smart key": or "transponder": or "high-security":,
      "price": 225, //225, 100, 75, each is associated with a type of key.
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "previewImage": "image url", // maybe of VIN?
      "keyImage": "image url",
      "status": "status", // "active", "locked", "awaiting key", etc.
    }
    ```

- Successful Response if Owner

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "vin": "12456789asdfghjk",
      "year": 1988,
      "make": "GMC",
      "model": "Sierra",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "previewImage": "image url", // maybe of VIN?
      "status": "status", // "active", "locked", "awaiting key", etc.
    }
    ```

- Error Response: Body validation errors for locksmiths

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "vin": "VIN must consist of exactly 17 alphanumeric characters",
        "year": "Year must be between 1949 and 2024",
        "make": "Make of the vehicle is required",
        "model": "Model of the vehicle is required",
        "keyType": "keyType can be 'smart key', 'transponder', or 'high-security' only", // "smart key": or "transponder": or "high-security":,
        "price": "price is required and must be greater than 0", //225, 100, 75, each is associated with a type of key.
        "status": "status", // "active", "locked", "awaiting key", etc.
      }
    }
    ```

- Error Response: Body validation errors for owners

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "vin": "VIN must consist of exactly 17 alphanumeric characters",
        "year": "Year must be between 1949 and 2024",
        "make": "Make of the vehicle is required",
        "model": "Model of the vehicle is required"
      }
    }
    ```

### Add an Image to a Vehicle based on the Vehicle's id

Add and return a new image for a vehicle specified by id.

- Require Authentication: true
- Require proper authorization: Vehicle must belong to the current user
- Request

  - Method: POST
  - Route path: /api/vehicles/:vechicleId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url",
      "preview": true
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url",
      "preview": true
    }
    ```

- Error response: Couldn't find a Vehicle with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

### Edit a Vehicle

Updates and returns an existing vehicle.

- Require Authentication: true
- Require proper authorization: Vehicle must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/vehicles/:vechicleId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "vin": "12456789asdfghjk",
      "year": 1988,
      "make": "GMC",
      "model": "Sierra",
      "keyType": "keyType", // "smart key": or "transponder": or "high-security": NOT editable by Owners
      "price": 225, //225, 100, 75, each is associated with a type of key. NOT editable by Owners
      "previewImage": "image url", // maybe of VIN?
      "keyImage": "image url",
      "status": "status", // "active", "locked", "awaiting key", etc.
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "vin": "12456789asdfghjk",
      "year": 1988,
      "make": "GMC",
      "model": "Sierra",
      "keyType": "keyType", // "smart key": or "transponder": or "high-security":
      "price": 225, //225, 100, 75, each is associated with a type of key.
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "previewImage": "image url", // maybe of VIN?
      "keyImage": "image url",
      "status": "status", // "active", "locked", "awaiting key", etc.
    }
    ```

- Error Response: Body validation errors for locksmiths

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "vin": "VIN must consist of exactly 17 alphanumeric characters",
        "year": "Year must be between 1949 and 2024",
        "make": "Make of the vehicle is required",
        "model": "Model of the vehicle is required",
        "keyType": "keyType can be 'smart key', 'transponder', or 'high-security' only", // "smart key": or "transponder": or "high-security":,
        "price": "price is required and must be greater than 0" //225, 100, 75, each is associated with a type of key.
      }
    }
    ```

- Error Response: Body validation errors for owners

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "vin": "VIN must consist of exactly 17 alphanumeric characters",
        "year": "Year must be between 1949 and 2024",
        "make": "Make of the vehicle is required",
        "model": "Model of the vehicle is required"
      }
    }
    ```

- Error response: Couldn't find a Vehicle with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

### Delete a Vehicle

Deletes an existing vehicle.

- Require Authentication: true
- Require proper authorization: Vehicle must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/vehicles/:vechicleId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Vehicle with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

## KEYS

### Get all Keys of the Current Locksmith

Returns all the keys owned by the current locksmith.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/keys/current
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Keys": [
        {
          "id": 1,
          "userId": 1,
          "keyType": "Smart AC8473",
          "invStatus": "low", // or 'med' or 'high' or 'ordered' or 'waitlisted'
          "count": 10,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "VehicleTypes": {
            "years": "1988-2000",
            "make": "GMC",
            "model": "Sierra"
          },
          "KeyImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ]
        }
      ]
    }
    ```

### Create a Key for a Vehicle based on the Vehicle's { identifier }

Create and return a new key for a vehicle specified by {identifier}.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/vehicles/{identifier}/keys
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "keyType": "smart", // or 'transponder', or 'high-security'
      "price": 225 // or '175', or '75'
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "locksmithId": 1,
      "vechicleId": 1,
      "keyType": "smart",
      "price": 225,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "keyType": "keyType can be 'smart key', 'transponder', or 'high-security' only", // "smart key": or "transponder": or "high-security":,
        "price": "price is required and must be greater than 0" //225, 100, 75, each is associated with a type of key.
      }
    }
    ```

- Error response: Couldn't find a Vehicle with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

- Error response: Keys from the current user already exists for the Vehicle

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already has 2 keys for this vehicle"
    }
    ```

### Add an Image to a Key based on the Key's id

Create and return a new image for a key specified by id.

- Require Authentication: true
- Require proper authorization: Key must belong to the current user
- Request

  - Method: POST
  - Route path: /api/keys/:keyId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Key with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Key couldn't be found"
    }
    ```

- Error response: Cannot add any more images because there is a maximum of 10
  images per resource

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Maximum number of images for this resource was reached"
    }
    ```

### Edit a Key

Update and return an existing key.

- Require Authentication: true
- Require proper authorization: Key must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/keys/:keyId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "keyType": "smart", // or 'transponder', or 'high-security'
      "price": 225 // or '175', or '75'
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "vechicleId": 1,
      "keyType": "smart", // or 'transponder', or 'high-security'
      "price": 225, // or '175', or '75',
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "keyType": "keyType can be 'smart key', 'transponder', or 'high-security' only", // "smart key": or "transponder": or "high-security":,
        "price": "price is required and must be greater than 0" //225, 100, 75, each is associated with a type of key.
      }
    }
    ```

- Error response: Couldn't find a Key with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Key couldn't be found"
    }
    ```

### Delete a Key

Delete an existing key. and/or deletes the key becuase it is made?

- Require Authentication: true
- Require proper authorization: Key must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/keys/:keyId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Key with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Key couldn't be found"
    }
    ```

## INVOICES

### Get all of the Current User's Invoices

Return all the invoices that the current user has made.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/invoices/current
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Invoices": [
        {
          "User": {
            "id": 2,
            "companyName": "Repo Depot",
            "address": "P.O. Box 1811",
            "city": "Gillibeat",
            "state": "TX",
            "zip": 12345,
            "country": "USA"
          },
          "Locksmith": {
            "id": 1,
            "companyName": "K;ngdom Keys",
            "address": "186 King St",
            "city": "Tulane",
            "state": "TX",
            "zip": 12345,
            "country": "USA"
          },
          "id": 1,
          "vechicleId": 1,
          "locksmithId": 1,
          "userId": 2,
          "createdAt": "2021-11-19",
          "description": {
            "keyType": "keyType", // obvi the type of key used
            "vehicle": {
              "year": 1999,
              "make": "GMC",
              "model": "Sierra",
              "last6": "Vin's last 6 digits" // probably need to parse somehow
            }
          },
          "units": 1, // or 2, most likely no more than 2 (called 'unit price' on user side)
          "price": 225, // or price for specified key (called 'rate' on user side)
          "amount": 225, // =SUM(units + price)
          "dueDate": "2021-12-01",
          "totalDue": 1525 // =SUM(all amounts)
        }
      ]
    }
    ```

### Get all Vehicles for an Invoice based on the Invoice's id

Return all the vehicles for a invoice specified by id.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/invoices/:invoiceId/vehicles
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Vehicles": [
        {
          "year": 1999,
          "make": "GMC",
          "model": "Sierra",
          "last6": "Vin's last 6 digits" // probably need to parse somehow
        }
      ]
    }
    ```

- Error response: Couldn't find a Vehicle with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

### Add vehicle to an invoice based on the Vehicle's id

Create and return a new vehicle on invoice specified by id.

- Require Authentication: true
- Require proper authorization: invoice additions only authorized by locksmiths
- Request

  - Method: POST
  - Route path: /api/vehicles/:vechicleId/:invoiceId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Vehicle": {
        "year": 1999,
        "make": "GMC",
        "model": "Sierra",
        "last6": "Vin's last 6 digits" // probably need to parse somehow
      }
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "invoiceId": 1,
      "vechicleId": 1,
      "locksmithId": 1,
      "Vehicle": {
        "year": 1999,
        "make": "GMC",
        "model": "Sierra",
        "last6": "Vin's last 6 digits" // probably need to parse somehow
      },
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "year": "Year must be between 1949 and 2024",
        "make": "Make of the vehicle is required",
        "model": "Model of the vehicle is required",
        "last6": "Last 6 of VIN are only numbers"
      }
    }
    ```

- Error response: Couldn't find a Vehicle with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle couldn't be found"
    }
    ```

- Error response: Invoice conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this vehicle is already added to the invoice",
      "errors": {
        "last6": "The last 6 are already added to invoice"
      }
    }
    ```

### Edit an Invoice

Update and return an existing invoice.

- Require Authentication: true
- Require proper authorization: Invoice must belong to the current locksmith
- Request

  - Method: PUT
  - Route path: /api/invoices/:invoiceId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Invoices": [
        {
          "description": {
            "keyType": "keyType", // obvi the type of key used
            "vehicle": {
              "year": 1999,
              "make": "GMC",
              "model": "Sierra",
              "last6": "Vin's last 6 digits" // probably need to parse somehow
            }
          },
          "units": 1, // or 2, most likely no more than 2 (called 'unit price' on user side)
          "price": 225, // or price for specified key (called 'rate' on user side)
          "amount": 225, // =SUM(units + price)
          "dueDate": "2021-12-01",
          "totalDue": 1525 // =SUM(all amounts)
        }
      ]
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Invoices": [
        {
          "User": {
            "id": 2,
            "companyName": "Repo Depot",
            "address": "P.O. Box 1811",
            "city": "Gillibeat",
            "state": "TX",
            "zip": 12345,
            "country": "USA"
          },
          "Locksmith": {
            "id": 1,
            "companyName": "K;ngdom Keys",
            "address": "186 King St",
            "city": "Tulane",
            "state": "TX",
            "zip": 12345,
            "country": "USA"
          },
          "id": 1,
          "vechicleId": 1,
          "locksmithId": 1,
          "userId": 2,
          "updatedAt": "2021-11-19",
          "description": {
            "keyType": "keyType", // obvi the type of key used
            "vehicle": {
              "year": 1999,
              "make": "GMC",
              "model": "Sierra",
              "last6": "Vin's last 6 digits" // probably need to parse somehow
            }
          },
          "units": 1, // or 2, most likely no more than 2 (called 'unit price' on user side)
          "price": 225, // or price for specified key (called 'rate' on user side)
          "amount": 225, // =SUM(units + price)
          "dueDate": "2021-12-01",
          "totalDue": 1525 // =SUM(all amounts)
        }
      ]
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        {
          "description": {
            "keyType": "keyType can be 'smart key', 'transponder', or 'high-security' only", // "smart key": or "transponder": or "high-security":,
            "vehicle": {
              "year": "Year must be between 1949 and 2024",
              "make": "Make of the vehicle is required",
              "model": "Model of the vehicle is required",
              "last6": "Last 6 of VIN are only numbers"
            }
          },
          "units": "units must be 1 or 2", // or 2, most likely no more than 2 (called 'unit price' on user side)
          "price": "price is required and must be greater than 0", //225, 100, 75, each is associated with a type of key.
          "amount": "amount is required and must be greater than 0", // =SUM(units + price)
          "dueDate": "must be a future date",
          "totalDue": "total dues is required and must be greater than 0" // =SUM(all amounts)
        }
      }
    }
    ```

- Error response: Couldn't find a Invoice with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invoice couldn't be found"
    }
    ```

- Error response: Invoice conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this vehicle is already added to the invoice",
      "errors": {
        "last6": "The last 6 are already added to invoice"
      }
    }
    ```

### Delete a Invoice

Delete an existing invoice.

- Require Authentication: true
- Require proper authorization: Invoice must belong to the current locksmith, Owner's CANNOT delete invoices
- Request

  - Method: DELETE
  - Route path: /api/invoices/:invoiceId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Invoice with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invoice couldn't be found"
    }
    ```

## IMAGES

### Delete a Vehicle Image

Delete an existing image for a Vehicle.

- Require Authentication: true
- Require proper authorization: Vehicle must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/vehicle-images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Vehicle Image with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Vehicle Image couldn't be found"
    }
    ```

### Delete a KeyImage

Delete an existing image for a Key.

- Require Authentication: true
- Require proper authorization: Key must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/key-images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a KeyImage with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "KeyImage couldn't be found"
    }
    ```

## Add Query Filters to Get All Vehicles

Return vehicles filtered by query parameters.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/vehicles
  - Query Parameters
    - page: integer, minimum: 1, default: 1
    - size: integer, minimum: 1, maximum: 20, default: 20
    - year: integer, optional
    - make: varchar, optional
    - model: varchar, optional
    - vin: varchar, optional
    - minPrice: decimal, optional, minimum: 0
    - maxPrice: decimal, optional, minimum: 0
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Vehicles": [
        {
          "id": 1,
          "ownerId": 1,
          "vin": "12456789asdfghjk",
          "year": 1988,
          "make": "GMC",
          "model": "Sierra",
          "keyType": "keyType", // "smart key": or "transponder": or "high-security":
          "price": 225, //225, 100, 75, each is associated with a type of key.
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url", // maybe of VIN?
          "keyImage": "image url",
          "status": "status", // "active", "locked", "awaiting key", etc.
        }
      ],
      "page": 2,
      "size": 20
    }
    ```

- Error Response: Query parameter validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be between 1 and 20",
        "vin": "VIN must consist of exactly 17 alphanumeric characters",
        "year": "Year must be between 1949 and 2024",
        "make": "Make of the vehicle is required",
        "model": "Model of the vehicle is required",
        "keyType": "keyType can be 'smart key', 'transponder', or 'high-security' only", // "smart key": or "transponder": or "high-security":,
        "minPrice": "Minimum price must be greater than 0",
        "maxPrice": "Maximum price must be greater than 0"
      }
    }
    ```

# KiKeys

