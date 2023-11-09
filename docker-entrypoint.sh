#!/bin/sh
echo 'Run migration'

python3 manage.py makemigrations forum
python3 manage.py makemigrations member
python3 manage.py makemigrations rank
python3 manage.py makemigrations stock

python3 manage.py migrate


exec "$@"