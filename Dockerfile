FROM python:3.8.10
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app


COPY . /app/

RUN pip install -r requirements.txt

RUN apt -f install -y
RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb -y

RUN chmod +x /app/docker-entrypoint.sh