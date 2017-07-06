FROM nginx:1.13

ENV APP_HOME /static

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

COPY ./src $APP_HOME

COPY load-balancer.conf /etc/nginx/conf.d/