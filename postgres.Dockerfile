FROM postgres:latest
COPY docker/postgres.sql /docker-entrypoint-initdb.d/
USER postgres
RUN initdb && pg_ctl start
EXPOSE 5432
CMD ['postgres']