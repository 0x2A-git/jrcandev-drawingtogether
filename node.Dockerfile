FROM node:latest
RUN adduser --disabled-password --gecos "" web
COPY --chown=web:web src /home/web
USER web
WORKDIR /home/web
RUN npm i && \
    npx next build
EXPOSE 8081

CMD npx prisma db push && npx next start -p 8081