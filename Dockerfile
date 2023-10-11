FROM circleci/node:latest-browsers

WORKDIR /usr/src/app/
USER root

RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn config set sass_binary_site "https://npm.taobao.org/mirrors/node-sass/"
RUN yarn config set profiler_binary_host_mirror "https://npm.taobao.org/mirrors/node-inspector/"
RUN yarn config set chromedriver_cdnurl "https://cdn.npm.taobao.org/dist/chromedriver"
RUN yarn

#RUN npm run test:all

CMD ["yarn", "run"", "build"]
CMD ["yarn", "run"", "start"]
