from flask import (
    Flask,
    jsonify,
    request,
    send_from_directory
)

from flask_cors import CORS

from dotenv import load_dotenv

import os
import requests

from agent import SupportAgent
from customer_data import CustomerData


# =========================================
# LOAD ENVIRONMENT VARIABLES
# =========================================

load_dotenv()


# =========================================
# FRONTEND PATH
# =========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)


# =========================================
# FLASK APP
# =========================================

app = Flask(

    __name__,

    static_folder=FRONTEND_DIR,

    static_url_path=""
)

CORS(app)


# =========================================
# CREATE OBJECTS
# =========================================

agent = SupportAgent()

customer_data = CustomerData()


# =========================================
# HINDSIGHT CONFIGURATION
# =========================================

HINDSIGHT_URL = "http://127.0.0.1:8888"


# =========================================
# FRONTEND
# =========================================

@app.route("/")
def home():

    return send_from_directory(

        FRONTEND_DIR,

        "index.html"
    )


# =========================================
# HEALTH CHECK
# =========================================

@app.route(
    "/health",
    methods=["GET"]
)
def health_check():

    return jsonify({

        "status": "ok",

        "message":
            "Customer Support AI backend is running"

    })


# =========================================
# GET ALL CUSTOMERS
# =========================================

@app.route(
    "/customers",
    methods=["GET"]
)
def get_customers():

    try:

        customers = customer_data.get_all_customers()

        return jsonify({

            "customers": customers

        })

    except Exception as e:

        print(
            "GET CUSTOMERS ERROR:",
            e
        )

        return jsonify({

            "error": str(e)

        }), 500


# =========================================
# GET SINGLE CUSTOMER
# =========================================

@app.route(
    "/customers/<customer_id>",
    methods=["GET"]
)
def get_customer(customer_id):

    try:

        customer = customer_data.get_customer(
            customer_id
        )

        if not customer:

            return jsonify({

                "error":
                    "Customer not found"

            }), 404

        context = customer_data.get_customer_context(
            customer_id
        )

        return jsonify({

            "customer": customer,

            "context": context

        })

    except Exception as e:

        print(
            "GET CUSTOMER ERROR:",
            e
        )

        return jsonify({

            "error": str(e)

        }), 500


# =========================================
# ADD NEW CUSTOMER
# =========================================

@app.route(
    "/customers",
    methods=["POST"]
)
def add_customer():

    data = request.get_json() or {}

    name = data.get(
        "name",
        ""
    ).strip()

    email = data.get(
        "email",
        ""
    ).strip()

    # -----------------------------------------
    # VALIDATION
    # -----------------------------------------

    if not name or not email:

        return jsonify({

            "error":
                "Name and email are required"

        }), 400

    try:

        # -----------------------------------------
        # CHECK DUPLICATE EMAIL
        # -----------------------------------------

        customers = customer_data.get_all_customers()

        for customer in customers:

            if customer.get(
                "email",
                ""
            ).lower() == email.lower():

                return jsonify({

                    "error":
                        "A customer with this email already exists"

                }), 409

        # -----------------------------------------
        # CREATE CUSTOMER
        # -----------------------------------------

        new_customer = customer_data.create_customer(

            name=name,

            email=email
        )

        customer_id = new_customer["id"]

        # -----------------------------------------
        # CREATE HINDSIGHT MEMORY BANK
        # -----------------------------------------

        bank_url = (

            f"{HINDSIGHT_URL}/v1/default/banks/"
            f"customer-{customer_id}"

        )

        bank_response = requests.put(
            bank_url,
            json={}
        )

        if bank_response.status_code not in [
            200,
            201
        ]:

            print(
                "HINDSIGHT BANK ERROR:",
                bank_response.text
            )

            return jsonify({

                "error":
                    "Customer created, but Hindsight memory bank could not be created",

                "customer": new_customer

            }), 500

        # -----------------------------------------
        # SUCCESS
        # -----------------------------------------

        return jsonify({

            "message":
                "Customer created successfully",

            "customer":
                new_customer,

            "memory_bank":
                f"customer-{customer_id}"

        }), 201

    except Exception as e:

        print(
            "ADD CUSTOMER ERROR:",
            e
        )

        return jsonify({

            "error": str(e)

        }), 500


# =========================================
# CHAT API
# =========================================

@app.route(
    "/chat",
    methods=["POST"]
)
def chat():

    data = request.get_json() or {}

    customer_id = data.get(
        "customer_id"
    )

    message = data.get(
        "message"
    )

    ticket_id = data.get(
        "ticket_id"
    )

    # -----------------------------------------
    # VALIDATION
    # -----------------------------------------

    if not customer_id or not message:

        return jsonify({

            "error":
                "customer_id and message are required"

        }), 400

    # -----------------------------------------
    # CHECK CUSTOMER
    # -----------------------------------------

    customer = customer_data.get_customer(
        customer_id
    )

    if not customer:

        return jsonify({

            "error":
                "Customer not found"

        }), 404

    # -----------------------------------------
    # GENERATE RESPONSE
    # -----------------------------------------

    try:

        result = agent.generate_response(

            customer_id=customer_id,

            message=message,

            ticket_id=ticket_id

        )

        return jsonify({

            "customer_id":
                customer_id,

            "ticket_id":
                ticket_id,

            "response":
                result["response"],

            "memories_used":
                result["memories_used"]

        })

    except Exception as e:

        print(
            "CHAT ERROR:",
            e
        )

        return jsonify({

            "error": str(e)

        }), 500


# =========================================
# RUN SERVER
# =========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True
    )