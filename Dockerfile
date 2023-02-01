# syntax=docker/dockerfile:1
FROM python:3-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY My_Time.py .
COPY web web
CMD [ "python", "./My_Time.py" ]
EXPOSE 8080
