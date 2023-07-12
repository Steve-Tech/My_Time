#!/usr/bin/python3
# My_Time - A simple time synchronisation web app
# Author: Steve-Tech
# License: GNU Lesser General Public License v3.0

import aiohttp
from aiohttp import web
from time import time

# Enable websockets for more responsive time sync
enable_websockets: bool = True

async def websocket(request: web.Request) -> web.WebSocketResponse:
    """Return the server's time in JSON format"""
    
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        t2: float = time()
        if msg.type == aiohttp.WSMsgType.TEXT or msg.type == aiohttp.WSMsgType.BINARY:
            await ws.send_json({"t1": msg.data, "t2": t2, "t3": time()})
    
    return ws


# Used to serve static files
async def get_file(file) -> web.FileResponse:
    """Serve a file from the web directory"""

    return web.FileResponse("./web/" + file)


async def sync_time(request: web.Request) -> web.Response:
    """Return the server's time in JSON format"""

    t2: float = time()
    match (request.method):
        case "GET":
            return web.json_response({"t2": t2, "t3": time()})
        case "POST":
            return web.json_response({"t1": await request.text(), "t2": t2, "t3": time()})
        case "HEAD":
            return web.Response()


def main() -> None:
    """My_Time main function, starts the web server"""

    app = web.Application()
    app.add_routes([
        web.get('/', lambda _ : get_file('index.html')),
        web.get('/style.css', lambda _ : get_file('style.css')),
        web.get('/script.js', lambda _ : get_file('script.js')),
        web.get('/favicon.svg', lambda _ : get_file('favicon.svg')),
        web.get('/sync', sync_time),
        web.post('/sync', sync_time)])

    if enable_websockets:
        app.add_routes([web.get('/ws', websocket)])

    web.run_app(app)


if __name__ == "__main__":
    main()
