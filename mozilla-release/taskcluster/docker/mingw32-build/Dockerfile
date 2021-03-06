# %ARG DOCKER_IMAGE_PARENT
FROM $DOCKER_IMAGE_PARENT
MAINTAINER Mike Hommey <mhommey@mozilla.com>

VOLUME /builds/worker/checkouts
VOLUME /builds/worker/workspace
VOLUME /builds/worker/tooltool-cache

ENV XZ_OPT=-T0

RUN dpkg --add-architecture i386

# Ideally, we wouldn't need gcc-multilib and the extra linux-libc-dev,
# but the latter is required to make the former installable, and the former
# because of bug 1409276.
RUN apt-get update && \
    apt-get install \
      autoconf2.13 \
      bison \
      bzip2 \
      flex \
      curl \
      file \
      gawk \
      g++-multilib \
      gnupg \
      libucl-dev \
      patch \
      p7zip-full \
      scons \
      tar \
      unzip \
      uuid \
      wget \
      x11-utils \
      xvfb \
      yasm \
      zip \
      zlib1g-dev \
      libfreetype6-dev:i386 \
      libx11-dev:i386

# Stubbed out credentials; mozharness looks for this file an issues a WARNING
# if it's not found, which causes the build to fail.  Note that this needs to
# be in the parent of the workspace directory and in the directory where
# mozharness is run (not its --work-dir).  See Bug 1169652.
# %include taskcluster/docker/recipes/oauth.txt
COPY topsrcdir/taskcluster/docker/recipes/oauth.txt /builds/worker/

# stubbed out buildprops, which keeps mozharness from choking
# Note that this needs to be in the parent of the workspace directory and in
# the directory where mozharness is run (not its --work-dir)
# %include taskcluster/docker/recipes/buildprops.json
COPY topsrcdir/taskcluster/docker/recipes/buildprops.json /builds/worker/
