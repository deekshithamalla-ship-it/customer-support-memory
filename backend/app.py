"""
Flask web server entry point for Customer Support That Remembers.
"""

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Customer Support AI backend is running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
