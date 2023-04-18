from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.requests import Request
from starlette.responses import Response
from starlette.exceptions import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST , HTTP_500_INTERNAL_SERVER_ERROR
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import PlainTextResponse
from starlette.routing import Route, Mount, WebSocketRoute
from starlette.staticfiles import StaticFiles
import psycopg2
import uvicorn
import json
app = Starlette()

middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'] , allow_headers=['*'], allow_methods=['*'])
]

@app.on_event("startup")
async def startup():
    conne = connect()
    print_version(conne)
    #create(conn)
    print("HELLO")


def connect():
    try:
        connection = psycopg2.connect(
           host="localhost",
           database="postgres",
           user="postgres",
           password="admin"
        )
        return connection
    except Exception as err:
        print("Error occurred in making connection …")
        

def print_version(connection):
    cursor = connect().cursor()
    cursor.execute('SELECT version()')
    db_version = cursor.fetchone()
    print(db_version)
    cursor.close()
    connection.close()
    


@app.route('/api/saveImage', methods=['POST'])
async def save_image(request: Request):
    try:
        conn = connect()
        data = await request.json()
        print(f"data : {data}");
        type = data["type"]
        title = data["title"]
        position = data["position"]
        url = data["url"]
        cursor = conn.cursor()
        cursor.execute("Insert Into images (type,title,url,position) values (%s, %s, %s, %s)", (type,title,url,position))
        conn.commit()
        return JSONResponse({"message" : "Image Added Successfully"})
    
    except KeyError as e:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Invalid input: missing {e} field")
    except Exception as e:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong"+e)
        
async def get_images(request: Request):
    try:
        cursor = connect().cursor()
        cursor.execute("SELECT * FROM images")
        rows = cursor.fetchall()
        print(rows)
        images = []
        for row in rows:
            print(row)
            image = {"id": row[0], "type": row[1], "title": row[2], "url": row[3], "position": row[4]}
            images.append(image)
        return JSONResponse({"images": images})
    except Exception as e:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong"+e)

        
    
async def update_position(request:Request):
    conn = connect()
    cursor = conn.cursor()
    try:
        data = await request.json()
        print(f"The Payload that you sent {data}")
        query="""UPDATE images SET position = %s WHERE id= %s """
        for card in data:
            cursor.execute(query,(card["position"] , card["id"]))
        conn.commit()
        cursor.close()
        conn.close()
        return JSONResponse(content={"message":"Cards updated Successfully"})
    except Exception as e:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR , detail="Something went wrong"+e)
   
def homepage(request):
    return PlainTextResponse('Hello, world!')



routes = [
    Route('/', homepage),
    Route('/getImages', get_images),
    Route('/api/saveImage' , save_image, methods=['POST']),
    Route('/api/updatePosition', update_position, methods=['PUT'])
]

app = Starlette(debug=True, routes=routes, on_startup=[startup], middleware=middleware)