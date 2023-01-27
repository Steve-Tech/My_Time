#!/usr/bin/python3
# My_Time - A simple time synchronisation web app
# Author: Steve-Tech
# License: GNU Lesser General Public License v3.0

import aiohttp
from aiohttp import web
from time import time

enable_websockets = False

async def websocket(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        t2 = time()
        if msg.type == aiohttp.WSMsgType.TEXT or msg.type == aiohttp.WSMsgType.BINARY:
            await ws.send_json({"t2": t2, "t3": time()})

    print('websocket connection closed')

    return ws


async def get_file(file):
    return web.FileResponse("./web/" + file)


async def sync_time(request):
    t2 = time()
    match (request.method):
        case "GET":
            return web.json_response({"t2": t2, "t3": time()})
        case "HEAD":
            return web.Response()


def main():
    app = web.Application()
    app.add_routes([
        web.get('/', lambda _ : get_file('index.html')),
        web.get('/style.css', lambda _ : get_file('style.css')),
        web.get('/script.js', lambda _ : get_file('script.js')),
        web.get('/favicon.svg', lambda _ : get_file('favicon.svg')),
        web.get('/sync', sync_time)])

    if enable_websockets:
        app.add_routes([web.get('/ws', websocket)])

    web.run_app(app)

if __name__ == "__main__":
    main()
