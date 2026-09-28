
import json
import os


class CustomerData:

    def __init__(self):

        self.data_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "data"
        )

    # =========================================
    # LOAD JSON FILE
    # =========================================

    def _load(self, filename):

        path = os.path.join(
            self.data_dir,
            filename
        )

        with open(
            path,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    # =========================================
    # SAVE JSON FILE
    # =========================================

    def _save(self, filename, data):

        path = os.path.join(
            self.data_dir,
            filename
        )

        with open(
            path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                indent=2
            )

    # =========================================
    # GET ALL CUSTOMERS
    # =========================================

    def get_all_customers(self):

        return self._load(
            "customers.json"
        )

    # =========================================
    # GET SINGLE CUSTOMER
    # =========================================

    def get_customer(self, customer_id):

        customers = self._load(
            "customers.json"
        )

        for customer in customers:

            if customer["id"] == customer_id:

                return customer

        return None

    # =========================================
    # CREATE CUSTOMER
    # =========================================

    def create_customer(
        self,
        name,
        email
    ):

        customers = self._load(
            "customers.json"
        )

        existing_numbers = []

        for customer in customers:

            customer_id = customer.get(
                "id",
                ""
            )

            if customer_id.startswith("cust_"):

                try:

                    number = int(
                        customer_id.split("_")[1]
                    )

                    existing_numbers.append(
                        number
                    )

                except (ValueError, IndexError):

                    pass

        if existing_numbers:

            next_number = max(
                existing_numbers
            ) + 1

        else:

            next_number = 101

        customer_id = f"cust_{next_number}"

        new_customer = {

            "id": customer_id,

            "name": name,

            "email": email,

            "notes":
                "New customer added through Hindsight."
        }

        customers.append(
            new_customer
        )

        self._save(
            "customers.json",
            customers
        )

        return new_customer

    # =========================================
    # GET ENVIRONMENT
    # =========================================

    def get_environment(
        self,
        customer_id
    ):

        environments = self._load(
            "customer_environment.json"
        )

        for environment in environments:

            if environment["customer_id"] == customer_id:

                return environment

        return None

    # =========================================
    # GET KNOWN ISSUES
    # =========================================

    def get_known_issues(
        self,
        customer_id
    ):

        issues = self._load(
            "known_issues.json"
        )

        return [

            issue

            for issue in issues

            if issue["customer_id"] == customer_id

        ]

    # =========================================
    # GET SOLUTIONS
    # =========================================

    def get_solutions(
        self,
        customer_id
    ):

        solutions = self._load(
            "solutions.json"
        )

        return [

            solution

            for solution in solutions

            if solution["customer_id"] == customer_id

        ]

    # =========================================
    # GET TICKETS
    # =========================================

    def get_tickets(
        self,
        customer_id
    ):

        tickets = self._load(
            "tickets.json"
        )

        return [

            ticket

            for ticket in tickets

            if ticket["customer_id"] == customer_id

        ]

    # =========================================
    # COMPLETE CUSTOMER CONTEXT
    # =========================================

    def get_customer_context(
        self,
        customer_id
    ):

        return {

            "customer":
                self.get_customer(
                    customer_id
                ),

            "environment":
                self.get_environment(
                    customer_id
                ),

            "known_issues":
                self.get_known_issues(
                    customer_id
                ),

            "solutions":
                self.get_solutions(
                    customer_id
                ),

            "tickets":
                self.get_tickets(
                    customer_id
                )
        }