FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update \
&& apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \
#
# Verify git, process tools, lsb-release (common in install instructions for CLIs) installed
&& apt-get -y install git iproute2 procps lsb-release curl ca-certificates \
#
# Install nvm with node and npm
&& curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Set up nvm, node and npm
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18.18.2
ENV YARN_VERSION=1.22.22

RUN . $NVM_DIR/nvm.sh \
&& nvm install $NODE_VERSION \
&& nvm alias default $NODE_VERSION \
&& nvm use default

# Set up PATH
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

ENV LOST_PIXEL_DISABLE_TELEMETRY=1

# Install Yarn
RUN npm install -g yarn@$YARN_VERSION


WORKDIR /app

COPY ./package.json .

RUN yarn install

RUN npx playwright install

RUN npx playwright install-deps

COPY . .