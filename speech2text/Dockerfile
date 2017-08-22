FROM node:8.1

ENV APP_HOME /app

RUN mkdir -p $APP_HOME

WORKDIR $APP_HOME

COPY ./src $APP_HOME

RUN mkdir -p /.config && chmod 777 /.config && \
    mkdir -p /.cache && chmod 777 /.cache && \
    touch /.yarnrc && chmod 777 /.yarnrc && \
    mkdir -p /home/node/.config && chmod 777 /home/node/.config && \
    mkdir -p /home/node/.cache && chmod 777 /home/node/.cache && \
    touch /home/node/.yarnrc && chmod 777 /home/node/.yarnrc

CMD [ "yarn", "start" ]

EXPOSE 8000
