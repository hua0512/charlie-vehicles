FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /usr/src/app

COPY pom.xml .
COPY common-java-services/ ./common-java-services/
COPY chargerpoints-service/pom.xml ./chargerpoints-service/
COPY user-service/pom.xml ./user-service/
COPY vehicles-service/ ./vehicles-service/

RUN mvn -Dmaven.test.skip package -pl vehicles-service -am


FROM openjdk:17-jdk-alpine
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY --from=build /usr/src/app/vehicles-service/target/vehicles-*.jar vehicles.jar
EXPOSE 8080
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar vehicles.jar