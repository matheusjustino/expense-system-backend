#!/bin/bash

yarn prisma migrate deploy

#yarn seed

yarn start:prod
