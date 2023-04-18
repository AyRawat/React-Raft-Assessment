# Raft Assessment - Cat Mania

This is a Drag and Drop Gallery based on React and Python Starlette

## Installation

```bash
  * git clone https://github.com/AyRawat/React-Raft-Assessment.git
  * cd React-Raft-Assessment
  * docker compose up -d
```

Open up your favorite browser and navigate to http://localhost:5173/ and you should see the Home Page.

## App Structure

```
>Root
 ->App
  -->ParentComponent
  ----->CardList
  ------->Card
  ----->ImageViewer
```

## Functionality

1. Upload 3D files (.gltb,glb,ftx).
2. Save Models in DB
3. Display 3D model.

## Front-End Design and Challenges.

1. React
   The App is broken into 4 components. Parent Component ,CardList ,Card and ImageViewer. For layout and styling, I have chosen react-bootstrap.
2. Image Drag and Drop.
   For drag and drop there is a very famous library called Beautiful React DnD, but I wrote a simple logic using the array to track the position changes, and just making the image elements draggable.

## Back-end Design

1. Starlette -> Used Starlette along with uvicorn to create backend server.
2. psycopg2 -> for connecting Python with PostGresql

##Database Schema

    id: {
      type: String,
    },
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    position: {
      type: Number,
    },
     url: {
         type: String
    },

This schema consists of the basic things that are required to store and render the model.

1. id -> to uniquely identify the image
2. type -> type of file
3. title-> Name of the Image
4. position -> Position of the image on the Front-end
5. url-> Url of the image

## Approach

1. Load the images on the home page.
2. Arrange them in their respective positions.
3. They should be draggable.
4. Once dragged, the new position should be saved .
5. Show a loader, to store the new order of the images.
6. when clicked on the image, it should be shown in the middle of the page.
7. When clicked on Esc, the modal should be closed.

## API Reference

#### Get All Images

- Description : Get All Images

```
curl --location 'http://localhost:8000/getImages' \
--header 'Content-Type: application/json'
```

Response

```
   {
    "images": [
        {
            "id": 9,
            "type": "bank-draft-2",
            "title": "Bank Draft 2",
            "url": "https://cdn.pixabay.com/photo/2021/09/12/11/42/halloween-6618187_960_720.png",
            "position": 0
        },
        {
            "id": 12,
            "type": "bank-draft",
            "title": "Bank Draft",
            "url": "https://cdn.pixabay.com/photo/2015/07/21/15/32/cat-854034_960_720.png",
            "position": 1
        },
    ]
}

```

#### PUT - Update position

- Description : Updates the position of the cards

```
| Parameter | Type     | Description                       |
| cards|Array | All the cards with updated position.


```

```
curl --location --request PUT 'https://localhost:8000/api/updatePosition' \
--header 'Content-Type: application/json' \
--data '[
  {
    "type": "bank-draft",
    "title": "Bank Draft",
    "position": 0,
    "url": "https://cdn.pixabay.com/photo/2015/07/21/15/32/cat-854034_960_720.png"
  },
  {
    "type": "bill-of-landing",
    "title": "Bill of Landing",
    "position": 1,
    "url": "https://cdn.pixabay.com/photo/2017/01/31/20/45/animal-2027159_960_720.png"
  },
]
'
```

### POST Save images

- Description: Adds a new image
  | Parameter | Type | Description |  
  | type. |String | All the cards with updated position.
  |title. |String | Title of the card
  |position. |Number | The position that you want the image
  |url |String.| Url of the image

```
curl --location 'http://localhost:8000/api/saveImage' \
--header 'Content-Type: application/json' \
--data '{
  "type": "bank-draft",
    "title": "Bank Draft",
    "position": 0,
    "url": "https://cdn.pixabay.com/photo/2015/07/21/15/32/cat-854034_960_720.png"}'
```

### API designs for Update Delete and Add cards

1. Update
   The approach that I took in this web app, takes the complete array and updates it, if there is a change, it works fine for now, because there are only 5 images, but what if we have 100000 images, then in that case it doesn't make sense to update the whole array. Instead, we can create an API that updates only those elements that were updated.
   In order to achieve this, we can use the above Update API, but the payload that we are sending should only consist of the updated images.

2. Add cards.
   When adding cards the major problem is the position parameter. We can have two images with same url or title but we cannot have two images with same position. So, while saving data, we can either track the largest position number, that is available in our db, or we can fetch it. We need to validate that the new position > biggest position present in our db and also if the position is available to

3. Delete Cards.
   Deleting a Card, empties a position, that needs to be filled. So when we delete an element, we can store the empty position. Now from here there are multiple approaches to handle this, based on the use case.

4. If user wants to add an image, and he doesn't care about the position, he just needs to store and display the image in any position. So we can maintain hash of empty positions , get the first position and assign the value.

5. If user wants a specific postion, check the hash, if it is available, assign the position to the image.
