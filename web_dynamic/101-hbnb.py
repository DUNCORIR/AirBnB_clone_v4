#!/usr/bin/python3
"""
Flask Web Application for HBNB Clone - Dynamic Web Version

This script starts a Flask web application that serves the dynamic version
of the HBNB clone. It retrieves data from a storage engine and passes it
to an HTML template for rendering.

Features:
- Retrieves and sorts states, cities, amenities, and places from storage.
- Implements Flask teardown to properly close the database session.
- Prevents asset caching by appending a unique cache ID to static file URLs.

Routes:
- `/1-hbnb/` : Displays the main HBNB page with dynamic content.

"""
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
from uuid import uuid4
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """
    Closes the current SQLAlchemy Session

    This function ensures that the database connection is properly closed
    after each request to prevent resource leaks.
    """
    storage.close()


@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive!
    Handles the `/101-hbnb/` route.

    Retrieves data from the database:
    - States (sorted by name), along with their associated cities.
    - Amenities (sorted by name).
    - Places (sorted by name).

    Generates unique `cache_id` using `uuid.uuid4()` to prevent asset caching.

    Returns:
        Renders `4-hbnb.html` template with retrieved data and cache ID.
    """
    # Retrieves amenities, sort places
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    # Create list of tuples (state, sorted cities)
    st_ct = [
        (state, sorted(state.cities, key=lambda k: k.name)) for state in states
    ]

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    cache_id = str(uuid4())  # Generate a unique cache ID

    return render_template('101-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id)  # Pass cache_id to template


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
