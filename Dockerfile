FROM nginx:latest
RUN echo 'types { application/javascript js mjs; }' > /etc/nginx/conf.d/mime-types.conf
COPY ./ /usr/share/nginx/html
EXPOSE 80
