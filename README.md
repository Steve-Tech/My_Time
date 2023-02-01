# My_Time

A simple time synchronisation web app similar to [time.is](https://time.is/) but fully open source and self-hostable. Perfect for those who already have their own Stratum 1 NTP server using GPS time or possibly even an atomic clock!

My_Time uses a method similar to that of NTP to synchronise the time on your server with the time on your client's browser. Thanks to Kevin Sookocheff for his write up on [how NTP works](https://sookocheff.com/post/time/how-does-ntp-work/)!

## Installation

### Docker

- Start using Docker Hub `docker run -d -p 8080:8080 --name My_Time stevetech8/my_time`
- Start using GitHub Container Registry `docker run -d -p 8080:8080 --name My_Time ghcr.io/steve-tech/my_time`

#### Build from source

1. Run `docker build -t my_time .` to build the image
2. Run `docker run -d -p 8080:8080 --name My_Time my_time` to start the container
3. Navigate to `http://localhost:8080` to view the app

### Systemd

**My_Time requires Python 3.10 or later**

1. Install the required packages with `pip3 install -r requirements.txt`
2. Copy the `my_time.service` file to `/etc/systemd/system/`
3. Run `systemctl enable --now my_time.service` to enable and start the service
4. Navigate to `http://localhost:8080` to view the app

### Python

**My_Time requires Python 3.10 or later**

But it can be easily modified to run with other versions of Python 3 by removing the match statement in `Time_py.py`.

1. Install the required packages with `pip3 install -r requirements.txt`
2. Run the app with `python3 Time_py.py`
3. Navigate to `http://localhost:8080` to view the app

### Cloudflare Pages

###### Cloudflare Pages is used for the demo site at [mytime.stevetech.au](https://mytime.stevetech.au).

**My_Time makes use of the 'Functions' feature for the time server, which makes no guarantees about accuracy.**

**Self hosting from a reliable time source is strongly recommended instead.**

1. Fork this repo
2. Create a new Cloudflare Pages project and select your forked repo
3. Leave the preset at None and build command empty, then set the output directory to `web`
4. Navigate to `https://<your-project>.pages.dev` to view the app

## Licensed under GNU LGPLv3 or later

My_Time is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

My_Time is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with My_Time. If not, see <https://www.gnu.org/licenses/>.
